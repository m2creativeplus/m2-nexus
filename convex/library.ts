import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ============ BOOKS ============
export const listBooks = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let books = await ctx.db.query("books").collect();

    if (args.category) {
      books = books.filter((b) => b.category === args.category);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(searchLower) ||
          b.author.toLowerCase().includes(searchLower) ||
          b.bookNo.toLowerCase().includes(searchLower)
      );
    }

    return books;
  },
});

export const getBook = query({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createBook = mutation({
  args: {
    bookNo: v.string(),
    title: v.string(),
    author: v.string(),
    publisher: v.optional(v.string()),
    isbn: v.optional(v.string()),
    category: v.string(),
    subject: v.optional(v.string()),
    rackNo: v.optional(v.string()),
    totalCopies: v.number(),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("books", {
      ...args,
      availableCopies: args.totalCopies,
    });
  },
});

export const updateBook = mutation({
  args: {
    id: v.id("books"),
    data: v.object({
      title: v.optional(v.string()),
      author: v.optional(v.string()),
      publisher: v.optional(v.string()),
      category: v.optional(v.string()),
      rackNo: v.optional(v.string()),
      totalCopies: v.optional(v.number()),
      availableCopies: v.optional(v.number()),
      price: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
  },
});

export const removeBook = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    // Check if any issues exist
    const issues = await ctx.db
      .query("bookIssues")
      .withIndex("by_book", (q) => q.eq("bookId", args.id))
      .filter((q) => q.eq(q.field("status"), "issued"))
      .collect();
    
    if (issues.length > 0) {
      throw new Error("Cannot delete book with active issues");
    }
    
    await ctx.db.delete(args.id);
  },
});

// ============ BOOK ISSUES ============
export const listIssues = query({
  args: {
    status: v.optional(v.string()),
    bookId: v.optional(v.id("books")),
  },
  handler: async (ctx, args) => {
    let issues = await ctx.db.query("bookIssues").collect();

    if (args.status) {
      issues = issues.filter((i) => i.status === args.status);
    }

    if (args.bookId) {
      issues = issues.filter((i) => i.bookId === args.bookId);
    }

    // Enrich with book data
    const enriched = await Promise.all(
      issues.map(async (issue) => {
        const book = await ctx.db.get(issue.bookId);
        return {
          ...issue,
          bookNo: book?.bookNo || "Unknown",
          bookTitle: book?.title || "Unknown",
        };
      })
    );

    return enriched.sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  },
});

export const issueBook = mutation({
  args: {
    bookId: v.id("books"),
    studentId: v.optional(v.id("students")),
    staffId: v.optional(v.id("staff")),
    memberType: v.string(),
    memberName: v.string(),
    admissionNo: v.optional(v.string()),
    issueDate: v.string(),
    dueDate: v.string(),
  },
  handler: async (ctx, args) => {
    // Check availability
    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Book not found");
    if (book.availableCopies <= 0) throw new Error("No copies available");

    // Reduce available copies
    await ctx.db.patch(args.bookId, {
      availableCopies: book.availableCopies - 1,
    });

    return await ctx.db.insert("bookIssues", {
      ...args,
      status: "issued",
    });
  },
});

export const returnBook = mutation({
  args: {
    id: v.id("bookIssues"),
    returnDate: v.string(),
    fineAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) throw new Error("Issue not found");
    if (issue.status === "returned") throw new Error("Already returned");

    // Increase available copies
    const book = await ctx.db.get(issue.bookId);
    if (book) {
      await ctx.db.patch(issue.bookId, {
        availableCopies: book.availableCopies + 1,
      });
    }

    await ctx.db.patch(args.id, {
      returnDate: args.returnDate,
      fineAmount: args.fineAmount,
      status: "returned",
    });
  },
});

// ============ STATS ============
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    const issues = await ctx.db.query("bookIssues").collect();

    const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const issuedBooks = totalBooks - availableBooks;
    const overdueIssues = issues.filter((i) => {
      if (i.status !== "issued") return false;
      return new Date(i.dueDate) < new Date();
    }).length;

    return {
      totalBooks,
      availableBooks,
      issuedBooks,
      bookTitles: books.length,
      overdueIssues,
    };
  },
});

// ============ SEED ============
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("books").collect();
    if (existing.length > 0) return "Already seeded";

    const books = [
      { bookNo: "BK001", title: "Mathematics Textbook", author: "John Smith", category: "Academic", totalCopies: 50, price: 25 },
      { bookNo: "BK002", title: "Science Lab Manual", author: "Jane Doe", category: "Academic", totalCopies: 30, price: 15 },
      { bookNo: "BK003", title: "English Literature", author: "Emily Johnson", category: "Academic", totalCopies: 40, price: 20 },
      { bookNo: "BK004", title: "World History", author: "Michael Brown", category: "Academic", totalCopies: 25, price: 18 },
      { bookNo: "BK005", title: "Harry Potter Collection", author: "J.K. Rowling", category: "Fiction", totalCopies: 20, price: 35 },
      { bookNo: "BK006", title: "Physics Fundamentals", author: "Robert Wilson", category: "Academic", totalCopies: 35, price: 22 },
      { bookNo: "BK007", title: "Chemistry Basics", author: "Lisa Chen", category: "Academic", totalCopies: 30, price: 20 },
      { bookNo: "BK008", title: "Biology Handbook", author: "Dr. Sarah Lee", category: "Reference", totalCopies: 15, price: 45 },
    ];

    for (const book of books) {
      await ctx.db.insert("books", {
        ...book,
        availableCopies: book.totalCopies,
      });
    }

    return "Library seeded";
  },
});
