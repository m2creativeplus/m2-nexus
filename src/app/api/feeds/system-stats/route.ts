import { NextResponse } from 'next/server';

/**
 * GET /api/feeds/system-stats
 * Returns real-time system metrics (CPU, RAM, Storage, Agent status)
 */
export async function GET(request: Request) {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error('NEXT_PUBLIC_CONVEX_URL not configured');
    }

    const response = await fetch(`${convexUrl}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'dataFeeds:getSystemStats',
        args: {},
      }),
    });

    if (!response.ok) throw new Error(`Convex API error: ${response.status}`);
    
    const stats = await response.json();
    
    return NextResponse.json({
      status: 'success',
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('System stats feed error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch system stats' },
      { status: 500 }
    );
  }
}
