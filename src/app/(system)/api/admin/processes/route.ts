import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
export const revalidate = 0;

export async function GET() {
  try {
    // ps aux sorted by CPU desc, top 40 processes
    const { stdout: psOut } = await execAsync(
      "ps aux --no-header 2>/dev/null || ps aux | tail -n +2",
      { timeout: 5000 }
    );

    const lines = psOut.trim().split('\n').filter(Boolean);

    const processes = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      const user = parts[0] ?? '';
      const pid = parseInt(parts[1] ?? '0');
      const cpu = parseFloat(parts[2] ?? '0');
      const mem = parseFloat(parts[3] ?? '0');
      // VSZ and RSS in KB
      const vsz = parseInt(parts[4] ?? '0');
      const rss = parseInt(parts[5] ?? '0');
      const stat = parts[7] ?? '';
      // command starts at index 10
      const command = parts.slice(10).join(' ') || parts.slice(9).join(' ');
      const name = command.split('/').pop()?.split(' ')[0] ?? command;

      return { user, pid, cpu, mem, vsz, rss, stat, command: command.slice(0, 80), name };
    })
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 50);

    // Top CPU consumers
    const topCpu = processes.slice(0, 5);
    // Top memory consumers
    const topMem = [...processes].sort((a, b) => b.mem - a.mem).slice(0, 5);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      total: lines.length,
      processes,
      topCpu,
      topMem,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch processes' }, { status: 500 });
  }
}
