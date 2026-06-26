# DEPLOYMENT.md — P1.11 (Vercel + DNS)

Self-paced checklist. The repo is already deploy-ready:
- ✅ `<Analytics />` wired into `src/app/layout.js`
- ✅ `npm run build` and `npm run lint` pass clean
- ✅ Released on `main` (tag `v0.1.0`); Vercel will auto-redeploy on every push to `main`

DNS choice: **Vercel nameservers** (Vercel manages DNS + SSL automatically — simplest path).

---

## Step 1 — Let Vercel see the repo, then deploy

1. In GitHub, the Vercel app currently has access to only one repo. Fix that first:
   GitHub → **Settings → Applications → Vercel → Configure** → under *Repository access*
   choose **All repositories** (or add `ahmadsheraz-portfolio`) → **Save**.
2. Go to **https://vercel.com/new** → **Import** `AhmadShazy/ahmadsheraz-portfolio`.
3. Framework auto-detects **Next.js** — keep all defaults
   (Root `./` · Build `next build` · Output `.next`).
4. **Environment Variables: leave empty.** Phase 1 has zero backend calls; none are
   needed yet (Mongo/Resend/JWT come in Phase 2).
5. **Deploy.** Open the `*.vercel.app` URL and confirm the site renders + scrolls.

> From now on, every push to `main` auto-deploys.

---

## Step 2 — Add the custom domain (Vercel nameservers)

1. Vercel project → **Settings → Domains** → add **`ahmadsheraz.com`**, then **`www.ahmadsheraz.com`**
   (accept the offer to redirect `www` → apex).
2. Vercel detects the domain isn't on its nameservers and shows **"Use Vercel Nameservers"**
   with two values, e.g. `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. Copy them.
3. At the **domain registrar** for ahmadsheraz.com → change the **nameservers** to the two
   Vercel ones (replace the existing ones) → save.
4. Wait for propagation (often <1 h, can be up to 24–48 h). Vercel auto-issues the SSL cert
   once it sees its nameservers.

### ⚠️ Caveat — if the registrar is Cloudflare Registrar
Cloudflare Registrar **forces Cloudflare nameservers** — you can't point NS at Vercel.
If that's the case, use the **Cloudflare DNS fallback** below instead of Step 2.3.

<details>
<summary>Fallback: keep DNS on Cloudflare (only if you can't move nameservers)</summary>

Cloudflare → ahmadsheraz.com → **DNS → Records**, add exactly what Vercel's domain
screen shows (typically):

| Type  | Name | Content                | Proxy            |
|-------|------|------------------------|------------------|
| A     | `@`  | `76.76.21.21`          | **DNS only (grey)** |
| CNAME | `www`| `cname.vercel-dns.com` | **DNS only (grey)** |

Then: **SSL/TLS → set mode to "Full"** (NOT "Flexible" — Flexible = infinite redirect loop),
and keep both records **grey-cloud / DNS-only** (orange-cloud proxy conflicts with Vercel SSL).
</details>

---

## Step 3 — Enable Analytics
Vercel project → **Analytics** tab → **Enable**. (The `<Analytics />` code is already shipped.)

---

## Step 4 — Verify (then tell Claude to double-check)
- `https://ahmadsheraz.com` loads with 🔒 (valid SSL)
- `https://www.ahmadsheraz.com` redirects to the apex
- All 8 sections render, scroll, and animate
- Vercel → Domains shows **Valid Configuration**

Once live, ask Claude to verify — it can fetch the live URL, confirm SSL/redirect, that all
sections render, and that the Analytics script loaded, then mark **P1.11 done / Phase 1 ✅**.

---

## Done When
- [ ] Site live at ahmadsheraz.com
- [ ] SSL active (https)
- [ ] Vercel Analytics enabled
- [ ] All sections work on the live site
