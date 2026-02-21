import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id, Doc } from "./_generated/dataModel";

// List timetable for a specific class and section
export const list = query({
  args: {
    classId: v.optional(v.id("classes")),
    sectionId: v.optional(v.id("sections")),
  },
  handler: async (ctx, args) => {
    if (!args.classId || !args.sectionId) {
      return [];
    }

    const timetable = await ctx.db
      .query("timetables")
      .withIndex("by_class_section", (q) => 
        q.eq("classId", args.classId as Id<"classes">)
         .eq("sectionId", args.sectionId as Id<"sections">)
      )
      .collect();

    // Enrich with subject and teacher names
    const enrichedTimetable = await Promise.all(
      timetable.map(async (entry) => {
        const subject = await ctx.db.get(entry.subjectId);
        const teacher = entry.teacherId ? await ctx.db.get(entry.teacherId) : null;
        return {
          ...entry,
          subjectName: (subject as any)?.name || "Unknown",
          teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : "TBA",
        };
      })
    );

    return enrichedTimetable;
  },
});

// Add a new timetable entry
export const create = mutation({
  args: {
    classId: v.id("classes"),
    sectionId: v.id("sections"),
    day: v.string(),
    period: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    subjectId: v.id("subjects"),
    teacherId: v.optional(v.id("staff")),
    roomNo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if slot is already occupied (optional logic)
    const existing = await ctx.db
      .query("timetables")
      .withIndex("by_class_section", (q) => 
        q.eq("classId", args.classId)
         .eq("sectionId", args.sectionId)
      )
      .filter((q) => q.eq(q.field("day"), args.day))
      .filter((q) => q.eq(q.field("period"), args.period))
      .first();

    if (existing) {
      throw new Error("Time slot already occupied for this class/section");
    }

    const timetableId = await ctx.db.insert("timetables", args);
    return timetableId;
  },
});

// Remove a timetable entry
export const remove = mutation({
  args: { id: v.id("timetables") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
