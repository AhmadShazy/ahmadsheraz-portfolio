# CLAUDE.md — ahmadsheraz.com
# Living rules and locked decisions. Read fully, every session.

**Status: Phases 0–2 shipped. Live at https://www.ahmadsheraz.com. Phase 3 (admin panel) is next.**

| Need | File |
|---|---|
| What to build next | [EXECUTION_PLAN.md](EXECUTION_PLAN.md) |
| How to build Phase 3 | [docs/PHASE3_GUIDE.md](docs/PHASE3_GUIDE.md) |
| Deploying, DNS, Atlas, Resend | [docs/RUNBOOK.md](docs/RUNBOOK.md) |
| Env vars | `.env.example` — the single source of truth |
| Phase 0–2 history | [docs/ARCHIVE-PHASES-0-2.md](docs/ARCHIVE-PHASES-0-2.md) *(don't read by default)* |

---

## 👤 Identity

- **Owner:** Ahmad Sheraz — goes by Shezi · sheraz@ahmadsheraz.com · github.com/AhmadShazy
- **Positioning:** AI engineer who ships full-stack products. **Not** a web developer.
- **Goal:** a statement piece that says *"I am a serious engineer — not a bootcamp grad."*
- **Dev environment:** Windows · PowerShell · Node ≥ 20.9

---

## ⚠️ Facts that bite if you forget them

1. **Tailwind v4 — there is NO `tailwind.config.js`.** All tokens live in the
   `@theme` block in `src/app/globals.css`. Never create one.
2. **JavaScript only.** No TypeScript.
3. **App Router only**, everything under `src/`.
4. **The database is pinned in code.** `src/lib/mongodb.js` sets
   `dbName: "portfolio"`. A URI without a `/db` path would otherwise connect to
   `test` and return zero rows with a 200 — a failure that looks like working.
5. **The page is ISR-cached for an hour** (`revalidate = 3600` in
   `src/app/page.js`). Content changes are not instant. Never tell the owner an
   edit will "appear immediately".
6. **`npm run seed` wipes and reinserts** all content collections (it preserves
   `messages`). Once the admin panel is live, it destroys real edits.
8. **No wildcard icon imports.** `import * as Icons from "lucide-react"` drags
   the whole set into the bundle. Use an explicit map with a fallback — icon
   names are admin-editable, so an unknown one must not render `undefined`.
7. **`GlassCard` is the only place card hover is defined.** Resting faint-teal
   border → solid teal + `scale(1.02)`. Do **not** re-add per-card hover CSS;
   `hoverBorder={false}` opts out.

---

## 🛠️ Stack — locked

### Portfolio (this repo)

| Layer | Technology |
|---|---|
| Framework | Next.js 16 — App Router (Node ≥ 20.9) |
| Language | JavaScript |
| Styling | Tailwind CSS v4 + glass utilities in `globals.css` |
| 3D | Three.js + React Three Fiber + drei |
| Animation | GSAP + ScrollTrigger · Typed.js |
| Icons | Lucide React |
| Data | MongoDB Atlas via Mongoose |
| Email | Resend |
| Hosting | Vercel (auto-deploys `main`) · DNS on Cloudflare |
| Analytics | Vercel Analytics + Speed Insights |

### Admin app (Phase 3 — separate private repo, NOT this one)

`mongoose` · **`jose`** (not `jsonwebtoken` — it cannot run in the proxy layer)
· `bcryptjs`. Details in [docs/PHASE3_GUIDE.md](docs/PHASE3_GUIDE.md).

It lives in the **sibling directory** `../ahmadsheraz-admin` — a separate repo
with its own `.git`, its own private GitHub remote, and its own `CLAUDE.md`.
**Do admin work from a session rooted in that folder, not this one.** Only the
session directory's `CLAUDE.md` loads automatically, so admin work started here
runs under the wrong rulebook — this file says nothing about `proxy.js`, cookie
handling or the bcrypt-hash env trap, and those omissions cost real time.

That repo copies `src/lib/mongodb.js` and `src/lib/models/` from here. **If you
change a schema in this repo, the admin's copy must change too** — both apps
write the same collections, and a field missing from one side is silent data
loss. The admin has `npm run check:models` to catch it; there is nothing on this
side that will.

---

## 🎨 Design system — locked, exact values

```css
--color-bg-start: #FFFBF2;   --color-bg-mid: #F0FDFA;   --color-bg-end: #CCFBF1;
--color-teal: #0D9488;       --color-teal-light: #14B8A6;  --color-gold: #F59E0B;
--color-text-primary: #0F1C2E;   --color-text-secondary: #5C7A78;
--color-glass-bg: rgba(255,255,255,0.42);
--color-glass-border: rgba(255,255,255,0.75);
--color-teal-border: rgba(13,148,136,0.22);
--shadow-card: 0 8px 32px rgba(13,148,136,0.08);
```

- **Background:** `linear-gradient(135deg,#FFFBF2 0%,#F0FDFA 50%,#CCFBF1 100%)`,
  applied once on the root layout — sections are transparent so there are no seams.
- **Glass card:** `rgba(255,255,255,0.42)` · `backdrop-filter: blur(24px)` ·
  `1px solid rgba(255,255,255,0.75)` · `border-radius: 16px`.
- **Font:** Inter via `next/font/google`.
- **Theme:** light warm glassmorphism on ivory. Premium and masculine — a luxury
  brand site, not a typical dev portfolio. **Not dark.**

**Accessibility flag (owner-deferred):** this palette is below WCAG AA for small
text. The owner decided on 2026-06-22 to leave it until the theme is finalized
post-deployment. Do not "fix" it unprompted.

---

## 🧊 3D strategy

| Section | What |
|---|---|
| Hero | **One** R3F canvas — `ParticleConstellation`: 80 drifting nodes, lines between near neighbours, cursor repel, slow Y parallax |
| Skills / Projects / Hire Me | CSS transforms on hover only — no 3D |
| About / Education / Experience | GSAP scroll reveal only |
| Contact, and anything text-heavy | Zero 3D |

**3D enhances — it never competes with content.** Lazy-load or simplify on
mobile: dynamic import with `ssr: false` for every R3F canvas.

---

## 💼 Hire Me positioning — never get this wrong

**Headline:** *"Let's Build Something Intelligent"*

| ❌ Never say | ✅ Always say |
|---|---|
| "I build websites for small businesses" | "I build AI-powered web applications and smart management systems" |
| Web developer for hire | AI engineer who ships full-stack products |
| "I can make you a website" | "I can make your business intelligent" |

Star proof: **JobCraft AI** — live, deployed. **AI is the star; web dev is the vehicle.**

---

## 🏆 Projects — locked display order

Ranked by `rank` in MongoDB, ascending:

1. ⭐ **JobCraft AI** (9.4) · 2. Emotion Detection FYP (9.1) · 3. Smart Grid
Energy Monitoring (8.7) · 4. Visual Cryptography Engine (7.8) · 5. Face
Recognition App (7.3) · 6. Income Predictor (6.2) · 7. Fullstack E-Commerce (5.9)

**Bike Buying Analysis — never include.**

Content lives in the database — including the hero, about, hire-me and contact
copy, which moved into a `SiteContent` singleton in P3.0. `src/lib/seed.js` is
the code copy used to populate it; edit both together until the admin panel
exists.

---

## 🔐 Admin panel rules — MANDATORY

- Built as a **completely separate Next.js app in a separate private repo**,
  deployed to its own Vercel project and subdomain.
- **Never mention, link or reference the admin URL in any public-facing code,
  comment, string, README, `robots.txt` or sitemap.** Listing it to "exclude" it
  publishes it.
- **Never import admin code into the portfolio app.** No auth libraries, no JWT
  handling, no login routes in this repo.
- Phase 3 *does* add public-safe things here (a revalidation hook, DB-backed
  content) — see P3.0. Nothing admin-specific.
- Auth: `jose` JWT in an httpOnly + Secure + SameSite=Lax cookie, bcrypt hash in
  an env var, rate-limited login.

---

## 📏 Coding rules

1. **Complete files only** — never partial snippets.
2. **Mobile first** — responsive classes on every element.
3. **Comment the important logic**, in plain language. Explain *why*, not *what*.
4. **Readable over clever.**
5. **No hardcoded secrets.** Env vars only, and never paste one into chat.
6. **No ambient sound.** Ever.
7. **Validate on the server** — never trust the client, even a trusted admin.
8. **Commit at every working state**, don't batch.

---

## 🌿 Git — mandatory

```
main     ← production. Auto-deploys to Vercel.
dev      ← integration.
feat/x   ← one feature per branch, always from dev.
```

1. **Never commit directly to `main` or `dev`.** Branch, then merge with `--no-ff`.
2. On Windows use **`git commit -F <file>`** — PowerShell mangles multi-line `-m`.
3. `npm run build` **and** `npm run lint` must pass before any commit.
4. **Verify the `dev` preview before every merge to `main`.** Hit `/api/projects`
   on the preview URL and expect 7 projects. An unverified merge once took
   production down — see [docs/RUNBOOK.md](docs/RUNBOOK.md) §2.
5. Rollback is `git revert -m 1 <merge-sha>`.

**Commit prefixes:** `feat:` · `fix:` · `style:` · `chore:` · `docs:`

---

## 📁 Where things live

```
src/app/          layout.js · page.js (ISR) · globals.css · api/{contact,projects,skills,education,experience,social,revalidate}
src/components/   shared/ (GlassCard, Navbar, Footer, SectionWrapper, TealButton)
                  Hero/ About/ Skills/ Projects/ Education/ Experience/ HireMe/ Contact/
src/lib/          mongodb.js (connection + pinned dbName) · data.js (shared read layer) · seed.js · models/

Sections that need the browser are split: a server component fetches (e.g.
`HeroSection`, `HireMeSection`, `ContactSection`) and a client child renders
(`HeroShell`, `HireMeContent`, `ContactInfo`). Icon *names* cross that boundary,
never icon components.
src/hooks/        useReducedMotion.js · useStaggerReveal.js
```

**Server components call `src/lib/data.js` directly — never `fetch("/api/…")`.**
That would add a round-trip and can deadlock during static generation.

---

*ahmadsheraz.com · last revised 2026-08-20 · decisions locked ✓*
