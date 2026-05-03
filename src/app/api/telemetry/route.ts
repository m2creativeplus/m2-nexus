import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      const [logsRes, statsRes] = await Promise.all([
        fetch(`${convexUrl}/api/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: 'telemetry:getLatestFull', args: { limit: 20 }, format: 'json' }),
          signal: AbortSignal.timeout(4000),
        }),
        fetch(`${convexUrl}/api/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: 'telemetry:getStats', args: {}, format: 'json' }),
          signal: AbortSignal.timeout(4000),
        }),
      ]);

      if (logsRes.ok && statsRes.ok) {
        const logs = await logsRes.json();
        const stats = await statsRes.json();
        return NextResponse.json({
          source: 'convex',
          heartbeat: stats?.value ?? stats,
          memoryEvents: logs?.value ?? logs,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      source: 'static',
      heartbeat: { status: 'offline', safe_mode: true, last_task_attempted: 'none' },
      memoryEvents: [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read telemetry data' }, { status: 500 });
  }
}
