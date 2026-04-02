---
description: Create a new Next.js project with M2 Creative standards (TypeScript, Tailwind, App Router)
---

# New Project Setup

Create a new Next.js project with M2 Creative & Consulting standards.

// turbo-all

## Steps

1. Verify you are in the correct workspace:
```bash
pwd
# Must be /Volumes/MAC DATA/Antigraphity/ or a subdirectory
```

2. Check if a similar project already exists:
```bash
ls -la /Volumes/MAC\ DATA/Antigraphity/ | grep -i "<project-name>"
ls -la /Volumes/MAC\ DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/ | grep -i "<project-name>"
```

If it exists, DO NOT create a duplicate. Build on the existing one.

3. Create the project using Next.js with App Router:
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

4. Install standard dependencies:
```bash
npm install zod sonner
```

5. Initialize git:
```bash
git init
git add .
git commit -m "Initial scaffold"
```

6. Set up Vercel:
```bash
vercel
```

## Standards
- TypeScript only (no JavaScript)
- App Router (app/ directory)
- Tailwind CSS for styling
- Dark mode + gold accents (#D4AF37) for M2-branded projects
- Green/White/Red for Somaliland government projects
- Zod for form validation
- Error boundaries on every page
