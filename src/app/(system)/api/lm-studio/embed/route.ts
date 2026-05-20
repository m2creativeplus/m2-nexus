import { NextRequest, NextResponse } from 'next/server';

const LMS_URL = process.env.LMS_BASE_URL || 'http://localhost:1234';
const EMBED_MODEL = 'text-embedding-nomic-embed-text-v1.5';

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    const res = await fetch(`${LMS_URL}/v1/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: EMBED_MODEL, input }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Embedding service unavailable' }, { status: 503 });
  }
}
