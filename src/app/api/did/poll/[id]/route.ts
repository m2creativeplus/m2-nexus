import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const apiKey = process.env.DID_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'DID_API_KEY is missing' }, { status: 500 });
    }

    const authString = Buffer.from(apiKey).toString('base64');

    const response = await fetch(`https://api.d-id.com/talks/${resolvedParams.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.description || 'API Error' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("D-ID Poll Error:", error);
    return NextResponse.json({ error: 'Failed to poll D-ID talk status' }, { status: 500 });
  }
}
