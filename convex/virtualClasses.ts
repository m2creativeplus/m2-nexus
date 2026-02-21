import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List classes
export const list = query({
  args: {
    classId: v.optional(v.id("classes")),
    teacherId: v.optional(v.id("staff")),
    status: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let classes = await ctx.db.query("virtualClasses").collect();

    // Filters
    if (args.classId) {
      classes = classes.filter(c => c.classId === args.classId);
    }
    if (args.teacherId) {
      classes = classes.filter(c => c.teacherId === args.teacherId);
    }
    if (args.status) {
      classes = classes.filter(c => c.status === args.status);
    }

    // Enrich
    const enriched = await Promise.all(
      classes.map(async (c) => {
        const cls = c.classId ? await ctx.db.get(c.classId) : null;
        const section = c.sectionId ? await ctx.db.get(c.sectionId) : null;
        const subject = c.subjectId ? await ctx.db.get(c.subjectId) : null;
        const teacher = await ctx.db.get(c.teacherId);

        return {
          ...c,
          className: cls ? cls.name : "All Classes",
          sectionName: section ? section.name : "",
          subjectName: subject ? subject.name : "General",
          teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown",
        };
      })
    );

    // Sort: Live first, then Scheduled by date
    return enriched.sort((a, b) => {
      if (a.status === "live" && b.status !== "live") return -1;
      if (b.status === "live" && a.status !== "live") return 1;
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    });
  },
});

// Create class
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    classId: v.optional(v.id("classes")),
    sectionId: v.optional(v.id("sections")),
    subjectId: v.optional(v.id("subjects")),
    teacherId: v.id("staff"),
    scheduledAt: v.string(),
    duration: v.string(),
    platform: v.string(),
    meetingId: v.optional(v.string()),
    joinUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const meetingId = args.meetingId || `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const joinUrl = args.joinUrl || (args.platform === "jitsi" ? `https://meet.jit.si/smartschool-${meetingId}` : "");

    return await ctx.db.insert("virtualClasses", {
      ...args,
      meetingId,
      joinUrl,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    });
  },
});

// Update Status
export const updateStatus = mutation({
  args: {
    id: v.id("virtualClasses"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Delete
export const remove = mutation({
  args: { id: v.id("virtualClasses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get Stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("virtualClasses").collect();
    const today = new Date().toISOString().split("T")[0];
    
    return {
      total: all.length,
      upcoming: all.filter(c => c.status === "scheduled").length,
      live: all.filter(c => c.status === "live").length,
      todayCount: all.filter(c => c.scheduledAt.startsWith(today)).length,
    };
  },
});
