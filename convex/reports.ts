import { v } from "convex/values";
import { query } from "./_generated/server";

// Helper to filter by date range
const isInRange = (date: string, start?: string, end?: string) => {
  if (!date) return false;
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

export const getFinancialSummary = query({
  args: {
    startDate: v.optional(v.string()), // YYYY-MM-DD
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Fetch all relevant data
    const income = await ctx.db.query("income").collect();
    const expenses = await ctx.db.query("expenses").collect();
    const studentFees = await ctx.db.query("studentFees").collect();

    // Filter and Aggregate
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalFees = 0; // Fees collected (isPaid)

    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};
    const feesByType: Record<string, number> = {}; // Needs join with FeeMaster -> FeeType

    // Process Income
    for (const inc of income) {
      if (isInRange(inc.date, args.startDate, args.endDate)) {
        totalIncome += inc.amount;
        // In a real app we would join with incomeHeads, for now use a placeholder or ID
        // const head = await ctx.db.get(inc.headId); 
        // We'll skip detailed category join for speed in this demo, just aggregated totals first
      }
    }

    // Process Expenses
    for (const exp of expenses) {
      if (isInRange(exp.date, args.startDate, args.endDate)) {
        totalExpenses += exp.amount;
      }
    }

    // Process Fees (which count as income)
    for (const fee of studentFees) {
      if (fee.isPaid && fee.paymentDate) {
        if (isInRange(fee.paymentDate, args.startDate, args.endDate)) {
          totalFees += fee.amountPaid;
        }
      }
    }

    // Grand Total Income = Misc Income + Fees
    const grandTotalIncome = totalIncome + totalFees;
    const netProfit = grandTotalIncome - totalExpenses;

    return {
      totalIncome,
      totalFees,
      grandTotalIncome,
      totalExpenses,
      netProfit,
      transactionCount: income.length + expenses.length + studentFees.length,
      period: { start: args.startDate, end: args.endDate }
    };
  },
});

export const getStudentAttendanceSummary = query({
  args: {
    classId: v.optional(v.id("classes")),
    date: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    // Get all students (optionally filtered by class)
    let students = await ctx.db.query("students");
    if (args.classId) {
       // @ts-ignore
      students = students.withIndex("by_class", q => q.eq("classId", args.classId));
    }
    const studentList = await students.collect();
    
    // Get attendance for that date
    // This is inefficient (O(N)), ideally querying "attendance" by date is better
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_date", q => q.eq("date", args.date))
      .collect();

    const stats = {
      total: studentList.length,
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      unmarked: 0,
    };

    // Map attendance
    const attendanceMap = new Map();
    attendance.forEach(a => attendanceMap.set(a.studentId, a.type));

    for (const stu of studentList) {
      const status = attendanceMap.get(stu._id);
      if (status) {
        if (status === "Present") stats.present++;
        else if (status === "Absent") stats.absent++;
        else if (status === "Late") stats.late++;
        else if (status === "Half Day") stats.halfDay++;
      } else {
        stats.unmarked++;
      }
    }

    return stats;
  }
});
