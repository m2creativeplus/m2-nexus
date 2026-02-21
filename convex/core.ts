import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ CATEGORIES ============
export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const createCategory = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", { name: args.name });
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ HOUSES ============
export const listHouses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("houses").collect();
  },
});

export const createHouse = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("houses", { name: args.name });
  },
});

export const deleteHouse = mutation({
  args: { id: v.id("houses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ SESSIONS ============
export const listSessions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sessions").collect();
  },
});

export const getCurrentSession = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").collect();
    return sessions.find(s => s.isCurrent) || sessions[0] || null;
  },
});

export const createSession = mutation({
  args: { 
    name: v.string(), 
    startDate: v.string(), 
    endDate: v.string(),
    isCurrent: v.boolean()
  },
  handler: async (ctx, args) => {
    // If this is current, unset others
    if (args.isCurrent) {
      const existing = await ctx.db.query("sessions").collect();
      for (const s of existing) {
        if (s.isCurrent) {
          await ctx.db.patch(s._id, { isCurrent: false });
        }
      }
    }
    return await ctx.db.insert("sessions", args);
  },
});

export const setCurrentSession = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("sessions").collect();
    for (const s of existing) {
      await ctx.db.patch(s._id, { isCurrent: s._id === args.id });
    }
  },
});

// ============ USERS ============
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      isActive: true,
    });
  },
});

export const updateUserRole = mutation({
  args: { id: v.id("users"), role: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { role: args.role });
  },
});
