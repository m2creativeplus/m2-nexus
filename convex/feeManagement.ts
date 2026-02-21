import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ FEE GROUPS ============
export const listFeeGroups = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("feeGroups").collect();
  },
});

export const createFeeGroup = mutation({
  args: { 
    name: v.string(), 
    description: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feeGroups", args);
  },
});

export const deleteFeeGroup = mutation({
  args: { id: v.id("feeGroups") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ FEE TYPES ============
export const listFeeTypes = query({
  args: {},
  handler: async (ctx) => {
    const feeTypes = await ctx.db.query("feeTypes").collect();
    const feeGroups = await ctx.db.query("feeGroups").collect();
    
    return feeTypes.map(ft => ({
      ...ft,
      feeGroup: feeGroups.find(fg => fg._id === ft.feeGroupId),
    }));
  },
});

export const createFeeType = mutation({
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

export const deleteFeeType = mutation({
  args: { id: v.id("feeTypes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ FEE MASTERS ============
export const listFeeMasters = query({
  args: {},
  handler: async (ctx) => {
    const masters = await ctx.db.query("feeMasters").collect();
    const feeGroups = await ctx.db.query("feeGroups").collect();
    const feeTypes = await ctx.db.query("feeTypes").collect();
    
    return masters.map(m => ({
      ...m,
      feeGroup: feeGroups.find(fg => fg._id === m.feeGroupId),
      feeType: feeTypes.find(ft => ft._id === m.feeTypeId),
    }));
  },
});

export const createFeeMaster = mutation({
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

export const deleteFeeMaster = mutation({
  args: { id: v.id("feeMasters") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ STUDENT FEES ============
export const listStudentFees = query({
  args: { studentId: v.optional(v.id("students")) },
  handler: async (ctx, args) => {
    if (args.studentId) {
      return await ctx.db
        .query("studentFees")
        .withIndex("by_student", (q) => q.eq("studentId", args.studentId!))
        .collect();
    }
    return await ctx.db.query("studentFees").collect();
  },
});

export const assignFeeToStudent = mutation({
  args: {
    studentId: v.id("students"),
    feeMasterId: v.id("feeMasters"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("studentFees", {
      studentId: args.studentId,
      feeMasterId: args.feeMasterId,
      isPaid: false,
      status: "unpaid",
      amountPaid: 0,
    });
  },
});

export const updateStudentFeePayment = mutation({
  args: {
    id: v.id("studentFees"),
    amountPaid: v.number(),
    paymentMode: v.string(),
    transactionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const fee = await ctx.db.get(args.id);
    if (!fee) throw new Error("Fee not found");
    
    const master = await ctx.db.get(fee.feeMasterId);
    const totalOwed = master?.amount || 0;
    const newTotal = fee.amountPaid + args.amountPaid;
    
    await ctx.db.patch(args.id, {
      amountPaid: newTotal,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: args.paymentMode,
      transactionId: args.transactionId,
      isPaid: newTotal >= totalOwed,
      status: newTotal >= totalOwed ? "paid" : newTotal > 0 ? "partial" : "unpaid",
    });
  },
});
