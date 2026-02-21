import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ==========================================
// M2 NEXUS: Central Project Registry Queries
// ==========================================

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("nexusProjects").collect();
  },
});

export const getAgents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("nexusAgents").collect();
  },
});

export const seedNexusData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if empty
    const existing = await ctx.db.query("nexusProjects").first();
    if (existing) return "Already seeded";

    const projects = [
      { name: "Smart School SMS", icon: "Shield", status: "live", statusLabel: "Active", description: "Next.js + Convex Student Management", color: "#22c55e", url: "https://smart-school-sms.vercel.app", priority: "P1" },
      { name: "M2 Creative Machine", icon: "Terminal", status: "live", statusLabel: "Deployed", description: "Sovereign AI Command Dashboard", color: "#22c55e", url: "https://m2-creative-machine.vercel.app", priority: "P1" },
      { name: "Guurti Portal", icon: "Landmark", status: "active", statusLabel: "In Progress", description: "House of Elders Legislative Portal", color: "#f59e0b", priority: "P1" },
      { name: "M2 Website", icon: "Globe", status: "active", statusLabel: "In Progress", description: "Main Agency Website (Next.js)", color: "#f59e0b", url: "https://m2creative-website.vercel.app", priority: "P2" },
      { name: "M2 NEXUS", icon: "Activity", status: "live", statusLabel: "Deployed", description: "Sovereign AI Data Dashboard", color: "#22c55e", url: "https://m2-nexus.vercel.app", priority: "P1" },
      { name: "SNPA Print Intel", icon: "FileText", status: "planned", statusLabel: "Scaffolded", description: "SNPA Research Portal Database", color: "#8b5cf6", priority: "P2" },
      { name: "Moving Ads", icon: "Car", status: "ready", statusLabel: "Concept", description: "Creator Economy Platform", color: "#3b82f6", priority: "P3" },
    ];

    for (const p of projects) {
      await ctx.db.insert("nexusProjects", p);
    }

    const agents = [
      { name: "Antigravity IDE", icon: "Code2", script: "gemini-2.0-flash", description: "Maximum Capacity Build Agent", lastRun: "Now", status: "idle" },
      { name: "DPIA Intel Unit", icon: "Cpu", script: "gemini-2.0-flash", description: "Digital Presence Audits & Scoring", lastRun: "Feb 20", status: "idle" },
      { name: "OpenClaw Gateway", icon: "Terminal", script: "gemini-2.0-flash", description: "Terminal Multi-Agent Hub", lastRun: "Feb 20", status: "idle" },
      { name: "Daily Systems Check", icon: "Shield", script: "gemini-2.0-flash", description: "Clear clutter, check Git, check storage", lastRun: "Today", status: "idle" },
    ];

    for (const a of agents) {
      await ctx.db.insert("nexusAgents", a);
    }

    return "Seeded successfully";
  }
});
