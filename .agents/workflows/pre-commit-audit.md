---
description: Automated Pre-commit Audit
---

# Pre-commit Audit Workflow

This workflow dynamically chains agent skills to ensure secure and optimized code changes.

1. Code Generation: Execute the primary feature code changes (using targeted diffs).
2. Security Auditor Skill Review: Trigger `security-auditor-agent` to review the changes.
3. Token-optimized Memory Update: Append the exact lesson learned to `docs/active-memory.md`.
