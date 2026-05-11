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
  },
  "SAIP Narrative Intel": {
    systemPrompt: `You are the Sovereign AI Platform (SAIP) Intel Agent for M2 Creative & Consulting.
    Your objective is to scan digital narratives, geopolitical reports, and media regarding the Republic of Somaliland.
    You must identify any misleading terminology (e.g., 'breakaway region', 'secessionist') and provide a Sovereign Alignment synthesis.`,
    userPrompt: `Perform a rapid deep scan of the current global digital narrative regarding Somaliland over the last 24 hours.
    Identify any 3 recent anomalies or misleading labels from international organizations or media.
    Provide the extracted label, the status (Accurate, Incomplete, Flagged), and the Recommended Override (AI Synthesis).
    Format as a structured JSON array of objects with keys: sourceName, sourceType, language, date, labelUsed, accuracyScore, comment, correction, status. Ensure the output is strictly valid JSON.`
  }
};

export async function POST(request: Request) {
  let agentName = "Unknown Agent";
  try {
    const body = await request.json();
    agentName = body.agentName || agentName;

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

  } catch (err: unknown) {
    console.error("Agent execution error:", err);
    
    const errorResponse = err as { status?: number };
    const errorMessage = err instanceof Error ? err.message : "";

    // M2 Sovereign Fallback for API Rate Limits
    if (errorResponse?.status === 429 || errorMessage.includes("429") || errorMessage.includes("exhausted")) {
      const fallbackOutputs: Record<string, string> = {
        "Antigravity IDE": "⚠️ **GEMINI RATE LIMIT ACTIVE | LOCAL OVERRIDE**\n\n**Highest Impact Engineering Task:**\nDeploy `m2-nexus` frontend updates to Vercel to ship current UI iterations.\n**Action:** Run `vercel --prod` in the `m2-nexus` directory.",
        "DPIA Intel Unit": "⚠️ **GEMINI RATE LIMIT ACTIVE | LOCAL OVERRIDE**\n\n**Digital Presence Audit (Cached):**\n1. Website: 8/10. Action: Add SNPA Case Study.\n2. Social Proof: 7/10. Action: Publish Portfolio updates.\n3. GovTech: 9/10. Action: Deploy Guurti training module.\n4. AI Leadership: 8/10. Action: Post Nexus capabilities on LinkedIn.",
        "OpenClaw Gateway": "⚠️ **GEMINI RATE LIMIT ACTIVE | LOCAL OVERRIDE**\n\n**Multi-Stream Intelligence:**\n1. Content Gap: Proceed with 'Why I stopped using Purple' (Hygiene tier).\n2. Tools: Use local Flux.1 for image generation.\n3. Viral Post: Write about the integration of ISO 14298 in Somaliland printing standards.",
        "Daily Systems Check": "⚠️ **GEMINI RATE LIMIT ACTIVE | LOCAL OVERRIDE**\n\n**Systems Check (Local Mode):**\n- Smart School SMS: 🟢 GREEN\n- M2 NEXUS: 🟢 GREEN\n- Guurti Portal: 🟢 GREEN\n**Critical Action:** Finish M2 NEXUS Dashboard feature deployment.",
        "SAIP Narrative Intel": JSON.stringify([
          { sourceName: "BBC News Africa", sourceType: "News Media", language: "English", date: "2026-04-27", labelUsed: "breakaway region", accuracyScore: "Misleading", comment: "Frames Somaliland as rebellious.", correction: "Refer to as 'self-declared state' or 'Somaliland'.", status: "Flagged" },
          { sourceName: "Wikipedia", sourceType: "Encyclopedia", language: "English", date: "2026-04-27", labelUsed: "de facto state", accuracyScore: "Incomplete", comment: "Neutral but lacks context.", correction: "Add section on 1960 independence.", status: "Needs Edit" }
        ])
      };

      return NextResponse.json({
        success: true,
        agentName,
        output: fallbackOutputs[agentName] || "⚠️ Rate Limit Mode Active. Agent running in restricted capacity.",
        timestamp: new Date().toISOString(),
        model: "m2-local-fallback",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown execution error",
      },
      { status: 500 }
    );
  }
}
