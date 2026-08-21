# EXECUTION_PLAN.md — ahmadsheraz.com

The **living plan**. One sub-phase = one Claude Code session.

- **What and when** → this file.
- **How to build Phase 3** → [docs/PHASE3_GUIDE.md](docs/PHASE3_GUIDE.md).
- **How to deploy / operate** → [docs/RUNBOOK.md](docs/RUNBOOK.md).
- **Rules and locked decisions** → [CLAUDE.md](CLAUDE.md).
- **Phases 0–2 build history** → [docs/ARCHIVE-PHASES-0-2.md](docs/ARCHIVE-PHASES-0-2.md) *(historical, don't read it)*.

---

## 📊 Status

**Phases 0–3 are COMPLETE and LIVE.** The site renders every project, skill,
degree and role from MongoDB via ISR, and the contact form delivers email and
persists messages. The private CMS is live on its own subdomain and edits every
content type here — including the profile photo — with changes reaching the
live site in under a minute.

**Work after P3.6, all shipped:** two-step sign-in (username + password, then a
TOTP code), hand-written RFC 6238 TOTP checked against the specification's own
vectors, 15-day trusted devices whose revocation also ends the live session,
a database-backed profile photo with browser-side downscaling and magic-byte
validation, and the admin's UI brought onto the portfolio's design system.

Guarded by four scripts in the admin repo: `check:auth`, `check:totp`,
`check:upload` and `check:models`.

| Phase | Scope | Status |
|---|---|---|
| **0** | Foundation — Next.js, Git, design system | 🟢 DONE |
| **1** | Frontend — 8 sections, 3D hero, responsive, deployed | 🟢 DONE |
| **2** | Backend — MongoDB, API routes, ISR, Resend contact form | 🟢 DONE |
| **3** | Admin panel — private CMS at a separate subdomain | 🟢 **DONE** — P3.0–P3.6 live, plus two-step auth, trusted devices and photo upload |

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
| `Project.rank` is `unique: true` — **kept deliberately** | Any code writing ranks. Use the admin's two-pass `bulkWrite`; never update one rank alone |
| `Skill` has a unique `{category, name}` index | Any code writing skills. The admin maps E11000 → 409; same name in a different category is legal and the seed relies on it |
| Deleting a `Message` resets that sender's contact rate-limit counter | Any inbox work. The admin archives instead — measured and confirmed unchanged across an archive |

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
Admin = `ahmadsheraz-admin` (**private, live**). Same Atlas cluster, same
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

### P3.1 — Admin app scaffold + authentication *(new repo)* — 🟢 **DONE**

Built 2026-08-20 in the new `ahmadsheraz-admin` repo (local; see the note below).

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

**Shipped.** `jose` + `src/proxy.js` (not `middleware.js`), password-only login,
DB-counted brute-force limiter that fails closed, logout route, gated dashboard,
noindex metadata, `.env.example`, and the portfolio's models copied in with
"⚠️ COPY — change both" headers.

Verified against a production build: `/dashboard` and `/api/admin/*` both refuse
an absent, garbage, or `alg=none`-forged token; 5 wrong passwords lock out and
the lockout holds even for the correct one; success returns a cookie with
HttpOnly + Secure + SameSite=Lax + Path=/ + Max-Age=86400; logout clears it;
a successful login resets the failure counter.

Two runtime traps were found by testing and are now documented in the guide §0:
Next's env loader eats a raw bcrypt hash out of `.env.local`, and setting a
cookie needs `NextResponse`, not `Response`.

> ⚠️ **Two owner steps remain before P3.2:**
> 1. Create the **private** GitHub repo `ahmadsheraz-admin` and push (`gh` is not
>    installed on this machine, so the remote could not be added automatically).
> 2. Replace the throwaway test password hash in the admin's `.env.local` with
>    one for a real password — see that repo's `.env.example`.

---

### P3.2 — Projects CRUD — 🟢 **DONE**

Shipped 2026-08-20 on `feat/admin-projects` in the admin repo.

Table (rank · title · rating · featured · actions), add/edit form, delete with
confirmation, drag-to-reorder. `/api/admin/projects` + `/api/admin/projects/[id]`
— GET, POST, PUT, DELETE, each verifying auth **inside the handler**.

- Reordering **must** use the guide §5 approach. Naive per-row updates throw
  E11000 on `rank`.
- Call `revalidatePortfolio()` after every successful write.
- **Back up the database before this ships** (guide §8).

**Shipped.** `/api/admin/projects` (GET, POST, PATCH) +
`/api/admin/projects/[id]` (PUT, DELETE), each verifying the session inside the
handler; a dashboard screen with add/edit/delete/reorder; server-side validation;
and `npm run backup`.

**Decision — the unique `rank` index was KEPT**, against the guide's stated
preference for dropping it. `ProjectCard` renders the rank literally as "#3", so
duplicates would be visible on the live site, and keeping it avoids a cross-repo
schema change. Every rank write is a two-pass `bulkWrite` instead. Rank is not
editable via PUT and not accepted on POST — ordering has exactly one entry point.

Two bugs the tests caught: rating validation treated any numeric rating as
missing (a string helper returning `""` for non-strings), and a rejected reorder
still mutated data because the id check ran after the park pass. Both fixed.

Verified against the real cluster — all five verbs 401 unauthenticated, eleven
validation cases rejected, reorder of last-to-first with contiguous unique ranks,
delete closing the gap, and every collection byte-identical to the pre-flight
backup afterwards.

> The authenticated UI was not visually confirmed — the browser session could not
> be established from this environment. Click through it once and report anything
> that looks wrong.

---

### P3.3 — Skills, Experience, Education CRUD — 🟢 **DONE**

Shipped 2026-08-20 on `feat/admin-content` in the admin repo.

**Shipped.** Built from one `crudRoute()` factory rather than three copies —
three hand-written copies means three places to forget the session check or
revalidation. Projects stays separate because its unique `rank` needs the
two-pass parking dance.

All three `{category, name}` E11000 paths on Skills return a readable 409;
same-name-different-category stays legal (the seed relies on it — InfluxDB is
both a Database and a Data Engineering tool). `order` on these schemas is NOT
unique, so their reorder is a single `bulkWrite`.

**The icon risk was overstated in this plan.** The portfolio resolves icons as
`Icons[name] || Icons.Circle`, so an unknown name shows a circle rather than
crashing. Only lucide's three non-component exports (`default`, `icons`,
`module.exports`) would break a render, and those are rejected by name.

The admin's Skills list groups by category — a flat run of 37 interleaved rows
was correct and unusable.

Verified against the real cluster: 15 endpoints refused unauthenticated; 14
validation cases rejected; reversing all 37 skills and restoring works; rejected
reorders leave data untouched; create/edit/delete clean on all three with
`order` preserved across PUT; the public Skills section renders unchanged.

> ⚠️ **The numeric-value validation bug from P3.2 reappeared.** `asText()`
> returns `""` for any non-string, so a numeric year read as missing and skipped
> every check after it — an end year before the start year saved successfully.
> There is now an explicit `isBlank()` helper. **Do not test a required-field
> check only with strings.**

---

### P3.4 — Site content editor — 🟢 **DONE**

Shipped 2026-08-20 on `feat/admin-sitecontent` (admin) and `feat/p34-content-icons` (portfolio).

**Shipped.** `/dashboard/content` edits the SiteContent singleton (its own
route, not the CRUD factory — GET reads the one document, PUT upserts it, and
POST/DELETE are deliberately absent). `/dashboard/social` uses the factory;
`platform` is unique there, so E11000 → 409 does real work.

**A portfolio-side change was needed first**, same reasoning as P3.0: both icon
maps were too narrow for the editor to be honest. `SocialLinks` *filtered out*
any platform without a brand mark, so adding one would have saved successfully
and rendered nothing. It now falls back to a generic globe, X was added as a
real mark, and HireMe's service icons went from 3 to 16. That map is the
authoritative list the admin's picker mirrors — **change one, change the other.**

Validation refuses what would look broken rather than error: no roles leaves the
hero with no typewriter, an availability toggle with no label renders no badge,
a half-filled stat renders a number with no caption.

Verified: 9 endpoints refused unauthenticated, 14 validation cases rejected with
the document untouched, a full read-modify-save round-trip preserved nested
arrays, and an admin-added link was confirmed rendering on the running site —
including an unbranded platform falling back to the globe instead of vanishing.

> ⚠️ **Never round-trip content through a Git Bash shell variable on Windows.**
> Testing with `curl -d "$VAR"` corrupted every em-dash and middot in the live
> SiteContent to `U+FFFD`. The app is not at fault — a Node-side fetch
> round-trip preserves UTF-8 exactly — but the data had to be restored from the
> pre-flight backup. Drive write tests from Node, not the shell.

---

### P3.5 — Contact inbox — 🟢 **DONE**

Shipped 2026-08-20 on `feat/admin-inbox`.

**Shipped.** List newest first, expand to read (which marks it read), read/unread
toggle, archive with a separate archived view, unread badge on the dashboard, and
a reply-by-email link. `ipHash` is stripped in both the API serializer and the
server-rendered page.

Only `isRead` and `isArchived` are writable — a message is a record of what a
visitor actually sent, and an inbox where that can be edited is one where
evidence quietly changes. Verified: a PATCH carrying `subject` is refused and
does not mutate it.

**Archive vs delete was confirmed, not assumed.** `/api/contact` counts stored
messages per `ipHash`, so deleting hands that sender part of their allowance
back; the per-sender count was measured across an archive and is unchanged. The
delete dialog says so and offers &ldquo;Archive instead&rdquo; as an equally
prominent button.

Needed a schema change in **both** repos (`Message.isArchived`) — `npm run
check:models` caught the drift on a real change, which is what it was built for.

> ⚠️ **A missing field does not match a literal `false`.** The six existing
> messages predate `isArchived`, so `{ isArchived: false }` returned **zero** and
> the inbox looked empty while six messages existed. Queries use `$ne: true`
> (covers missing, null and false) and the existing rows were backfilled. Any
> future field added to a populated collection has the same trap.

---

### P3.6 — Deploy the admin

**Branch:** `feat/admin-deploy`

Follow [docs/RUNBOOK.md](docs/RUNBOOK.md) §7: separate Vercel project, env vars
in all three environments, the admin subdomain via Cloudflare (grey-cloud),
then attempt **Vercel Deployment Protection** as a second lock — which the
current plan refuses for production; see RUNBOOK §7 step 6.

The step-by-step procedure lives in the **admin** repo at `docs/DEPLOY.md` —
that repo is private, so the real hostname can be written down there.

**Final security check** — run in the PORTFOLIO repo, expect no output:

```bash
grep -rinE "admin\.[a-z0-9-]+\.(com|dev|app)" src/ public/ *.md docs/
```

This looks for a *hostname*, not the word "admin". The earlier version,
`grep -ri "admin\."`, matched any sentence ending in "admin." — CLAUDE.md
contains one, so it reported a hit on a clean repo — and its `*.md` covered only
the top level, never scanning `docs/`, where `RUNBOOK.md` and `PHASE3_GUIDE.md`
are the two files most likely to ever carry a hostname.

**Done when:** login and all CRUD work on the live admin, edits appear on the
portfolio within a minute, the admin URL appears nowhere in the portfolio, and
the second lock is either in place or consciously deferred — it is
**plan-blocked today**, see the admin repo's `docs/DEPLOY.md` §6.
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
