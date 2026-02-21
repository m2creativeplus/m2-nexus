import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Default settings values
const defaultSettings: Record<string, { value: string; category: string }> = {
  schoolName: { value: "Smart School", category: "school" },
  schoolAddress: { value: "", category: "school" },
  schoolPhone: { value: "", category: "school" },
  schoolEmail: { value: "", category: "school" },
  schoolWebsite: { value: "", category: "school" },
  currentSession: { value: "2025-26", category: "session" },
  sessionStartMonth: { value: "April", category: "session" },
  sessionEndMonth: { value: "March", category: "session" },
  language: { value: "English", category: "general" },
  timezone: { value: "UTC+0:00", category: "general" },
  dateFormat: { value: "YYYY-MM-DD", category: "general" },
  currency: { value: "USD", category: "general" },
  currencySymbol: { value: "$", category: "general" },
};

// Get all settings as an object
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("systemSettings").collect();
    
    // Build settings object with defaults
    const result: Record<string, string> = {};
    for (const [key, def] of Object.entries(defaultSettings)) {
      const found = settings.find(s => s.key === key);
      result[key] = found?.value || def.value;
    }
    
    return result;
  },
});

// Get a single setting by key
export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("systemSettings")
      .withIndex("by_key", q => q.eq("key", args.key))
      .first();
    
    if (setting) {
      return setting.value;
    }
    
    return defaultSettings[args.key]?.value || null;
  },
});

// Update a single setting
export const set = mutation({
  args: {
    key: v.string(),
    value: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("systemSettings")
      .withIndex("by_key", q => q.eq("key", args.key))
      .first();
    
    const category = args.category || defaultSettings[args.key]?.category || "general";
    
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("systemSettings", {
        key: args.key,
        value: args.value,
        category,
      });
    }
  },
});

// Bulk update multiple settings
export const updateMultiple = mutation({
  args: {
    settings: v.array(v.object({
      key: v.string(),
      value: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    for (const setting of args.settings) {
      const existing = await ctx.db
        .query("systemSettings")
        .withIndex("by_key", q => q.eq("key", setting.key))
        .first();
      
      const category = defaultSettings[setting.key]?.category || "general";
      
      if (existing) {
        await ctx.db.patch(existing._id, { value: setting.value });
      } else {
        await ctx.db.insert("systemSettings", {
          key: setting.key,
          value: setting.value,
          category,
        });
      }
    }
  },
});

// Initialize default settings
export const initDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("systemSettings").collect();
    
    for (const [key, def] of Object.entries(defaultSettings)) {
      const alreadyExists = existing.some(s => s.key === key);
      if (!alreadyExists) {
        await ctx.db.insert("systemSettings", {
          key,
          value: def.value,
          category: def.category,
        });
      }
    }
    
    return "Settings initialized";
  },
});
