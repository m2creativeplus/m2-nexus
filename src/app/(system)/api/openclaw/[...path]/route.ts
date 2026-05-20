import { NextRequest, NextResponse } from 'next/server';

const OPENCLAW_PORT = process.env.OPENCLAW_PORT || 18789;
const OPENCLAW_URL = `http://localhost:${OPENCLAW_PORT}`;

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const pathPrefix = resolvedParams.path ? resolvedParams.path.join('/') : '';
  const url = new URL(req.url);
  const searchParams = url.searchParams.toString();
  const targetUrl = `${OPENCLAW_URL}/${pathPrefix}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('OpenClaw Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to connect to OpenClaw Nerve Engine' }, { status: 502 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const pathPrefix = resolvedParams.path ? resolvedParams.path.join('/') : '';
  const url = new URL(req.url);
  const searchParams = url.searchParams.toString();
  const targetUrl = `${OPENCLAW_URL}/${pathPrefix}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const body = await req.json();
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('OpenClaw Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to connect to OpenClaw Nerve Engine' }, { status: 502 });
  }
}
