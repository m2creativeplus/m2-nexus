import { NextResponse } from 'next/server';

const LMS_URL = process.env.LMS_BASE_URL || 'http://localhost:1234';

export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch(`${LMS_URL}/v1/models`, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json({ online: false, models: [] }, { status: 200 });
    }

    const data = await res.json();

    const models = (data.data || []).map((m: { id: string; object: string }) => ({
      id: m.id,
      name: m.id.split('/').pop()?.replace(/-/g, ' ') || m.id,
      provider: m.id.split('/')[0] || 'local',
      type: m.id.includes('embed') ? 'embedding' : 'chat',
      active: true,
    }));

    return NextResponse.json({ online: true, models, port: 1234 });
  } catch {
    return NextResponse.json({ online: false, models: [], error: 'LM Studio server not running' }, { status: 200 });
  }
}
