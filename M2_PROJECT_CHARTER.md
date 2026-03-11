# M2 NEXUS DASHBOARD — PROJECT CHARTER

> **Status:** 🟡 IN PROGRESS
> **Type:** Internal Corporate Tool
> **Objective:** The central commanding dashboard for orchestrating all M2 Creative & Consulting operations, integrating various AI agent skills, tracking projects, and serving as the unified sovereign engine.

---

## 🤖 COMPULSORY AI HANDOFF (READ THIS FIRST)
When an agent is spun up in this workspace, ALWAYS read this section before taking action.

- **Current State:** Basic Nexus UI and layout structure have been scaffolded (Next.js App Router). Navigation, Banners, and sidebars exist. Needs dynamic wiring and complete route build-outs.
- **Next Immediate Action:** Wire the Dashboard layout with actionable widgets and dynamic data sources. Add state persistence (Convex/Supabase).
- **Core Rules:**
  - DO NOT create duplicate dashboards or folders.
  - MUST use M2 Glassmorphism aesthetic (Dark Mode, #1A1A1A backgrounds, #D4AF37 gold accents).
  - TypeScript strictly.

---

## 🛠️ TECH STACK & ARCHITECTURE

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Vanilla CSS fallbacks)
- **Database/Backend:** TBD (Convex recommended, check `package.json` for current integration)
- **Deployment:** Vercel

## 🔗 RELEVENT LINKS
- **Local Dev:** `http://localhost:3000`
- **Vercel Console:** [M2 Nexus Vercel Project](https://vercel.com/m2creatives-projects/m2-nexus)
- **Brand Assets:** Uses default logo from `/Volumes/MAC DATA/Antigraphity/M2 BRAND KIT/`

---

## 📁 KEY DIRECTORIES
- `src/app/`: Core application routes.
- `src/components/`: Reusable UI elements (DashboardLayout, M2Banners, etc.)
- `public/`: Static brand assets and SVGs.

*This charter supersedes all standard Next.js documentation.*
