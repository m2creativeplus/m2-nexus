---
description: Smart School SMS - Parallel Agent Re-Engineering Protocol
---

# Smart School SMS — Parallel Re-Engineering

When doing a major re-engineering of Smart School SMS, follow this protocol to work efficiently.

## Module Priority (Critical Path)
1. **Authentication** — Replace mock auth with real Clerk
2. **Students** — Core CRUD + enrollment
3. **Fees** — Payment tracking + receipts  
4. **Attendance** — Daily tracking + reports
5. **Academics** — Classes, subjects, timetable
6. **Examinations** — Marks, grades, report cards
7. **Staff** — HR management
8. **Communication** — SMS/Email notifications

## Per-Module Checklist
For each module, you MUST complete:
- [ ] Convex schema + indexes
- [ ] Convex mutations (create, update, delete)
- [ ] Convex queries (list, getById, search)
- [ ] Main list page with real data
- [ ] Add/Create form with Zod validation
- [ ] Edit form
- [ ] Delete with confirmation
- [ ] Loading states
- [ ] Error handling
- [ ] `npm run build` passes
- [ ] Commit with descriptive message

## Rules
- Complete ONE module fully before starting the next
- Never leave a module half-done
- Run build after every module
- No empty scaffolds — every route must work
