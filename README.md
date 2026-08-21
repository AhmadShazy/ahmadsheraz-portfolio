# 👤 ahmadsheraz.com — Personal Portfolio & AI/ML Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

A personal portfolio for **Ahmad Sheraz (Shezi)**, engineered as a statement piece positioning him as a serious **AI/ML Engineer, Data Engineer, and Backend Engineer**.

**Every word on this site comes from MongoDB** — projects, skills, experience, education, the hero/about/hire-me/contact copy, social links and the profile photo. Nothing is hardcoded, so it is all editable from a private CMS that lives in a separate repository and deployment. This repo contains no admin code, and never references it.

It transitions away from typical developer web aesthetics, implementing a light-warm luxury brand design language with heavy glassmorphism, responsive 3D elements, scroll-synchronized animations, and a decoupled admin subsystem.

---

## 🎨 Design System & Visuals

* **Theme**: Light warm luxury (ivory-teal-gold), resembling high-end products rather than generic dark portfolios.
* **Palette**:
  * Primary Background: Warm Ivory (`#FFFBF2` to `#CCFBF1` gradient)
  * Primary Text: Deep Navy Slate (`#0F1C2E`)
  * Secondary Text: Muted Pine Teal (`#5C7A78`)
  * Accent Colors: Emerald Teal (`#0D9488`) and Amber Gold (`#F59E0B`)
* **Frosted Glass (.glass-card)**: Reusable components leveraging backdrop filters (`blur(24px)`) and subtle borders to look premium on all screens.
* **3D Strategy**:
  * **Hero Section**: Custom Client-side React Three Fiber mouse-reactive particle constellation background.
  * **Interactive Depth**: A single shared hover treatment across every glass card — faint teal border at rest, solid teal with a subtle lift on hover.
  * **Reduced Motion Support**: Fully respects OS-level `prefers-reduced-motion` settings by bypassing animations and offering optimized static layout fallbacks.

---

## 🛠️ Technical Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | High-performance React framework for server/client component optimization. |
| **Language** | JavaScript (ES6+) | Keep codebase clean, readable, and focused. |
| **Styling** | Tailwind CSS v4 | Uses the new v4 CSS-first configuration (all tokens live inside `src/app/globals.css`). |
| **3D Rendering** | React Three Fiber & `@react-three/drei` | Drives interactive 3D particle constellations and web canvases. |
| **Animations** | GSAP & ScrollTrigger | Synchronizes elegant entrance and exit animations with page scrolling. |
| **Interactivity** | Typed.js & Lucide React | Implements typewriter role loops and custom outline vectors. |
| **Database** | MongoDB Atlas & Mongoose | Persists dynamic contents (Projects, Skills, Socials, and Messages). |
| **APIs** | Built-in Next.js Route Handlers | Decoupled serverless backend endpoints (`/api/*`). |
| **Email Delivery** | Resend | Powers reliable, fast email delivery for the contact form. |
| **Authentication** | `jose` JWT & `bcryptjs` | Secures the administrative dashboard — lives in a separate private repository. |

---

## 📁 Project Architecture

```text
src/app/          Root layout, the single ISR-cached page, global styles, and the
                  /api route handlers: contact, projects, skills, education,
                  experience, social, profile-photo (serves the uploaded image)
                  and revalidate (the CMS's cache-purge hook).
src/components/   One folder per section (Hero, About, Skills, Projects,
                  Education, Experience, HireMe, Contact) plus shared/ for the
                  glass card, navbar, footer, scroll wrapper and button.
src/lib/          mongodb.js (cached connection, pinned database name),
                  data.js (the shared read layer every server component calls),
                  seed.js, and eight Mongoose models — Project, Skill,
                  Experience, Education, SocialLink, Message, SiteContent and
                  ProfilePhoto.
src/hooks/        useReducedMotion, useStaggerReveal.
```

Server components call `src/lib/data.js` directly rather than fetching the app's
own API routes — one fewer round-trip, and it cannot deadlock during static
generation. The API routes exist for external consumers.

Planning and operational docs: [CLAUDE.md](./CLAUDE.md) (conventions),
[EXECUTION_PLAN.md](./EXECUTION_PLAN.md) (roadmap),
[docs/RUNBOOK.md](./docs/RUNBOOK.md) (deploy and operations).

---

## 🚀 Development Roadmap

This project is built following the structured plan outlined in `EXECUTION_PLAN.md`:

* **Phase 0 — Foundation** (DONE): Setup Next.js, initialize Git branches, and integrate tailwind theme variables.
* **Phase 1 — Frontend & Visuals** (DONE): Interactive client-side development featuring full responsive layout, GSAP entry transitions, Typed.js cycling text, and the Three.js particle constellation. 
* **Phase 2 — Backend & Databases** (DONE): MongoDB schema and connection layer, serverless Route Handlers for dynamic content delivery via ISR, and Resend email integration for the contact form.
* **Phase 3 — Admin Subsystem** (DONE): A completely isolated CMS in its own
  private repository, deployed separately, editing every content type on this
  site. Two-step sign-in (password + TOTP), trusted devices, and an on-demand
  revalidation hook so an edit is live in under a minute rather than waiting
  out the one-hour ISR window.

---

## 💻 Getting Started

### Prerequisites

* Node.js **v20.9 or newer** (enforced via `engines` in `package.json` — the seed
  script uses `node --env-file`, which older releases don't support)
* Git installed

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AhmadShazy/ahmadsheraz-portfolio.git
   cd ahmadsheraz-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the Environment Variables:
   Copy `.env.example` to `.env.local` and fill in the values — that file is the
   single source of truth for what the code actually reads, and documents which
   variables are required versus optional:
   ```bash
   cp .env.example .env.local
   ```
   `MONGODB_URI` is the only one the page cannot render without. `RESEND_*`
   powers the contact form, and `REVALIDATE_SECRET` must match the CMS's copy
   exactly or content edits wait out the full ISR hour instead of appearing in
   under a minute.

   (`JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and `ADMIN_TOTP_SECRET`
   belong to the separate admin app, not to this repo.)

4. Seed the database with the content defined in `src/lib/seed.js`:
   ```bash
   npm run seed
   ```

### Running Locally

* **Start the development server**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

* **Lint and check for errors**:
  ```bash
  npm run lint
  ```

* **Verify production build**:
  ```bash
  npm run build
  ```

---

## 🖼️ A note on `next.config.mjs`

`images.localPatterns` is not optional decoration. The profile photo is served
from `/api/profile-photo?v=<upload time>`, and Next 16 **throws during render**
for a local image whose `src` carries a query string unless its path is listed
there. Defining the option at all also flips local images from allow-everything
to allow-listed, so the `{ pathname: "/**", search: "" }` entry is what keeps the
bundled `public/profile-v2.jpg` fallback working. Both entries are load bearing.

---

## 🌐 Deployment

The application is deploy-ready and optimized for the **Vercel Platform**:
* Auto-deploys on every commit pushed to the `main` branch.
* Web analytics are enabled via `@vercel/analytics` inside `src/app/layout.js`.
* DNS is managed via Cloudflare, pointing at Vercel. Canonical URL is `https://www.ahmadsheraz.com` (the apex 308-redirects to it). See [docs/RUNBOOK.md](./docs/RUNBOOK.md).
