import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
export const revalidate = 0;

async function run(cmd: string): Promise<string> {
  try {
    const { stdout } = await execAsync(cmd, { timeout: 5000 });
    return stdout.trim();
  } catch {
    return '';
  }
}

export async function GET() {
  try {
    const [cpuRaw, memRaw, diskRaw, netRaw, uptimeRaw, loadRaw, machineName] = await Promise.all([
      // CPU usage via top snapshot
      run("top -l 1 -n 0 | grep 'CPU usage'"),
      // Memory via vm_stat
      run("vm_stat"),
      // Disk usage
      run("df -H / | tail -1"),
      // Network interfaces bytes
      run("netstat -ib | grep -E '^en' | head -5"),
      // Uptime
      run("uptime"),
      // Load average
      run("sysctl -n vm.loadavg"),
      // Machine name
      run("scutil --get ComputerName"),
    ]);

    // --- CPU ---
    // "CPU usage: 12.50% user, 8.33% sys, 79.16% idle"
    const cpuMatch = cpuRaw.match(/(\d+\.\d+)%\s+user.*?(\d+\.\d+)%\s+sys.*?(\d+\.\d+)%\s+idle/);
    const cpuUser = parseFloat(cpuMatch?.[1] ?? '0');
    const cpuSys = parseFloat(cpuMatch?.[2] ?? '0');
    const cpuIdle = parseFloat(cpuMatch?.[3] ?? '100');
    const cpuUsage = Math.round(cpuUser + cpuSys);

    // --- Memory (vm_stat page size 16384 on Apple Silicon) ---
    const pageSize = 16384;
    const vmPages: Record<string, number> = {};
    memRaw.split('\n').forEach(line => {
      const m = line.match(/^(.+?):\s+(\d+)/);
      if (m) vmPages[m[1].trim()] = parseInt(m[2]) * pageSize;
    });
    const memWired = vmPages['Pages wired down'] ?? 0;
    const memActive = vmPages['Pages active'] ?? 0;
    const memInactive = vmPages['Pages inactive'] ?? 0;
    const memFree = vmPages['Pages free'] ?? 0;
    const memTotal = memWired + memActive + memInactive + memFree;
    const memUsed = memWired + memActive;
    const memPercent = memTotal > 0 ? Math.round((memUsed / memTotal) * 100) : 0;

    // --- Disk ---
    const diskParts = diskRaw.split(/\s+/);
    const diskSize = diskParts[1] ?? '0';
    const diskUsed = diskParts[2] ?? '0';
    const diskAvail = diskParts[3] ?? '0';
    const diskPercent = parseInt(diskParts[4]?.replace('%', '') ?? '0');

    // --- Network ---
    const netLines = netRaw.split('\n').filter(Boolean);
    let netIn = 0, netOut = 0;
    netLines.forEach(line => {
      const parts = line.split(/\s+/);
      netIn += parseInt(parts[6] ?? '0') || 0;
      netOut += parseInt(parts[9] ?? '0') || 0;
    });

    // --- Load ---
    // "{ 2.50 1.75 1.25 }"
    const loadMatch = loadRaw.match(/([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    const load1 = parseFloat(loadMatch?.[1] ?? '0');
    const load5 = parseFloat(loadMatch?.[2] ?? '0');
    const load15 = parseFloat(loadMatch?.[3] ?? '0');

    // --- Uptime ---
    const uptimeClean = uptimeRaw.replace(/.*up\s+/, '').split(',').slice(0, 2).join(',').trim();

    return NextResponse.json({
      machine: machineName || 'M2 MacBook',
      timestamp: new Date().toISOString(),
      cpu: {
        usage: cpuUsage,
        user: cpuUser,
        sys: cpuSys,
        idle: cpuIdle,
        load: { '1m': load1, '5m': load5, '15m': load15 },
      },
      memory: {
        totalGB: parseFloat((memTotal / 1e9).toFixed(1)),
        usedGB: parseFloat((memUsed / 1e9).toFixed(1)),
        freeGB: parseFloat((memFree / 1e9).toFixed(1)),
        percent: memPercent,
        wiredGB: parseFloat((memWired / 1e9).toFixed(1)),
        activeGB: parseFloat((memActive / 1e9).toFixed(1)),
      },
      disk: {
        size: diskSize,
        used: diskUsed,
        available: diskAvail,
        percent: diskPercent,
      },
      network: {
        bytesIn: netIn,
        bytesOut: netOut,
        mbIn: parseFloat((netIn / 1e6).toFixed(1)),
        mbOut: parseFloat((netOut / 1e6).toFixed(1)),
      },
      uptime: uptimeClean,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch system stats' }, { status: 500 });
  }
}
