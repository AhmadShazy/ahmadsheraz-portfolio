# EXECUTION_PLAN.md — ahmadsheraz.com

The **living plan**. One sub-phase = one Claude Code session.

- **What and when** → this file.
- **How to build Phase 3** → [docs/PHASE3_GUIDE.md](docs/PHASE3_GUIDE.md).
- **How to deploy / operate** → [docs/RUNBOOK.md](docs/RUNBOOK.md).
- **Rules and locked decisions** → [CLAUDE.md](CLAUDE.md).
- **Phases 0–2 build history** → [docs/ARCHIVE-PHASES-0-2.md](docs/ARCHIVE-PHASES-0-2.md) *(historical, don't read it)*.

---

## 📊 Status

**Phases 0, 1 and 2 are COMPLETE and LIVE at https://www.ahmadsheraz.com.**
The site renders every project, skill, degree and role from MongoDB via ISR, and
the contact form delivers email and persists messages.

| Phase | Scope | Status |
|---|---|---|
| **0** | Foundation — Next.js, Git, design system | 🟢 DONE |
| **1** | Frontend — 8 sections, 3D hero, responsive, deployed | 🟢 DONE |
| **2** | Backend — MongoDB, API routes, ISR, Resend contact form | 🟢 DONE |
| **3** | Admin panel — private CMS at a separate subdomain | 🟡 **IN PROGRESS** — P3.0 done |

<details>
<summary>Sub-phase detail for the finished phases</summary>

| Sub-Phase | Name | Status |
|---|---|---|
| P0.1 | Project Foundation & Git Setup | 🟢 |
| P1.1–P1.10 | Shared components, Hero, About, Skills, Projects, Education, Experience, Hire Me, Contact, polish | 🟢 |
| P1.11a | Hero 3D consolidated into one `ParticleConstellation` | 🟢 |
| P1.11b | Profile photo merged into the About card | 🟢 |
| P1.11c | Mobile background-gradient seams fixed | 🟢 |
| P1.11 | Deployment — Vercel + Cloudflare DNS, SSL + HSTS, Analytics | 🟢 |
| P2.1 | Connection singleton + 6 Mongoose models | 🟢 |
| P2.2 | Shared `src/lib/data.js` read layer + 5 GET routes | 🟢 |
| P2.3 | `npm run seed` — 7 projects / 37 skills / 1 edu / 1 exp / 2 social | 🟢 |
| P2.4 | 4 sections became async server components; ISR `revalidate = 3600` | 🟢 |
| P2.5 | Contact form + Resend; messages persisted before sending | 🟢 |

Unplanned refinement passes, all merged: Skills redesign (Option D) · hero
constellation cursor fix · skill-group hover · **GlassCard as the single source
of card hover** · skills equal-height symmetry · About card merge + photo sizing
· contact-abuse hardening · audit follow-ups.

</details>

---

## ⚠️ Known issues — read before touching the related area

Deliberately unfixed. Raise them rather than rediscovering them.

| Issue | Bites you when |
|---|---|
| `SkillsGrid` uses `import * as Icons from "lucide-react"` — defeats tree-shaking, ships ~809 KB | Any bundle-size work. Fix = an explicit icon map, like the one `HireMeContent` now uses |
| A DB error during ISR revalidation caches "Failed to load" for up to an hour | Atlas hiccups. Consider serving the last good payload |
| `seed.js` wipes then inserts, non-atomically | **After P3.2 it destroys every admin edit.** Back up first |
| `Project.rank` is `unique: true` | **P3.2.** Drag-to-reorder throws E11000. See the guide, §5 |
| `Skill` has a unique `{category, name}` index | **P3.3.** Ordinary edits throw E11000 |
| Deleting a `Message` resets that sender's contact rate-limit counter | **P3.5.** Prefer archiving |

**Owner-deferred — do NOT action without explicit instruction:**
**WCAG AA contrast.** The locked palette is below AA for small text (teal
`#0D9488` ≈ 3.3–3.7:1, white-on-teal buttons ≈ 3:1, `text-secondary` ≈
4.1–4.5:1). Decision (2026-06-22): leave colors unchanged; revisit **after the
theme is finalized post-deployment**.

---

# PHASE 3 — Admin Panel

**Goal:** a private CMS that edits the live site's content, at a subdomain that
is never referenced from the portfolio.

**The rule, stated precisely:** no admin code, URL, credential or reference may
ever enter the portfolio app. Phase 3 *does* make changes in the portfolio repo
(P3.0 only) — every one of them public-safe and admin-agnostic. The earlier
phrasing "Phase 3 never touches the portfolio" was impossible: without a
revalidation hook the admin cannot refresh the live page, and without wiring the
hardcoded sections there is nothing for half the admin to edit.

**Repos:** portfolio = `ahmadsheraz-portfolio` (public, exists).
Admin = `ahmadsheraz-admin` (**private, to create**). Same Atlas cluster, same
`portfolio` database.

> 📖 **Before P3.1, read [docs/PHASE3_GUIDE.md](docs/PHASE3_GUIDE.md) §0.** Five
> parts of the original plan were verified broken against the installed
> `next@16.2.9` — Edge-runtime JWT, a non-existent shared secret, "changes appear
> immediately", unique-index reordering, and editors for hardcoded content. The
> sub-phases below are the corrected versions.

---

### P3.0 — Portfolio prep *(in the **portfolio** repo)* — 🟢 **DONE**

**Branch:** `feat/phase3-prep` from `dev` · shipped 2026-08-20
**Why first:** everything after this depends on it. Skipping it produces an
admin panel whose saves succeed and change nothing.

1. **Revalidation hook** — add `src/app/api/revalidate/route.js`
   (guide §3). Add `REVALIDATE_SECRET` to `.env.example`, `.env.local` and the
   Vercel project. Public-safe: no input, no writes, no admin references.
2. **Wire social links** — `getSocialLinks()` → `HeroContent.jsx` and
   `ContactSection.jsx` via server-component props. Delete the hardcoded
   `GITHUB_URL` / `LINKEDIN_URL` constants.
3. **Add the `SiteContent` model** (guide §4) and move hardcoded content into
   it: hero roles/tagline/available-for-work, About paragraphs + stats, Hire Me
   services, contact email. Extend `seed.js` to populate it. Sections read it
   through `src/lib/data.js` like every other content type.
4. **Add `{ timestamps: true }`** to the content schemas.
5. **Housekeeping:** `npm uninstall jsonwebtoken bcryptjs` (unused here — they
   belong to the admin repo, and leaving them invites auth code into the wrong
   app). Delete the unreferenced create-next-app SVGs in `public/`.

**Shipped.** New: `SiteContent` model + `getSiteContent()`, `/api/revalidate`,
a shared `SocialLinks` component, and server/client splits for Hero, Hire Me and
Contact (`HeroShell`, `HireMeContent`, `ContactInfo`). Removed: `jsonwebtoken`,
`bcryptjs`, five scaffold SVGs, and every hardcoded content constant.

> ⚠️ **`REVALIDATE_SECRET` must be added to the Vercel project** before the
> admin's revalidate calls will work. Until then `/api/revalidate` returns 500
> and edits appear on the normal 1-hour ISR schedule — the site is unaffected.

---

### P3.1 — Admin app scaffold + authentication *(new repo)*

**Branch:** `feat/admin-setup-auth` in the new `ahmadsheraz-admin` repo

```bash
npx create-next-app@latest ahmadsheraz-admin --js --tailwind --app --src-dir --import-alias "@/*" --yes
npm install mongoose jose bcryptjs
```

**Not** `jsonwebtoken`, **not** `js-cookie`, **not** `cookie` — see guide §1.

1. Copy `src/lib/mongodb.js` + `src/lib/models/` from the portfolio verbatim,
   each with the "⚠️ COPY — change both" header (guide §6).
2. `src/lib/auth.js` — jose sign/verify + the one cookie definition (guide §1).
3. `src/proxy.js` — **not** `middleware.js`; matcher covers `/dashboard/:path*`
   **and** `/api/admin/:path*` from day one.
4. `src/app/login/page.js` — password only, glass styling to match the portfolio.
5. `src/app/api/auth/login/route.js` + `logout/route.js`.
6. Login brute-force limiter, DB-counted, **fails closed** (guide §1).
7. `src/app/dashboard/page.js` — placeholder nav + working logout.
8. `noindex` metadata in the admin's root layout.
9. `.env.example` + `.env.local`. Generate `JWT_SECRET` and
   `ADMIN_PASSWORD_HASH` locally — **never in chat** (guide §2).
10. **Private** GitHub repo, `main`/`dev` branches, first push.

**Done when:** correct password → dashboard; wrong → 401; 5 wrong → 429;
`/dashboard` and `/api/admin/*` both redirect/401 without a valid cookie; the
cookie is `httpOnly` + `Secure` + `SameSite=Lax`; logout genuinely clears it;
`npm run build` passes with **no** middleware-deprecation warning.

---

### P3.2 — Projects CRUD

**Branch:** `feat/admin-projects`

Table (rank · title · rating · featured · actions), add/edit form, delete with
confirmation, drag-to-reorder. `/api/admin/projects` + `/api/admin/projects/[id]`
— GET, POST, PUT, DELETE, each verifying auth **inside the handler**.

- Reordering **must** use the guide §5 approach. Naive per-row updates throw
  E11000 on `rank`.
- Call `revalidatePortfolio()` after every successful write.
- **Back up the database before this ships** (guide §8).

**Done when:** every operation works against real data, an edit appears on
www.ahmadsheraz.com within a minute, unauthenticated requests get 401.

---

### P3.3 — Skills, Experience, Education CRUD

**Branch:** `feat/admin-content`

Same pattern as P3.2, three more resources.

- Skills: category dropdown from `SKILL_CATEGORIES`; icon **picker** backed by
  the real lucide export list — a free-text icon crashes the live Skills section
  (guide §5). Catch E11000 → 409, never 500.
- Experience: dynamic bullet add/remove; `order` controls sequence.
- Education: add an `order` field while you are here.

---

### P3.4 — Site content editor

**Branch:** `feat/admin-sitecontent`

Edits the `SiteContent` document created in P3.0: hero roles (add / remove /
reorder), tagline, available-for-work toggle, About paragraphs + stats, Hire Me
services, contact email, and the social links.

Blocked on P3.0 — without it this screen edits data nothing renders.

---

### P3.5 — Contact inbox

**Branch:** `feat/admin-inbox`

Message list (newest first), expand to read, read/unread toggle, unread badge in
the nav, archive. **Never display `ipHash`.** Prefer archive over delete —
deleting resets that sender's rate-limit counter (guide §5).

---

### P3.6 — Deploy the admin

**Branch:** `feat/admin-deploy`

Follow [docs/RUNBOOK.md](docs/RUNBOOK.md) §7: separate Vercel project, env vars
in all three environments, the admin subdomain via Cloudflare (grey-cloud),
then **enable Vercel Deployment Protection** as a second lock.

**Final security check:**

```bash
grep -ri "admin\." src/ public/ *.md      # in the PORTFOLIO repo — must be empty
```

**Done when:** login and all CRUD work on the live admin, edits appear on the
portfolio within a minute, the admin URL appears nowhere in the portfolio, and
the admin returns Vercel's protection screen when logged out.
**Phase 3 complete ✅**

---

## 🔁 Session start template

```
Read CLAUDE.md and EXECUTION_PLAN.md.
For Phase 3 work also read docs/PHASE3_GUIDE.md.

Current sub-phase: [e.g. P3.1 — Admin scaffold + auth]
Repo: [portfolio | admin]
Branch to create: [e.g. feat/admin-setup-auth] from dev

Last session completed: [what shipped]
Known issues carried in: [anything broken or pending]

Do only this sub-phase. Run npm run build and npm run lint before committing.
Verify the dev preview before any merge to main.
```

---

*ahmadsheraz.com · Ahmad Sheraz · plan last revised 2026-08-20*
