---
description: Start a new coding session - check project status, pick ONE task, and build
---

# Start Session

Protocol for starting any new Antigravity coding session. Prevents the repeat failure cycle.

## Steps

1. Check these rules FIRST — read `/Users/m2creative/.gemini/GEMINI.md` if unsure about identity, workspace, or sovereignty rules.

2. Identify what the user wants. Do NOT spend more than 2 tool calls on "research".

3. Check project status — is this project already started? Check git log:
```bash
git log -5 --oneline
```

4. Pick ONE deliverable for this session. Ask yourself:
   - "What is the ONE thing we can ship today?"
   - "What is the smallest working version?"
   - "Has this stalled before? Why?" (Answer: over-complexity)

5. Start coding within the first 5 minutes. Do NOT:
   - Create planning documents
   - Write audits or strategic frameworks
   - Propose multi-phase approaches
   - Re-explain the workspace structure

6. At the end of the session:
   - Run `npm run build` to verify
   - Commit and push: `git add . && git commit -m "<msg>" && git push`
   - Deploy: `vercel --prod`
   - Leave a clear "Next Step" comment

## Anti-Patterns to Avoid
- ❌ "Let me research the workspace first..."
- ❌ "Here's a comprehensive 4-week plan..."
- ❌ "Should I proceed?"
- ❌ Creating README.md for a project that doesn't work
- ❌ Switching between multiple projects
