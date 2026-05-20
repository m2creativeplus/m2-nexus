import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

// Allowed commands for n8n to trigger (Whitelisted for security)
const ALLOWED_COMMANDS: Record<string, string> = {
  "boot": "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/00_CORE_OS/scripts/m2_boot.sh",
  "audit": "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/06_SYSTEM_OPS/m2_forensic_audit.py",
  "sync": "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/06_SYSTEM_OPS/SCRIPTS/m2_gdrive_sync.sh",
  "cleanup": "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/06_SYSTEM_OPS/SCRIPTS/m2_cleanup.sh",
  "mission_control": "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/06_SYSTEM_OPS/SCRIPTS/m2_mission_control.sh"
};

export async function POST(request: Request) {
  try {
    const { command_key, args } = await request.json();

    if (!ALLOWED_COMMANDS[command_key]) {
      return NextResponse.json({ 
        status: 'error', 
        message: `Command '${command_key}' is not whitelisted in Sovereign Nexus.` 
      }, { status: 403 });
    }

    const commandPath = ALLOWED_COMMANDS[command_key];
    const fullCommand = args ? `${commandPath} ${args}` : commandPath;

    console.log(`[NEXUS BRIDGE] Executing: ${fullCommand}`);
    
    const { stdout, stderr } = await execPromise(fullCommand);

    // Log the execution to human_signals for the Antigravity Score
    const signalPath = '/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/00_CORE_OS/memory/human_signals.json';
    if (fs.existsSync(signalPath)) {
      const signals = JSON.parse(fs.readFileSync(signalPath, 'utf-8'));
      signals.push({
        timestamp: new Date().toISOString(),
        run_id: `n8n_${command_key}_${Date.now()}`,
        accepted: true,
        type: "automated_bridge_execution",
        command: command_key
      });
      fs.writeFileSync(signalPath, JSON.stringify(signals.slice(-500), null, 2));
    }

    return NextResponse.json({ 
      status: 'success', 
      output: stdout, 
      error: stderr 
    });

  } catch (error: any) {
    console.error('[NEXUS BRIDGE] Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
