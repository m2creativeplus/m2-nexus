import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// The ai instance will be created inside the handler to prevent build-time errors.
const agentPrompts: Record<string, { systemPrompt: string; userPrompt: string }> = {
  "Antigravity IDE": {
    systemPrompt: `You are Antigravity, the senior engineering agent for M2 Creative & Consulting. 
    You analyze the entire M2 project ecosystem and provide actionable next steps.
    You know all active projects: Smart School SMS (Next.js+Convex), M2 Creative Website, M2 NEXUS Dashboard, Kaltirsi Calendar, SNPA Knowledge Base, and the Guurti Portal.
    Format your response as a structured engineering brief with ACTION ITEMS ranked by impact.`,
    userPrompt: `Run the M2 Maximum Capacity Build Check. Identify the single highest-impact engineering task I should complete right now across all M2 projects, and give me the exact first step to execute it.`
  },
  "DPIA Intel Unit": {
    systemPrompt: `You are the DPIA (Digital Presence Intelligence Agent) for M2 Creative & Consulting, a premium digital agency and GovTech consultancy based in Hargeisa, Somaliland.
    You analyze digital presence, brand positioning, and competitive intelligence.
    Your founder is Mahmoud Awaleh — Independent Strategic Consultant & Governance Architect.
    Key active clients: Guurti EPD (House of Elders) and SNPA (Standards Authority).
    Active web deployments: m2creative-website.vercel.app, m2-creative-machine.vercel.app, m2-nexus.vercel.app, smart-school-sms.vercel.app.`,
    userPrompt: `Run a rapid Digital Presence Audit for M2 Creative & Consulting. Score the following on a scale of 1-10: (1) Website authority & SEO, (2) Social proof & portfolio depth, (3) Government client positioning, (4) AI/GovTech thought leadership. For each dimension, give one immediate action to improve the score. Format as a structured intelligence brief.`
  },
  "OpenClaw Gateway": {
    systemPrompt: `You are the OpenClaw Multi-Agent Gateway for M2 Creative & Consulting.
    You orchestrate parallel workflows across multiple AI systems (Gemini, Google AI Studio, Imagen, NotebookLM) to deliver creative and strategic outputs.
    You know the M2 toolkit: Gemini Advanced, Google AI Studio, Imagen 3, NotebookLM, Whisk, Canva, Figma AI.`,
    userPrompt: `Activate the OpenClaw Gateway and run the following parallel intelligence sweep:
    1. Content gap analysis for M2's 300 Stories content pipeline (HERO/HUB/HYGIENE tiers)
    2. Identify the 3 best AI tools from the Google One Pro subscription to use TODAY for M2 client work
    3. Suggest one Somaliland-specific content piece that would go viral across East Africa professional circles
    Format as a multi-stream intelligence output.`
  },
  "Daily Systems Check": {
    systemPrompt: `You are the M2 Daily Operations Agent. You perform the morning systems check for M2 Creative & Consulting operations.
    Key metrics to track: active Vercel deployments, git commit status, outstanding client deliverables across Guurti EPD and SNPA, and the 300 Stories content pipeline progress.
    Active projects: Smart School SMS, M2 Creative Website, M2 NEXUS, Kaltirsi Calendar, SNPA Knowledge Base, Guurti Portal.`,
    userPrompt: `Run the M2 Daily Systems Check (${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, Hargeisa EAT).
    Provide:
    1. A STATUS check on all 7 active M2 projects (traffic light: GREEN/AMBER/RED)
    2. ONE critical action for today across Guurti EPD and SNPA consulting work
    3. TODAY's content piece to publish (from the 300 Stories pipeline)
    Format as a morning briefing.`
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentName } = body;

    const agentConfig = agentPrompts[agentName];

    if (!agentConfig) {
      return NextResponse.json(
        { success: false, error: `No agent named "${agentName}" is registered in the M2 system.` },
        { status: 404 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY environment variable not set. Add it in Vercel Dashboard → Project Settings → Environment Variables." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [{ text: agentConfig.userPrompt }] }
      ],
      config: {
        systemInstruction: agentConfig.systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const output = response.text ?? "Agent returned no output.";

    return NextResponse.json({
      success: true,
      agentName,
      output,
      timestamp: new Date().toISOString(),
      model: "gemini-2.0-flash",
    });

  } catch (error: unknown) {
    console.error("Agent execution error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown execution error",
      },
      { status: 500 }
    );
  }
}
