import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all sections with optional class filter
export const list = query({
  args: {
    classId: v.optional(v.id("classes")),
  },
  handler: async (ctx, args) => {
    if (args.classId) {
      return await ctx.db
        .query("sections")
        .withIndex("by_class", (q) => q.eq("classId", args.classId!))
        .collect();
    }
    return await ctx.db.query("sections").collect();
  },
});

// Get a single section
export const get = query({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a section
export const create = mutation({
  args: {
    name: v.string(),
    classId: v.id("classes"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sections", args);
  },
});

// Update a section
export const update = mutation({
  args: {
    id: v.id("sections"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Delete a section
export const remove = mutation({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
