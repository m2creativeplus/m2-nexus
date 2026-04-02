---
description: Deploy a project to Vercel with build verification and route checking
---

# Deploy to Vercel

Full deployment workflow: build locally, push to git, deploy to Vercel, verify live URL.

## Steps

1. First, verify the build passes locally:
```bash
npm run build
```

If the build fails, fix the errors before proceeding. Do NOT push broken code.

2. Stage and commit all changes:
```bash
git add .
git status
```

Review the staged files, then commit with a meaningful message:
```bash
git commit -m "<describe what changed>"
```

3. Push to GitHub:
```bash
git push origin main
```

4. Deploy to Vercel production:
```bash
vercel --prod
```

5. Verify the live URL loads correctly. If the project has a `verify-routes.js` file, run it:
```bash
node verify-routes.js
```

Otherwise, open the deployed URL in browser and verify manually.

6. Report the live URL to the user and confirm deployment is working.

## Rules
- NEVER skip step 1 (build check)
- NEVER report "done" without verifying the live URL
- If build fails, fix errors before deploying — do NOT deploy broken code
