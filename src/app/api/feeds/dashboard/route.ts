import { NextResponse } from 'next/server';

/**
 * GET /api/feeds/dashboard
 * Returns aggregated dashboard metrics (all-in-one)
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
        path: 'dataFeeds:getDashboardMetrics',
        args: {},
      }),
    });

    if (!response.ok) throw new Error(`Convex API error: ${response.status}`);
    
    const metrics = await response.json();
    
    return NextResponse.json({
      status: 'success',
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard metrics feed error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
