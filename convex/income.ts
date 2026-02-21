import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ INCOME HEADS ============
export const listHeads = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("incomeHeads").collect();
  },
});

export const createHead = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("incomeHeads", args);
  },
});

export const updateHead = mutation({
  args: {
    id: v.id("incomeHeads"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeHead = mutation({
  args: { id: v.id("incomeHeads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ INCOME RECORDS ============
export const list = query({
  args: {
    headId: v.optional(v.id("incomeHeads")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let income = await ctx.db.query("income").order("desc").collect();

    if (args.headId) {
      income = income.filter((i) => i.headId === args.headId);
    }

    if (args.startDate) {
      income = income.filter((i) => i.date >= args.startDate!);
    }

    if (args.endDate) {
      income = income.filter((i) => i.date <= args.endDate!);
    }

    // Enrich with head names
    const enriched = await Promise.all(
      income.map(async (i) => {
        const head = await ctx.db.get(i.headId);
        return {
          ...i,
          headName: head?.name || "Unknown",
        };
      })
    );

    return enriched;
  },
});

export const getById = query({
  args: { id: v.id("income") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    headId: v.id("incomeHeads"),
    name: v.string(),
    invoiceNumber: v.optional(v.string()),
    date: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    document: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("income", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("income"),
    headId: v.optional(v.id("incomeHeads")),
    name: v.optional(v.string()),
    invoiceNumber: v.optional(v.string()),
    date: v.optional(v.string()),
    amount: v.optional(v.number()),
    description: v.optional(v.string()),
    document: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("income") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ STATISTICS ============
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const income = await ctx.db.query("income").collect();
    const heads = await ctx.db.query("incomeHeads").collect();

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);

    // Group by head
    const byHead = heads.map((h) => ({
      name: h.name,
      total: income
        .filter((i) => i.headId === h._id)
        .reduce((sum, i) => sum + i.amount, 0),
    }));

    // This month's income
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const thisMonthIncome = income
      .filter((i) => i.date.startsWith(thisMonth))
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      totalIncome,
      thisMonthIncome,
      recordCount: income.length,
      byHead,
    };
  },
});

// ============ SEED DATA ============
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingHeads = await ctx.db.query("incomeHeads").collect();
    if (existingHeads.length > 0) return "Already seeded";

    // Create income heads
    const feeCollection = await ctx.db.insert("incomeHeads", {
      name: "Fee Collection",
      description: "Income from student fees",
    });

    const donations = await ctx.db.insert("incomeHeads", {
      name: "Donations",
      description: "Donations and grants",
    });

    const events = await ctx.db.insert("incomeHeads", {
      name: "Events",
      description: "Income from school events",
    });

    const canteen = await ctx.db.insert("incomeHeads", {
      name: "Canteen",
      description: "Canteen sales income",
    });

    // Create sample income records
    await ctx.db.insert("income", {
      headId: feeCollection,
      name: "January Fees - Class 10",
      invoiceNumber: "INV-2026-001",
      date: "2026-01-05",
      amount: 125000,
      description: "Bulk fee collection for 25 students",
    });

    await ctx.db.insert("income", {
      headId: donations,
      name: "Alumni Association Grant",
      invoiceNumber: "DON-2026-001",
      date: "2026-01-10",
      amount: 50000,
      description: "Annual contribution from alumni",
    });

    await ctx.db.insert("income", {
      headId: events,
      name: "Annual Day Ticket Sales",
      invoiceNumber: "EVT-2026-001",
      date: "2026-01-12",
      amount: 15000,
      description: "Ticket sales for annual function",
    });

    await ctx.db.insert("income", {
      headId: canteen,
      name: "Canteen Weekly Revenue",
      date: "2026-01-15",
      amount: 8500,
      description: "Week 2 canteen sales",
    });

    return "Income data seeded successfully";
  },
});
