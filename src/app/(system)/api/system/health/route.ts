import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_LAKE = process.env.SOVEREIGN_DATA_LAKE || '/Volumes/MAC DATA/Antigraphity/Sovereign_Data_Lake';
const WORKSPACE = '/Volumes/MAC DATA/Antigraphity';

export const revalidate = 0;

export async function GET() {
  try {
    const rawDir = path.join(DATA_LAKE, 'raw');
    let docCount = 0;
    let totalBytes = 0;

    if (fs.existsSync(rawDir)) {
      const files = fs.readdirSync(rawDir);
      docCount = files.length;
      files.forEach(f => {
        try {
          const stat = fs.statSync(path.join(rawDir, f));
          totalBytes += stat.size;
        } catch {}
      });
    }

    // Check LM Studio server
    let lmsOnline = false;
    let loadedModels: string[] = [];
    try {
      const r = await fetch('http://localhost:1234/v1/models', { signal: AbortSignal.timeout(2000) });
      if (r.ok) {
        const d = await r.json();
        lmsOnline = true;
        loadedModels = (d.data || []).map((m: { id: string }) => m.id);
      }
    } catch {}

    // Check OpenClaw
    let openclawOnline = false;
    try {
      const r = await fetch('http://localhost:18789/health', { signal: AbortSignal.timeout(1000) });
      openclawOnline = r.ok;
    } catch {}

    // Check Convex (package.json hint)
    const pkgPath = path.join(WORKSPACE, 'M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/m2-nexus/package.json');
    let convexConnected = false;
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      convexConnected = !!pkg.dependencies?.convex;
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      lmStudio: { online: lmsOnline, port: 1234, models: loadedModels },
      openClaw: { online: openclawOnline, port: 18789 },
      convex: { connected: convexConnected },
      sovereignDataLake: { docCount, totalBytes, path: rawDir },
      mcp: { filesystem: true },
      plugins: { ragV1: true, jsCodeSandbox: true },
    });
  } catch (error) {
    return NextResponse.json({ error: 'System health check failed' }, { status: 500 });
  }
}
