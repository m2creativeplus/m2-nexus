import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ EXAM GROUPS ============
export const listGroups = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("examGroups").collect();
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
    examType: v.string(), // General, GPA, CCE
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("examGroups", args);
  },
});

export const updateGroup = mutation({
  args: {
    id: v.id("examGroups"),
    name: v.optional(v.string()),
    examType: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeGroup = mutation({
  args: { id: v.id("examGroups") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ EXAMS ============
export const listExams = query({
  args: { examGroupId: v.optional(v.id("examGroups")) },
  handler: async (ctx, args) => {
    let exams = await ctx.db.query("exams").collect();
    if (args.examGroupId) {
      exams = exams.filter((e) => e.examGroupId === args.examGroupId);
    }
    
    // Enrich with exam group name
    const enriched = await Promise.all(
      exams.map(async (e) => {
        const group = await ctx.db.get(e.examGroupId);
        return {
          ...e,
          examGroupName: group?.name || "Unknown",
        };
      })
    );
    
    return enriched;
  },
});

export const createExam = mutation({
  args: {
    name: v.string(),
    examGroupId: v.id("examGroups"),
    session: v.string(),
    publishResult: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exams", {
      ...args,
      publishResult: args.publishResult ?? false,
    });
  },
});

export const updateExam = mutation({
  args: {
    id: v.id("exams"),
    name: v.optional(v.string()),
    session: v.optional(v.string()),
    publishResult: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeExam = mutation({
  args: { id: v.id("exams") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ EXAM SCHEDULE ============
export const listSchedule = query({
  args: { examId: v.optional(v.id("exams")) },
  handler: async (ctx, args) => {
    let schedule = await ctx.db.query("examSchedule").collect();
    if (args.examId) {
      schedule = schedule.filter((s) => s.examId === args.examId);
    }
    
    // Enrich with subject name
    const enriched = await Promise.all(
      schedule.map(async (s) => {
        const subject = await ctx.db.get(s.subjectId);
        return {
          ...s,
          subjectName: subject?.name || "Unknown",
        };
      })
    );
    
    return enriched;
  },
});

export const createSchedule = mutation({
  args: {
    examId: v.id("exams"),
    subjectId: v.id("subjects"),
    date: v.string(),
    startTime: v.string(),
    duration: v.string(),
    roomNo: v.optional(v.string()),
    maxMarks: v.number(),
    minMarks: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("examSchedule", args);
  },
});

export const updateSchedule = mutation({
  args: {
    id: v.id("examSchedule"),
    date: v.optional(v.string()),
    startTime: v.optional(v.string()),
    duration: v.optional(v.string()),
    roomNo: v.optional(v.string()),
    maxMarks: v.optional(v.number()),
    minMarks: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const removeSchedule = mutation({
  args: { id: v.id("examSchedule") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ============ EXAM MARKS ============
export const listMarks = query({
  args: {
    examScheduleId: v.optional(v.id("examSchedule")),
    studentId: v.optional(v.id("students")),
  },
  handler: async (ctx, args) => {
    let marks = await ctx.db.query("examMarks").collect();
    
    if (args.examScheduleId) {
      marks = marks.filter((m) => m.examScheduleId === args.examScheduleId);
    }
    
    if (args.studentId) {
      marks = marks.filter((m) => m.studentId === args.studentId);
    }
    
    // Enrich with student name
    const enriched = await Promise.all(
      marks.map(async (m) => {
        const student = await ctx.db.get(m.studentId);
        const schedule = await ctx.db.get(m.examScheduleId);
        const subject = schedule ? await ctx.db.get(schedule.subjectId) : null;
        
        return {
          ...m,
          studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
          subjectName: subject?.name || "Unknown",
          maxMarks: schedule?.maxMarks || 0,
        };
      })
    );
    
    return enriched;
  },
});

export const enterMarks = mutation({
  args: {
    examScheduleId: v.id("examSchedule"),
    studentId: v.id("students"),
    marksObtained: v.number(),
    isAbsent: v.optional(v.boolean()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for existing record
    const existing = await ctx.db
      .query("examMarks")
      .collect();
    
    const existingMark = existing.find(
      (m) => m.examScheduleId === args.examScheduleId && m.studentId === args.studentId
    );
    
    if (existingMark) {
      await ctx.db.patch(existingMark._id, {
        marksObtained: args.marksObtained,
        isAbsent: args.isAbsent ?? false,
        note: args.note,
      });
      return existingMark._id;
    } else {
      return await ctx.db.insert("examMarks", {
        examScheduleId: args.examScheduleId,
        studentId: args.studentId,
        marksObtained: args.marksObtained,
        isAbsent: args.isAbsent ?? false,
        note: args.note,
      });
    }
  },
});

export const bulkEnterMarks = mutation({
  args: {
    examScheduleId: v.id("examSchedule"),
    marks: v.array(
      v.object({
        studentId: v.id("students"),
        marksObtained: v.number(),
        isAbsent: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const mark of args.marks) {
      const existing = await ctx.db
        .query("examMarks")
        .collect();
      
      const existingMark = existing.find(
        (m) => m.examScheduleId === args.examScheduleId && m.studentId === mark.studentId
      );
      
      if (existingMark) {
        await ctx.db.patch(existingMark._id, {
          marksObtained: mark.marksObtained,
          isAbsent: mark.isAbsent ?? false,
        });
      } else {
        await ctx.db.insert("examMarks", {
          examScheduleId: args.examScheduleId,
          studentId: mark.studentId,
          marksObtained: mark.marksObtained,
          isAbsent: mark.isAbsent ?? false,
        });
      }
    }
    
    return "Marks entered";
  },
});

// Get student result for an exam
export const getStudentResult = query({
  args: {
    studentId: v.id("students"),
    examId: v.id("exams"),
  },
  handler: async (ctx, args) => {
    // Get all schedules for this exam
    const schedules = await ctx.db.query("examSchedule").collect();
    const examSchedules = schedules.filter((s) => s.examId === args.examId);
    
    // Get marks for this student in these schedules
    const allMarks = await ctx.db.query("examMarks").collect();
    const studentMarks = allMarks.filter((m) => m.studentId === args.studentId);
    
    const results = await Promise.all(
      examSchedules.map(async (schedule) => {
        const mark = studentMarks.find((m) => m.examScheduleId === schedule._id);
        const subject = await ctx.db.get(schedule.subjectId);
        
        return {
          subject: subject?.name || "Unknown",
          maxMarks: schedule.maxMarks,
          minMarks: schedule.minMarks,
          marksObtained: mark?.marksObtained || 0,
          isAbsent: mark?.isAbsent || false,
          isPassed: mark ? mark.marksObtained >= schedule.minMarks : false,
          percentage: mark ? ((mark.marksObtained / schedule.maxMarks) * 100).toFixed(1) : "0",
        };
      })
    );
    
    const totalMax = examSchedules.reduce((sum, s) => sum + s.maxMarks, 0);
    const totalObtained = results.reduce((sum, r) => sum + r.marksObtained, 0);
    
    return {
      subjects: results,
      summary: {
        totalMax,
        totalObtained,
        percentage: totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : "0",
        result: results.every((r) => r.isPassed) ? "PASS" : "FAIL",
      },
    };
  },
});

// Seed exam data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("examGroups").collect();
    if (existing.length > 0) return "Already seeded";

    // Create exam groups
    const firstTerm = await ctx.db.insert("examGroups", {
      name: "First Term Examination",
      examType: "General",
      description: "First term examinations for all classes",
    });
    
    const midTerm = await ctx.db.insert("examGroups", {
      name: "Mid Term Examination",
      examType: "General",
      description: "Mid term examinations",
    });
    
    const final = await ctx.db.insert("examGroups", {
      name: "Final Examination",
      examType: "General",
      description: "Final examinations",
    });

    // Create exams
    await ctx.db.insert("exams", {
      name: "First Term 2025-26",
      examGroupId: firstTerm,
      session: "2025-26",
      publishResult: false,
    });

    return "Examinations seeded";
  },
});
