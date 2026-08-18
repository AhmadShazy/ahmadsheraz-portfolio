import { Resend } from "resend";

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

// Escape user input before embedding it in the HTML emails
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validate({ name, email, subject, message }) {
  const errors = [];
  if (!name?.trim()) errors.push("Name is required.");
  if (!email?.trim()) errors.push("Email is required.");
  else if (!EMAIL_RE.test(email.trim())) errors.push("Email is not valid.");
  if (!subject?.trim()) errors.push("Subject is required.");
  if (!message?.trim()) errors.push("Message is required.");
  else if (message.trim().length < 10)
    errors.push("Message must be at least 10 characters.");

  for (const [field, max] of Object.entries(LIMITS)) {
    const value = { name, email, subject, message }[field];
    if (value && String(value).length > max)
      errors.push(`${field} is too long (max ${max}).`);
  }
  return errors;
}

export async function POST(request) {
  // Fail loudly in logs, softly to the visitor, if the key is missing (e.g. the
  // env var wasn't added in the Vercel dashboard).
  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not set");
    return Response.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

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

  const name = body.name?.trim();
  const email = body.email?.trim();
  const subject = body.subject?.trim();
  const message = body.message?.trim();

  const errors = validate({ name, email, subject, message });
  if (errors.length > 0) {
    return Response.json({ error: errors.join(" ") }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject),
    // Preserve the sender's line breaks in the HTML email
    message: escapeHtml(message).replace(/\n/g, "<br>"),
  };

  try {
    // 1) Notify Ahmad. reply_to is the sender, so hitting Reply just works.
    const notify = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `🔔 New Message from ahmadsheraz.com — ${name}`,
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
      return Response.json({ error: "Could not send message." }, { status: 500 });
    }

    // 2) Auto-reply to the sender. Best-effort: if this fails the message still
    //    reached Ahmad, so don't fail the whole request.
    const autoReply = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: TO_EMAIL,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;color:#0F1C2E;line-height:1.6">
          <h2 style="color:#0D9488;margin:0 0 16px">Thanks for getting in touch</h2>
          <p style="margin:0 0 12px">Hi ${safe.name},</p>
          <p style="margin:0 0 12px">
            Your message reached me — I read every one personally and usually reply
            within 24–48 hours.
          </p>
          <p style="margin:0 0 12px">For reference, here's what you sent:</p>
          <div style="border-left:3px solid #0D9488;padding:12px 16px;background:#F0FDFA">
            <p style="margin:0 0 8px"><strong>${safe.subject}</strong></p>
            ${safe.message}
          </div>
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
    return Response.json({ error: "Could not send message." }, { status: 500 });
  }
}
