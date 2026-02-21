import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ HOSTELS ============
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hostels").collect();
  },
});

export const get = query({
  args: { id: v.id("hostels") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(), // boys, girls, combined
    address: v.optional(v.string()),
    intake: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("hostels", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("hostels"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    address: v.optional(v.string()),
    intake: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("hostels") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get hostel students
export const getHostelStudents = query({
  args: { hostelId: v.optional(v.id("hostels")) },
  handler: async (ctx, args) => {
    let students = await ctx.db.query("students").collect();
    students = students.filter((s) => s.hostelId && s.isActive);
    
    if (args.hostelId) {
      students = students.filter((s) => s.hostelId === args.hostelId);
    }
    
    // Enrich with hostel info
    const enriched = await Promise.all(
      students.map(async (s) => {
        const hostel = s.hostelId ? await ctx.db.get(s.hostelId) : null;
        return {
          _id: s._id,
          name: `${s.firstName} ${s.lastName}`,
          admissionNo: s.admissionNo,
          hostelName: hostel?.name || "Not Assigned",
          roomNo: s.roomNo || "N/A",
        };
      })
    );
    
    return enriched;
  },
});

// Seed hostel data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("hostels").collect();
    if (existing.length > 0) return "Already seeded";

    await ctx.db.insert("hostels", {
      name: "Boys Hostel",
      type: "boys",
      address: "Block A, School Campus",
      intake: 100,
    });
    
    await ctx.db.insert("hostels", {
      name: "Girls Hostel",
      type: "girls",
      address: "Block B, School Campus",
      intake: 80,
    });

    return "Hostels seeded";
  },
});
