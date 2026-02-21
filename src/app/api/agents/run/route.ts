import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Map frontend agent names to actual absolute paths on the MacBook
const agentScripts: Record<string, string> = {
  "DPIA Intel Unit": 'cd "/Volumes/MAC DATA/Antigraphity" && python3 m2_presence_analyzer.py',
  "Daily Systems Check": 'cd "/Volumes/MAC DATA/Antigraphity" && bash M2_PROJECTS_HUB/10_SCRIPTS/m2_daily_check.sh',
  // Add more local scripts mapping here as they are developed
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentName } = body;

    const cmd = agentScripts[agentName];

    if (!cmd) {
      return NextResponse.json({ error: "Agent script mapping not found" }, { status: 404 });
    }

    // Execute the local script
    const { stdout, stderr } = await execAsync(cmd);

    return NextResponse.json({ 
      success: true, 
      message: "Agent executed successfully", 
      stdout,
      stderr 
    });

  } catch (error: unknown) {
    console.error("Agent execution failed:", error);
    return NextResponse.json({ 
      error: "Execution failed", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
