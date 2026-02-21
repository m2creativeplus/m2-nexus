import { mutation, query } from "./_generated/server";
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

export const updateCategory = mutation({
  args: { id: v.id("categories"), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const removeCategory = mutation({
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

export const updateHouse = mutation({
  args: { id: v.id("houses"), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const removeHouse = mutation({
  args: { id: v.id("houses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed categories and houses
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCats = await ctx.db.query("categories").collect();
    const existingHouses = await ctx.db.query("houses").collect();

    if (existingCats.length === 0) {
      const categories = ["General", "OBC", "SC", "ST", "Other"];
      for (const name of categories) {
        await ctx.db.insert("categories", { name });
      }
    }

    if (existingHouses.length === 0) {
      const houses = ["Red House", "Blue House", "Green House", "Yellow House"];
      for (const name of houses) {
        await ctx.db.insert("houses", { name });
      }
    }

    return "Categories and houses seeded";
  },
});
