import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const TELEMETRY_DIR = '/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/M2_SOVEREIGN_CORE/telemetry';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(TELEMETRY_DIR, `execution_log_${today}.jsonl`);
    const eventsFile = path.join(TELEMETRY_DIR, 'events.log');

    let logs: any[] = [];
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf-8');
      logs = content.trim().split('\n').map(line => JSON.parse(line)).reverse();
    }

    let events: string[] = [];
    if (fs.existsSync(eventsFile)) {
      const content = fs.readFileSync(eventsFile, 'utf-8');
      events = content.trim().split('\n').reverse().slice(0, 50);
    }

    return NextResponse.json({
      success: true,
      logs,
      events,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sovereign Telemetry Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to read sovereign telemetry' }, { status: 500 });
  }
}
