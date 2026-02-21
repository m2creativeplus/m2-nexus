import { mutation } from "./_generated/server";

// Master seed function to populate all tables with sample data
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const results: string[] = [];

    // Import all seed functions dynamically
    // Note: Since Convex doesn't support dynamic imports, we'll run seeds inline

    // 1. Seed Categories and Houses
    const existingCats = await ctx.db.query("categories").collect();
    if (existingCats.length === 0) {
      const categories = ["General", "OBC", "SC", "ST", "Other"];
      for (const name of categories) {
        await ctx.db.insert("categories", { name });
      }
      results.push("Categories seeded");
    }

    const existingHouses = await ctx.db.query("houses").collect();
    if (existingHouses.length === 0) {
      const houses = ["Red House", "Blue House", "Green House", "Yellow House"];
      for (const name of houses) {
        await ctx.db.insert("houses", { name });
      }
      results.push("Houses seeded");
    }

    // 2. Seed Subjects
    const existingSubjects = await ctx.db.query("subjects").collect();
    if (existingSubjects.length === 0) {
      const subjects = [
        { name: "Mathematics", type: "Theory", code: "MATH" },
        { name: "Science", type: "Theory", code: "SCI" },
        { name: "English", type: "Theory", code: "ENG" },
        { name: "Social Studies", type: "Theory", code: "SST" },
        { name: "Computer Science", type: "Practical", code: "CS" },
        { name: "Physical Education", type: "Practical", code: "PE" },
      ];
      for (const subject of subjects) {
        await ctx.db.insert("subjects", subject);
      }
      results.push("Subjects seeded");
    }

    // 3. Seed News
    const existingNews = await ctx.db.query("news").collect();
    if (existingNews.length === 0) {
      const newsItems = [
        {
          title: "TEACHERS DAY",
          content: "Schools are organizing various cultural programs to celebrate Teachers Day.",
          excerpt: "Schools are organizing various cultural programs...",
          publishDate: "2026-01-10",
          isActive: true,
        },
        {
          title: "Parents and Guardians Teacher's Meeting",
          content: "Dear parents and guardians, There will be a parent-teacher meeting on January 20th.",
          excerpt: "Dear parents and guardians, There...",
          publishDate: "2026-01-08",
          isActive: true,
        },
        {
          title: "Winter Term-end Exams Start",
          content: "This is to inform all students that the term-end examinations will begin from January 25th.",
          excerpt: "This is to inform all students that the term-end...",
          publishDate: "2026-01-05",
          isActive: true,
        },
      ];
      for (const item of newsItems) {
        await ctx.db.insert("news", item);
      }
      results.push("News seeded");
    }

    // 4. Seed Staff
    const existingStaff = await ctx.db.query("staff").collect();
    if (existingStaff.length === 0) {
      const staffData = [
        { staffId: "STF001", firstName: "Ahmed", lastName: "Hassan", role: "Admin", department: "Administration", email: "ahmed@school.com", gender: "Male", dob: "1980-05-15", dateOfJoining: "2015-01-10", phone: "634567890", basicSalary: 400, designation: "Principal", isActive: true },
        { staffId: "STF002", firstName: "Amina", lastName: "Mohamed", role: "Admin", department: "Administration", email: "amina@school.com", gender: "Female", dob: "1985-03-20", dateOfJoining: "2016-03-15", phone: "634567891", basicSalary: 300, designation: "Vice Principal", isActive: true },
        { staffId: "STF003", firstName: "Ibrahim", lastName: "Ali", role: "Teacher", department: "Mathematics", email: "ibrahim@school.com", gender: "Male", dob: "1990-06-10", dateOfJoining: "2018-06-20", phone: "634567892", basicSalary: 250, designation: "Senior Teacher", isActive: true },
        { staffId: "STF004", firstName: "Faduma", lastName: "Abdi", role: "Teacher", department: "Science", email: "faduma@school.com", gender: "Female", dob: "1992-08-25", dateOfJoining: "2019-08-01", phone: "634567893", basicSalary: 200, designation: "Teacher", isActive: true },
        { staffId: "STF005", firstName: "Mohamed", lastName: "Jama", role: "Teacher", department: "English", email: "mohamed@school.com", gender: "Male", dob: "1988-01-05", dateOfJoining: "2020-01-15", phone: "634567894", basicSalary: 200, designation: "Teacher", isActive: true },
        { staffId: "STF006", firstName: "Hibo", lastName: "Yusuf", role: "Accountant", department: "Finance", email: "hibo@school.com", gender: "Female", dob: "1987-04-12", dateOfJoining: "2017-04-10", phone: "634567895", basicSalary: 180, designation: "Accountant", isActive: true },
      ];
      for (const staff of staffData) {
        await ctx.db.insert("staff", staff);
      }
      results.push("Staff seeded");
    }

    // 5. Seed Exam Groups
    const existingExamGroups = await ctx.db.query("examGroups").collect();
    if (existingExamGroups.length === 0) {
      const examGroups = [
        { name: "First Term Examination", examType: "General", description: "First term exams" },
        { name: "Mid Term Examination", examType: "General", description: "Mid term exams" },
        { name: "Final Examination", examType: "General", description: "Final exams" },
      ];
      for (const group of examGroups) {
        await ctx.db.insert("examGroups", group);
      }
      results.push("Exam Groups seeded");
    }

    // 6. Seed Fee Groups and Types
    const existingFeeGroups = await ctx.db.query("feeGroups").collect();
    if (existingFeeGroups.length === 0) {
      const tuitionGroup = await ctx.db.insert("feeGroups", {
        name: "Class 10 Tuition",
        description: "Tuition fees for Class 10",
      });
      
      await ctx.db.insert("feeTypes", {
        feeGroupId: tuitionGroup,
        name: "Monthly Tuition",
        code: "TUI",
        description: "Monthly tuition fee",
      });
      
      results.push("Fee Groups seeded");
    }

    // 7. Seed Income Heads
    const existingIncomeHeads = await ctx.db.query("incomeHeads").collect();
    if (existingIncomeHeads.length === 0) {
      const heads = [
        { name: "Student Fees", description: "Income from student fees" },
        { name: "Donations", description: "Donations received" },
        { name: "Other Income", description: "Miscellaneous income" },
      ];
      for (const head of heads) {
        await ctx.db.insert("incomeHeads", head);
      }
      results.push("Income Heads seeded");
    }

    // 8. Seed Expense Heads
    const existingExpenseHeads = await ctx.db.query("expenseHeads").collect();
    if (existingExpenseHeads.length === 0) {
      const heads = [
        { name: "Staff Salaries", description: "Monthly staff salaries" },
        { name: "Utilities", description: "Electricity, water, internet" },
        { name: "Maintenance", description: "Building maintenance" },
        { name: "Office Supplies", description: "Stationery and supplies" },
      ];
      for (const head of heads) {
        await ctx.db.insert("expenseHeads", head);
      }
      results.push("Expense Heads seeded");
    }

    // 9. Seed Transport
    const existingVehicles = await ctx.db.query("transportVehicles").collect();
    if (existingVehicles.length === 0) {
      const bus1 = await ctx.db.insert("transportVehicles", {
        vehicleNumber: "HRG-001",
        vehicleModel: "Toyota Coaster",
        driverName: "Abdirahman Ali",
        driverPhone: "634112233",
      });
      
      await ctx.db.insert("transportRoutes", {
        title: "Route A - New Hargeisa",
        fare: 15,
        vehicleId: bus1,
      });
      
      results.push("Transport seeded");
    }

    // 10. Seed Hostels
    const existingHostels = await ctx.db.query("hostels").collect();
    if (existingHostels.length === 0) {
      await ctx.db.insert("hostels", {
        name: "Boys Hostel",
        type: "boys",
        address: "Block A, School Campus",
        intake: 100,
      });
      
      await ctx.db.insert("hostels", {
        name: "Girls Hostel",
        type: "girls",
        address: "Block B, School Campus",
        intake: 80,
      });
      
      results.push("Hostels seeded");
    }

    // 11. Initialize Settings
    const existingSettings = await ctx.db.query("systemSettings").collect();
    if (existingSettings.length === 0) {
      const defaultSettings = [
        { key: "schoolName", value: "Al-Nuur Academy Hargeisa", category: "school" },
        { key: "schoolAddress", value: "26 June Road, Hargeisa, Somaliland", category: "school" },
        { key: "currentSession", value: "2025-26", category: "session" },
        { key: "currency", value: "USD", category: "general" },
        { key: "currencySymbol", value: "$", category: "general" },
        { key: "dateFormat", value: "YYYY-MM-DD", category: "general" },
      ];
      for (const setting of defaultSettings) {
        await ctx.db.insert("systemSettings", setting);
      }
      results.push("Settings initialized");
    }

    // 12. Seed Inventory
    const existingInventory = await ctx.db.query("inventoryCategories").collect();
    if (existingInventory.length === 0) {
      const cat1 = await ctx.db.insert("inventoryCategories", { name: "Office Supplies", description: "Stationery and office materials" });
      const cat2 = await ctx.db.insert("inventoryCategories", { name: "Cleaning Supplies", description: "Cleaning materials and equipment" });
      const cat3 = await ctx.db.insert("inventoryCategories", { name: "Sports Equipment", description: "Sports and PE equipment" });
      
      await ctx.db.insert("inventoryItems", { name: "A4 Paper Ream", categoryId: cat1, itemCode: "INV001", unit: "pcs", quantity: 100, minQuantity: 20, unitPrice: 3 });
      await ctx.db.insert("inventoryItems", { name: "Whiteboard Markers", categoryId: cat1, itemCode: "INV002", unit: "box", quantity: 50, minQuantity: 10, unitPrice: 2 });
      await ctx.db.insert("inventoryItems", { name: "Floor Cleaner", categoryId: cat2, itemCode: "INV003", unit: "liters", quantity: 30, minQuantity: 5, unitPrice: 4 });
      await ctx.db.insert("inventoryItems", { name: "Footballs", categoryId: cat3, itemCode: "INV004", unit: "pcs", quantity: 20, minQuantity: 5, unitPrice: 8 });
      
      await ctx.db.insert("inventorySuppliers", { name: "Hargeisa Stationery", phone: "634223344", email: "info@hrgstationery.com", contactPerson: "Yusuf Ahmed" });
      await ctx.db.insert("inventorySuppliers", { name: "Somaliland Sports", phone: "634334455", email: "sales@slsports.com", contactPerson: "Abdi Mohamud" });
      
      results.push("Inventory seeded");
    }

    // 13. Seed Library Books
    const existingBooks = await ctx.db.query("books").collect();
    if (existingBooks.length === 0) {
      const books = [
        { bookNo: "BK001", title: "Mathematics Textbook", author: "Oxford Press", category: "Academic", totalCopies: 50, availableCopies: 50, price: 8 },
        { bookNo: "BK002", title: "Science Lab Manual", author: "Cambridge", category: "Academic", totalCopies: 30, availableCopies: 30, price: 5 },
        { bookNo: "BK003", title: "English Literature", author: "Longman", category: "Academic", totalCopies: 40, availableCopies: 40, price: 6 },
        { bookNo: "BK004", title: "World History", author: "Pearson", category: "Academic", totalCopies: 25, availableCopies: 25, price: 6 },
        { bookNo: "BK005", title: "Islamic Studies", author: "Dar Al-Maarif", category: "Religious", totalCopies: 20, availableCopies: 20, price: 4 },
        { bookNo: "BK006", title: "Physics Fundamentals", author: "McGraw-Hill", category: "Academic", totalCopies: 35, availableCopies: 35, price: 7 },
        { bookNo: "BK007", title: "Chemistry Basics", author: "Cambridge", category: "Academic", totalCopies: 30, availableCopies: 30, price: 7 },
        { bookNo: "BK008", title: "Somali Language Guide", author: "Ministry of Education", category: "Reference", totalCopies: 15, availableCopies: 15, price: 3 },
      ];
      for (const book of books) {
        await ctx.db.insert("books", book);
      }
      results.push("Library Books seeded");
    }

    // 14. Seed Homework
    const existingHomework = await ctx.db.query("homework").collect();
    const firstClass = await ctx.db.query("classes").first();
    const firstSubject = await ctx.db.query("subjects").first();
    if (existingHomework.length === 0 && firstClass && firstSubject) {
      const today = new Date().toISOString().split("T")[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      
      await ctx.db.insert("homework", {
        title: "Chapter 5 Exercise",
        description: "Complete all exercises from Chapter 5 of the textbook",
        classId: firstClass._id,
        subjectId: firstSubject._id,
        assignDate: today,
        dueDate: nextWeek,
        maxMarks: 20,
        status: "active",
      });
      
      await ctx.db.insert("homework", {
        title: "Essay Writing",
        description: "Write an essay on 'My Country' (500 words minimum)",
        classId: firstClass._id,
        subjectId: firstSubject._id,
        assignDate: today,
        dueDate: nextWeek,
        maxMarks: 50,
        status: "active",
      });
      
      results.push("Homework seeded");
    }

    // 15. Seed Timetable
    const existingTimetable = await ctx.db.query("timetables").collect();
    const firstSection = await ctx.db.query("sections").first();
    if (existingTimetable.length === 0 && firstClass && firstSubject && firstSection) {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const periods = ["Period 1", "Period 2", "Period 3"];
      
      for (let i = 0; i < 3; i++) {
        await ctx.db.insert("timetables", {
          classId: firstClass._id,
          sectionId: firstSection._id,
          subjectId: firstSubject._id,
          day: days[i % 5],
          period: periods[i],
          startTime: `0${8 + i}:00`,
          endTime: `0${8 + i}:45`,
          roomNo: `Room 10${i + 1}`,
        });
      }
      results.push("Timetable seeded");
    }


    if (results.length === 0) {
      return "All data already seeded!";
    }

    return `Seeded: ${results.join(", ")}`;
  },
});

