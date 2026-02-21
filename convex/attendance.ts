import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List attendance records with filters
export const list = query({
  args: {
    date: v.optional(v.string()),
    classId: v.optional(v.id("classes")),
    studentId: v.optional(v.id("students")),
  },
  handler: async (ctx, args) => {
    let attendance = await ctx.db.query("attendance").collect();
    
    if (args.date) {
      attendance = attendance.filter((a) => a.date === args.date);
    }
    
    if (args.studentId) {
      attendance = attendance.filter((a) => a.studentId === args.studentId);
    }
    
    // If filtering by class, get students first
    if (args.classId) {
      const students = await ctx.db
        .query("students")
        .withIndex("by_class", (q) => q.eq("classId", args.classId!))
        .collect();
      const studentIds = new Set(students.map((s) => s._id));
      attendance = attendance.filter((a) => studentIds.has(a.studentId));
    }
    
    // Enrich with student data
    const enriched = await Promise.all(
      attendance.map(async (a) => {
        const student = await ctx.db.get(a.studentId);
        return {
          ...a,
          studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
          rollNo: student?.rollNo || "",
        };
      })
    );
    
    return enriched;
  },
});

// Get attendance by date with all students
export const getByDate = query({
  args: {
    date: v.string(),
    classId: v.id("classes"),
    sectionId: v.optional(v.id("sections")),
  },
  handler: async (ctx, args) => {
    // Get all students in class
    let students = await ctx.db
      .query("students")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();
    
    if (args.sectionId) {
      students = students.filter((s) => s.sectionId === args.sectionId);
    }
    
    students = students.filter((s) => s.isActive);
    
    // Get attendance records for this date
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
    
    // Merge student and attendance data
    const result = students.map((student) => {
      const record = attendance.find((a) => a.studentId === student._id);
      return {
        studentId: student._id,
        studentName: `${student.firstName} ${student.lastName}`,
        rollNo: student.rollNo || "",
        type: record?.type || "not_marked",
        attendanceId: record?._id,
        note: record?.note || "",
      };
    });
    
    return result;
  },
});

// Mark attendance for a student
export const mark = mutation({
  args: {
    studentId: v.id("students"),
    date: v.string(),
    type: v.string(), // Present, Absent, Late, Half Day
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if record exists
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_student_date", (q) =>
        q.eq("studentId", args.studentId).eq("date", args.date)
      )
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        type: args.type,
        note: args.note,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("attendance", {
        studentId: args.studentId,
        date: args.date,
        type: args.type,
        note: args.note,
      });
    }
  },
});

// Bulk mark attendance
export const bulkMark = mutation({
  args: {
    date: v.string(),
    records: v.array(
      v.object({
        studentId: v.id("students"),
        type: v.string(),
        note: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const record of args.records) {
      const existing = await ctx.db
        .query("attendance")
        .withIndex("by_student_date", (q) =>
          q.eq("studentId", record.studentId).eq("date", args.date)
        )
        .first();
      
      if (existing) {
        await ctx.db.patch(existing._id, {
          type: record.type,
          note: record.note,
        });
      } else {
        await ctx.db.insert("attendance", {
          studentId: record.studentId,
          date: args.date,
          type: record.type,
          note: record.note,
        });
      }
    }
    
    return "Attendance marked";
  },
});

// Get attendance statistics for a date
export const getStats = query({
  args: {
    date: v.string(),
    classId: v.optional(v.id("classes")),
  },
  handler: async (ctx, args) => {
    let attendance = await ctx.db
      .query("attendance")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
    
    // Filter by class if provided
    if (args.classId) {
      const students = await ctx.db
        .query("students")
        .withIndex("by_class", (q) => q.eq("classId", args.classId!))
        .collect();
      const studentIds = new Set(students.map((s) => s._id));
      attendance = attendance.filter((a) => studentIds.has(a.studentId));
    }
    
    const present = attendance.filter((a) => a.type === "Present" || a.type === "present").length;
    const absent = attendance.filter((a) => a.type === "Absent" || a.type === "absent").length;
    const late = attendance.filter((a) => a.type === "Late" || a.type === "late").length;
    const halfDay = attendance.filter((a) => a.type === "Half Day" || a.type === "half_day").length;
    
    return {
      total: attendance.length,
      present,
      absent,
      late,
      halfDay,
    };
  },
});

// Delete attendance record
export const remove = mutation({
  args: { id: v.id("attendance") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get monthly attendance report for a student
export const getMonthlyReport = query({
  args: {
    studentId: v.id("students"),
    month: v.string(), // Format: "2026-01"
  },
  handler: async (ctx, args) => {
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_student_date", (q) => q.eq("studentId", args.studentId))
      .collect();
    
    const monthRecords = attendance.filter((a) => a.date.startsWith(args.month));
    
    const present = monthRecords.filter((a) => a.type === "Present" || a.type === "present").length;
    const absent = monthRecords.filter((a) => a.type === "Absent" || a.type === "absent").length;
    const late = monthRecords.filter((a) => a.type === "Late" || a.type === "late").length;
    
    return {
      records: monthRecords,
      summary: {
        totalDays: monthRecords.length,
        present,
        absent,
        late,
        attendancePercentage: monthRecords.length > 0 ? ((present / monthRecords.length) * 100).toFixed(1) : "0",
      },
    };
  },
});
