import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const OS_ROOT = '/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/00_CORE_OS';
  const signalPath = path.join(OS_ROOT, 'memory/human_signals.json');

  try {
    const { run_id, accepted, rejected_reason, value_score } = await request.json();

    // Ensure directory exists
    if (!fs.existsSync(path.dirname(signalPath))) {
      fs.mkdirSync(path.dirname(signalPath), { recursive: true });
    }

    // Read existing signals
    let signals = [];
    if (fs.existsSync(signalPath)) {
      signals = JSON.parse(fs.readFileSync(signalPath, 'utf-8'));
    }

    // Append new signal
    const newSignal = {
      timestamp: new Date().toISOString(),
      run_id,
      accepted,
      rejected_reason: rejected_reason || null,
      value_score: value_score || (accepted ? 10 : 0)
    };

    signals.push(newSignal);

    // Keep only last 500 signals for performance
    const prunedSignals = signals.slice(-500);

    fs.writeFileSync(signalPath, JSON.stringify(prunedSignals, null, 2));

    return NextResponse.json({ status: 'success', message: 'Signal captured' });
  } catch (error: any) {
    console.error('Signal API Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
