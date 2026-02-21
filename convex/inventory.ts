import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ============ CATEGORIES ============
export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("inventoryCategories").collect();
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inventoryCategories", args);
  },
});

export const removeCategory = mutation({
  args: { id: v.id("inventoryCategories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ ITEMS ============
export const listItems = query({
  args: {
    categoryId: v.optional(v.id("inventoryCategories")),
    lowStock: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("inventoryItems").collect();

    if (args.categoryId) {
      items = items.filter((i) => i.categoryId === args.categoryId);
    }

    if (args.lowStock) {
      items = items.filter((i) => i.minQuantity && i.quantity <= i.minQuantity);
    }

    // Enrich with category name
    const enriched = await Promise.all(
      items.map(async (item) => {
        const category = await ctx.db.get(item.categoryId);
        return {
          ...item,
          categoryName: category?.name || "Unknown",
        };
      })
    );

    return enriched;
  },
});

export const createItem = mutation({
  args: {
    name: v.string(),
    categoryId: v.id("inventoryCategories"),
    itemCode: v.string(),
    unit: v.string(),
    quantity: v.number(),
    minQuantity: v.optional(v.number()),
    unitPrice: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inventoryItems", args);
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("inventoryItems"),
    data: v.object({
      name: v.optional(v.string()),
      quantity: v.optional(v.number()),
      minQuantity: v.optional(v.number()),
      unitPrice: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
  },
});

export const removeItem = mutation({
  args: { id: v.id("inventoryItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ SUPPLIERS ============
export const listSuppliers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("inventorySuppliers").collect();
  },
});

export const createSupplier = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    contactPerson: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inventorySuppliers", args);
  },
});

export const removeSupplier = mutation({
  args: { id: v.id("inventorySuppliers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ ISSUES ============
export const listIssues = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let issues = await ctx.db.query("inventoryIssues").collect();

    if (args.status) {
      issues = issues.filter((i) => i.status === args.status);
    }

    // Enrich with item name
    const enriched = await Promise.all(
      issues.map(async (issue) => {
        const item = await ctx.db.get(issue.itemId);
        return {
          ...issue,
          itemName: item?.name || "Unknown",
          itemCode: item?.itemCode || "",
        };
      })
    );

    return enriched.sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  },
});

export const issueItem = mutation({
  args: {
    itemId: v.id("inventoryItems"),
    issuedTo: v.string(),
    issuedBy: v.optional(v.string()),
    quantity: v.number(),
    issueDate: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Reduce stock
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");
    if (item.quantity < args.quantity) throw new Error("Insufficient stock");

    await ctx.db.patch(args.itemId, { quantity: item.quantity - args.quantity });

    return await ctx.db.insert("inventoryIssues", {
      ...args,
      status: "issued",
    });
  },
});

export const returnItem = mutation({
  args: {
    issueId: v.id("inventoryIssues"),
    returnDate: v.string(),
  },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.issueId);
    if (!issue) throw new Error("Issue record not found");

    // Restore stock
    const item = await ctx.db.get(issue.itemId);
    if (item) {
      await ctx.db.patch(issue.itemId, { quantity: item.quantity + issue.quantity });
    }

    await ctx.db.patch(args.issueId, {
      status: "returned",
      returnDate: args.returnDate,
    });
  },
});

// ============ STATS ============
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("inventoryItems").collect();
    const categories = await ctx.db.query("inventoryCategories").collect();
    const issues = await ctx.db.query("inventoryIssues").collect();

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const lowStockCount = items.filter((i) => i.minQuantity && i.quantity <= i.minQuantity).length;
    const totalValue = items.reduce((sum, i) => sum + (i.quantity * (i.unitPrice || 0)), 0);
    const issuedCount = issues.filter((i) => i.status === "issued").length;

    return {
      totalItems,
      lowStockCount,
      totalValue,
      issuedCount,
      categoryCount: categories.length,
      itemTypeCount: items.length,
    };
  },
});

// ============ SEED ============
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("inventoryCategories").collect();
    if (existing.length > 0) return "Already seeded";

    // Categories
    const stationery = await ctx.db.insert("inventoryCategories", { name: "Stationery", description: "Office supplies and stationery items" });
    const electronics = await ctx.db.insert("inventoryCategories", { name: "Electronics", description: "Electronic equipment and devices" });
    const furniture = await ctx.db.insert("inventoryCategories", { name: "Furniture", description: "Office and classroom furniture" });
    const sports = await ctx.db.insert("inventoryCategories", { name: "Sports", description: "Sports equipment and gear" });

    // Items
    await ctx.db.insert("inventoryItems", { name: "A4 Paper Ream", categoryId: stationery, itemCode: "STN001", unit: "packs", quantity: 150, minQuantity: 20, unitPrice: 5 });
    await ctx.db.insert("inventoryItems", { name: "Whiteboard Markers", categoryId: stationery, itemCode: "STN002", unit: "boxes", quantity: 45, minQuantity: 10, unitPrice: 8 });
    await ctx.db.insert("inventoryItems", { name: "Notebooks", categoryId: stationery, itemCode: "STN003", unit: "pcs", quantity: 200, minQuantity: 50, unitPrice: 2 });
    await ctx.db.insert("inventoryItems", { name: "Projector", categoryId: electronics, itemCode: "ELC001", unit: "pcs", quantity: 8, minQuantity: 2, unitPrice: 450 });
    await ctx.db.insert("inventoryItems", { name: "Laptop", categoryId: electronics, itemCode: "ELC002", unit: "pcs", quantity: 25, minQuantity: 5, unitPrice: 800 });
    await ctx.db.insert("inventoryItems", { name: "Student Desk", categoryId: furniture, itemCode: "FRN001", unit: "pcs", quantity: 180, minQuantity: 20, unitPrice: 45 });
    await ctx.db.insert("inventoryItems", { name: "Football", categoryId: sports, itemCode: "SPT001", unit: "pcs", quantity: 15, minQuantity: 5, unitPrice: 25 });

    // Supplier
    await ctx.db.insert("inventorySuppliers", { name: "Office Depot", phone: "555-1234", email: "sales@officedepot.com", contactPerson: "John Smith" });
    await ctx.db.insert("inventorySuppliers", { name: "Tech Solutions", phone: "555-5678", email: "info@techsolutions.com", contactPerson: "Jane Doe" });

    return "Inventory seeded";
  },
});
