import { NextResponse } from 'next/server';

/**
 * GET /api/feeds/agents
 * Returns agent status and recent activity
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
        path: 'dataFeeds:getAgentActivity',
        args: {},
      }),
    });

    if (!response.ok) throw new Error(`Convex API error: ${response.status}`);
    
    const agents = await response.json();
    
    return NextResponse.json({
      status: 'success',
      data: agents,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Agents feed error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch agent status' },
      { status: 500 }
    );
  }
}
