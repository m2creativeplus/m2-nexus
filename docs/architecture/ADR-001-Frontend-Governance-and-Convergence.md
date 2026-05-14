# ADR 001: Frontend Governance and Curated Convergence

## Status
Accepted

## Date
2026-05-14

## Context
The M2 Sovereign Ecosystem was suffering from severe **Component Entropy** and **Uncontrolled Ingestion**. The architecture had drifted due to the proliferation of AI-generated UI scaffolds (v0.dev, Lovable) and duplicate repositories (`open-lovable`, `m2-sovereign-ingest`). 

This violated the Microsoft Well-Architected Framework (Operational Excellence pillar) by creating unmaintainable duplicate infrastructure and violated the M2 Global Rules (Section 2.1: Canonical Workspace). Agents were maximizing component *generation* rather than component *governance*.

## Decision
We are shifting the M2 Nexus architecture from an "Ingestion/Scaffold" model to a **"Curated Convergence"** model. 

1. **Runtime Enforcement:** 
   - We implemented strict ESLint rules (`no-restricted-imports`) in `m2-nexus` to fatally block any direct imports from `@/components/lovable/*` or `@/components/v0/*`.
   - All reusable components MUST be registered and imported from the canonical `@m2-dev-library`.

2. **Graph-Based Entropy Detection:**
   - We introduced the `m2_graph_governor.py` (using `networkx`) to mathematically parse the AST of the codebase and identify orphaned components (In-Degree = 0).
   - 19 orphaned components were immediately archived to prevent UI rot.

3. **Workspace De-duplication:**
   - Rogue clones (`open-lovable` and `m2-sovereign-ingest`) have been physically archived/renamed in the file system to force IDEs and AI agents to lose context of the dead branches.

## Consequences

### Positive
* **Operational Excellence:** Complete elimination of duplicate component maintenance. 
* **Reliability:** Codebase is structurally sound; agents can no longer hallucinate or arbitrarily inject unapproved UI scaffolds without compiler errors.
* **Performance:** Reduced bundle size and faster build times due to the purging of 19 orphaned files.

### Negative
* Developers and AI agents will encounter friction (build errors) when attempting to quickly copy-paste raw UI components. They must now take the extra step to integrate new components into the canonical `m2-dev-library` first.

## Compliance Check
This decision aligns with:
- M2 Global Rules: 4.1 (Finish what you start) & 4.4 (Banned Anti-Patterns)
- AI Well-Architected Framework: Version Control & Observability
