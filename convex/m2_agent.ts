import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ==========================================
// SYSTEM STATS (CPU, RAM, STORAGE)
// ==========================================

export const getSystemStats = query({
  args: {},
  handler: async (ctx) => {
    // In a full production app, the backend mac daemon pushes this to Convex.
    // We return the most recent status, or a default baseline.
    const stats = await ctx.db.query("systemStats").order("desc").first();
    
    // Auto-generate some safe baseline data if empty (for UI testing)
    if (!stats) {
      return { cpu: 22, ram: 51, storage: 68 };
    }
    return stats;
  },
});

export const updateSystemStats = mutation({
  args: { cpu: v.number(), ram: v.number(), storage: v.number() },
  handler: async (ctx, args) => {
    // Allows the local MacBook execution scripts to sync live usage to Convex
    await ctx.db.insert("systemStats", {
      cpu: args.cpu,
      ram: args.ram,
      storage: args.storage,
    });
  }
});


// ==========================================
// AGENT LIVE LOGS
// ==========================================

export const getLogs = query({
  args: {},
  handler: async (ctx) => {
    // Return the 10 most recent agent execution logs globally
    return await ctx.db
      .query("liveLogs")
      .order("desc")
      .take(10);
  },
});

export const createLog = mutation({
  args: { 
    agent: v.string(), 
    action: v.string(), 
    type: v.string() // "info" | "success" | "error" | "running"
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("liveLogs", {
      agent: args.agent,
      action: args.action,
      type: args.type,
    });
  }
});
