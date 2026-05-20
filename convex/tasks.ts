import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * M2 TASK DISPATCHER
 * Logic for managing the sovereign task execution queue.
 */

export const createTask = mutation({
  args: {
    type: v.string(),
    description: v.string(),
    priority: v.number(),
    dependencies: v.array(v.id("tasks")),
    input: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      type: args.type,
      description: args.description,
      status: "pending",
      priority: args.priority,
      dependencies: args.dependencies ?? [],
      input: args.input,
      createdAt: Date.now(),
    });
  },
});

export const updateTaskStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.string(),
    output: v.optional(v.any()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: any = { status: args.status };
    if (args.status === "in-progress") {
      patch.startedAt = Date.now();
    }
    if (args.status === "completed" || args.status === "failed") {
      patch.completedAt = Date.now();
      if (args.output) patch.output = args.output;
      if (args.error) patch.error = args.error;
    }
    await ctx.db.patch(args.id, patch);
  },
});

export const getPendingTasks = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();
  },
});
