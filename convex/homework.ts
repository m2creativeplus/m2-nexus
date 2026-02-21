import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ============ HOMEWORK ============
export const list = query({
  args: {
    classId: v.optional(v.id("classes")),
    subjectId: v.optional(v.id("subjects")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let homework = await ctx.db.query("homework").collect();

    if (args.classId) {
      homework = homework.filter((h) => h.classId === args.classId);
    }
    if (args.subjectId) {
      homework = homework.filter((h) => h.subjectId === args.subjectId);
    }
    if (args.status) {
      homework = homework.filter((h) => h.status === args.status);
    }

    // Enrich with class and subject names
    const enriched = await Promise.all(
      homework.map(async (h) => {
        const cls = await ctx.db.get(h.classId);
        const subject = await ctx.db.get(h.subjectId);
        const section = h.sectionId ? await ctx.db.get(h.sectionId) : null;
        const teacher = h.assignedBy ? await ctx.db.get(h.assignedBy) : null;
        
        // Count submissions
        const submissions = await ctx.db
          .query("homeworkSubmissions")
          .withIndex("by_homework", (q) => q.eq("homeworkId", h._id))
          .collect();

        return {
          ...h,
          className: cls?.name || "Unknown",
          sectionName: section?.name || "All",
          subjectName: subject?.name || "Unknown",
          teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown",
          submissionCount: submissions.length,
          evaluatedCount: submissions.filter((s) => s.status === "evaluated").length,
        };
      })
    );

    return enriched.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  },
});

export const get = query({
  args: { id: v.id("homework") },
  handler: async (ctx, args) => {
    const homework = await ctx.db.get(args.id);
    if (!homework) return null;

    const cls = await ctx.db.get(homework.classId);
    const subject = await ctx.db.get(homework.subjectId);
    const section = homework.sectionId ? await ctx.db.get(homework.sectionId) : null;

    return {
      ...homework,
      className: cls?.name || "Unknown",
      sectionName: section?.name || "All",
      subjectName: subject?.name || "Unknown",
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    classId: v.id("classes"),
    sectionId: v.optional(v.id("sections")),
    subjectId: v.id("subjects"),
    assignedBy: v.optional(v.id("staff")),
    assignDate: v.string(),
    dueDate: v.string(),
    maxMarks: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("homework", {
      ...args,
      status: "active",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("homework"),
    data: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      dueDate: v.optional(v.string()),
      maxMarks: v.optional(v.number()),
      status: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
  },
});

export const remove = mutation({
  args: { id: v.id("homework") },
  handler: async (ctx, args) => {
    // Delete all submissions first
    const submissions = await ctx.db
      .query("homeworkSubmissions")
      .withIndex("by_homework", (q) => q.eq("homeworkId", args.id))
      .collect();
    
    for (const sub of submissions) {
      await ctx.db.delete(sub._id);
    }
    
    await ctx.db.delete(args.id);
  },
});

// ============ SUBMISSIONS ============
export const listSubmissions = query({
  args: { homeworkId: v.id("homework") },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("homeworkSubmissions")
      .withIndex("by_homework", (q) => q.eq("homeworkId", args.homeworkId))
      .collect();

    const enriched = await Promise.all(
      submissions.map(async (s) => {
        const student = await ctx.db.get(s.studentId);
        return {
          ...s,
          studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
          admissionNo: student?.admissionNo || "",
        };
      })
    );

    return enriched;
  },
});

export const submitHomework = mutation({
  args: {
    homeworkId: v.id("homework"),
    studentId: v.id("students"),
    attachmentUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const homework = await ctx.db.get(args.homeworkId);
    if (!homework) throw new Error("Homework not found");

    const now = new Date().toISOString();
    const isLate = now > homework.dueDate;

    return await ctx.db.insert("homeworkSubmissions", {
      ...args,
      submittedAt: now,
      status: isLate ? "late" : "submitted",
    });
  },
});

export const evaluateSubmission = mutation({
  args: {
    id: v.id("homeworkSubmissions"),
    marks: v.number(),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      marks: args.marks,
      feedback: args.feedback,
      status: "evaluated",
    });
  },
});

// ============ STATS ============
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const homework = await ctx.db.query("homework").collect();
    const submissions = await ctx.db.query("homeworkSubmissions").collect();

    const today = new Date().toISOString().split("T")[0];
    
    return {
      totalHomework: homework.length,
      activeHomework: homework.filter((h) => h.status === "active").length,
      dueToday: homework.filter((h) => h.dueDate === today).length,
      totalSubmissions: submissions.length,
      pendingEvaluation: submissions.filter((s) => s.status === "submitted" || s.status === "late").length,
    };
  },
});

// ============ SEED ============
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("homework").collect();
    if (existing.length > 0) return "Already seeded";

    // Get first class and subject
    const cls = await ctx.db.query("classes").first();
    const subject = await ctx.db.query("subjects").first();
    
    if (!cls || !subject) return "No classes or subjects to seed homework";

    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    await ctx.db.insert("homework", {
      title: "Chapter 5 Exercise",
      description: "Complete all exercises from Chapter 5 of the textbook",
      classId: cls._id,
      subjectId: subject._id,
      assignDate: today,
      dueDate: nextWeek,
      maxMarks: 20,
      status: "active",
    });

    await ctx.db.insert("homework", {
      title: "Essay Writing",
      description: "Write an essay on 'My Country' (500 words minimum)",
      classId: cls._id,
      subjectId: subject._id,
      assignDate: today,
      dueDate: nextWeek,
      maxMarks: 50,
      status: "active",
    });

    return "Homework seeded";
  },
});
