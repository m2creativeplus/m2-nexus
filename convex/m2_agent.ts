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
  },
});

// ==========================================
// AGENT TASK QUEUE
// ==========================================

export const getPendingTask = query({
  args: { agentName: v.string() },
  handler: async (ctx, args) => {
    const task = await ctx.db
      .query("agentTasks")
      .withIndex("by_status", (q) => q.eq("status", "PENDING"))
      .filter((q) => q.eq(q.field("assignedAgent"), args.agentName))
      .first();

    if (task) {
      // We can't mutate in a query, but the HTTP action could trigger a mutation
      // Alternatively, the python agent handles "IN_PROGRESS" transition.
      return task;
    }
    return null;
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    payload: v.any(),
    assignedAgent: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentTasks", {
      title: args.title,
      status: "PENDING",
      assignedAgent: args.assignedAgent,
      payload: args.payload,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("agentTasks"),
    status: v.union(v.literal("PENDING"), v.literal("IN_PROGRESS"), v.literal("COMPLETED"), v.literal("FAILED")),
    result: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      status: args.status,
      result: args.result,
      updatedAt: Date.now(),
    });

    // Also push a live log so the UI sees it
    await ctx.db.insert("liveLogs", {
      agent: "m2-content-engine", // Could be dynamic based on task
      action: `Task ${args.status}: ${args.taskId}`,
      type: args.status === "COMPLETED" ? "success" : args.status === "FAILED" ? "error" : "running",
    });
  },
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
