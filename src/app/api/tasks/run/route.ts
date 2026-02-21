// This file goes into m2-nexus/src/app/api/tasks/run/route.ts
// It acts as the bridge that connects the Vercel Dashboard to your Local n8n Server

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { taskName, prompt } = await req.json();

    // In production, this would be an Ngrok forwarding URL pointing to your Mac
    // For local dev, this points to your newly installed n8n instance webhook
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/m2-nexus-agent';

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: taskName,
        details: prompt,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`n8n Local Execution Error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Task delegated to local n8n orchestrator successfully.",
      data
    });
  } catch (error: any) {
    console.error("Agent Execution Bridge Error:", error);
    // Graceful fallback for when the Mac is asleep or n8n is offline
    return NextResponse.json({
        success: false, 
        error: "Local Executor (n8n) is offline. Ensure your MacBook is awake and m2_start_n8n.sh is running."
    }, { status: 503 });
  }
}
