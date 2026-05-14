import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackEvent = mutation({
  args: {
    project: v.string(),
    event: v.string(),
    source: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const timestamp = new Date().toISOString();
    
    // Insert into the Sovereign Event Pipeline
    const eventId = await ctx.db.insert("deploymentEvents", {
      ...args,
      timestamp,
    });
    
    return eventId;
  },
});

export const getProjectEvents = query({
  args: { 
    project: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    return await ctx.db
      .query("deploymentEvents")
      .withIndex("by_project", (q) => q.eq("project", args.project))
      .order("desc")
      .take(limit);
  },
});

export const getAggregatedMetrics = query({
  args: { project: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("deploymentEvents")
      .withIndex("by_project", (q) => q.eq("project", args.project))
      .collect();
      
    // Basic aggregation
    const totalEvents = events.length;
    const uniqueSources = new Set(events.map(e => e.source).filter(Boolean)).size;
    const eventCounts = events.reduce((acc, curr) => {
      acc[curr.event] = (acc[curr.event] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents,
      uniqueSources,
      eventCounts,
      lastActive: events.length > 0 ? events[0].timestamp : null
    };
  },
});
