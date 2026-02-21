import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ EXAMS ============
export const listExams = query({
  args: {
    classId: v.optional(v.id("classes")),
    subjectId: v.optional(v.id("subjects")),
  },
  handler: async (ctx, args) => {
    let exams = await ctx.db.query("onlineExams").collect();
    
    if (args.classId) {
      exams = exams.filter(e => e.classId === args.classId);
    }
    if (args.subjectId) {
      exams = exams.filter(e => e.subjectId === args.subjectId);
    }
    
    // Enrich
    const enriched = await Promise.all(
      exams.map(async (e) => {
        const classData = await ctx.db.get(e.classId);
        const subject = e.subjectId ? await ctx.db.get(e.subjectId) : null;
        const questions = await ctx.db.query("onlineExamQuestions").withIndex("by_exam", q => q.eq("examId", e._id)).collect();
        const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
        
        return {
          ...e,
          className: classData?.name || "Unknown",
          subjectName: subject?.name || "General",
          questionCount: questions.length,
          totalMarks,
        };
      })
    );
    
    return enriched.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  },
});

export const createExam = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    classId: v.id("classes"),
    sectionId: v.optional(v.id("sections")),
    subjectId: v.optional(v.id("subjects")),
    startDate: v.string(),
    endDate: v.string(),
    duration: v.string(),
    passingPercentage: v.optional(v.number()),
    publishResult: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("onlineExams", {
      ...args,
      publishResult: args.publishResult ?? false,
      status: "active",
    });
  },
});

export const deleteExam = mutation({
  args: { id: v.id("onlineExams") },
  handler: async (ctx, args) => {
    // Also delete questions and attempts
    const questions = await ctx.db.query("onlineExamQuestions").withIndex("by_exam", q => q.eq("examId", args.id)).collect();
    for (const q of questions) {
      await ctx.db.delete(q._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const togglePublish = mutation({
  args: { id: v.id("onlineExams"), publish: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { publishResult: args.publish });
  },
});


// ============ QUESTIONS ============
export const listQuestions = query({
  args: { examId: v.id("onlineExams") },
  handler: async (ctx, args) => {
    return await ctx.db.query("onlineExamQuestions")
      .withIndex("by_exam", q => q.eq("examId", args.examId))
      .collect();
  },
});

export const createQuestion = mutation({
  args: {
    examId: v.id("onlineExams"),
    question: v.string(),
    questionType: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.string(),
    marks: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("onlineExamQuestions", args);
  },
});

export const deleteQuestion = mutation({
  args: { id: v.id("onlineExamQuestions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});


// ============ ATTEMPTS & RESULTS ============
export const submitAttempt = mutation({
  args: {
    examId: v.id("onlineExams"),
    studentId: v.id("students"),
    answers: v.string(), // JSON
  },
  handler: async (ctx, args) => {
    const studentAnswers = JSON.parse(args.answers) as Record<string, string>;
    const questions = await ctx.db.query("onlineExamQuestions")
      .withIndex("by_exam", q => q.eq("examId", args.examId))
      .collect();
      
    let totalScore = 0;
    
    // Auto-Grading Logic
    questions.forEach(q => {
      const studentAns = studentAnswers[q._id];
      if (studentAns === q.correctAnswer) {
        totalScore += q.marks;
      }
    });

    return await ctx.db.insert("onlineExamAttempts", {
      examId: args.examId,
      studentId: args.studentId,
      answers: args.answers,
      score: totalScore,
      status: "submitted",
      startTime: new Date().toISOString(), // Mock, should be passed
      submitTime: new Date().toISOString(),
    });
  },
});

export const getAttempts = query({
  args: { examId: v.id("onlineExams") },
  handler: async (ctx, args) => {
    const attempts = await ctx.db.query("onlineExamAttempts")
      .withIndex("by_exam", q => q.eq("examId", args.examId))
      .collect();
      
    // Enrich with student data
    return await Promise.all(attempts.map(async (a) => {
      const student = await ctx.db.get(a.studentId);
      return {
        ...a,
        studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
        rollNo: student?.rollNo || student?.admissionNo || "-",
      };
    }));
  },
});
