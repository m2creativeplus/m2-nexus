// @ts-nocheck
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id, Doc } from "./_generated/dataModel";

// List all students with optional filters
export const list = query({
  args: {
    classId: v.optional(v.id("classes")),
    sectionId: v.optional(v.id("sections")),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q: any = ctx.db.query("students");

    if (args.classId) {
      q = q.withIndex("by_class", (q) => q.eq("classId", args.classId as Id<"classes">));
    }

    let students: Doc<"students">[] = await q.collect();

    // In-memory filtering for section and search (Convex filters coming soon for relations)
    if (args.sectionId) {
      students = students.filter((s) => s.sectionId === args.sectionId);
    }

    if (args.search) {
      const search = args.search.toLowerCase();
      students = students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(search) ||
          s.lastName.toLowerCase().includes(search) ||
          s.admissionNo.toLowerCase().includes(search)
      );
    }

    // Enrich with class and section names
    const enrichedStudents = await Promise.all(
      students.map(async (s) => {
        const cls = await ctx.db.get(s.classId);
        const section = await ctx.db.get(s.sectionId);
        return {
          ...s,
          className: (cls as any)?.name || "Unknown",
          sectionName: (section as any)?.name || "Unknown",
        };
      })
    );

    return enrichedStudents;
  },
});

// Create a new student
export const create = mutation({
  args: {
    admissionNo: v.string(),
    rollNo: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    classId: v.id("classes"),
    sectionId: v.id("sections"),
    gender: v.string(),
    dob: v.string(),
    categoryId: v.optional(v.id("categories")),
    religion: v.optional(v.string()),
    caste: v.optional(v.string()),
    mobileNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    admissionDate: v.string(),
    bloodGroup: v.optional(v.string()),
    houseId: v.optional(v.id("houses")),
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    measurementDate: v.optional(v.string()),
    fatherName: v.optional(v.string()),
    fatherPhone: v.optional(v.string()),
    fatherOccupation: v.optional(v.string()),
    motherName: v.optional(v.string()),
    motherPhone: v.optional(v.string()), 
    motherOccupation: v.optional(v.string()),
    guardianName: v.optional(v.string()),
    guardianRelation: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    guardianEmail: v.optional(v.string()),
    guardianAddress: v.optional(v.string()),
    isTransport: v.optional(v.boolean()),
    routeId: v.optional(v.id("transportRoutes")),
    vehicleId: v.optional(v.id("transportVehicles")),
    hostelId: v.optional(v.id("hostels")),
    roomNo: v.optional(v.string()),
    previousSchool: v.optional(v.string()),
    note: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check for duplicate admission number
    const existing = await ctx.db
      .query("students")
      .withIndex("by_admission_no", (q) => q.eq("admissionNo", args.admissionNo))
      .unique();

    if (existing) {
      throw new Error(`Admission Number ${args.admissionNo} already exists`);
    }

    const studentId = await ctx.db.insert("students", args);
    return studentId;
  },
});

// Update a student
export const update = mutation({
  args: {
    id: v.id("students"),
    data: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      mobileNumber: v.optional(v.string()),
      email: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
      classId: v.optional(v.id("classes")),
      sectionId: v.optional(v.id("sections")),
      rollNo: v.optional(v.string()),
      gender: v.optional(v.string()),
      dob: v.optional(v.string()),
      categoryId: v.optional(v.id("categories")),
      religion: v.optional(v.string()),
      caste: v.optional(v.string()),
      admissionDate: v.optional(v.string()),
      bloodGroup: v.optional(v.string()),
      houseId: v.optional(v.id("houses")),
      height: v.optional(v.string()),
      weight: v.optional(v.string()),
      fatherName: v.optional(v.string()),
      fatherPhone: v.optional(v.string()),
      motherName: v.optional(v.string()),
      motherPhone: v.optional(v.string()),
      guardianName: v.optional(v.string()),
      guardianPhone: v.optional(v.string()),
      isTransport: v.optional(v.boolean()),
      routeId: v.optional(v.id("transportRoutes")),
      hostelId: v.optional(v.id("hostels")),
      roomNo: v.optional(v.string()),
      previousSchool: v.optional(v.string()),
      note: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
  },
});

// Delete a student
export const remove = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
