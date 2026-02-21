import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ STAFF ATTENDANCE ============
export const listStaffAttendance = query({
  args: { date: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.date) {
      return await ctx.db
        .query("staffAttendance")
        .filter((q) => q.eq(q.field("date"), args.date))
        .collect();
    }
    return await ctx.db.query("staffAttendance").collect();
  },
});

export const markStaffAttendance = mutation({
  args: {
    staffId: v.id("staff"),
    date: v.string(),
    type: v.string(), // Present, Absent, Late, Half Day
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already marked
    const existing = await ctx.db
      .query("staffAttendance")
      .filter((q) => 
        q.and(
          q.eq(q.field("staffId"), args.staffId),
          q.eq(q.field("date"), args.date)
        )
      )
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, { type: args.type, note: args.note });
      return existing._id;
    }
    
    return await ctx.db.insert("staffAttendance", args);
  },
});

export const getStaffAttendanceStats = query({
  args: { staffId: v.id("staff"), month: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let records = await ctx.db.query("staffAttendance").collect();
    
    records = records.filter(r => r.staffId === args.staffId);
    
    if (args.month) {
      records = records.filter(r => r.date.startsWith(args.month!));
    }
    
    return {
      total: records.length,
      present: records.filter(r => r.type === "Present").length,
      absent: records.filter(r => r.type === "Absent").length,
      late: records.filter(r => r.type === "Late").length,
      halfDay: records.filter(r => r.type === "Half Day").length,
    };
  },
});

// ============ EXAM MARKS ============
export const listExamMarks = query({
  args: { 
    studentId: v.optional(v.id("students")),
    examScheduleId: v.optional(v.id("examSchedule")),
  },
  handler: async (ctx, args) => {
    let marks = await ctx.db.query("examMarks").collect();
    
    if (args.studentId) {
      marks = marks.filter(m => m.studentId === args.studentId);
    }
    if (args.examScheduleId) {
      marks = marks.filter(m => m.examScheduleId === args.examScheduleId);
    }
    
    return marks;
  },
});

export const addExamMarks = mutation({
  args: {
    studentId: v.id("students"),
    examScheduleId: v.id("examSchedule"),
    marksObtained: v.number(),
    isAbsent: v.boolean(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("examMarks")
      .filter((q) => 
        q.and(
          q.eq(q.field("studentId"), args.studentId),
          q.eq(q.field("examScheduleId"), args.examScheduleId)
        )
      )
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        marksObtained: args.marksObtained,
        isAbsent: args.isAbsent,
        note: args.note,
      });
      return existing._id;
    }
    
    return await ctx.db.insert("examMarks", args);
  },
});

export const getStudentResults = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    const marks = await ctx.db
      .query("examMarks")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .collect();
    
    const schedules = await ctx.db.query("examSchedule").collect();
    const subjects = await ctx.db.query("subjects").collect();
    const exams = await ctx.db.query("exams").collect();
    
    return marks.map(m => {
      const schedule = schedules.find(s => s._id === m.examScheduleId);
      const exam = schedule ? exams.find(e => e._id === schedule.examId) : null;
      const subject = schedule ? subjects.find(s => s._id === schedule.subjectId) : null;
      
      return {
        ...m,
        examName: exam?.name || "Unknown",
        subjectName: subject?.name || "Unknown",
        maxMarks: schedule?.maxMarks || 100,
        minMarks: schedule?.minMarks || 33,
        percentage: schedule?.maxMarks ? (m.marksObtained / schedule.maxMarks) * 100 : 0,
        passed: schedule ? m.marksObtained >= schedule.minMarks : false,
      };
    });
  },
});

// ============ POSTAL DISPATCH ============
export const listPostalDispatch = query({
  args: { type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let records = await ctx.db.query("postalDispatch").collect();
    if (args.type) {
      records = records.filter(r => r.type === args.type);
    }
    return records.sort((a, b) => b.date.localeCompare(a.date));
  },
});

export const createPostalDispatch = mutation({
  args: {
    type: v.string(), // dispatch, receive
    referenceNo: v.string(),
    toTitle: v.string(),
    fromTitle: v.optional(v.string()),
    address: v.optional(v.string()),
    note: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("postalDispatch", args);
  },
});

export const deletePostalDispatch = mutation({
  args: { id: v.id("postalDispatch") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
