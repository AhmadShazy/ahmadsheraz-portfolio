# RUNBOOK — ahmadsheraz.com operations

Everything about running the live site: deploying, rolling back, DNS, and the
external services. Replaces the old `DEPLOYMENT.md` and `SETUP_SERVICES.md`,
both of which contradicted themselves on the facts below.

---

## 1. Current production reality (verified)

| Thing | Value |
|---|---|
| Canonical URL | **https://www.ahmadsheraz.com** |
| Apex | `ahmadsheraz.com` → **308 redirect → www** |
| Host | Vercel, project `ahmadsheraz-portfolio`, auto-deploys `main` |
| DNS zone | **Cloudflare** (nameservers stayed at Cloudflare — Vercel nameservers were *not* used) |
| Cloudflare records | Point at Vercel anycast `216.198.79.1`, `64.29.17.1` — **grey-cloud / DNS-only** |
| SSL | Vercel-issued, HSTS `max-age=63072000` |
| Analytics | Vercel Web Analytics **and** Speed Insights, both enabled |
| Repo | `github.com/AhmadShazy/ahmadsheraz-portfolio` (public) |

> The old `DEPLOYMENT.md` claimed both "apex 308→www" *and* "www redirects to the
> apex", and its fallback table listed `76.76.21.21`, which is **not** what this
> zone points at. Both are corrected above. If you ever re-add records, read them
> off the Vercel domain screen — never off a doc.

**Cloudflare proxy must stay grey-cloud (DNS-only).** Orange-cloud proxying in
front of Vercel breaks certificate issuance. If SSL mode is ever set, it must be
**Full** — "Flexible" causes an infinite redirect loop.

---

## 2. Deploy safety rule — read before every merge to `main`

`main` auto-deploys to production. Since Phase 2 the page reads MongoDB at
build/ISR time, so **a missing or wrong env var breaks the live site.**

Vercel **snapshots environment variables at build time** — changing a variable in
the dashboard does nothing until the next deployment.

**Before merging `dev` → `main`:**

1. Push to `dev`. It builds a preview at
   `ahmadsheraz-portfolio-git-dev-ahmadshazys-projects.vercel.app`.
2. Hit `/api/projects` on that preview. Expect **200 with 7 projects**, not a 500
   and not `[]`.
3. Only then merge to `main`, and re-check production afterwards.

### If production breaks

```bash
git revert -m 1 <merge-sha> && git push origin main
```

That restored the site in ~10 seconds the one time it was needed. Diagnose from
**Vercel runtime logs**, not guesswork:

| Log says | Actual cause |
|---|---|
| `bad auth : authentication failed` | Wrong credentials in Vercel's copy of `MONGODB_URI` |
| Connection timeout | Atlas IP allowlist |
| 200 OK but empty arrays | Wrong database — but `dbName` is now pinned in code, so this class is closed |

---

## 3. Environment variables

`.env.example` in the repo root is the **single source of truth**. Every variable
must be set in **both** `.env.local` (local) and the **Vercel dashboard** (all
three environments: Production, Preview, Development).

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | **yes** | Without it the build ships an empty site |
| `MONGODB_DB` | no | Defaults to `portfolio`; the code pins `dbName` either way |
| `RESEND_API_KEY` | no | Contact form still persists messages without it |
| `CONTACT_FROM_EMAIL` | no | Must be a Resend-verified sender |
| `IP_HASH_SALT` | no | Derived from `MONGODB_URI` when unset |
| `REVALIDATE_SECRET` | no | Authenticates `POST /api/revalidate`. Unset ⇒ the endpoint refuses everything and the page refreshes on its normal 1-hour schedule. The admin app needs the **identical** value |

Generate the revalidate secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

**Never paste a secret into chat, a commit, or a markdown file.**

---

## 4. Resend (email)

**Verified sending domain: `jobcraft-ai.ahmadsheraz.com`.** That is what
`src/app/api/contact/route.js` falls back to and what the free tier allows —
Resend's free plan permits **one domain only**, and this one was reused rather
than adding a second.

> The old `SETUP_SERVICES.md` told you to verify `send.ahmadsheraz.com`. That was
> the original plan and is **not** what shipped. Do not add that domain.

- Delivery address: `sheraz@ahmadsheraz.com` (Cloudflare Email Routing).
- Quota: 100 emails/day. The contact form sends up to **two** per submission
  (notification + auto-reply), so the real ceiling is ~50 submissions/day —
  which is why `/api/contact` rate-limits to 3/hour and 8/day per IP.

### The one dangerous mistake

**Never replace the MX records on the apex `ahmadsheraz.com`.** MX is how mail
reaches the inbox; overwriting it silently kills `sheraz@ahmadsheraz.com`.
Resend verification only ever needs records on the **sending subdomain**.

---

## 5. MongoDB Atlas

- Free tier (M0), shared cluster. Database name: **`portfolio`** — pinned in
  `src/lib/mongodb.js`, not trusted to the URI path.
- Collections: `projects`, `skills`, `experiences`, `educations`,
  `sociallinks`, `messages`.
- Network access: allow-from-anywhere (`0.0.0.0/0`) is required because Vercel's
  serverless egress IPs are not fixed. Adding a second Vercel project (the admin
  app) needs **no** network-access change.

### Connection-string gotchas that already cost time

- A URI **without** `/portfolio` connects and authenticates fine but returns zero
  rows — a 200-OK failure. Pinning `dbName` in code closed this.
- The `mongodb+srv://` form needs working **SRV *and* TXT** DNS lookups. Some
  ISPs drop TXT, producing `queryTxt ETIMEOUT`. Fix: use the **non-SRV
  multi-host** connection string, or switch the resolver to `8.8.8.8`.
- Placeholders in guides are placeholders. `querySrv ESERVFAIL` once came from
  copying a literal `xxxxx` hostname.

---

## 6. Reseeding

```bash
npm run seed
```

Requires Node ≥ 20.9 (uses `node --env-file`). It **wipes and reinserts**
`projects`, `skills`, `experiences`, `educations` and `sociallinks`. It
deliberately **preserves `messages`**.

> ⚠️ **After the admin panel goes live, `npm run seed` destroys every edit made
> through it.** Treat it as a first-time-setup and disaster-recovery command
> only. See [PHASE3_GUIDE.md](PHASE3_GUIDE.md) §8 for the backup step.

---

## 7. Adding the admin subdomain (Phase 3, P3.6)

The admin app is a **separate Vercel project** from a **separate private repo**.

1. Vercel → **New Project** → import `ahmadsheraz-admin` (private repo).
2. Add its environment variables (see [PHASE3_GUIDE.md](PHASE3_GUIDE.md) §2)
   to all three environments. Deploy and confirm the `*.vercel.app` URL works.
3. Vercel → that project → **Settings → Domains** → add the admin subdomain.
   Vercel shows the exact record to create — **use the value it shows**, do not
   copy one from any document.
4. Cloudflare → `ahmadsheraz.com` → **DNS → Records** → add the record Vercel
   asked for, **grey-cloud / DNS-only**.
5. Wait for **Valid Configuration** in Vercel, then confirm HTTPS.
6. **Vercel Deployment Protection — not available on the current plan.**
   Standard Protection is enabled on the admin project, but the plan caps it at
   `all_except_custom_domains`: it gates the per-deployment URLs and leaves both
   the custom domain and the bare `<project>.vercel.app` alias serving the app.
   Setting it to `all` is refused with *"Vercel Authentication is not available
   on your plan for production deployments"*. Verified 2026-08-21.

   The admin therefore runs on its own login alone. Options for a real second
   lock — Vercel Pro, Cloudflare Access, or app-level TOTP — are weighed in the
   **admin** repo's `docs/DEPLOY.md` §6. Do not record this step as done because
   the setting reads "enabled"; it is enabled and it does not cover the live
   URLs.

**Never reference the admin hostname from the portfolio app** — not in code, not
in comments, not in `robots.txt`, not in a sitemap, and not in these docs (this
repo is public). Listing it in a public `robots.txt` would *advertise* it, which
is worse than saying nothing.

---

*Supersedes DEPLOYMENT.md and SETUP_SERVICES.md · last verified 2026-08-20*
