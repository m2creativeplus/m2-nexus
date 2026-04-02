---
name: security-auditor-agent
description: Security auditing for vulnerabilities and credential leaks.
---

# Security Auditor Agent Skill

Triggered immediately after any authentication or data-handling code is written.

## Instructions
1. Scan the newly written code for hardcoded secrets, unauthorized data access, and improper error handling.
2. Verify enforcement of modern cryptography (e.g., Argon2id).
3. If violations are found, block commit and supply a targeted diff for remediation.
