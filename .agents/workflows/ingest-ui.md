---
description: Automatically ingests a v0.dev or Lovable UI component safely into the m2-nexus codebase and wires up the Convex backend
---
# Ingest UI Workflow

This workflow automates "Stage 4" of the Linear Pipeline. It safely integrates an external GenAI component into the canonical workspace without hallucinations.

1. Ensure the user has pasted the raw UI code into the chat context or created a temporary file with it.
2. Analyze the UI code to identify its purpose (e.g., Dashboard Sidebar, Data Table).
3. Identify the required data models that this UI depends on.
4. **Step 1: Save the UI Component**
   Create the `.tsx` file in `/Volumes/MAC DATA/Antigraphity/m2-nexus/src/components/` with the raw UI. Do NOT change the layout.
5. **Step 2: Backend Generation**
   Create or update the appropriate `convex/[file].ts` and `convex/schema.ts` to support the required data structures.
6. **Step 3: Component Wiring**
   Update the `.tsx` file to import `useQuery` or `useMutation` from `convex/react` and replace the mock data with the live Convex feed.
7. Verify all TypeScript errors are resolved and check if any Lucide or Radix UI icons/components need to be installed.
8. Request the user to test the component on `localhost:3000`.
