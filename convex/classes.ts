import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all classes with their sections
export const list = query({
  args: {},
  handler: async (ctx) => {
    const classes = await ctx.db.query("classes").collect();
    
    // Enrich with sections
    const classesWithSections = await Promise.all(
      classes.map(async (cls) => {
        const sections = await ctx.db
          .query("sections")
          .withIndex("by_class", (q) => q.eq("classId", cls._id))
          .collect();
        return { ...cls, sectionDetails: sections };
      })
    );
    
    return classesWithSections;
  },
});

// Seed initial classes and sections
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingClasses = await ctx.db.query("classes").collect();
    if (existingClasses.length > 0) return "Already seeded";

    const classNames = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
    const sectionNames = ["A", "B", "C"];

    for (const name of classNames) {
      const classId = await ctx.db.insert("classes", {
        name,
        sections: sectionNames, // storing simple array for quick access
      });

      for (const sectionName of sectionNames) {
        await ctx.db.insert("sections", {
          name: sectionName,
          classId,
        });
      }
    }

    return "Seeding complete";
  },
});
