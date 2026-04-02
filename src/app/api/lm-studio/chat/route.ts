import { NextRequest } from 'next/server';

const LMS_URL = process.env.LMS_BASE_URL || 'http://localhost:1234';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model, stream = true, temperature = 0.7, max_tokens = 2048 } = body;

    const response = await fetch(`${LMS_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream, temperature, max_tokens }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: err }), { status: response.status });
    }

    if (stream && response.body) {
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('[LM Studio Chat] Error:', error);
    return Response.json({ error: 'LM Studio unreachable. Ensure server is running on port 1234.' }, { status: 503 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
