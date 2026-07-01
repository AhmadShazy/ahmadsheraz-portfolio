# 👤 ahmadsheraz.com — Personal Portfolio & AI/ML Platform

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

A premium, state-of-the-art personal portfolio website and administration platform built for **Ahmad Sheraz (Shezi)**. This project is engineered as a statement piece to position Ahmad as a serious **AI/ML Engineer, Data Engineer, and Backend Engineer**. 

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
  * **Interactive Depth**: Smooth 3D tilt effects and hover transitions across cards (Skills, Projects, Education).
  * **Reduced Motion Support**: Fully respects OS-level `prefers-reduced-motion` settings by bypassing animations and offering optimized static layout fallbacks.

---

## 🛠️ Technical Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | Next.js 15+ (App Router) | High-performance React framework for server/client component optimization. |
| **Language** | JavaScript (ES6+) | Keep codebase clean, readable, and focused. |
| **Styling** | Tailwind CSS v4 | Uses the new v4 CSS-first configuration (all tokens live inside `src/app/globals.css`). |
| **3D Rendering** | React Three Fiber & `@react-three/drei` | Drives interactive 3D particle constellations and web canvases. |
| **Animations** | GSAP & ScrollTrigger | Synchronizes elegant entrance and exit animations with page scrolling. |
| **Interactivity** | Typed.js & Lucide React | Implements typewriter role loops and custom outline vectors. |
| **Database** | MongoDB Atlas & Mongoose | Persists dynamic contents (Projects, Skills, Socials, and Messages). |
| **APIs** | Built-in Next.js Route Handlers | Decoupled serverless backend endpoints (`/api/*`). |
| **Email Delivery** | Resend | Powers reliable, fast email delivery for the contact form. |
| **Authentication** | JWT (`jsonwebtoken`) & `bcryptjs` | Secures the administrative dashboard access. |

---

## 📁 Project Architecture

```text
ahmadsheraz-portfolio/
├── CLAUDE.md                # Development instructions, context, rules & scripts
├── CONTEXT.md               # Hardcoded portfolio data & copy (Single Source of Truth)
├── EXECUTION_PLAN.md        # Comprehensive multi-phase implementation roadmap
├── DEPLOYMENT.md            # Hosting checklist (Vercel + Cloudflare DNS)
├── package.json
├── src/
│   ├── app/
│   │   ├── layout.js        # Global layout, Inter font, analytics, theme
│   │   ├── page.js          # Assembly point for all frontend sections
│   │   ├── globals.css      # CSS styling tokens & custom glass classes
│   │   └── api/             # Phase 2: Dynamic API endpoints
│   ├── components/
│   │   ├── shared/          # Reusable Navbar, Footer, GlassCard, SectionWrapper
│   │   ├── Hero/            # Hero section, content, particle animation Canvas
│   │   ├── About/           # Bio description & quick stats
│   │   ├── Skills/          # Category-grouped interactive skill chips
│   │   ├── Projects/        # Featured list of AI, ML, & Data Eng projects
│   │   ├── Education/       # Academic timeline & coursework
│   │   ├── Experience/      # Industry/Project role highlights
│   │   ├── HireMe/          # Service offerings and Call-To-Action (CTA)
│   │   └── Contact/         # Interactive frosted glass message submission form
│   ├── lib/
│   │   └── mongodb.js       # Database client connection configuration
│   ├── hooks/
│   │   └── useScrollReveal.js # Reusable GSAP ScrollTrigger hook
│   └── styles/
│       └── glass.css        # Visual adjustments & glass overlays
```

---

## 🚀 Development Roadmap

This project is built following the structured plan outlined in `EXECUTION_PLAN.md`:

* **Phase 0 — Foundation** (DONE): Setup Next.js, initialize Git branches, and integrate tailwind theme variables.
* **Phase 1 — Frontend & Visuals** (DONE): Interactive client-side development featuring full responsive layout, GSAP entry transitions, Typed.js cycling text, and the Three.js particle constellation. 
* **Phase 2 — Backend & Databases** (NEXT): Integrate MongoDB database schema, implement serverless Route Handlers for dynamic content delivery, and connect Resend email integration.
* **Phase 3 — Admin Subsystem** (FUTURE): Build a completely isolated admin console deployed separately at `admin.ahmadsheraz.com` to control site details dynamically.

---

## 💻 Getting Started

### Prerequisites

* Node.js (v18.x or v20.x recommended)
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
   Create a `.env.local` file in the root directory and append the following configurations (add actual credentials during Phase 2):
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   RESEND_API_KEY=your_resend_api_key
   JWT_SECRET=your_long_random_jwt_secret
   ADMIN_PASSWORD_HASH=bcrypt_hash_of_your_admin_password
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
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

## 🌿 Git & Version Control Policy

This repository adheres to a strict industry-standard branching and merge policy, structured as follows:

### Branch Structure
* `main`: Stable, fully tested, deploy-ready production branch.
* `dev`: Integration branch where feature branches are merged.
* `feat/<feature-name>`: Dedicated feature development branches spawned from `dev`.

### Code Workflow
1. Switch to dev and pull updates: `git checkout dev && git pull origin dev`
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit progress incrementally using conventional commits.
4. Merge back to dev upon completion:
   ```bash
   git checkout dev
   git merge feat/your-feature-name
   git branch -d feat/your-feature-name
   git push origin dev
   ```

### Commit Formatting Guidelines
Use specific prefixes for all commits to maintain an easily readable history:
* `feat: ...` for new features (e.g., `feat: add constellation canvas`)
* `fix: ...` for bug fixes (e.g., `fix: mobile navbar tap target`)
* `style: ...` for layout or style alterations
* `chore: ...` for configurations or dependency changes

---

## 🌐 Deployment

The application is deploy-ready and optimized for the **Vercel Platform**:
* Auto-deploys on every commit pushed to the `main` branch.
* Web analytics are enabled via `@vercel/analytics` inside `src/app/layout.js`.
* DNS is managed via Cloudflare pointing directly to Vercel apex servers. See [DEPLOYMENT.md](file:///c:/Users/ahmad/Desktop/PortFolio/ahmadsheraz-portfolio/DEPLOYMENT.md) for more details.
