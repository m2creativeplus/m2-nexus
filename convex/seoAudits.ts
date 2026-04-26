import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveAudit = mutation({
  args: {
    targetUrl: v.string(),
    score: v.number(),
    passedChecks: v.array(v.number()),
    rating: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("seoAudits", {
      targetUrl: args.targetUrl,
      score: args.score,
      passedChecks: args.passedChecks,
      rating: args.rating,
      timestamp: new Date().toISOString(),
    });
  },
});

export const getAudits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("seoAudits").order("desc").take(50);
  },
});
