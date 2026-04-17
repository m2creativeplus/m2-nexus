import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_LAKE_DIR = '/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/Sovereign_Data_Lake/memory';
const HEARTBEAT_FILE = path.join(DATA_LAKE_DIR, 'heartbeat.json');
const MEMORY_STREAM_FILE = path.join(DATA_LAKE_DIR, 'memory_stream.jsonl');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let heartbeat = { status: 'offline', safe_mode: false, last_task_attempted: 'none' };
    let memoryEvents: any[] = [];

    if (fs.existsSync(HEARTBEAT_FILE)) {
      const hbContent = fs.readFileSync(HEARTBEAT_FILE, 'utf-8');
      try {
        heartbeat = { ...heartbeat, ...JSON.parse(hbContent) };
      } catch (e) {}
    }

    if (fs.existsSync(MEMORY_STREAM_FILE)) {
      const memContent = fs.readFileSync(MEMORY_STREAM_FILE, 'utf-8');
      const lines = memContent.trim().split('\n').filter(Boolean);
      // Get the last 20 events
      memoryEvents = lines.slice(-20).map((line) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      }).filter(Boolean).reverse(); // newest first
    }

    return NextResponse.json({ heartbeat, memoryEvents });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read telemetry data' }, { status: 500 });
  }
}
