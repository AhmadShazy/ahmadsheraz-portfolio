# SETUP_SERVICES.md — Phase 2 external accounts

Self-paced setup for the two services Phase 2 needs. Do **Resend first** — it unblocks
the live contact form, which currently shows a success message but sends nothing.

## 🔐 Rule for both services

**Never paste a connection string or API key into chat.** Put values directly into
`.env.local` (git-ignored). Claude writes code that reads `process.env.X` and never
needs the real value.

Every secret must **also** be added in the Vercel dashboard
(Project → Settings → Environment Variables → Production + Preview).
`.env.local` is local-only — if a secret is missing on Vercel, the live site breaks.

---

# 1. Resend (email) — do this first

## ⚠️ READ THIS BEFORE ADDING ANY DNS RECORD

You currently receive mail at `sheraz@ahmadsheraz.com` through **Cloudflare Email
Routing**, which owns the MX records on your root domain:

```
ahmadsheraz.com  MX  route1.mx.cloudflare.net  (47)
ahmadsheraz.com  MX  route2.mx.cloudflare.net  (29)
ahmadsheraz.com  MX  route3.mx.cloudflare.net  (53)
```

**If you add Resend's MX record to the root domain, incoming email to
sheraz@ahmadsheraz.com stops working.** MX records are how mail finds your inbox;
pointing them at Resend sends your mail to a service that doesn't host mailboxes.

✅ **The fix: verify a _subdomain_ in Resend, not the root domain.**
Use **`send.ahmadsheraz.com`**. Its records never touch the root MX, so your inbox
is untouched. This is also Resend's own recommendation.

## Steps

1. **Sign up** → https://resend.com (free tier: 3,000 emails/month, 100/day — plenty).

2. **Domains → Add Domain** → enter **`send.ahmadsheraz.com`** (NOT `ahmadsheraz.com`).
   Pick the region closest to you.

3. Resend shows a record list — typically:
   - `MX` on `send` → `feedback-smtp.<region>.amazonses.com`
   - `TXT` on `send` → `v=spf1 include:amazonses.com ~all`
   - `TXT` on `resend._domainkey.send` → long DKIM key
   - (optional) `TXT` `_dmarc` → DMARC policy

4. **Add them in Cloudflare** → ahmadsheraz.com → **DNS → Records → Add record**.
   - Copy each **exactly**; watch for trailing dots and truncated DKIM keys.
   - Cloudflare may append the domain automatically — if a field wants `send`, don't
     type `send.ahmadsheraz.com` or you'll create `send.ahmadsheraz.com.ahmadsheraz.com`.
   - **Proxy status: DNS only (grey cloud).** MX/TXT can't be proxied anyway.
   - ❗ Do **not** touch or delete the existing `route1/2/3.mx.cloudflare.net` records.

5. Back in Resend → **Verify**. Usually a few minutes.

6. **API Keys → Create API Key** (permission: *Sending access*). Copy it once — it's
   shown only once.

7. Put it in `.env.local`:
   ```
   RESEND_API_KEY=re_your_key_here
   ```
   …and add the same variable in **Vercel → Settings → Environment Variables**.

8. Tell Claude it's done. Sending address will be something like
   `noreply@send.ahmadsheraz.com`, with **reply-to** set to `sheraz@ahmadsheraz.com`
   so replies land in your normal inbox.

### Gotchas
- Free tier can only send to **your own verified address** until the domain verifies —
  finish verification before testing.
- If DKIM won't verify, it's almost always a truncated/wrapped key. Re-paste it.
- Don't send from `@ahmadsheraz.com` while only the subdomain is verified.

---

# 2. MongoDB Atlas (database) — needed for P2.1

## Steps

1. **Sign up** → https://www.mongodb.com/cloud/atlas/register

2. **Create a cluster** → **M0 (Free)**.
   - Provider/region: pick the closest — e.g. AWS **Mumbai (ap-south-1)**.
   - Name it something like `portfolio-cluster`.

3. **Database Access → Add New Database User**
   - Auth: password. Username e.g. `portfolio_app`.
   - Use Atlas's **Autogenerate Secure Password** and save it.
   - Role: **Read and write to any database**.
   - ⚠️ If your password contains `@ : / ? # [ ] %`, it must be **URL-encoded** in the
     connection string (`@` → `%40`). Easiest to avoid those characters entirely.

4. **Network Access → Add IP Address → Allow access from anywhere (`0.0.0.0/0`)**
   - **Why:** Vercel serverless functions get rotating IPs, so there's no fixed address
     to allow-list. Without this, the live site can't reach the database.
   - **The trade-off (accept knowingly):** the cluster is reachable from any IP, so your
     database user's password is the only thing protecting it. Use a long generated
     password, never commit it, and give the user only the roles it needs.

5. **Connect → Drivers → Node.js** → **copy the string Atlas shows you — don't retype it
   from this guide.** Atlas gives every cluster a unique 5-character hash in the hostname
   (e.g. `portfolio-cluster.a1b2c.mongodb.net`). Any example below writes that hash as
   `HASH`; if `HASH` (or `xxxxx`) survives into your `.env.local`, DNS can't resolve the
   host and you get `querySrv ESERVFAIL`.

   Shape only — yours will differ:
   ```
   mongodb+srv://portfolio_app:<password>@portfolio-cluster.HASH.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Then make exactly two edits to the copied string:**
   - Replace `<password>` with the real password (URL-encoded if needed).
   - Insert the database name **before the `?`** — otherwise Mongoose writes to `test`:
   ```
   mongodb+srv://portfolio_app:PASSWORD@portfolio-cluster.HASH.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

7. Put it in `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://...
   ```
   …and add the same variable in **Vercel → Settings → Environment Variables**.

### Gotchas
- **Placeholder hostname** (`HASH` / `xxxxx` left in) → `querySrv ESERVFAIL`. Always copy
  the host from Atlas itself.
- `<password>` left literally in the string is the other classic failure.
- Missing database name → data silently lands in `test`.
- M0 clusters **auto-pause after ~60 days idle**; the first request after that is slow.

---

# Checklist

**Resend (unblocks the contact form)**
- [ ] Account created
- [ ] **`send.ahmadsheraz.com`** subdomain added (NOT the root domain)
- [ ] DNS records added in Cloudflare, grey-cloud, existing MX untouched
- [ ] Domain shows **Verified**
- [ ] API key in `.env.local` **and** Vercel

**MongoDB Atlas (unblocks P2.1)**
- [ ] M0 cluster created
- [ ] Database user created, password saved
- [ ] Network access `0.0.0.0/0`
- [ ] Connection string fixed up (password + db name) in `.env.local` **and** Vercel

Once Resend is verified, tell Claude and the contact form gets wired up for real.
