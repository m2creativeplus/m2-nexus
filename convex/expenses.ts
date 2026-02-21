import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ EXPENSE HEADS ============
export const listHeads = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("expenseHeads").collect();
  },
});

export const createHead = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("expenseHeads", args);
  },
});

export const updateHead = mutation({
  args: {
    id: v.id("expenseHeads"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeHead = mutation({
  args: { id: v.id("expenseHeads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ EXPENSE RECORDS ============
export const list = query({
  args: {
    headId: v.optional(v.id("expenseHeads")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let expenses = await ctx.db.query("expenses").collect();
    
    if (args.headId) {
      expenses = expenses.filter((e) => e.headId === args.headId);
    }
    
    if (args.startDate) {
      expenses = expenses.filter((e) => e.date >= args.startDate!);
    }
    
    if (args.endDate) {
      expenses = expenses.filter((e) => e.date <= args.endDate!);
    }
    
    // Enrich with head name
    const enriched = await Promise.all(
      expenses.map(async (e) => {
        const head = await ctx.db.get(e.headId);
        return {
          ...e,
          headName: head?.name || "Unknown",
        };
      })
    );
    
    return enriched.sort((a, b) => b.date.localeCompare(a.date));
  },
});

export const get = query({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    headId: v.id("expenseHeads"),
    name: v.string(),
    invoiceNumber: v.optional(v.string()),
    date: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("expenses", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("expenses"),
    headId: v.optional(v.id("expenseHeads")),
    name: v.optional(v.string()),
    invoiceNumber: v.optional(v.string()),
    date: v.optional(v.string()),
    amount: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const updates: any = {};
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) updates[k] = v;
    });
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get expense statistics
export const getStats = query({
  args: {
    month: v.optional(v.string()), // Format: "2026-01"
  },
  handler: async (ctx, args) => {
    let expenses = await ctx.db.query("expenses").collect();
    
    if (args.month) {
      expenses = expenses.filter((e) => e.date.startsWith(args.month!));
    }
    
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Group by head
    const byHead: Record<string, number> = {};
    for (const e of expenses) {
      const head = await ctx.db.get(e.headId);
      const headName = head?.name || "Unknown";
      byHead[headName] = (byHead[headName] || 0) + e.amount;
    }
    
    return {
      total,
      count: expenses.length,
      byHead,
    };
  },
});

// Seed expense data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("expenseHeads").collect();
    if (existing.length > 0) return "Already seeded";

    // Create expense heads
    const salaryHead = await ctx.db.insert("expenseHeads", {
      name: "Staff Salaries",
      description: "Monthly staff salaries",
    });
    
    const utilityHead = await ctx.db.insert("expenseHeads", {
      name: "Utilities",
      description: "Electricity, water, internet bills",
    });
    
    const maintenanceHead = await ctx.db.insert("expenseHeads", {
      name: "Maintenance",
      description: "Building and equipment maintenance",
    });
    
    const suppliesHead = await ctx.db.insert("expenseHeads", {
      name: "Office Supplies",
      description: "Stationery and office supplies",
    });

    // Create sample expense records
    await ctx.db.insert("expenses", {
      headId: salaryHead,
      name: "January Staff Salaries",
      date: "2026-01-05",
      amount: 35000,
      description: "Monthly salaries for teaching and non-teaching staff",
    });
    
    await ctx.db.insert("expenses", {
      headId: utilityHead,
      name: "Electricity Bill",
      date: "2026-01-10",
      amount: 2500,
      description: "December electricity bill",
    });
    
    await ctx.db.insert("expenses", {
      headId: maintenanceHead,
      name: "AC Repair",
      date: "2026-01-08",
      amount: 800,
      description: "Air conditioning repair in computer lab",
    });

    return "Expenses seeded";
  },
});
