import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all subjects
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subjects").collect();
  },
});

// Get a single subject
export const get = query({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a subject
export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(), // Theory / Practical
    code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subjects", args);
  },
});

// Update a subject
export const update = mutation({
  args: {
    id: v.id("subjects"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const updates: any = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.type !== undefined) updates.type = data.type;
    if (data.code !== undefined) updates.code = data.code;
    await ctx.db.patch(id, updates);
  },
});

// Delete a subject
export const remove = mutation({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed subjects
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("subjects").collect();
    if (existing.length > 0) return "Already seeded";

    const subjects = [
      { name: "Mathematics", type: "Theory", code: "MATH" },
      { name: "Science", type: "Theory", code: "SCI" },
      { name: "English", type: "Theory", code: "ENG" },
      { name: "Social Studies", type: "Theory", code: "SST" },
      { name: "Computer Science", type: "Practical", code: "CS" },
      { name: "Physical Education", type: "Practical", code: "PE" },
      { name: "Art", type: "Practical", code: "ART" },
      { name: "Music", type: "Practical", code: "MUS" },
    ];

    for (const subject of subjects) {
      await ctx.db.insert("subjects", subject);
    }

    return "Subjects seeded";
  },
});
