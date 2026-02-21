import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============ USERS & AUTH ============
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.string(), // superadmin, admin, teacher, accountant, receptionist, librarian, student, parent
    staffId: v.optional(v.id("staff")),
    studentId: v.optional(v.id("students")),
    isActive: v.boolean(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // ============ SYSTEM SETTINGS ============
  systemSettings: defineTable({
    key: v.string(),
    value: v.string(),
    category: v.string(), // general, school, session, email, sms, payment
  }).index("by_key", ["key"]),

  sessions: defineTable({
    name: v.string(), // "2025-26"
    startDate: v.string(),
    endDate: v.string(),
    isCurrent: v.boolean(),
  }),

  // ============ NEWS & ANNOUNCEMENTS ============
  news: defineTable({
    title: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    publishDate: v.string(),
    isActive: v.boolean(),
  }).index("by_publish_date", ["publishDate"]),

  // ============ NOTIFICATIONS ============
  notifications: defineTable({
    recipientId: v.string(), // Clerk ID or User ID
    title: v.string(),
    message: v.string(),
    type: v.string(), // info, success, warning, error
    link: v.optional(v.string()), // URL to redirect
    isRead: v.boolean(),
    createdAt: v.string(), // ISO date
  })
  .index("by_recipient", ["recipientId"])
  .index("by_recipient_unread", ["recipientId", "isRead"]),

  // ============ EVENTS & CALENDAR ============
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.string(), // ISO date string
    endDate: v.optional(v.string()), 
    type: v.string(), // academic, holiday, activity, other
    audience: v.optional(v.string()), // all, students, staff, etc.
  }).index("by_start_date", ["startDate"]),

  // 1. Student Information
  students: defineTable({
    admissionNo: v.string(),
    rollNo: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    classId: v.id("classes"),
    sectionId: v.id("sections"), 
    gender: v.string(),
    dob: v.string(),
    categoryId: v.optional(v.id("categories")),
    religion: v.optional(v.string()),
    caste: v.optional(v.string()),
    mobileNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    admissionDate: v.string(),
    bloodGroup: v.optional(v.string()),
    houseId: v.optional(v.id("houses")),
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    measurementDate: v.optional(v.string()),
    fatherName: v.optional(v.string()),
    fatherPhone: v.optional(v.string()),
    fatherOccupation: v.optional(v.string()),
    motherName: v.optional(v.string()),
    motherPhone: v.optional(v.string()), 
    motherOccupation: v.optional(v.string()),
    guardianName: v.optional(v.string()),
    guardianRelation: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    guardianEmail: v.optional(v.string()),
    guardianAddress: v.optional(v.string()),
    isTransport: v.optional(v.boolean()),
    routeId: v.optional(v.id("transportRoutes")),
    vehicleId: v.optional(v.id("transportVehicles")),
    hostelId: v.optional(v.id("hostels")),
    roomNo: v.optional(v.string()),
    previousSchool: v.optional(v.string()),
    note: v.optional(v.string()),
    isActive: v.boolean(),
  })
  .index("by_class", ["classId"])
  .index("by_admission_no", ["admissionNo"]),

  // Academic Structure
  classes: defineTable({
    name: v.string(), // e.g. "Class 10"
    sections: v.array(v.string()), // e.g. ["A", "B", "C"] - simplistic reference
  }),
  
  sections: defineTable({
    name: v.string(), // e.g. "A"
    classId: v.id("classes"),
  }).index("by_class", ["classId"]),

  subjects: defineTable({
    name: v.string(),
    type: v.string(), // Theory / Practical
    code: v.optional(v.string()),
  }),

  categories: defineTable({
    name: v.string(), // e.g. General, OBC, SC/ST
  }),

  houses: defineTable({
    name: v.string(), // e.g. Red House, Blue House
  }),

  // 2. Fees Collection
  feeGroups: defineTable({
    name: v.string(), // e.g. Class 1 Installment
    description: v.optional(v.string()),
  }),

  feeTypes: defineTable({
    feeGroupId: v.id("feeGroups"),
    name: v.string(), // e.g. Tuition Fee
    code: v.string(),
    description: v.optional(v.string()),
  }),

  feeMasters: defineTable({
    feeGroupId: v.id("feeGroups"),
    feeTypeId: v.id("feeTypes"),
    dueDate: v.string(),
    amount: v.number(),
    fineType: v.optional(v.string()), // None, Percentage, Fixed
    fineAmount: v.optional(v.number()),
  }),

  studentFees: defineTable({
    studentId: v.id("students"),
    feeMasterId: v.id("feeMasters"),
    isPaid: v.boolean(),
    status: v.string(), // paid, unpaid, partial
    amountPaid: v.number(),
    paymentDate: v.optional(v.string()),
    paymentMode: v.optional(v.string()),
    transactionId: v.optional(v.string()),
    discount: v.optional(v.number()),
    fine: v.optional(v.number()),
  }).index("by_student", ["studentId"]),

  // 3. Attendance
  attendance: defineTable({
    studentId: v.id("students"),
    date: v.string(),
    type: v.string(), // Present, Late, Absent, Half Day
    note: v.optional(v.string()),
  })
  .index("by_date", ["date"])
  .index("by_student_date", ["studentId", "date"]),

  // 4. Human Resource
  staff: defineTable({
    staffId: v.string(),
    role: v.string(), // Admin, Teacher, Accountant, etc
    designation: v.optional(v.string()),
    department: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    fatherName: v.optional(v.string()),
    motherName: v.optional(v.string()),
    email: v.string(),
    gender: v.string(),
    dob: v.string(),
    dateOfJoining: v.string(),
    phone: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    maritalStatus: v.optional(v.string()),
    photo: v.optional(v.string()),
    currentAddress: v.optional(v.string()),
    permanentAddress: v.optional(v.string()),
    qualification: v.optional(v.string()),
    workExperience: v.optional(v.string()),
    payroll: v.optional(v.string()), // Basic Salary, Contract
    basicSalary: v.optional(v.number()),
    contractType: v.optional(v.string()),
    workShift: v.optional(v.string()),
    location: v.optional(v.string()),
    isActive: v.boolean(),
  }),

  staffAttendance: defineTable({
    staffId: v.id("staff"),
    date: v.string(),
    type: v.string(),
    note: v.optional(v.string()),
  }),

  // 5. Examinations
  examGroups: defineTable({
    name: v.string(),
    examType: v.string(), // General, GPA, CCE
    description: v.optional(v.string()),
  }),

  exams: defineTable({
    name: v.string(),
    examGroupId: v.id("examGroups"),
    session: v.string(),
    publishResult: v.boolean(),
  }),

  examSchedule: defineTable({
    examId: v.id("exams"),
    subjectId: v.id("subjects"),
    date: v.string(),
    startTime: v.string(),
    duration: v.string(),
    roomNo: v.optional(v.string()),
    maxMarks: v.number(),
    minMarks: v.number(),
  }),

  examMarks: defineTable({
    studentId: v.id("students"),
    examScheduleId: v.id("examSchedule"),
    marksObtained: v.number(),
    isAbsent: v.boolean(),
    note: v.optional(v.string()),
  }),

  // 6. Income & Expenses
  incomeHeads: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),

  income: defineTable({
    headId: v.id("incomeHeads"),
    name: v.string(), 
    invoiceNumber: v.optional(v.string()),
    date: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    document: v.optional(v.string()),
  }).index("by_date", ["date"]),

  expenseHeads: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),

  expenses: defineTable({
    headId: v.id("expenseHeads"),
    name: v.string(),
    invoiceNumber: v.optional(v.string()),
    date: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    document: v.optional(v.string()),
  }).index("by_date", ["date"]),

  // 7. Transport
  transportRoutes: defineTable({
    title: v.string(),
    fare: v.number(),
    vehicleId: v.optional(v.id("transportVehicles")),
  }),

  // Timetable
  timetables: defineTable({
    classId: v.id("classes"),
    sectionId: v.id("sections"),
    day: v.string(), // Monday, Tuesday, etc.
    period: v.string(), // 1, 2, 3...
    startTime: v.string(),
    endTime: v.string(),
    subjectId: v.id("subjects"),
    teacherId: v.optional(v.id("staff")),
    roomNo: v.optional(v.string()),
  })
  .index("by_class_section", ["classId", "sectionId"])
  .index("by_teacher", ["teacherId"]),

  transportVehicles: defineTable({
    vehicleNumber: v.string(),
    vehicleModel: v.string(),
    driverName: v.string(),
    driverPhone: v.optional(v.string()),
    driverLicense: v.optional(v.string()),
  }),

  // 8. Hostel
  hostels: defineTable({
    name: v.string(),
    type: v.string(), // Boys, Girls, Combined
    address: v.optional(v.string()),
    intake: v.optional(v.number()),
  }),

  // 9. Front Office
  admissionEnquiries: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    description: v.optional(v.string()),
    reference: v.optional(v.string()),
    source: v.string(), // advertisement, website, reference, etc.
    classApplied: v.optional(v.string()),
    numberOfChild: v.optional(v.number()),
    followUpDate: v.optional(v.string()),
    status: v.string(), // pending, followup, converted, closed
    date: v.string(),
  }).index("by_status", ["status"]),

  visitors: defineTable({
    name: v.string(),
    phone: v.string(),
    purpose: v.string(),
    toMeet: v.string(),
    idCard: v.optional(v.string()),
    inTime: v.string(),
    outTime: v.optional(v.string()),
    note: v.optional(v.string()),
    date: v.string(),
  }).index("by_date", ["date"]),

  phoneCalls: defineTable({
    name: v.string(),
    phone: v.string(),
    callType: v.string(), // incoming, outgoing
    purpose: v.string(),
    callDuration: v.optional(v.string()),
    followUpDate: v.optional(v.string()),
    note: v.optional(v.string()),
    date: v.string(),
  }),

  postalDispatch: defineTable({
    type: v.string(), // dispatch, receive
    referenceNo: v.string(),
    toTitle: v.string(),
    fromTitle: v.optional(v.string()),
    address: v.optional(v.string()),
    note: v.optional(v.string()),
    date: v.string(),
  }),

  // 10. Inventory
  inventoryCategories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),

  inventoryItems: defineTable({
    name: v.string(),
    categoryId: v.id("inventoryCategories"),
    itemCode: v.string(),
    unit: v.string(), // pcs, kg, liters, etc.
    quantity: v.number(),
    minQuantity: v.optional(v.number()), // for low stock alerts
    unitPrice: v.optional(v.number()),
    description: v.optional(v.string()),
  })
  .index("by_category", ["categoryId"])
  .index("by_item_code", ["itemCode"]),

  inventorySuppliers: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    contactPerson: v.optional(v.string()),
  }),

  inventoryIssues: defineTable({
    itemId: v.id("inventoryItems"),
    issuedTo: v.string(), // staff name or department
    issuedBy: v.optional(v.string()),
    quantity: v.number(),
    issueDate: v.string(),
    returnDate: v.optional(v.string()),
    status: v.string(), // issued, returned
    note: v.optional(v.string()),
  })
  .index("by_item", ["itemId"])
  .index("by_status", ["status"]),

  // 11. Homework
  homework: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    classId: v.id("classes"),
    sectionId: v.optional(v.id("sections")),
    subjectId: v.id("subjects"),
    assignedBy: v.optional(v.id("staff")),
    assignDate: v.string(),
    dueDate: v.string(),
    attachmentUrl: v.optional(v.string()),
    maxMarks: v.optional(v.number()),
    status: v.string(), // active, completed, archived
  })
  .index("by_class", ["classId"])
  .index("by_subject", ["subjectId"])
  .index("by_due_date", ["dueDate"]),

  homeworkSubmissions: defineTable({
    homeworkId: v.id("homework"),
    studentId: v.id("students"),
    submittedAt: v.string(),
    attachmentUrl: v.optional(v.string()),
    marks: v.optional(v.number()),
    feedback: v.optional(v.string()),
    status: v.string(), // submitted, evaluated, late
  })
  .index("by_homework", ["homeworkId"])
  .index("by_student", ["studentId"]),

  // 12. Library
  books: defineTable({
    bookNo: v.string(),
    title: v.string(),
    author: v.string(),
    publisher: v.optional(v.string()),
    isbn: v.optional(v.string()),
    category: v.string(), // Academic, Fiction, Reference, etc.
    subject: v.optional(v.string()),
    rackNo: v.optional(v.string()),
    totalCopies: v.number(),
    availableCopies: v.number(),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
  })
  .index("by_book_no", ["bookNo"])
  .index("by_category", ["category"]),

  bookIssues: defineTable({
    bookId: v.id("books"),
    studentId: v.optional(v.id("students")),
    staffId: v.optional(v.id("staff")),
    memberType: v.string(), // student, staff
    memberName: v.string(),
    admissionNo: v.optional(v.string()),
    issueDate: v.string(),
    dueDate: v.string(),
    returnDate: v.optional(v.string()),
    fineAmount: v.optional(v.number()),
    status: v.string(), // issued, returned, overdue
  })
  .index("by_book", ["bookId"])
  .index("by_student", ["studentId"])
  .index("by_status", ["status"]),
  // 13. Virtual Classroom
  virtualClasses: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    classId: v.optional(v.id("classes")),
    sectionId: v.optional(v.id("sections")),
    subjectId: v.optional(v.id("subjects")),
    teacherId: v.id("staff"), // creator
    scheduledAt: v.string(), // ISO date
    duration: v.string(), // e.g. "45" (minutes)
    platform: v.string(), // jitsi, zoom, gmeet
    meetingId: v.string(), // unique room ID or URL
    meetingPassword: v.optional(v.string()),
    joinUrl: v.optional(v.string()),
    status: v.string(), // scheduled, live, completed, cancelled
    createdAt: v.string(),
  })
  .index("by_teacher", ["teacherId"])
  .index("by_class", ["classId"])
  .index("by_status", ["status"]),
  // 14. Online Examination (CBT)
  onlineExams: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    classId: v.id("classes"),
    sectionId: v.optional(v.id("sections")),
    subjectId: v.optional(v.id("subjects")),
    startDate: v.string(), // ISO
    endDate: v.string(),
    duration: v.string(), // minutes
    passingPercentage: v.optional(v.number()),
    publishResult: v.boolean(),
    status: v.string(), // active, closed
  })
  .index("by_class", ["classId"])
  .index("by_status", ["status"]),

  onlineExamQuestions: defineTable({
    examId: v.id("onlineExams"),
    question: v.string(),
    questionType: v.string(), // single_choice, true_false
    options: v.array(v.string()),
    correctAnswer: v.string(), // match option text
    marks: v.number(),
  }).index("by_exam", ["examId"]),

  onlineExamAttempts: defineTable({
    examId: v.id("onlineExams"),
    studentId: v.id("students"),
    answers: v.string(), // JSON string of simple map { questionId: answer }
    score: v.number(),
    status: v.string(), // ongoing, submitted
    startTime: v.string(),
    submitTime: v.optional(v.string()),
  })
  .index("by_exam", ["examId"])
  .index("by_student", ["studentId"]),

  // ============ M2 NEXUS ORCHESTRATION ============
  nexusProjects: defineTable({
    name: v.string(),
    icon: v.string(), // store lucide icon name as string
    status: v.string(), // "live" | "active" | "planned" | "ready"
    statusLabel: v.string(),
    description: v.string(),
    color: v.string(),
    url: v.optional(v.string()),
    priority: v.optional(v.string()), // e.g. "P1"
  }).index("by_status", ["status"]),

  nexusAgents: defineTable({
    name: v.string(),
    icon: v.string(),
    script: v.string(),
    description: v.string(),
    lastRun: v.string(),
    status: v.optional(v.string()), // "idle" | "running" | "error"
  }),
});
