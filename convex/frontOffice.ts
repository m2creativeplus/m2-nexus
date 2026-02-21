import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ ADMISSION ENQUIRIES ============
export const listEnquiries = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let enquiries = await ctx.db.query("admissionEnquiries").collect();
    
    if (args.status) {
      enquiries = enquiries.filter((e) => e.status === args.status);
    }
    
    return enquiries.sort((a, b) => b.date.localeCompare(a.date));
  },
});

export const createEnquiry = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    description: v.optional(v.string()),
    reference: v.optional(v.string()),
    source: v.string(),
    classApplied: v.optional(v.string()),
    numberOfChild: v.optional(v.number()),
    followUpDate: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("admissionEnquiries", {
      ...args,
      status: args.status || "pending",
      date: new Date().toISOString().split("T")[0],
    });
  },
});

export const updateEnquiry = mutation({
  args: {
    id: v.id("admissionEnquiries"),
    data: v.object({
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      address: v.optional(v.string()),
      description: v.optional(v.string()),
      reference: v.optional(v.string()),
      source: v.optional(v.string()),
      classApplied: v.optional(v.string()),
      followUpDate: v.optional(v.string()),
      status: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
  },
});

export const removeEnquiry = mutation({
  args: { id: v.id("admissionEnquiries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ VISITORS ============
export const listVisitors = query({
  args: {
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let visitors = await ctx.db.query("visitors").collect();
    
    if (args.date) {
      visitors = visitors.filter((v) => v.date === args.date);
    }
    
    return visitors.sort((a, b) => b.date.localeCompare(a.date) || b.inTime.localeCompare(a.inTime));
  },
});

export const createVisitor = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    purpose: v.string(),
    toMeet: v.string(),
    idCard: v.optional(v.string()),
    inTime: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("visitors", {
      ...args,
      date: new Date().toISOString().split("T")[0],
    });
  },
});

export const updateVisitor = mutation({
  args: {
    id: v.id("visitors"),
    outTime: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeVisitor = mutation({
  args: { id: v.id("visitors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ PHONE CALLS ============
export const listCalls = query({
  args: {
    date: v.optional(v.string()),
    callType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let calls = await ctx.db.query("phoneCalls").collect();
    
    if (args.date) {
      calls = calls.filter((c) => c.date === args.date);
    }
    
    if (args.callType) {
      calls = calls.filter((c) => c.callType === args.callType);
    }
    
    return calls.sort((a, b) => b.date.localeCompare(a.date));
  },
});

export const createCall = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    callType: v.string(), // incoming, outgoing
    purpose: v.string(),
    callDuration: v.optional(v.string()),
    followUpDate: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("phoneCalls", {
      ...args,
      date: new Date().toISOString().split("T")[0],
    });
  },
});

export const removeCall = mutation({
  args: { id: v.id("phoneCalls") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ POSTAL DISPATCH ============
export const listPostal = query({
  args: {
    type: v.optional(v.string()), // dispatch, receive
  },
  handler: async (ctx, args) => {
    let postal = await ctx.db.query("postalDispatch").collect();
    
    if (args.type) {
      postal = postal.filter((p) => p.type === args.type);
    }
    
    return postal.sort((a, b) => b.date.localeCompare(a.date));
  },
});

export const createPostal = mutation({
  args: {
    type: v.string(), // dispatch, receive
    referenceNo: v.string(),
    toTitle: v.string(),
    fromTitle: v.optional(v.string()),
    address: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("postalDispatch", {
      ...args,
      date: new Date().toISOString().split("T")[0],
    });
  },
});

export const removePostal = mutation({
  args: { id: v.id("postalDispatch") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get front office statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    
    const enquiries = await ctx.db.query("admissionEnquiries").collect();
    const visitors = await ctx.db.query("visitors").collect();
    const calls = await ctx.db.query("phoneCalls").collect();
    const postal = await ctx.db.query("postalDispatch").collect();
    
    const todayVisitors = visitors.filter((v) => v.date === today);
    const pendingEnquiries = enquiries.filter((e) => e.status === "pending");
    
    return {
      totalEnquiries: enquiries.length,
      pendingEnquiries: pendingEnquiries.length,
      todayVisitors: todayVisitors.length,
      totalCalls: calls.length,
      totalPostal: postal.length,
    };
  },
});
