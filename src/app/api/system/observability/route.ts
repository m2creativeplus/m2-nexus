import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const OS_ROOT = '/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/00_CORE_OS';

  try {
    const systemState = JSON.parse(fs.readFileSync(path.join(OS_ROOT, 'state/system_state.json'), 'utf-8'));
    const lastRun = JSON.parse(fs.readFileSync(path.join(OS_ROOT, 'state/last_run.json'), 'utf-8'));
    const failures = JSON.parse(fs.readFileSync(path.join(OS_ROOT, 'memory/failure_memory.json'), 'utf-8'));

    return NextResponse.json({
      status: 'success',
      data: {
        systemState,
        lastRun,
        failures: failures.slice(-5), // Last 5 failures
        heartbeat: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Observability API Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to read system telemetry',
      details: error.message
    }, { status: 500 });
  }
}
