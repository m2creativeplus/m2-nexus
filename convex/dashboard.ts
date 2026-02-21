import { query } from "./_generated/server";

// Get aggregated dashboard statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    
    // Get all students count
    const students = await ctx.db.query("students").collect();
    const activeStudents = students.filter(s => s.isActive);
    const totalStudents = activeStudents.length;
    
    // Get today's student attendance
    const todayAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();
    const studentsPresent = todayAttendance.filter(a => a.type === "Present" || a.type === "present").length;
    
    // Get all staff count
    const staff = await ctx.db.query("staff").collect();
    const activeStaff = staff.filter(s => s.isActive);
    const totalStaff = activeStaff.length;
    
    // Get today's staff attendance
    const staffAttendance = await ctx.db.query("staffAttendance").collect();
    const todayStaffAttendance = staffAttendance.filter(a => a.date === today);
    const staffPresent = todayStaffAttendance.filter(a => a.type === "Present" || a.type === "present").length;
    
    // Get fee statistics
    const studentFees = await ctx.db.query("studentFees").collect();
    const totalFees = studentFees.length;
    const paidFees = studentFees.filter(f => f.status === "paid").length;
    const pendingFees = studentFees.filter(f => f.status === "unpaid" || f.status === "partial").length;
    
    // Calculate total amounts
    const totalFeesAmount = studentFees.reduce((sum, f) => sum + (f.amountPaid || 0), 0);
    const pendingAmount = studentFees
      .filter(f => f.status !== "paid")
      .reduce((sum, f) => {
        const master = f.amountPaid || 0;
        return sum + master;
      }, 0);
    
    return {
      totalStudents,
      studentsPresent,
      studentsAbsent: totalStudents - studentsPresent,
      totalStaff,
      staffPresent,
      totalFees,
      paidFees,
      pendingFees,
      totalFeesAmount,
      pendingAmount,
    };
  },
});

// Get monthly financial data for charts
export const getMonthlyFinancials = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
    
    const income = await ctx.db.query("income").collect();
    const expenses = await ctx.db.query("expenses").collect();
    
    const monthlyData = [];
    for (let day = 1; day <= Math.min(daysInMonth, now.getDate()); day++) {
      const dateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;
      
      const dayIncome = income
        .filter(i => i.date === dateStr)
        .reduce((sum, i) => sum + i.amount, 0);
      
      const dayExpenses = expenses
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      
      monthlyData.push({
        day: String(day).padStart(2, "0"),
        fees: dayIncome,
        expenses: dayExpenses,
      });
    }
    
    return monthlyData;
  },
});

// Get session-wide financial data for charts
export const getSessionFinancials = query({
  args: {},
  handler: async (ctx) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const income = await ctx.db.query("income").collect();
    const expenses = await ctx.db.query("expenses").collect();
    
    const now = new Date();
    const currentMonth = now.getMonth();
    
    // Get last 10 months of data
    const sessionData = [];
    for (let i = 9; i >= 0; i--) {
      const targetMonth = (currentMonth - i + 12) % 12;
      const monthStr = monthNames[targetMonth];
      
      const monthIncome = income
        .filter(inc => {
          const incMonth = new Date(inc.date).getMonth();
          return incMonth === targetMonth;
        })
        .reduce((sum, i) => sum + i.amount, 0);
      
      const monthExpenses = expenses
        .filter(exp => {
          const expMonth = new Date(exp.date).getMonth();
          return expMonth === targetMonth;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      
      sessionData.push({
        month: monthStr,
        fees: monthIncome,
        expenses: monthExpenses,
      });
    }
    
    return sessionData;
  },
});
