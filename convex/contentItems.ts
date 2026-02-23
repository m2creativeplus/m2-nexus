import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getContentTiers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contentTiers").collect();
  },
});

export const seedContentTiers = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("contentTiers").first();
    if (existing) return "Already seeded";

    const tiers = [
      { label: "HERO", target: 15, done: 3, color: "#fbbf24" },
      { label: "HUB", target: 50, done: 0, color: "#3b82f6" },
      { label: "HYGIENE", target: 235, done: 0, color: "#8b5cf6" },
    ];

    for (const t of tiers) {
      await ctx.db.insert("contentTiers", t);
    }

    return "Seeded successfully";
  },
});
