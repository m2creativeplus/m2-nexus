import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// List staff with optional filters
export const list = query({
  args: {
    role: v.optional(v.string()),
    department: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let staff = await ctx.db.query("staff").collect();

    // Filter by role
    if (args.role) {
      staff = staff.filter((s) => s.role === args.role);
    }

    // Filter by department
    if (args.department) {
      staff = staff.filter((s) => s.department === args.department);
    }

    // Search by name
    if (args.search) {
      const search = args.search.toLowerCase();
      staff = staff.filter(
        (s) =>
          s.firstName.toLowerCase().includes(search) ||
          s.lastName.toLowerCase().includes(search) ||
          s.staffId.toLowerCase().includes(search)
      );
    }

    // Limit results
    if (args.limit && staff.length > args.limit) {
      staff = staff.slice(0, args.limit);
    }

    return staff;
  },
});

// Get a single staff member
export const get = query({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get staff by staffId
export const getByStaffId = query({
  args: { staffId: v.string() },
  handler: async (ctx, args) => {
    const staff = await ctx.db.query("staff").collect();
    return staff.find((s) => s.staffId === args.staffId) || null;
  },
});

// Create staff member
export const create = mutation({
  args: {
    staffId: v.string(),
    role: v.string(),
    designation: v.optional(v.string()),
    department: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    gender: v.string(),
    dob: v.string(),
    dateOfJoining: v.string(),
    phone: v.optional(v.string()),
    photo: v.optional(v.string()),
    qualification: v.optional(v.string()),
    basicSalary: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("staff", {
      ...args,
      isActive: args.isActive ?? true,
    });
  },
});

// Update staff member
export const update = mutation({
  args: {
    id: v.id("staff"),
    data: v.object({
      role: v.optional(v.string()),
      designation: v.optional(v.string()),
      department: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      photo: v.optional(v.string()),
      qualification: v.optional(v.string()),
      basicSalary: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
  },
});

// Delete staff member
export const remove = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get staff statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const staff = await ctx.db.query("staff").collect();
    const active = staff.filter((s) => s.isActive);

    const byRole: Record<string, number> = {};
    for (const s of active) {
      byRole[s.role] = (byRole[s.role] || 0) + 1;
    }

    const totalSalary = active.reduce((sum, s) => sum + (s.basicSalary || 0), 0);

    return {
      total: staff.length,
      active: active.length,
      inactive: staff.length - active.length,
      byRole,
      totalSalary,
    };
  },
});

// Seed staff data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("staff").collect();
    if (existing.length > 0) return "Already seeded";

    const staffData = [
      { staffId: "STF001", firstName: "James", lastName: "Wilson", role: "Admin", department: "Administration", email: "james@school.com", gender: "Male", dob: "1980-05-15", dateOfJoining: "2015-01-10", phone: "9876543210", basicSalary: 8000, designation: "Principal", isActive: true },
      { staffId: "STF002", firstName: "Sarah", lastName: "Miller", role: "Admin", department: "Administration", email: "sarah@school.com", gender: "Female", dob: "1985-03-20", dateOfJoining: "2016-03-15", phone: "9876543211", basicSalary: 6000, designation: "Vice Principal", isActive: true },
      { staffId: "STF003", firstName: "Robert", lastName: "Brown", role: "Teacher", department: "Mathematics", email: "robert@school.com", gender: "Male", dob: "1990-06-10", dateOfJoining: "2018-06-20", phone: "9876543212", basicSalary: 4000, designation: "Senior Teacher", isActive: true },
      { staffId: "STF004", firstName: "Emily", lastName: "Davis", role: "Teacher", department: "Science", email: "emily@school.com", gender: "Female", dob: "1992-08-25", dateOfJoining: "2019-08-01", phone: "9876543213", basicSalary: 4000, designation: "Teacher", isActive: true },
      { staffId: "STF005", firstName: "Michael", lastName: "Garcia", role: "Teacher", department: "English", email: "michael@school.com", gender: "Male", dob: "1988-01-05", dateOfJoining: "2020-01-15", phone: "9876543214", basicSalary: 3800, designation: "Teacher", isActive: true },
      { staffId: "STF006", firstName: "Lisa", lastName: "Anderson", role: "Accountant", department: "Finance", email: "lisa@school.com", gender: "Female", dob: "1987-04-12", dateOfJoining: "2017-04-10", phone: "9876543215", basicSalary: 3500, designation: "Accountant", isActive: true },
      { staffId: "STF007", firstName: "David", lastName: "Lee", role: "Librarian", department: "Library", email: "david@school.com", gender: "Male", dob: "1991-09-18", dateOfJoining: "2019-09-01", phone: "9876543216", basicSalary: 2800, designation: "Librarian", isActive: true },
      { staffId: "STF008", firstName: "Jennifer", lastName: "Martinez", role: "Receptionist", department: "Front Office", email: "jennifer@school.com", gender: "Female", dob: "1995-02-28", dateOfJoining: "2021-02-20", phone: "9876543217", basicSalary: 2500, designation: "Receptionist", isActive: true },
    ];

    for (const staff of staffData) {
      await ctx.db.insert("staff", staff);
    }

    return "Staff seeded";
  },
});
