import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getLivePortfolio = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("portfolioItems").order("desc").collect();
  },
});

export const seedInitialPortfolio = mutation({
  args: {},
  handler: async (ctx) => {
    // Only seed if empty to prevent duplicates
    const existing = await ctx.db.query("portfolioItems").first();
    if (existing) return "Already seeded.";

    const items = [
      {
        title: "SNPA Vista Hub",
        type: "vercel",
        description: "Strategic knowledge portal and ISO modernization engine built on React/Vite.",
        url: "https://snpa-vista-hub.vercel.app",
      },
      {
        title: "Smart School SMS",
        type: "vercel",
        description: "Full-stack Next.js 15 convex deployment for institutional operations.",
        url: "https://smart-school-sms-manaalm2cawaale-3121s-projects.vercel.app",
      },
      {
        title: "M2 Sovereign Design System",
        type: "figma",
        description: "Official UI/UX case study and brand architecture components embedded directly from Figma.",
        embedUrl: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Ffile%2F1607595136433545833",
      }
    ];

    for (const item of items) {
      await ctx.db.insert("portfolioItems", item);
    }
    
    return "Seeded successfully.";
  },
});
