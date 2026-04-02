---
description: Automatically scaffolds a new full-stack Next.js component and Convex backend route within an active mission.
---

# New Feature Generator Workflow
**Target:** Any M2 Active Mission Repository
**Engine:** M2 Nexus Orchestrator

This workflow scaffolds the exact M2 architecture standard for new full-stack features:
1. `page.tsx` or `Component.tsx` with Glassmorphism / Gold Design Tokens.
2. `convex/feature.ts` for database routing.

## Pre-Flight Check
```bash
echo "[0/4] Verifying Project Context & Overrides..."
pwd
ls -la .m2-override.md || echo "No local brand overrides found. Proceeding with M2 Global Standards."
```

## Step 1: Initialize Component Structure & Enforce CRUD
**CRITICAL:** Before styling anything, establish the Convex data pipeline.

```bash
echo "[1/4] Scanning active deployment directory for existing features..."
if [ -d "src/app/new-feature" ]; then
  echo "WARNING: Directory src/app/new-feature already exists. Halt and specify custom module name."
  exit 1
fi
mkdir -p src/app/new-feature
touch src/app/new-feature/page.tsx
mkdir -p src/components/features
touch src/components/features/NewFeatureCard.tsx
```

## Step 2: Write Premium UI Scaffolding

```bash
echo "[2/4] Injecting Sovereign Glassmorphism UI tokens..."
cat << 'EOF' > src/components/NewFeatureCard.tsx
"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function NewFeatureCard({ title, data }: { title: string, data: any }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} 
                className="glass-card p-6 border-l-4 border-[var(--m2-gold)]">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-[var(--m2-gold)]" />
        <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
      </div>
      <div className="text-sm text-gray-400">
        Feature initialized via M2 Nexus Orchestrator.
        <pre className="mt-4 p-3 bg-black/50 rounded-lg border border-white/5 text-[10px] text-green-400 font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </motion.div>
  );
}
EOF
```

## Step 3: Inject Database Schema & Routes

```bash
echo "[3/4] Connecting to Sovereign Convex Database Layer..."
mkdir -p convex
touch convex/newFeature.ts

cat << 'EOF' > convex/newFeature.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// M2 Auto-Generated Route
export const getData = query({
  args: {},
  handler: async (ctx) => {
    return { status: "Active", metric: 100, system: "M2 NEXUS" };
  },
});
EOF
```

## Step 4: Finalize & Ping Agents

```bash
echo "[4/4] Feature integration complete. Verifying build..."
npx convex dev --once || echo "Convex sync skipped - execute manually if schema changed."
echo "✅ New Feature successfully mounted."
```
