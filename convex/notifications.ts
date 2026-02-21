import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const limit = args.limit || 20;

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", identity.subject))
      .order("desc")
      .take(limit);

    return notifications;
  },
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_unread", (q) => 
        q.eq("recipientId", identity.subject).eq("isRead", false)
      )
      .collect();

    return unread.length;
  },
});

export const send = mutation({
  args: {
    recipientId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.optional(v.string()), // info, success, warning, error
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // In a real app, you might verify the sender has permission to send notifications
    // For now, we allow any authenticated user or internal calls to send

    await ctx.db.insert("notifications", {
      recipientId: args.recipientId,
      title: args.title,
      message: args.message,
      type: args.type || "info",
      link: args.link,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const notification = await ctx.db.get(args.id);
    if (!notification) throw new Error("Notification not found");

    if (notification.recipientId !== identity.subject) {
      throw new Error("Unauthorized to access this notification");
    }

    await ctx.db.patch(args.id, { isRead: true });
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_unread", (q) => 
        q.eq("recipientId", identity.subject).eq("isRead", false)
      )
      .collect();

    for (const n of unread) {
      await ctx.db.patch(n._id, { isRead: true });
    }
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", identity.subject))
      .collect();

    for (const n of notifications) {
      await ctx.db.delete(n._id);
    }
  },
});

// Seed some notifications for testing
export const seedDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return; // Can't seed if not logged in context

    // Check if already has notifications
    const existing = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", identity.subject))
      .first();

    if (existing) return;

    const messages = [
      { title: "Welcome to Smart School", message: "Your account has been successfully set up.", type: "success" },
      { title: "Fee Reminder", message: "Term 1 fees are due next week.", type: "warning" },
      { title: "New Assignment", message: "Math homework assigned by Mr. Smith.", type: "info" },
    ];

    for (const msg of messages) {
      await ctx.db.insert("notifications", {
        recipientId: identity.subject,
        title: msg.title,
        message: msg.message,
        type: msg.type,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
});
