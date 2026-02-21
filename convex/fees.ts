import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ FEE GROUPS ============
export const listGroups = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("feeGroups").collect();
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feeGroups", args);
  },
});

export const updateGroup = mutation({
  args: {
    id: v.id("feeGroups"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeGroup = mutation({
  args: { id: v.id("feeGroups") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ FEE TYPES ============
export const listTypes = query({
  args: { feeGroupId: v.optional(v.id("feeGroups")) },
  handler: async (ctx, args) => {
    let types = await ctx.db.query("feeTypes").collect();
    if (args.feeGroupId) {
      types = types.filter((t) => t.feeGroupId === args.feeGroupId);
    }
    return types;
  },
});

export const createType = mutation({
  args: {
    feeGroupId: v.id("feeGroups"),
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feeTypes", args);
  },
});

export const updateType = mutation({
  args: {
    id: v.id("feeTypes"),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeType = mutation({
  args: { id: v.id("feeTypes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ FEE MASTERS ============
export const listMasters = query({
  args: {},
  handler: async (ctx) => {
    const masters = await ctx.db.query("feeMasters").collect();
    
    // Enrich with related data
    const enriched = await Promise.all(
      masters.map(async (m) => {
        const feeGroup = await ctx.db.get(m.feeGroupId);
        const feeType = await ctx.db.get(m.feeTypeId);
        return {
          ...m,
          feeGroupName: feeGroup?.name || "Unknown",
          feeTypeName: feeType?.name || "Unknown",
        };
      })
    );
    
    return enriched;
  },
});

export const createMaster = mutation({
  args: {
    feeGroupId: v.id("feeGroups"),
    feeTypeId: v.id("feeTypes"),
    dueDate: v.string(),
    amount: v.number(),
    fineType: v.optional(v.string()),
    fineAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feeMasters", args);
  },
});

export const updateMaster = mutation({
  args: {
    id: v.id("feeMasters"),
    dueDate: v.optional(v.string()),
    amount: v.optional(v.number()),
    fineType: v.optional(v.string()),
    fineAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeMaster = mutation({
  args: { id: v.id("feeMasters") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ STUDENT FEES ============
export const listStudentFees = query({
  args: {
    studentId: v.optional(v.id("students")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let fees = await ctx.db.query("studentFees").collect();
    
    if (args.studentId) {
      fees = fees.filter((f) => f.studentId === args.studentId);
    }
    
    if (args.status) {
      fees = fees.filter((f) => f.status === args.status);
    }
    
    // Enrich with student and fee master data
    const enriched = await Promise.all(
      fees.map(async (f) => {
        const student = await ctx.db.get(f.studentId);
        const feeMaster = await ctx.db.get(f.feeMasterId);
        return {
          ...f,
          studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
          admissionNo: student?.admissionNo || "",
        };
      })
    );
    
    return enriched;
  },
});

export const collectFee = mutation({
  args: {
    studentId: v.id("students"),
    feeMasterId: v.id("feeMasters"),
    amountPaid: v.number(),
    paymentMode: v.string(),
    transactionId: v.optional(v.string()),
    discount: v.optional(v.number()),
    fine: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get fee master to check amount
    const feeMaster = await ctx.db.get(args.feeMasterId);
    if (!feeMaster) throw new Error("Fee master not found");
    
    const totalDue = feeMaster.amount - (args.discount || 0) + (args.fine || 0);
    const status = args.amountPaid >= totalDue ? "paid" : "partial";
    
    // Check if student fee record exists
    const existing = await ctx.db
      .query("studentFees")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();
    
    const existingFee = existing.find((f) => f.feeMasterId === args.feeMasterId);
    
    if (existingFee) {
      // Update existing record
      const newAmountPaid = existingFee.amountPaid + args.amountPaid;
      const newStatus = newAmountPaid >= totalDue ? "paid" : "partial";
      
      await ctx.db.patch(existingFee._id, {
        amountPaid: newAmountPaid,
        status: newStatus,
        paymentMode: args.paymentMode,
        transactionId: args.transactionId,
        paymentDate: new Date().toISOString().split("T")[0],
        isPaid: newStatus === "paid",
      });
      
      return existingFee._id;
    } else {
      // Create new record
      return await ctx.db.insert("studentFees", {
        studentId: args.studentId,
        feeMasterId: args.feeMasterId,
        amountPaid: args.amountPaid,
        status,
        paymentMode: args.paymentMode,
        transactionId: args.transactionId,
        paymentDate: new Date().toISOString().split("T")[0],
        discount: args.discount,
        fine: args.fine,
        isPaid: status === "paid",
      });
    }
  },
});

// Get fee statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const fees = await ctx.db.query("studentFees").collect();
    const masters = await ctx.db.query("feeMasters").collect();
    
    const totalCollected = fees.reduce((sum, f) => sum + f.amountPaid, 0);
    const paidCount = fees.filter((f) => f.status === "paid").length;
    const pendingCount = fees.filter((f) => f.status !== "paid").length;
    
    return {
      totalCollected,
      paidCount,
      pendingCount,
      totalRecords: fees.length,
    };
  },
});

// Seed fee data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingGroups = await ctx.db.query("feeGroups").collect();
    if (existingGroups.length > 0) return "Already seeded";

    // Create fee groups
    const tuitionGroup = await ctx.db.insert("feeGroups", {
      name: "Class 10 Tuition",
      description: "Tuition fees for Class 10",
    });
    
    const transportGroup = await ctx.db.insert("feeGroups", {
      name: "Transport Fees",
      description: "School bus transport fees",
    });

    // Create fee types
    const tuitionType = await ctx.db.insert("feeTypes", {
      feeGroupId: tuitionGroup,
      name: "Monthly Tuition",
      code: "TUI",
      description: "Monthly tuition fee",
    });
    
    const transportType = await ctx.db.insert("feeTypes", {
      feeGroupId: transportGroup,
      name: "Bus Fee",
      code: "BUS",
      description: "Monthly bus fee",
    });

    // Create fee masters
    await ctx.db.insert("feeMasters", {
      feeGroupId: tuitionGroup,
      feeTypeId: tuitionType,
      dueDate: "2026-01-15",
      amount: 5000,
      fineType: "Fixed",
      fineAmount: 100,
    });

    await ctx.db.insert("feeMasters", {
      feeGroupId: transportGroup,
      feeTypeId: transportType,
      dueDate: "2026-01-15",
      amount: 1500,
      fineType: "None",
    });

    return "Fees seeded";
  },
});
