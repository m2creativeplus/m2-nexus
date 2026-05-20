import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const eventsFile = '/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/M2_SOVEREIGN_CORE/telemetry/events.log';
  
  try {
    if (fs.existsSync(eventsFile)) {
      const content = fs.readFileSync(eventsFile, 'utf-8');
      const lines = content.trim().split('\n').reverse().slice(0, 50);
      
      const data = lines.map(line => {
        // Format: 2026-05-16 01:23:45: [TYPE] Message
        const match = line.match(/^(.+?): \[(.+?)\] (.+)$/);
        if (match) {
          return {
            timestamp: match[1],
            type: match[2].toLowerCase().includes('failed') || match[2].toLowerCase().includes('error') ? 'error' : 
                  match[2].toLowerCase().includes('complete') ? 'success' : 'info',
            agent: match[2],
            action: match[3]
          };
        }
        return { agent: 'System', action: line, type: 'info' };
      });

      return NextResponse.json({ status: 'success', source: 'local', data, timestamp: new Date().toISOString() });
    }
  } catch (error) {
    console.error('Local Log Read Error:', error);
  }

  // Fallback to Convex if local file not found
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (convexUrl) {
    try {
      const res = await fetch(`${convexUrl}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: `m2_agent:getLogs`, args: {}, format: 'json' }),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ status: 'success', source: 'convex', data: data?.value ?? data, timestamp: new Date().toISOString() });
      }
    } catch {}
  }
  
  return NextResponse.json({ status: 'success', source: 'empty', data: [], timestamp: new Date().toISOString() });
}
