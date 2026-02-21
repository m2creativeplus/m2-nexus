import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List active news items for the login page
export const listActive = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    
    const news = await ctx.db
      .query("news")
      .withIndex("by_publish_date")
      .order("desc")
      .filter(q => q.eq(q.field("isActive"), true))
      .take(limit);
    
    return news;
  },
});

// List all news items (admin view)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const news = await ctx.db
      .query("news")
      .withIndex("by_publish_date")
      .order("desc")
      .collect();
    
    return news;
  },
});

// Get a single news item
export const get = query({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a news item
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    publishDate: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const newsId = await ctx.db.insert("news", {
      title: args.title,
      content: args.content,
      excerpt: args.excerpt || args.content.slice(0, 100) + "...",
      publishDate: args.publishDate || new Date().toISOString().split("T")[0],
      isActive: args.isActive ?? true,
    });
    
    return newsId;
  },
});

// Update a news item
export const update = mutation({
  args: {
    id: v.id("news"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    publishDate: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const updates: any = {};
    
    if (data.title !== undefined) updates.title = data.title;
    if (data.content !== undefined) updates.content = data.content;
    if (data.excerpt !== undefined) updates.excerpt = data.excerpt;
    if (data.publishDate !== undefined) updates.publishDate = data.publishDate;
    if (data.isActive !== undefined) updates.isActive = data.isActive;
    
    await ctx.db.patch(id, updates);
  },
});

// Delete a news item
export const remove = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed sample news
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("news").collect();
    if (existing.length > 0) return "Already seeded";
    
    const sampleNews = [
      {
        title: "TEACHERS DAY",
        content: "Schools are organizing various cultural programs to celebrate Teachers Day. Students are preparing special performances to honor their teachers.",
        excerpt: "Schools are organizing various cultural programs...",
        publishDate: "2026-01-10",
        isActive: true,
      },
      {
        title: "Parents and Guardians Teacher's Meeting",
        content: "Dear parents and guardians, There will be a parent-teacher meeting on January 20th, 2026. Please attend to discuss your child's progress.",
        excerpt: "Dear parents and guardians, There...",
        publishDate: "2026-01-08",
        isActive: true,
      },
      {
        title: "Winter Term-end Exams Start",
        content: "This is to inform all students that the term-end examinations will begin from January 25th, 2026. Please prepare accordingly.",
        excerpt: "This is to inform all students that the term-end...",
        publishDate: "2026-01-05",
        isActive: true,
      },
    ];
    
    for (const item of sampleNews) {
      await ctx.db.insert("news", item);
    }
    
    return "News seeded successfully";
  },
});
