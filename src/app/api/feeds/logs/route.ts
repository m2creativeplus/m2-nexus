import { NextResponse } from 'next/server';

/**
 * GET /api/feeds/logs
 * Returns live activity logs
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
        path: 'dataFeeds:getLiveLogs',
        args: {},
      }),
    });

    if (!response.ok) throw new Error(`Convex API error: ${response.status}`);
    
    const logs = await response.json();
    
    return NextResponse.json({
      status: 'success',
      data: logs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Logs feed error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
