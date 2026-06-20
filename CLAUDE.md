# CLAUDE.md — ahmadsheraz.com Portfolio
# READ THIS ENTIRE FILE BEFORE DOING ANYTHING ELSE. EVERY SESSION. NO EXCEPTIONS.

---

## 👤 Identity & Goal

- **Owner:** Ahmad Sheraz — goes by Shezi
- **Project:** Personal portfolio website — full-stack web application
- **Domain:** ahmadsheraz.com (DNS on Cloudflare)
- **Email:** sheraz@ahmadsheraz.com
- **GitHub:** github.com/AhmadShazy
- **Dev Environment:** Windows · 16GB RAM · Node.js installed · Antigravity IDE
- **Career Direction:** AI/ML Engineering · Data Engineering · Backend Engineering
- **Goal:** A statement piece that says *"I am a serious engineer — not a bootcamp grad."*
- **Positioning:** AI engineer who ships full-stack products. NOT a web developer.

---

## ⚠️ CRITICAL TECHNICAL FACTS — READ BEFORE TOUCHING ANY FILE

1. **Tailwind v4 is installed** — `create-next-app` latest uses Tailwind v4 by default.
   - There is **NO** `tailwind.config.js` file in this project.
   - All custom colors, tokens, and utilities go inside the `@theme` block in `src/app/globals.css`.
   - Never create a `tailwind.config.js`. Never import from it. It does not exist.

2. **`create-next-app` cannot scaffold into a non-empty folder.**
   - If the project folder already has files (planning docs), scaffold into a sibling temp folder first, then move files across, then delete temp.
   - Exact approach: `npx create-next-app@latest ../portfolio-temp ...` → copy scaffold → delete temp.

3. **App Router only** — never use Pages Router. All routes live in `src/app/`.

4. **JavaScript only** — no TypeScript. Keep it clean and readable.

5. **`src/` directory is used** — all source code lives under `src/`.

---

## 🛠️ Tech Stack — LOCKED. NEVER CHANGE WITHOUT EXPLICIT INSTRUCTION.

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ — App Router |
| Language | JavaScript (no TypeScript) |
| Styling | Tailwind CSS v4 + custom glass CSS in globals.css |
| 3D Engine | Three.js + React Three Fiber (`@react-three/fiber`) |
| 3D Helpers | `@react-three/drei` |
| Animations | GSAP + ScrollTrigger |
| Typewriter | Typed.js |
| Icons | Lucide React |
| Database | MongoDB Atlas (free tier) via Mongoose |
| API Layer | Next.js built-in App Router API routes (`src/app/api/`) |
| Email | Resend (preferred over EmailJS) |
| Admin Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Hosting | Vercel (portfolio) + Vercel (admin — separate app) |
| DNS | Cloudflare → Vercel |
| Analytics | Vercel Analytics |

### All npm packages (install once in Phase 0 — never reinstall mid-phase)
```bash
npm install three @react-three/fiber @react-three/drei gsap typed.js lucide-react resend mongoose jsonwebtoken bcryptjs
npm install @vercel/analytics
```

---

## 🎨 Design System — LOCKED. EXACT VALUES. DO NOT DEVIATE.

### Colors (go in `@theme` block inside `globals.css`)
```css
--color-bg-start: #FFFBF2;
--color-bg-mid: #F0FDFA;
--color-bg-end: #CCFBF1;
--color-teal: #0D9488;
--color-teal-light: #14B8A6;
--color-gold: #F59E0B;
--color-text-primary: #0F1C2E;
--color-text-secondary: #5C7A78;
--color-glass-bg: rgba(255, 255, 255, 0.42);
--color-glass-border: rgba(255, 255, 255, 0.75);
--color-teal-border: rgba(13, 148, 136, 0.22);
--shadow-card: 0 8px 32px rgba(13, 148, 136, 0.08);
```

### Background Gradient (applied to root layout)
```css
background: linear-gradient(135deg, #FFFBF2 0%, #F0FDFA 50%, #CCFBF1 100%);
min-height: 100vh;
```

### Glass Card Pattern (reused everywhere via `.glass-card` utility)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 8px 32px rgba(13, 148, 136, 0.08);
  border-radius: 16px;
}
```

### Typography
- **Font:** Inter (loaded via `next/font/google` in `layout.js`)
- **Headings:** bold, `#0F1C2E`
- **Body:** regular, `#5C7A78`
- **Accent text:** `#0D9488` (teal) or `#F59E0B` (gold)

### Theme
- **Light warm** — NOT dark. Light glassmorphism on warm ivory background.
- **Premium, masculine** — comparable to luxury brand websites, not typical dev portfolios.

---

## 🧊 3D Strategy — STRICT RULES

| Section | Level | What |
|---|---|---|
| Hero | 🔥 FULL 3D | Rotating globe + mouse-reactive particles + interactive 3D geometric object |
| Navbar | 🪟 FROSTED GLASS | Sticky, blur backdrop, no 3D |
| Skills | ⚡ MODERATE | 3D tilt effect on glass cards (hover only, CSS transform) |
| Projects | ⚡ MODERATE | 3D glass card depth / flip effect on hover |
| Hire Me | ⚡ MODERATE | Glassmorphism glow, animated CTA |
| About | 🌊 SUBTLE | GSAP scroll reveal fade-in only |
| Education | 🌊 SUBTLE | Timeline fade-in on scroll |
| Experience | 🌊 SUBTLE | Scroll reveal only |
| Contact | 🪟 GLASS ONLY | Frosted glass form card — zero 3D |
| Plain text | ❌ ZERO | Never add 3D to text-heavy areas |

**Core rule: 3D enhances — it never competes with content.**
**Mobile rule: 3D canvas must be lazy-loaded or simplified on small screens for performance.**

---

## 📄 Portfolio Sections (Final Order)

| # | Section | Status |
|---|---|---|
| 1 | Hero | Active |
| 2 | About | Active |
| 3 | Skills | Active |
| 4 | Projects | Active |
| 5 | Education Timeline | Active |
| 6 | Experience | Active |
| 7 | Hire Me | Active |
| 8 | Contact | Active |
| — | Blog | Deferred — add when regularly writing |
| — | GitHub Stats | Deferred — add when contribution graph is strong |
| — | Certifications | Deferred — add when CS certs are earned (AWS, GCP etc.) |

---

## 💼 Hire Me — Positioning (CRITICAL — Never Get This Wrong)

**Headline:** `"Let's Build Something Intelligent"`

| ❌ Never Say | ✅ Always Say |
|---|---|
| "I build websites for small businesses" | "I build AI-powered web applications and smart management systems" |
| Web developer for hire | AI engineer who ships full-stack products |
| I can make you a website | I can make your business intelligent |

- **Services:** AI-powered websites · Smart management systems for SMBs
- **Target client:** Small businesses wanting to automate and digitize
- **Star proof:** JobCraft AI — live deployed product
- **AI is the STAR. Web dev is the vehicle.**

---

## 🏆 Projects — Final Rankings (LOCKED — Display in This Exact Order)

| Rank | Project | Rating | Stack |
|---|---|---|---|
| 1 ⭐ | JobCraft AI | 9.4/10 | React 19 + FastAPI + MongoDB + Gemini 5-model fallback + JWT + Docker |
| 2 | Emotion Detection System (FYP) | 9.1/10 | Python + Whisper + SpeechBrain Wav2Vec2 + OpenFace |
| 3 | Smart Grid Energy Monitoring | 8.7/10 | MQTT + Kafka + PySpark + InfluxDB + Grafana |
| 4 | Visual Cryptography Engine | 7.8/10 | Python + XOR OTP + custom image encryption |
| 5 | Face Recognition App | 7.3/10 | Python + OpenCV + Haar Cascade + LBPH + custom dataset |
| 6 | Income Predictor | 6.2/10 | Python + scikit-learn + PCA (show only if needed for padding) |
| 7 | Fullstack E-Commerce Node.js | 5.9/10 | Node.js + EJS + Tailwind (show only if needed for padding) |
| 8 | Bike Buying Analysis | ❌ SKIP | Do NOT include — ever |

---

## 🔐 Admin Panel — Rules (MANDATORY)

- **URL:** `admin.ahmadsheraz.com`
- **NEVER mention, link, or reference this URL in any public-facing code, component, or content.**
- **NEVER import admin code into the portfolio app.**
- Built as a **completely separate Next.js app** (Phase 3).
- Deployed separately on Vercel under a subdomain.
- Auth: JWT + bcrypt + password stored in environment variable.
- Database: Same MongoDB Atlas cluster as portfolio.
- What admin controls: Hero · Skills · Projects · Experience · Education · Hire Me · Contact Inbox · Social Links.

---

## 🌿 Git & Version Control — MANDATORY. INDUSTRY STANDARD. ALWAYS FOLLOW.

### Branch Structure
```
main     ← production only. Stable, tested, deployed code.
dev      ← integration. All tested features merge here first.
feat/x   ← one feature = one branch. Always created from dev.
```

### Rules
1. **Never commit directly to `main` or `dev`.**
2. Always create `feat/` branch from `dev` before starting any work.
3. Feature complete + tested → merge `feat/` into `dev`, delete `feat/` branch.
4. `dev` stable → merge into `main`, push, tag release if significant.
5. Commit early, commit often — every meaningful working state gets a commit.

### Exact Workflow Per Sub-Phase
```bash
# Start of every sub-phase
git checkout dev
git pull origin dev
git checkout -b feat/[branch-name]

# During work
git add .
git commit -m "feat: [description]"

# Sub-phase complete
git checkout dev
git merge feat/[branch-name]
git branch -d feat/[branch-name]
git push origin dev

# When dev is stable (end of full phase)
git checkout main
git merge dev
git push origin main
```

### Commit Message Format
```
feat: add rotating 3D globe to hero section
feat: add glassmorphism navbar with smooth scroll
fix: fix particle z-index on mobile safari
style: adjust teal card shadow opacity
chore: install gsap and typed.js dependencies
```

### Branch Names by Sub-Phase
```
feat/project-foundation      ← Phase 0
feat/shared-components       ← P1.1
feat/hero-layout             ← P1.2
feat/hero-3d                 ← P1.3
feat/about                   ← P1.4
feat/skills                  ← P1.5
feat/projects                ← P1.6
feat/education-experience    ← P1.7
feat/hire-me                 ← P1.8
feat/contact                 ← P1.9
feat/polish-assembly         ← P1.10
feat/deployment              ← P1.11
feat/mongodb-models          ← P2.1
feat/api-routes              ← P2.2
feat/db-seed                 ← P2.3
feat/frontend-api            ← P2.4
feat/email-contact           ← P2.5
feat/admin-setup-auth        ← P3.1
feat/admin-projects          ← P3.2
feat/admin-content           ← P3.3
feat/admin-inbox-social      ← P3.4
feat/admin-deploy            ← P3.5
```

---

## 📁 Project Folder Structure

```
ahmadsheraz-portfolio/
├── CLAUDE.md                    ← YOU ARE HERE — read every session
├── EXECUTION_PLAN.md            ← Phased build roadmap — check current step
├── CONTEXT.md                   ← All real portfolio content data
├── .env.local                   ← Secrets — NEVER commit
├── .gitignore
├── package.json
├── next.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.js            ← Root layout (Inter font, background gradient)
│   │   ├── page.js              ← Home page (assembles all sections)
│   │   ├── globals.css          ← Design system tokens + glass utilities
│   │   └── api/                 ← API routes (Phase 2 only)
│   │       ├── projects/route.js
│   │       ├── skills/route.js
│   │       ├── experience/route.js
│   │       ├── education/route.js
│   │       ├── contact/route.js
│   │       └── social/route.js
│   ├── components/
│   │   ├── shared/
│   │   │   ├── GlassCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SectionWrapper.jsx   ← GSAP scroll reveal wrapper
│   │   │   └── TealButton.jsx
│   │   ├── Hero/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── HeroContent.jsx      ← Text, typewriter, CTAs
│   │   │   ├── Globe3D.jsx          ← R3F rotating globe
│   │   │   ├── Particles3D.jsx      ← Mouse-reactive particles
│   │   │   └── GeometricObject.jsx  ← Interactive 3D shape
│   │   ├── About/
│   │   │   └── AboutSection.jsx
│   │   ├── Skills/
│   │   │   ├── SkillsSection.jsx
│   │   │   └── SkillCard.jsx
│   │   ├── Projects/
│   │   │   ├── ProjectsSection.jsx
│   │   │   └── ProjectCard.jsx
│   │   ├── Education/
│   │   │   ├── EducationSection.jsx
│   │   │   └── EducationCard.jsx
│   │   ├── Experience/
│   │   │   ├── ExperienceSection.jsx
│   │   │   └── ExperienceCard.jsx
│   │   ├── HireMe/
│   │   │   └── HireMeSection.jsx
│   │   └── Contact/
│   │       ├── ContactSection.jsx
│   │       └── ContactForm.jsx
│   ├── lib/
│   │   ├── mongodb.js               ← MongoDB connection (Phase 2)
│   │   ├── models/                  ← Mongoose models (Phase 2)
│   │   │   ├── Project.js
│   │   │   ├── Skill.js
│   │   │   ├── Experience.js
│   │   │   ├── Education.js
│   │   │   ├── Message.js
│   │   │   └── SocialLink.js
│   │   └── seed.js                  ← DB seed script (Phase 2)
│   ├── hooks/
│   │   ├── useScrollReveal.js       ← GSAP scroll hook
│   │   └── useMousePosition.js      ← Mouse tracking for 3D particles
│   └── styles/
│       └── glass.css                ← Additional glass effect overrides
└── public/
    └── (static assets, images)
```

---

## ⚙️ Environment Variables

```env
# .env.local — NEVER COMMIT THIS FILE
MONGODB_URI=your_mongodb_atlas_connection_string
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_long_random_jwt_secret
ADMIN_PASSWORD_HASH=bcrypt_hash_of_your_admin_password
NEXT_PUBLIC_SITE_URL=https://ahmadsheraz.com
```

---

## 📏 Coding Rules — ALWAYS FOLLOW

1. **Complete files only** — never write partial snippets. Always write the entire file.
2. **Mobile first** — Tailwind responsive classes on every element. Mobile is not an afterthought.
3. **Comments on all important logic** — clean, beginner-friendly comments.
4. **Readable over clever** — no fancy one-liners. Write for clarity.
5. **No hardcoded secrets** — always use environment variables.
6. **Admin URL never in public code** — not in comments, not in strings, nowhere.
7. **No ambient sound** — ever. Not even as an option.
8. **Phase 1 rule** — ZERO backend calls. All data hardcoded from CONTEXT.md. Get visuals perfect first.
9. **Lazy load 3D on mobile** — use dynamic import + `ssr: false` for all R3F canvases.
10. **Commit after every working state** — don't batch up too much before committing.

---

## 🚀 How to Start Every Claude Code Session

**Step 1 — Paste this at the start of every session:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md carefully.
Current phase: [PHASE NUMBER]
Current sub-phase: [SUB-PHASE e.g. P1.3]
Task: [EXACT TASK DESCRIPTION]
Last session completed: [WHAT WAS DONE]
```

**Step 2 — Claude Code checks the current branch before doing anything:**
```bash
git branch          # confirms you are on correct feat/ branch
git status          # confirms clean working tree
```

**Step 3 — Claude Code builds the sub-phase deliverables.**

**Step 4 — After completing sub-phase, Claude Code:**
1. Runs `npm run build` to verify zero errors
2. Commits to `feat/` branch
3. Merges to `dev`
4. Confirms done

---

*ahmadsheraz.com — CLAUDE.md · Last updated June 2026 · Decisions locked ✓*
