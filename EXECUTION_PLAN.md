# EXECUTION_PLAN.md — ahmadsheraz.com Build Roadmap
# Every sub-phase = exactly ONE Claude Code session. No more, no less.

---

## 📊 Master Progress Tracker

| Sub-Phase | Name | Branch | Status |
|---|---|---|---|
| **P0.1** | Project Foundation & Git Setup | feat/project-foundation | 🟢 DONE |
| **P1.1** | Shared Components | feat/shared-components | 🟢 DONE |
| **P1.2** | Hero — Layout & Typewriter | feat/hero-layout | 🟢 DONE |
| **P1.3** | Hero — 3D (Globe, Particles, Geometric) | feat/hero-3d | 🟢 DONE |
| **P1.4** | About Section | feat/about | 🟢 DONE |
| **P1.5** | Skills Section | feat/skills | 🟢 DONE |
| **P1.6** | Projects Section | feat/projects | 🟢 DONE |
| **P1.7** | Education + Experience | feat/education-experience | 🟢 DONE |
| **P1.8** | Hire Me Section | feat/hire-me | 🟢 DONE |
| **P1.9** | Contact Section | feat/contact | 🟢 DONE |
| **P1.10** | Full Assembly + Polish + Responsive | feat/polish-assembly | 🟢 DONE |
| **P1.11** | Deployment (Vercel + Cloudflare DNS) | feat/deployment | 🔴 TODO |
| **P2.1** | MongoDB Setup + Mongoose Models | feat/mongodb-models | 🔴 TODO |
| **P2.2** | API Routes (GET endpoints) | feat/api-routes | 🔴 TODO |
| **P2.3** | Database Seed | feat/db-seed | 🔴 TODO |
| **P2.4** | Wire Frontend to API | feat/frontend-api | 🔴 TODO |
| **P2.5** | Contact Form + Resend Email | feat/email-contact | 🔴 TODO |
| **P3.1** | Admin App Setup + JWT Auth | feat/admin-setup-auth | 🔴 TODO |
| **P3.2** | Admin Projects CRUD | feat/admin-projects | 🔴 TODO |
| **P3.3** | Admin Skills + Experience + Education CRUD | feat/admin-content | 🔴 TODO |
| **P3.4** | Admin Contact Inbox + Social Links + Hero | feat/admin-inbox-social | 🔴 TODO |
| **P3.5** | Admin Deploy to admin.ahmadsheraz.com | feat/admin-deploy | 🔴 TODO |

**Update status to 🟡 IN PROGRESS or 🟢 DONE after each session.**

---

---

# PHASE 0 — Foundation
## Goal: Clean project setup, Git configured, all dependencies installed, design system wired. Zero components yet.

---

### P0.1 — Project Foundation & Git Setup
**Branch:** `feat/project-foundation` (created from `main`)
**Session Goal:** Scaffold Next.js, install all deps, configure design system, set up Git with 3-branch structure, push to GitHub. Nothing else.

**Pre-session (you do manually before starting Claude Code):**
- Create empty folder: `ahmadsheraz-portfolio/`
- Place `CLAUDE.md`, `EXECUTION_PLAN.md`, `CONTEXT.md` inside it
- Create GitHub repo: `ahmadsheraz-portfolio` (public)
- Open Antigravity IDE in this folder
- Launch Claude Code: `claude`

**Session Prompt (copy-paste exactly):**
```
Read CLAUDE.md and EXECUTION_PLAN.md carefully before doing anything.

Task: P0.1 — Project Foundation & Git Setup

The folder already has planning docs (CLAUDE.md, EXECUTION_PLAN.md, CONTEXT.md).
Do NOT delete these. Follow these steps in order:

1. Initialize Git and connect remote:
   git init
   git remote add origin https://github.com/AhmadShazy/ahmadsheraz-portfolio.git

2. Scaffold Next.js into a sibling temp folder (not current folder — it has files):
   npx create-next-app@latest ../portfolio-temp --js --tailwind --app --src-dir --import-alias "@/*" --yes

3. Copy all scaffold files (excluding .git) from portfolio-temp into current folder.
   Keep all existing planning docs. Delete portfolio-temp after.

4. Install all project dependencies:
   npm install three @react-three/fiber @react-three/drei gsap typed.js lucide-react resend mongoose jsonwebtoken bcryptjs
   npm install @vercel/analytics

5. Create the full folder structure from CLAUDE.md (all component folders, lib, hooks, styles — empty for now).

6. Configure design system in src/app/globals.css — add all CSS variables from CLAUDE.md under @theme block. Add .glass-card utility class. Add body background gradient.

7. Update src/app/layout.js — load Inter font via next/font/google. Apply font to body. Apply background gradient class.

8. Clean src/app/page.js — return a simple centered placeholder: "ahmadsheraz.com — coming soon" in teal color. Nothing more.

9. Create .gitignore (node_modules, .env.local, .next, .vercel).

10. Create .env.local with placeholder keys (values empty — just the key names from CLAUDE.md).

11. Run: npm run build — must pass with zero errors before committing.

12. Git setup:
    git add .
    git commit -m "chore: initialize Next.js project with design system and full dependency set"
    git push -u origin main
    git checkout -b dev
    git push -u origin dev
    git checkout -b feat/project-foundation
    git merge main
    git checkout dev
    git merge feat/project-foundation
    git push origin dev

Done. Do not build any components in this session.
```

**Done When:**
- [ ] `npm run build` passes with zero errors
- [ ] `npm run dev` serves the placeholder page
- [ ] Design system CSS variables are in globals.css under `@theme`
- [ ] `.glass-card` utility class exists in globals.css
- [ ] Inter font loads on the page
- [ ] Background gradient applied to body
- [ ] All component folders exist (empty)
- [ ] GitHub shows `main` and `dev` branches
- [ ] No planning docs were deleted

---

---

# PHASE 1 — Frontend (WOW Factor)
## Goal: Complete, stunning, fully responsive portfolio with all hardcoded data. No backend. No API calls. Visuals perfect.
## Rule: ALL data comes from CONTEXT.md — hardcoded directly in components.

---

### P1.1 — Shared Components
**Branch:** `feat/shared-components` (from `dev`)
**Session Goal:** Build every reusable shared component. These are used by ALL sections — must be solid before building sections.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.1 — Shared Components
Branch: feat/shared-components (create from dev)

Build these 5 components. Write complete files. All must be mobile responsive.

1. src/components/shared/GlassCard.jsx
   - Accepts: children, className (optional), onClick (optional)
   - Applies .glass-card styles (from globals.css)
   - Supports hover: slight scale-up (transform scale 1.02) and increased shadow
   - Smooth transition on all hover states

2. src/components/shared/Navbar.jsx
   - Sticky top, full width
   - Frosted glass background (backdrop-filter blur, semi-transparent white)
   - Left: "Ahmad Sheraz" in teal bold
   - Right: navigation links — About · Skills · Projects · Experience · Hire Me · Contact
   - Links use smooth scroll (scrollIntoView behavior: smooth)
   - On mobile: hamburger menu that opens a dropdown with the same links
   - Active link highlighted in teal
   - Teal bottom border on scroll (adds when user scrolls past 50px)

3. src/components/shared/Footer.jsx
   - Minimal. One line.
   - "© 2025 Ahmad Sheraz · Built with Next.js & Three.js"
   - Centered, secondary text color

4. src/components/shared/SectionWrapper.jsx
   - Accepts: children, id (for anchor links), className (optional)
   - Sets section id for navbar smooth scroll targeting
   - On mount, registers GSAP ScrollTrigger animation:
     children fade in + slide up 30px when section enters viewport
   - Animation: opacity 0→1, y 30→0, duration 0.8, ease "power2.out"
   - Uses useEffect + useRef. Cleans up on unmount.

5. src/components/shared/TealButton.jsx
   - Accepts: children, onClick, href (optional), variant (primary | outline)
   - primary: teal background, white text, hover darkens
   - outline: transparent bg, teal border, teal text, hover fills teal
   - Smooth transition, rounded-lg, px-6 py-3
   - If href is provided, renders as Next.js Link

After building all 5, update src/app/page.js to render:
<Navbar /> at the top and <Footer /> at the bottom with placeholder text between them.
Run npm run build — must pass. Then commit and merge to dev.
```

**Done When:**
- [ ] All 5 components exist as complete files
- [ ] Navbar shows on page with smooth scroll links and mobile hamburger
- [ ] Footer renders correctly
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P1.2 — Hero Section — Layout & Typewriter
**Branch:** `feat/hero-layout` (from `dev`)
**Session Goal:** Build the complete Hero section layout with content, typewriter effect, and CTAs. 3D elements are placeholder divs for now (3D added in P1.3).

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.2 — Hero Layout & Typewriter
Branch: feat/hero-layout (create from dev)

Build the Hero section layout. The 3D canvas is a placeholder div for now.
Real 3D objects are added in P1.3. Focus on layout, content, and typewriter.

1. src/components/Hero/HeroContent.jsx
   - Left side of hero (on desktop), centered on mobile
   - Small badge: "Available for AI Projects" — amber gold color, glass background
   - Large heading: "Ahmad Sheraz" — bold, primary text color, 3D text depth effect using CSS text-shadow (not R3F yet)
   - Typewriter subtitle using Typed.js cycling through these roles (from CONTEXT.md):
     "AI/ML Engineer" | "Data Engineer" | "Backend Engineer" | "Full-Stack Developer" | "Problem Solver"
   - Short bio (2 lines max in hero): "Building intelligent systems that scale."
   - Two CTAs side by side:
     - Primary TealButton: "View My Work" → scrolls to #projects
     - Outline TealButton: "Let's Talk" → scrolls to #contact
   - Social links row: GitHub icon + LinkedIn icon (Lucide icons, teal color, hover scales)

2. src/components/Hero/HeroSection.jsx
   - Full viewport height section (min-h-screen)
   - Two-column layout on desktop (content left, 3D right), stacked on mobile
   - Left: <HeroContent />
   - Right: placeholder div with id="hero-3d-canvas" and a teal-bordered glass card that says "3D Scene — Coming in P1.3"
   - Subtle scroll-down indicator at bottom center (animated bouncing chevron)

3. Update src/app/page.js to include <HeroSection /> below <Navbar />.

Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] Hero renders full-viewport height
- [ ] Typewriter cycles through all 5 roles
- [ ] Two CTAs render and scroll smoothly
- [ ] Social icons render
- [ ] Two-column desktop, stacked mobile layout works
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P1.3 — Hero Section — 3D (Globe, Particles, Geometric Object)
**Branch:** `feat/hero-3d` (from `dev`)
**Session Goal:** Replace the hero placeholder with real R3F 3D canvas. Three separate 3D elements. Mobile performance handled.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.3 — Hero 3D Elements
Branch: feat/hero-3d (create from dev)

Replace the hero 3D placeholder with a real React Three Fiber canvas.
Three separate 3D components, assembled in one Canvas.
Use dynamic import with ssr: false for the entire canvas (performance on mobile + SSR safety).

1. src/components/Hero/Globe3D.jsx
   - R3F Mesh using SphereGeometry (radius 1.5, widthSegments 64, heightSegments 64)
   - Material: MeshStandardMaterial — color #0D9488 (teal), wireframe: true
   - Rotation: slow continuous rotation on Y axis (0.003 per frame in useFrame)
   - Subtle ambient light + directional light
   - Positioned in background, slightly behind and to the right
   - On mobile: reduce sphere segments to 32x32 for performance

2. src/components/Hero/Particles3D.jsx
   - 150 floating particles (Points + BufferGeometry)
   - Random positions within a defined sphere volume around the scene
   - Particle color: #F59E0B (amber gold) with slight opacity
   - Slowly drift upward and reset position when out of bounds
   - React to mouse position: particles subtly shift toward cursor (lerp, not snap)
   - Use useMousePosition hook from src/hooks/useMousePosition.js
   - On mobile: reduce to 60 particles. Disable mouse interaction.

3. src/components/Hero/GeometricObject.jsx
   - R3F Mesh using IcosahedronGeometry (radius 0.8, detail 0)
   - Material: MeshPhongMaterial — color #0D9488, wireframe: false, shininess 100
   - Continuous rotation on all 3 axes (different speeds)
   - Reacts to mouse: rotate slightly toward cursor position
   - Glass-like appearance: add slight transparency and teal edge glow using emissive
   - Floating animation: subtle up-down oscillation using Math.sin in useFrame
   - Position: center-right of canvas

4. src/components/Hero/HeroCanvas.jsx
   - Wraps Globe3D + Particles3D + GeometricObject in one R3F Canvas
   - Canvas fills its parent container
   - Camera position z: 5, fov: 60
   - Lights: ambientLight (intensity 0.4) + directionalLight (white, intensity 0.8, position [5,5,5])
   - Exported as a default export

5. src/components/Hero/HeroSection.jsx — UPDATE
   - Replace the placeholder div with dynamic import of HeroCanvas:
     const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })
   - Wrap in a div that is hidden on very small screens (xs) to protect performance

Create src/hooks/useMousePosition.js:
   - Tracks mouse x, y as normalized values (-1 to 1) relative to window center
   - Returns { x, y } — updated on mousemove event
   - Cleans up event listener on unmount

Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] Globe rotates slowly in hero
- [ ] Particles float and respond to mouse
- [ ] Geometric object rotates and responds to mouse
- [ ] No SSR errors (dynamic import with ssr: false)
- [ ] Mobile: simplified particles, no mouse interaction
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P1.4 — About Section
**Branch:** `feat/about` (from `dev`)
**Session Goal:** Build About section. Scroll reveal animation. No heavy 3D.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.4 — About Section
Branch: feat/about (create from dev)

Build src/components/About/AboutSection.jsx

Content (from CONTEXT.md — use exact bio text):
- Section heading: "About Me" with teal underline
- Two-column layout on desktop: left is bio text, right is a glass card with quick stats
- Bio text from CONTEXT.md
- Quick stats glass card: Years Coding · Projects Built · Fields of Expertise · Available for Work: Yes
- Subtle decorative teal accent line or dot on the left of bio text
- GSAP scroll reveal: entire section fades in + slides up when entering viewport
  Use SectionWrapper from shared components (id="about")

Add <AboutSection /> to src/app/page.js after HeroSection.
Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] About section renders with correct bio
- [ ] GSAP scroll reveal triggers when section enters viewport
- [ ] Two-column desktop, single column mobile
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P1.5 — Skills Section
**Branch:** `feat/skills` (from `dev`)
**Session Goal:** Skills grid with glass cards and 3D tilt hover effect. All skills from CONTEXT.md hardcoded.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.5 — Skills Section
Branch: feat/skills (create from dev)

Build two components:

1. src/components/Skills/SkillCard.jsx
   - Uses GlassCard as base
   - Shows: skill icon (Lucide or emoji fallback) + skill name
   - 3D tilt effect on hover using CSS transforms:
     onMouseMove: calculate cursor position relative to card center
     Apply transform: perspective(1000px) rotateX(Xdeg) rotateY(Ydeg)
     Max tilt: 15 degrees
     Add subtle shine overlay that moves with cursor
   - onMouseLeave: reset transform to flat
   - Amber gold dot or small border accent on hover

2. src/components/Skills/SkillsSection.jsx
   - Section heading: "Skills & Technologies" with teal underline
   - Render skills in groups (from CONTEXT.md):
     Languages · Frontend · Backend & APIs · AI / ML · Data Engineering · Databases · DevOps & Tools
   - Each group has a subtle group label in teal
   - Responsive grid: 2 cols mobile, 3 cols tablet, 4-5 cols desktop
   - Wrap in SectionWrapper (id="skills")

Add <SkillsSection /> to src/app/page.js.
Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] All skills render in correct groups
- [ ] 3D tilt effect works on hover (CSS-based, no R3F needed)
- [ ] Responsive grid adapts to screen size
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P1.6 — Projects Section
**Branch:** `feat/projects` (from `dev`)
**Session Goal:** Projects section with 3D glass card depth effect. All 7 projects hardcoded from CONTEXT.md in ranked order.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.6 — Projects Section
Branch: feat/projects (create from dev)

Build two components:

1. src/components/Projects/ProjectCard.jsx
   - Based on GlassCard
   - Top: Project rank number (styled small, teal) + "STAR PROJECT ⭐" badge on rank 1 only
   - Title: bold, primary color
   - Description: 2-3 lines max, secondary color
   - Tech stack: small amber gold pill/badge for each technology
   - Rating: shown as "9.4/10" in teal small text
   - Bottom row: two icon buttons — GitHub (links to repo) + Live Demo (links to live URL if available)
   - 3D depth effect on hover:
     transform: perspective(1000px) translateZ(10px) scale(1.02)
     Increased shadow on hover
     Smooth transition 0.3s
   - If no live URL: hide live demo button
   - If repo is private: show GitHub button as disabled/grayed

2. src/components/Projects/ProjectsSection.jsx
   - Section heading: "Featured Projects" with teal underline
   - Subheading: "Ranked by complexity, AI depth, and real-world impact"
   - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
   - Render all 7 projects from CONTEXT.md in exact ranked order (1→7)
   - Wrap in SectionWrapper (id="projects")

Add <ProjectsSection /> to src/app/page.js.
Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] All 7 projects render in correct ranked order
- [ ] JobCraft AI has ⭐ star badge
- [ ] Tech stack pills render for each project
- [ ] 3D depth hover effect works
- [ ] GitHub links open correctly
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P1.7 — Education + Experience Sections
**Branch:** `feat/education-experience` (from `dev`)
**Session Goal:** Build both Education Timeline and Experience sections in one session. Both are simple — subtle animations only.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.7 — Education + Experience
Branch: feat/education-experience (create from dev)

Build 4 components:

1. src/components/Education/EducationCard.jsx
   - GlassCard with: degree name (bold) · university name (teal) · duration (secondary color) · relevant coursework (small pill tags)
   - Left border: solid teal 3px accent line

2. src/components/Education/EducationSection.jsx
   - Section heading: "Education" with teal underline
   - Vertical timeline layout with connecting teal line between cards on desktop
   - Cards fade in one by one on scroll (staggered GSAP ScrollTrigger)
   - Data from CONTEXT.md
   - Wrap in SectionWrapper (id="education")

3. src/components/Experience/ExperienceCard.jsx
   - GlassCard with: role title (bold) · company name (teal) · duration · bullet points of responsibilities
   - Same left teal border accent as EducationCard

4. src/components/Experience/ExperienceSection.jsx
   - Section heading: "Experience" with teal underline
   - Same timeline layout as Education
   - Data from CONTEXT.md (placeholder structure if empty — show "Currently seeking first industry role" card)
   - Wrap in SectionWrapper (id="experience")

Add both sections to src/app/page.js (Education first, then Experience).
Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] Education timeline renders with correct data
- [ ] Experience section renders (or shows placeholder if no data)
- [ ] Staggered scroll reveal works on both
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P1.8 — Hire Me Section
**Branch:** `feat/hire-me` (from `dev`)
**Session Goal:** AI-first positioned Hire Me section. Glassmorphism CTA. Correct messaging.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.8 — Hire Me Section
Branch: feat/hire-me (create from dev)

Build src/components/HireMe/HireMeSection.jsx

Design: Premium glassmorphism CTA section. Moderate 3D — glowing card, animated elements.

Content (from CONTEXT.md and CLAUDE.md):
- Large headline: "Let's Build Something Intelligent" (bold, primary color)
- Subheading: "I build AI-powered web applications and smart management systems for small businesses that want to automate and think smarter."
- Three service cards (GlassCard each) with amber gold icon + teal title:
  1. "AI-Powered Web Applications" — intelligent apps with AI features built in
  2. "Smart Management Systems" — business automation for SMBs
  3. "Data Pipelines & Dashboards" — make sense of your data
- "My Work" proof: JobCraft AI showcase — name, short description, teal "Live Product" badge
- CTA button (large TealButton): "Start a Project" → scrolls to #contact
- Secondary link: "View full portfolio" → scrolls to #projects

Animations:
- Section background: subtle animated gradient shimmer (CSS keyframes — teal to ivory)
- Service cards: appear with staggered fade-in on scroll
- CTA button: glowing teal pulse animation on hover

Wrap in SectionWrapper (id="hire-me").
Add <HireMeSection /> to src/app/page.js.
Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] Section reads as AI engineer positioning (NOT web developer)
- [ ] Three service cards render with icons
- [ ] JobCraft AI proof shown
- [ ] CTA button glows on hover
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P1.9 — Contact Section
**Branch:** `feat/contact` (from `dev`)
**Session Goal:** Glass contact form with validation. No email sending yet (that's Phase 2). Social links.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.9 — Contact Section
Branch: feat/contact (create from dev)

Build two components:

1. src/components/Contact/ContactForm.jsx
   - Glass card form (GlassCard wrapper)
   - Fields: Full Name · Email Address · Subject · Message (textarea)
   - All fields styled with: glass-card input style (teal bottom border, transparent background, focus glow)
   - Client-side validation on submit:
     - All fields required
     - Email must be valid format
     - Message minimum 10 characters
     - Show inline error messages in red below each field
   - On submit (for now): show success state "Message received! I'll be in touch soon." (no API call — Phase 2)
   - Submit TealButton: "Send Message"
   - Form resets after successful fake submit

2. src/components/Contact/ContactSection.jsx
   - Two-column layout desktop: left = info + social, right = form
   - Left side:
     - Heading: "Get In Touch"
     - Subtext: "Open to AI projects, collaborations, and smart system builds."
     - Email: sheraz@ahmadsheraz.com (teal, with copy-to-clipboard on click)
     - Social links: GitHub + LinkedIn icons (from CONTEXT.md)
   - Right side: <ContactForm />
   - Mobile: stacked (info on top, form below)
   - Wrap in SectionWrapper (id="contact")

Add <ContactSection /> to src/app/page.js.
Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] Form renders with all 4 fields
- [ ] Validation catches empty fields, bad email, short message
- [ ] Success state shows on submit
- [ ] Social links render correctly
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P1.10 — Full Assembly + Polish + Responsive Audit
**Branch:** `feat/polish-assembly` (from `dev`)
**Session Goal:** Wire all sections into page.js in correct order. Full GSAP pass. Mobile audit. Performance. No new features — only polish.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P1.10 — Full Assembly + Polish + Responsive
Branch: feat/polish-assembly (create from dev)

This session is polish only — no new features. Fix, refine, and perfect what exists.

1. Confirm src/app/page.js has sections in exact order:
   Navbar → Hero → About → Skills → Projects → Education → Experience → HireMe → Contact → Footer

2. GSAP ScrollTrigger audit:
   - Confirm every section (except Hero) has scroll reveal via SectionWrapper
   - Fix any sections where animation doesn't trigger correctly
   - Add stagger delays where multiple cards appear (Skills, Projects)

3. Navbar smooth scroll audit:
   - Each nav link scrolls to correct section id
   - Active section is highlighted in navbar on scroll (IntersectionObserver)

4. Mobile responsive audit — check every section at these widths: 375px, 430px, 768px, 1024px, 1440px
   - Fix any overflow issues
   - Fix any text that's too large or too small on mobile
   - Fix any broken layouts on tablet
   - 3D canvas: verify it doesn't cause layout shift or overflow on mobile

5. Performance:
   - Confirm all R3F canvases use dynamic import with ssr: false
   - Add loading fallback for the 3D canvas (simple teal gradient div)
   - Check that GSAP ScrollTrigger is properly cleaned up in all useEffect hooks

6. Visual polish:
   - Consistent section spacing (padding-top: 80px, padding-bottom: 80px minimum on all sections)
   - Consistent heading styles across all sections
   - Teal divider line under every section heading
   - Page scrolls smoothly (html { scroll-behavior: smooth } in globals.css)

7. Run npm run build — must pass with zero errors and zero warnings if possible.

Commit and merge to dev. Then merge dev to main:
   git checkout main
   git merge dev
   git push origin main
   git tag v0.1.0
```

**Done When:**
- [ ] All sections in correct order
- [ ] All scroll reveals work
- [ ] Navbar active states work
- [ ] No mobile layout breaks at 375px, 768px, 1024px
- [ ] 3D canvas has loading fallback
- [ ] `npm run build` passes clean
- [ ] Merged to `main` and tagged `v0.1.0`

---

### P1.11 — Deployment
**Branch:** `feat/deployment` (from `dev`)
**Session Goal:** Deploy to Vercel. Connect Cloudflare DNS. Enable Analytics. Site live at ahmadsheraz.com.

**Session Prompt:**
```
Read CLAUDE.md and EXECUTION_PLAN.md.
Current sub-phase: P1.11 — Deployment
Branch: feat/deployment (create from dev)

1. Verify GitHub repo has latest main branch pushed and clean.

2. Vercel deployment (guide me through these steps if needed):
   - Go to vercel.com → Add New Project → Import from GitHub
   - Select: AhmadShazy/ahmadsheraz-portfolio
   - Framework: Next.js (auto-detected)
   - Root Directory: ./ (default)
   - Build command: npm run build (default)
   - Output: .next (default)
   - Add environment variables from .env.local (add empty ones for now)
   - Deploy

3. Cloudflare DNS (after Vercel gives the deployment URL):
   - Log into Cloudflare → ahmadsheraz.com → DNS
   - Add CNAME record: @ → cname.vercel-dns.com (or Vercel's provided record)
   - Add CNAME record: www → cname.vercel-dns.com
   - In Vercel: add custom domain ahmadsheraz.com

4. Vercel Analytics:
   - In Vercel dashboard → project → Analytics → Enable
   - Add <Analytics /> component from @vercel/analytics/next to src/app/layout.js

5. Verify:
   - https://ahmadsheraz.com loads correctly
   - https://www.ahmadsheraz.com redirects properly
   - SSL certificate is active
   - All sections load and scroll correctly on live site

Commit any changes (Analytics component). Merge to dev, then merge dev to main.
```

**Done When:**
- [ ] Site live at ahmadsheraz.com
- [ ] SSL active (https)
- [ ] Vercel Analytics enabled
- [ ] All sections work on live site
- [ ] **Phase 1 Complete ✅**

---

---

# PHASE 2 — Backend (Dynamic Content)
## Goal: Replace all hardcoded data with MongoDB Atlas. API routes for every content type. Resend email integration.
## Rule: Frontend must look identical after Phase 2. Only the data source changes.

---

### P2.1 — MongoDB Setup + Mongoose Models
**Branch:** `feat/mongodb-models` (from `dev`)
**Session Goal:** MongoDB Atlas cluster connected. All Mongoose models defined.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P2.1 — MongoDB Setup + Mongoose Models
Branch: feat/mongodb-models (create from dev)

1. Confirm MongoDB Atlas cluster is created (if not, pause and create it first).
   Update MONGODB_URI in .env.local with the real connection string.

2. Create src/lib/mongodb.js:
   - Singleton pattern for MongoDB connection (reuse in development, fresh in production)
   - Export: connectDB() async function
   - Handles connection errors gracefully with console.error

3. Create all Mongoose models in src/lib/models/:

   Project.js — fields: rank, title, description, rating, techStack (array), githubUrl, liveUrl, isPrivate, isStarred, isFeatured, tags (array), createdAt
   
   Skill.js — fields: name, category (enum: Languages|Frontend|Backend & APIs|AI / ML|Data Engineering|Databases|DevOps & Tools), icon, order
   
   Experience.js — fields: role, company, startDate, endDate, isCurrent, description, bullets (array), order
   
   Education.js — fields: degree, institution, startYear, endYear, specialization, coursework (array), fyp
   
   Message.js — fields: name, email, subject, message, receivedAt, isRead
   
   SocialLink.js — fields: platform, url, icon, order

4. Test connection works:
   Create a temporary test file src/lib/test-connection.js, run it with node, confirm connection succeeds. Delete test file after.

Run npm run build — must pass.
Commit and merge to dev.
```

**Done When:**
- [ ] `connectDB()` connects to MongoDB Atlas successfully
- [ ] All 6 Mongoose models created with correct schemas
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P2.2 — API Routes (GET Endpoints)
**Branch:** `feat/api-routes` (from `dev`)
**Session Goal:** All GET API routes for reading portfolio content.

**Session Prompt:**
```
Read CLAUDE.md and EXECUTION_PLAN.md.
Current sub-phase: P2.2 — API Routes
Branch: feat/api-routes (create from dev)

Create these Next.js App Router API routes in src/app/api/:

1. src/app/api/projects/route.js — GET all projects, sorted by rank ascending
2. src/app/api/skills/route.js — GET all skills, grouped by category
3. src/app/api/experience/route.js — GET all experience, sorted by order
4. src/app/api/education/route.js — GET all education entries
5. src/app/api/social/route.js — GET all social links, sorted by order
6. src/app/api/contact/route.js — POST only (for Phase 2.5 — create the file but leave POST empty for now)

Each GET route:
- Calls connectDB() first
- Queries the correct model
- Returns JSON response with data array
- Handles errors: returns 500 with error message
- Uses Next.js Response.json()

Run npm run build — must pass.
Commit and merge to dev.
```

**Done When:**
- [ ] All 6 route files exist
- [ ] GET routes return correct JSON structure
- [ ] Error handling in place
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P2.3 — Database Seed
**Branch:** `feat/db-seed` (from `dev`)
**Session Goal:** Seed all portfolio content from CONTEXT.md into MongoDB. Verify data in Atlas.

**Session Prompt:**
```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md.
Current sub-phase: P2.3 — Database Seed
Branch: feat/db-seed (create from dev)

Create src/lib/seed.js:
- Import all models and connectDB
- Clear existing data first (deleteMany on all collections)
- Insert all data from CONTEXT.md:
  - All 7 projects with complete data (ranked 1-7)
  - All skills grouped by category
  - Education entry
  - Experience entries (or placeholder if empty)
  - Social links: GitHub + LinkedIn

Make it runnable: add to package.json scripts:
"seed": "node src/lib/seed.js"

Run: npm run seed
Verify in MongoDB Atlas UI that all data appears correctly in all collections.

Run npm run build — must pass.
Commit and merge to dev.
```

**Done When:**
- [ ] Seed script runs without errors
- [ ] All collections have correct data in MongoDB Atlas
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P2.4 — Wire Frontend to API
**Branch:** `feat/frontend-api` (from `dev`)
**Session Goal:** Replace all hardcoded data in components with API fetch calls. Loading states. Error handling.

**Session Prompt:**
```
Read CLAUDE.md and EXECUTION_PLAN.md.
Current sub-phase: P2.4 — Wire Frontend to API
Branch: feat/frontend-api (create from dev)

Replace hardcoded data in these sections with API fetch calls.
Use Next.js App Router server components where possible (async components that fetch on server).
For client-side components (ones with interactivity/hooks), use useEffect + useState.

1. ProjectsSection.jsx — fetch from /api/projects
2. SkillsSection.jsx — fetch from /api/skills
3. ExperienceSection.jsx — fetch from /api/experience
4. EducationSection.jsx — fetch from /api/education

For each section:
- Add loading state: show skeleton cards (gray animated pulse glass cards) while fetching
- Add error state: show "Failed to load — please refresh" message in teal
- Data display must look identical to Phase 1 hardcoded version

Create src/components/shared/SkeletonCard.jsx:
- Animated pulse glass card placeholder
- Accepts: height prop

Run npm run dev and verify all sections load real data from MongoDB.
Run npm run build — must pass.
Commit and merge to dev.
```

**Done When:**
- [ ] All 4 sections load real data from MongoDB
- [ ] Loading skeletons appear while fetching
- [ ] Site looks identical to Phase 1
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P2.5 — Contact Form + Resend Email
**Branch:** `feat/email-contact` (from `dev`)
**Session Goal:** Wire contact form to API route. Resend sends email to sheraz@ahmadsheraz.com. Auto-reply to sender. Save to MongoDB.

**Session Prompt:**
```
Read CLAUDE.md and EXECUTION_PLAN.md.
Current sub-phase: P2.5 — Contact Form + Resend Email
Branch: feat/email-contact (create from dev)

1. Complete src/app/api/contact/route.js POST handler:
   - Validate: name, email, subject, message all required
   - Save to MongoDB: new Message({ ...data, receivedAt: new Date() })
   - Send email via Resend to sheraz@ahmadsheraz.com:
     Subject: "🔔 New Message from ahmadsheraz.com — [Name]"
     Body: HTML with all form fields nicely formatted
   - Send auto-reply via Resend to the sender:
     Subject: "Thanks for reaching out, [Name]!"
     Body: Professional acknowledgement, mentions reply within 24-48 hours
   - Return: 200 success or 500 error

2. Update src/components/Contact/ContactForm.jsx:
   - Replace fake submit handler with real fetch POST to /api/contact
   - Show loading spinner on submit button while sending
   - On success: show success message (same as before)
   - On error: show "Something went wrong. Please email me directly at sheraz@ahmadsheraz.com"

3. Add RESEND_API_KEY to .env.local (real key).
   Verify from Resend dashboard that domain is configured.

Test: submit the form and verify email arrives at sheraz@ahmadsheraz.com.
Run npm run build — must pass.
Commit and merge to dev. Merge dev to main. Tag v2.0.0.
```

**Done When:**
- [ ] Contact form submits to API
- [ ] Email arrives at sheraz@ahmadsheraz.com
- [ ] Auto-reply sent to test sender
- [ ] Message saved in MongoDB Messages collection
- [ ] `npm run build` passes
- [ ] Merged to `main`, tagged `v2.0.0`
- [ ] **Phase 2 Complete ✅**

---

---

# PHASE 3 — Admin Panel
## Goal: Private CMS dashboard at admin.ahmadsheraz.com. Separate Next.js app. Never publicly referenced.
## Rule: The admin panel URL, codebase, and existence must NEVER appear in the portfolio app.

---

### P3.1 — Admin App Setup + JWT Auth
**Branch:** `feat/admin-setup-auth` (this is a NEW separate repo: `ahmadsheraz-admin`)
**Session Goal:** Scaffold the admin Next.js app. Login page. JWT middleware. All admin routes protected.

**Session Prompt:**
```
Read CLAUDE.md and EXECUTION_PLAN.md.
Current sub-phase: P3.1 — Admin App Setup + Auth
This is a NEW, SEPARATE Next.js application — NOT inside the portfolio repo.

Create a new folder: ahmadsheraz-admin/
This app is private. It must never be linked from the portfolio.

1. Scaffold: npx create-next-app@latest . --js --tailwind --app --src-dir --import-alias "@/*" --yes
   Install: npm install mongoose jsonwebtoken bcryptjs cookie js-cookie

2. src/app/login/page.js:
   - Simple centered login form: password field only (no username — single admin)
   - On submit: POST to /api/auth/login
   - On success: redirect to /dashboard
   - Minimal glass design (same design system as portfolio)

3. src/app/api/auth/login/route.js:
   - Accept: { password }
   - Compare with process.env.ADMIN_PASSWORD using bcryptjs
   - If match: generate JWT (sign with JWT_SECRET, expires 24h)
   - Set as httpOnly cookie named "admin_token"
   - Return 200
   - If no match: return 401

4. src/middleware.js:
   - Protect all routes under /dashboard/*
   - Read "admin_token" cookie
   - Verify JWT signature
   - If invalid or missing: redirect to /login
   - Allow /login and /api/auth/* without auth

5. src/app/dashboard/page.js:
   - Placeholder: "Admin Dashboard — ahmadsheraz.com"
   - Links to: Projects · Skills · Experience · Education · Contact Inbox · Social Links
   - Logout button: clears cookie, redirects to /login

6. .env.local:
   MONGODB_URI=same_uri_as_portfolio
   JWT_SECRET=same_secret_as_portfolio
   ADMIN_PASSWORD=bcrypt_hash_of_your_password

Run npm run build — must pass.
Git init, create GitHub repo: ahmadsheraz-admin (PRIVATE repo).
Push to GitHub.
```

**Done When:**
- [ ] Login page renders
- [ ] Correct password grants access to dashboard
- [ ] Wrong password returns 401
- [ ] All /dashboard/* routes redirect to /login without valid JWT
- [ ] `npm run build` passes
- [ ] Private GitHub repo created and pushed

---

### P3.2 — Admin Projects CRUD
**Branch:** `feat/admin-projects` (from `dev` in admin repo)
**Session Goal:** Full CRUD interface for Projects in the admin panel.

**Session Prompt:**
```
Read CLAUDE.md and EXECUTION_PLAN.md.
Current sub-phase: P3.2 — Admin Projects CRUD
Branch: feat/admin-projects

Build the projects management section in the admin panel.
Uses the same MongoDB models as the portfolio (import from lib/models/).

src/app/dashboard/projects/page.js:
- Table of all projects: rank · title · rating · featured · actions (edit / delete)
- "Add Project" button → opens modal/form
- "Edit" → pre-fills form with existing data
- "Delete" → confirm dialog → deletes from MongoDB
- Drag to reorder rows → updates rank field for all affected projects

src/app/api/admin/projects/route.js:
- GET: return all projects (admin view — more fields than public API)
- POST: create new project (validate all required fields)

src/app/api/admin/projects/[id]/route.js:
- PUT: update project by id
- DELETE: delete project by id

All admin API routes must verify JWT from cookie before processing.
Create a helper: src/lib/verifyAdminToken.js that checks the httpOnly cookie.

Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] Projects table renders all projects
- [ ] Add new project works
- [ ] Edit existing project works
- [ ] Delete with confirmation works
- [ ] All API routes reject unauthenticated requests
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P3.3 — Admin Skills + Experience + Education CRUD
**Branch:** `feat/admin-content` (from `dev`)
**Session Goal:** CRUD interfaces for Skills, Experience, and Education.

**Session Prompt:**
```
Read CLAUDE.md and EXECUTION_PLAN.md.
Current sub-phase: P3.3 — Admin Skills + Experience + Education CRUD
Branch: feat/admin-content

Build 3 management sections using the same CRUD pattern from P3.2.

1. src/app/dashboard/skills/page.js
   - Table: name · category · order · actions
   - Add/Edit modal: name, category dropdown, icon selector
   - Reorder by drag or up/down arrows

2. src/app/dashboard/experience/page.js
   - Cards or table: role · company · dates · current
   - Add/Edit form: all experience fields + bullet points (dynamic add/remove)

3. src/app/dashboard/education/page.js
   - Simple: degree · institution · dates · specialization
   - Add/Edit form

Create API routes for each under /api/admin/skills, /api/admin/experience, /api/admin/education.
All routes: GET (list), POST (create), PUT by id (update), DELETE by id.
All routes: verify JWT first.

Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] Skills, Experience, Education all have working CRUD
- [ ] All API routes protected by JWT verification
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P3.4 — Admin Contact Inbox + Social Links + Hero Editor
**Branch:** `feat/admin-inbox-social` (from `dev`)
**Session Goal:** Contact message inbox. Social links editor. Hero text editor.

**Session Prompt:**
```
Read CLAUDE.md and EXECUTION_PLAN.md.
Current sub-phase: P3.4 — Admin Contact Inbox + Social Links + Hero Editor
Branch: feat/admin-inbox-social

1. src/app/dashboard/inbox/page.js
   - Table of all contact messages: name · email · subject · date · read/unread
   - Click row to expand: show full message
   - Mark as read toggle
   - Delete message
   - Unread count shown in dashboard nav badge

2. src/app/dashboard/social/page.js
   - List of social links: platform · url · order
   - Add/Edit/Delete
   - Reorder by drag

3. src/app/dashboard/hero/page.js
   - Simple form: edit hero tagline, typewriter roles (add/remove/reorder), available for work toggle
   - These are stored in a single Settings document in MongoDB

   Create src/lib/models/Settings.js:
   - key: String (unique)
   - value: Mixed (stores JSON value)

   Seed initial hero settings in a hero key.

API routes: /api/admin/inbox, /api/admin/social, /api/admin/settings
All routes: GET, POST/PUT, DELETE where applicable. All JWT protected.

Run npm run build — must pass. Commit and merge to dev.
```

**Done When:**
- [ ] Inbox shows all messages with read/unread state
- [ ] Social links manageable
- [ ] Hero text editable from admin
- [ ] `npm run build` passes
- [ ] Committed and merged to `dev`

---

### P3.5 — Admin Deploy to admin.ahmadsheraz.com
**Branch:** `feat/admin-deploy` (from `dev`)
**Session Goal:** Deploy admin panel to Vercel. Configure subdomain. Test all CRUD on live.

**Session Prompt:**
```
Read CLAUDE.md and EXECUTION_PLAN.md.
Current sub-phase: P3.5 — Admin Deploy
Branch: feat/admin-deploy

1. Merge dev to main in admin repo. Push. Tag v1.0.0.

2. Vercel deployment:
   - New project → import ahmadsheraz-admin from GitHub
   - Add all environment variables from .env.local
   - Deploy

3. Cloudflare DNS:
   - Add CNAME: admin → cname.vercel-dns.com
   - In Vercel: add custom domain admin.ahmadsheraz.com

4. Test on live URL:
   - Login works
   - All CRUD operations work on real data
   - Changes reflect on portfolio (ahmadsheraz.com) immediately

5. Security check:
   - admin.ahmadsheraz.com does NOT appear anywhere in portfolio code
   - admin.ahmadsheraz.com does NOT appear in portfolio robots.txt or sitemap
   - JWT cookies are httpOnly and Secure

Final commit: cleanup any debug logs. Merge to main.
```

**Done When:**
- [ ] admin.ahmadsheraz.com is live and secure
- [ ] Login + all CRUD works on live
- [ ] Portfolio reflects admin changes
- [ ] Admin URL not referenced anywhere in portfolio
- [ ] **Phase 3 Complete ✅**
- [ ] **Project Complete 🎉**

---

---

## 🔁 Session Start Template (Copy-Paste Every Time)

```
Read CLAUDE.md, EXECUTION_PLAN.md, and CONTEXT.md before doing anything.

Current phase: [e.g. Phase 1]
Current sub-phase: [e.g. P1.3 — Hero 3D]
Branch to create: [e.g. feat/hero-3d] from dev

Last session summary: [what was completed]
Known issues from last session: [anything broken or pending]

Proceed with the sub-phase deliverables as listed in EXECUTION_PLAN.md.
Do not start the next sub-phase — only complete the current one.
Run npm run build before committing. Must pass with zero errors.
```

---

*ahmadsheraz.com — Execution Plan · Ahmad Sheraz · June 2026 · 22 sub-phases · 3 phases*
