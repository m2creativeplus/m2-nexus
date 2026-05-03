import { NextResponse } from 'next/server';

export async function GET() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  if (convexUrl) {
    try {
      const res = await fetch(`${convexUrl}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: `nexus:getAgents`, args: {}, format: 'json' }),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ status: 'success', source: 'convex', data: data?.value ?? data, timestamp: new Date().toISOString() });
      }
    } catch {}
  }
  
  return NextResponse.json({ status: 'success', source: 'static', data: [], timestamp: new Date().toISOString() });
}
