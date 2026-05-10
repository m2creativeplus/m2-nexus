"use server";

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Configure to use the local Sovereign AI (LM Studio)
const localAI = createOpenAI({
  baseURL: process.env.LMS_BASE_URL ? `${process.env.LMS_BASE_URL}/v1` : 'http://localhost:1234/v1',
  apiKey: 'lm-studio-local', // API key is ignored by LM Studio but required by SDK
});

export async function deepNarrativeAnalysis(dataSnapshot: unknown[]) {
  try {
    const prompt = `
      You are the Sovereign Intelligence Agent for the M2 NEXUS system.
      Analyze the following snapshot of global media narratives concerning Somaliland.
      Provide a concise, strategic executive summary (max 3 paragraphs) detailing:
      1. The prevailing bias or accuracy trend.
      2. The most dangerous misleading terms being used.
      3. A strategic communication recommendation to counter these narratives based on Somaliland's 1960 independence.
      
      Data Snapshot:
      ${JSON.stringify(dataSnapshot, null, 2)}
    `;

    const { text } = await generateText({
      model: localAI('microsoft/phi-4-mini-reasoning'), // Or fallback to a generic model name if this fails
      prompt: prompt,
    });

    return { success: true, text };
  } catch (error) {
    console.error("Local AI Engine Error:", error);
    // Graceful fallback for demo/development if LM Studio is offline
    return { 
      success: false, 
      text: "🚨 Local Sovereign AI Engine (LM Studio) is currently offline or unreachable on port 1234.\n\n**Fallback Analysis**:\n- The data indicates a high volume of 'Misleading' classifications (e.g., 'secessionist region', 'gobolada waqooyi').\n- The prevailing bias attempts to legally subordinate Somaliland to Somalia, ignoring the 1960 independence fact.\n- **Recommendation**: Deploy the M2 Orbit bot to auto-reply to these sources with the 2005 AU Fact-Finding mission report."
    };
  }
}
