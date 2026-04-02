import { mutation } from "./_generated/server";

/**
 * Seed test data for real-time feeds
 * Run this once to populate initial data
 */
export const seedTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing test logs
    const existingLogs = await ctx.db.query("liveLogs").collect();
    for (const log of existingLogs) {
      await ctx.db.delete(log._id);
    }

    // Add sample live logs
    const sampleLogs = [
      {
        agent: "Antigravity IDE",
        action: "Built m2-nexus frontend bundle (2.3MB)",
        type: "success" as const,
      },
      {
        agent: "DPIA Intel Unit",
        action: "Scanning 12 project deployments...",
        type: "running" as const,
      },
      {
        agent: "OpenClaw Gateway",
        action: "Failed to connect to SAIP API",
        type: "error" as const,
      },
      {
        agent: "Daily Systems Check",
        action: "Cleared 245MB temporary files",
        type: "success" as const,
      },
      {
        agent: "Antigravity IDE",
        action: "Deploying to Vercel...",
        type: "running" as const,
      },
      {
        agent: "DPIA Intel Unit",
        action: "Score: SNPA Portal 92/100",
        type: "success" as const,
      },
      {
        agent: "OpenClaw Gateway",
        action: "Retrying connection...",
        type: "info" as const,
      },
      {
        agent: "Daily Systems Check",
        action: "Git repos up to date",
        type: "success" as const,
      },
    ];

    for (const log of sampleLogs) {
      await ctx.db.insert("liveLogs", log);
    }

    // Add sample system stats
    await ctx.db.insert("systemStats", {
      cpu: 34,
      ram: 62,
      storage: 58,
    });

    return { success: true, logsAdded: sampleLogs.length };
  },
});
