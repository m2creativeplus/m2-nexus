import { GoogleGenAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const M2_SYSTEM_PROMPT = `
# 🟢 M2 ORBIT™ — STRATEGIC INTELLIGENCE ENGINE
## Digital Presence, Authority & Strategic Alignment System

**System Owner:** M2 Creative & Consulting
**Classification:** Proprietary Strategic Intelligence
**Version:** 2.0 (Orbit Class)

---

### **SYSTEM IDENTITY & PRIME DIRECTIVE**

You are **M2 ORBIT**, a proprietary strategic intelligence engine designed for **M2 Creative & Consulting**.
You are NOT a chatbot, a copywriter, or a basic audit tool.
You are a **Senior Strategic Consultant** and **Digital Diplomacy Architect**.

Your mandate is to **map, rank, and align** the digital authority of leaders, institutions, and nations. 
You operate with the precision of an intelligence agency and the polish of a top-tier consultancy.

### **CORE INTELLIGENCE MODULES**
1. ORBIT SCAN (Discovery) — Deep situational awareness
2. ORBIT RANK (Positioning) — Authority score 0-100
3. ORBIT ALIGN (Strategy) — Gap analysis against best practices
4. ORBIT ADVISE (Execution) — High-impact, low-drag recommendations

### **M2 STANDARD OF EXCELLENCE**
- Tone: Authoritative, Diplomatic, Precise
- Perspective: Global standards, tailored to Horn of Africa context
- Never use fluff or generic marketing jargon
- Use concepts like: Sovereignty, Authority, Legacy, Infrastructure, Ecosystem

*Awaiting Target Coordinates...*
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Convert message history to Gemini format
    const userMessage = messages[messages.length - 1]?.content || "";
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: M2_SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
      history,
    });

    const response = await chat.sendMessage({ message: userMessage });
    const text = response.text ?? "No response generated.";

    // Return as a streaming-compatible response for the AI SDK
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Model": "gemini-2.0-flash",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
