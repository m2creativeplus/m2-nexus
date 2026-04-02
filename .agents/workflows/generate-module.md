---
description: Generate a full-stack module (Convex backend + Next.js page) in Smart School SMS
---

# Generate Module

Generate a complete full-stack module for the Smart School SMS app with Convex backend + Next.js frontend.

## Steps

1. Navigate to the project:
```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/smart-school-sms"
```

2. Define the module. The user will specify a module name (e.g., "fees", "attendance", "library"). Create:

### Backend (Convex)
- `convex/<module>.ts` — Mutations (create, update, delete) and Queries (list, getById)
- Schema additions in `convex/schema.ts` if needed
- Use proper TypeScript types — NO `any`
- Add validation in mutations

### Frontend (Next.js)
- `app/(dashboard)/<module>/page.tsx` — Main list view with real data
- `app/(dashboard)/<module>/add/page.tsx` — Create form with Zod validation
- `app/(dashboard)/<module>/[id]/page.tsx` — Detail/edit view
- Components in `components/<module>/` if needed

### Requirements for EVERY module:
- ✅ Real CRUD operations connected to Convex
- ✅ Loading states (skeleton loaders)
- ✅ Error boundaries
- ✅ Form validation with Zod
- ✅ TypeScript interfaces (no `any`)
- ✅ Toast notifications on success/error (Sonner)
- ❌ NO mock data
- ❌ NO "Coming Soon" pages
- ❌ NO `console.log`

3. Test the module:
```bash
npm run build
```

4. Commit:
```bash
git add .
git commit -m "feat: add <module> module with full CRUD"
```
