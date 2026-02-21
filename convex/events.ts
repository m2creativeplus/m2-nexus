import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all events
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

// List events by date range (for calendar view)
export const listByRange = query({
  args: {
    start: v.string(),
    end: v.string(),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db.query("events").collect(); // Filter in memory for simplicity or add index range if needed
    
    // Simple string comparison for ISO dates
    return events.filter(e => e.startDate >= args.start && e.startDate <= args.end);
  },
});

// Create a new event
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    type: v.string(),
    audience: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args);
  },
});

// Update an event
export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    type: v.optional(v.string()),
    audience: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Delete an event
export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed some initial events
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("events").collect();
    if (existing.length > 0) return "Already seeded";

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    await ctx.db.insert("events", {
        title: "Staff Meeting",
        startDate: `${year}-${month}-05`,
        type: "activity",
        audience: "staff"
    });

    await ctx.db.insert("events", {
        title: "Parent Teacher Meeting",
        startDate: `${year}-${month}-15`,
        type: "activity",
        audience: "all"
    });

    await ctx.db.insert("events", {
        title: "Sports Day",
        startDate: `${year}-${month}-25`,
        type: "activity",
        audience: "students"
    });

    return "Events seeded";
  },
});
