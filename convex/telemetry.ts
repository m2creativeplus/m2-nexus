import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const log = mutation({
  args: {
    projectId: v.optional(v.id("nexusProjects")),
    projectName: v.optional(v.string()),
    agent: v.string(),
    action: v.string(),
    message: v.string(),
    type: v.string(),
    mistake: v.optional(v.string()),
    solution: v.optional(v.string()),
    enforcedRule: v.optional(v.string()),
    timeWastedMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("aiTelemetryLogs", {
      ...args,
      timestamp: new Date().toISOString(),
    });
    return logId;
  },
});

export const getLatestFull = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiTelemetryLogs")
      .order("desc")
      .take(args.limit);
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const logs = await ctx.db.query("aiTelemetryLogs").collect();
    
    const mistakes = logs.filter(l => l.type === "mistake");
    const totalWasted = mistakes.reduce((acc, l) => acc + (l.timeWastedMinutes || 0), 0);
    
    return {
      totalLogs: logs.length,
      mistakeCount: mistakes.length,
      totalTimeWastedStr: `${totalWasted} Minutes`,
      recentMistake: mistakes[mistakes.length - 1],
    };
  },
});
