# Global Security Rule

- **ABSOLUTE PROHIBITION:** Never use, write, or suggest hardcoded secrets, API keys, or database credentials.
- **ENVIRONMENT VARIABLES:** Strictly require environment variables for all sensitive configuration in all projects.
- **CRYPTOGRAPHY:** Enforce modern cryptographic standards (e.g., Argon2id) for all authentication flows.
- **AUDITING:** Automatically trigger security-auditor-agent for review on auth/security code changes.
