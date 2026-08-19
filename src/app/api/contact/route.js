import crypto from "node:crypto";
import { Resend } from "resend";
import connectDB from "@/lib/mongodb";
import Message from "@/lib/models/Message";

// Where contact-form messages are delivered, and who they appear to come from.
// The sending domain must be verified in Resend. CONTACT_FROM_EMAIL lets the
// address change without a code edit (e.g. if a dedicated portfolio subdomain is
// verified later) — the display name keeps "Ahmad Sheraz" front and centre.
const TO_EMAIL = "sheraz@ahmadsheraz.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ||
  "Ahmad Sheraz <noreply@jobcraft-ai.ahmadsheraz.com>";

// Same rule the client uses — never trust the client, so it's checked again here
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generous caps that still stop someone pasting a novel into the form
const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 };

// Abuse limits per IP. This endpoint is public, unauthenticated, and spends a
// finite email quota, so it needs a ceiling. Counts are read from the messages
// collection, which works across serverless instances (an in-memory counter
// would reset on every cold start).
const MAX_PER_HOUR = 3;
const MAX_PER_DAY = 8;

// Escape user input before embedding it in the HTML emails
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Salt for the IP hash. A hardcoded default would be worthless — it ships in a
// public repo, and the IPv4 space is small enough to brute-force a known-salt
// hash straight back to an address. Prefer an explicit IP_HASH_SALT; otherwise
// derive one from MONGODB_URI, which is already secret, always present, and
// stable across serverless instances (so counts still add up).
function getSalt() {
  if (process.env.IP_HASH_SALT) return process.env.IP_HASH_SALT;
  const seed = process.env.MONGODB_URI;
  if (!seed) return null;
  return crypto.createHash("sha256").update(seed).digest("hex");
}

// Only ever store a salted hash — the raw IP is never persisted or logged.
// Returns null when no salt is derivable, in which case we skip storing
// anything identifying rather than writing a trivially reversible digest.
function hashIp(request) {
  const salt = getSalt();
  if (!salt) return null;
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0].trim() || "unknown";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

// Coerce to a trimmed string. Non-string JSON values (numbers, objects, arrays)
// previously reached .trim() and threw an uncaught TypeError, turning malformed
// input into a 500 instead of the intended 400.
function asText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validate({ name, email, subject, message }) {
  const errors = [];
  if (!name) errors.push("Name is required.");
  if (!email) errors.push("Email is required.");
  else if (!EMAIL_RE.test(email)) errors.push("Email is not valid.");
  if (!subject) errors.push("Subject is required.");
  if (!message) errors.push("Message is required.");
  else if (message.length < 10)
    errors.push("Message must be at least 10 characters.");

  for (const [field, max] of Object.entries(LIMITS)) {
    const value = { name, email, subject, message }[field];
    if (value && value.length > max)
      errors.push(`${field} is too long (max ${max}).`);
  }
  return errors;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real people never fill a hidden field, bots usually do. Pretend it
  // worked so the bot doesn't retry, but send nothing (protects the send quota).
  if (body.website) {
    return Response.json({ ok: true }, { status: 200 });
  }

  const name = asText(body.name);
  const email = asText(body.email);
  const subject = asText(body.subject);
  const message = asText(body.message);

  const errors = validate({ name, email, subject, message });
  if (errors.length > 0) {
    return Response.json({ error: errors.join(" ") }, { status: 400 });
  }

  // --- Rate limit BEFORE spending any email quota or writing anything ---
  const ipHash = hashIp(request);
  let dbUp = false;
  try {
    await connectDB();
    dbUp = true;
    // Without a hash there's nothing to count by. Never query { ipHash: null } —
    // pre-existing messages carry null, so that would throttle every visitor
    // based on unrelated history.
    if (!ipHash) throw new Error("no ip hash available — skipping rate limit");
    const now = Date.now();
    const [lastHour, lastDay] = await Promise.all([
      Message.countDocuments({
        ipHash,
        receivedAt: { $gte: new Date(now - 60 * 60 * 1000) },
      }),
      Message.countDocuments({
        ipHash,
        receivedAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) },
      }),
    ]);

    if (lastHour >= MAX_PER_HOUR || lastDay >= MAX_PER_DAY) {
      console.warn("[contact] rate limited", { lastHour, lastDay });
      return Response.json(
        {
          error:
            "You've sent several messages recently. Please email me directly at sheraz@ahmadsheraz.com.",
        },
        { status: 429 }
      );
    }
  } catch (err) {
    // Fail OPEN: if the database is unreachable we can't count, and silently
    // blocking every genuine enquiry would be worse than briefly losing the cap.
    console.error("[contact] rate-limit check unavailable:", err.message);
  }

  // Persist BEFORE emailing, so a message is never lost if delivery fails. This
  // is also what the Phase 3 admin inbox reads, and what the cap counts.
  let savedToDb = false;
  if (dbUp) {
    try {
      await Message.create({ name, email, subject, message, ipHash });
      savedToDb = true;
    } catch (err) {
      console.error("[contact] could not save message to DB:", err.message);
    }
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject),
    // Preserve the sender's line breaks in the HTML email
    message: escapeHtml(message).replace(/\n/g, "<br>"),
  };

  // Missing key is a misconfiguration, not a reason to lose the message — it's
  // already in the DB by this point, so log loudly and report based on that.
  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not set — email skipped");
    return savedToDb
      ? Response.json({ ok: true }, { status: 200 })
      : Response.json({ error: "Could not send message." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // 1) Notify Ahmad. reply_to is the sender, so hitting Reply just works.
    //    The subject carries no caller-supplied text, so the inbox can't be
    //    used to display attacker-chosen wording.
    const notify = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `🔔 New message from ahmadsheraz.com`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;color:#0F1C2E;line-height:1.6">
          <h2 style="color:#0D9488;margin:0 0 16px">New portfolio message</h2>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${safe.name}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${safe.email}</p>
          <p style="margin:0 0 16px"><strong>Subject:</strong> ${safe.subject}</p>
          <div style="border-left:3px solid #0D9488;padding:12px 16px;background:#F0FDFA">
            ${safe.message}
          </div>
          <p style="margin:20px 0 0;font-size:12px;color:#5C7A78">
            Sent from the contact form at ahmadsheraz.com
          </p>
        </div>`,
    });

    if (notify.error) {
      console.error("[contact] notification failed:", notify.error);
      // Nothing reached Ahmad and nothing was stored — tell the truth.
      if (!savedToDb) {
        return Response.json(
          { error: "Could not send message." },
          { status: 500 }
        );
      }
      // Stored but not delivered: the message is safe, but do NOT send an
      // auto-reply promising it arrived, and do not spend more quota.
      return Response.json({ ok: true }, { status: 200 });
    }

    // 2) Auto-reply — only after the notification actually succeeded.
    //    Deliberately carries NO caller-authored prose: this mail goes to an
    //    address supplied by the caller, from a domain signed as Ahmad's, so
    //    echoing their subject/message back would make the form a usable
    //    vehicle for sending attacker-written content to third parties.
    const autoReply = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: TO_EMAIL,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family:Inter,Arial,sans-serif;color:#0F1C2E;line-height:1.6">
          <h2 style="color:#0D9488;margin:0 0 16px">Thanks for getting in touch</h2>
          <p style="margin:0 0 12px">Hi ${safe.name},</p>
          <p style="margin:0 0 12px">
            Your message reached me — I read every one personally and usually reply
            within 24–48 hours.
          </p>
          <p style="margin:0 0 12px">
            If it's urgent, you can reply straight to this email.
          </p>
          <p style="margin:20px 0 4px">Best,<br><strong>Ahmad Sheraz</strong></p>
          <p style="margin:0;font-size:13px;color:#5C7A78">
            AI/ML Engineer · <a href="https://www.ahmadsheraz.com" style="color:#0D9488">ahmadsheraz.com</a>
          </p>
        </div>`,
    });

    if (autoReply.error) {
      console.error("[contact] auto-reply failed:", autoReply.error);
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    // Same rule: if it's already stored, the visitor's message wasn't lost.
    return savedToDb
      ? Response.json({ ok: true }, { status: 200 })
      : Response.json({ error: "Could not send message." }, { status: 500 });
  }
}
