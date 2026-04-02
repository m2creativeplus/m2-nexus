---
description: Execute Smart School SMS Maximum Capacity Build in phases
---

# Smart School SMS Build

Build workflow for completing the Smart School SMS application. Focuses on shipping real functionality, not scaffolds.

## Pre-Flight Checks

1. Navigate to the project:
```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/smart-school-sms"
```

2. Check current state:
```bash
git status --short
git log -3 --oneline
```

3. Verify the build passes BEFORE making changes:
```bash
npm run build
```

## Build Rules
- Pick ONE module per session (Students, Fees, Attendance, etc.)
- **THE CRUD-FIRST CONTRACT:** You are forbidden from editing CSS, styling, or Tailwind classes until the Convex backend mutation/query is 100% functional.
- Every page must have real CRUD operations — NO empty scaffolds
- Run `npm run build` after every major change
- Do NOT install new packages unless absolutely necessary (check package.json first)
- Replace all `any` types with proper interfaces
- Remove all `console.log` statements
- Remove `// @ts-ignore` — fix the actual type errors

## Status Check
- Do NOT rely on outdated bug lists. At the beginning of a session, scan the active codebase or `CODE_REVIEW.md` (if dynamically updated) to determine the real-time status.

## Deploy
After completing a module, follow the `/deploy` workflow.
