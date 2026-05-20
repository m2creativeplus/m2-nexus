import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MCP_ROOT = process.env.MCP_FILESYSTEM_ROOT || '/Volumes/MAC DATA/Antigraphity';
const ALLOWED_DIRS = ['Sovereign_Data_Lake', 'M2_PROJECTS_HUB', 'M2_EPD_MASTER_HUB', 'rag-v1', 'js-code-sandbox'];

function isSafe(filePath: string): boolean {
  const normalized = path.resolve(filePath);
  return normalized.startsWith(path.resolve(MCP_ROOT)) &&
    ALLOWED_DIRS.some(d => normalized.includes(d));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('path') || '';
  const action = searchParams.get('action') || 'list';

  const fullPath = target ? path.join(MCP_ROOT, target) : MCP_ROOT;

  if (!isSafe(fullPath) && target) {
    return NextResponse.json({ error: 'Access denied — outside MCP boundary' }, { status: 403 });
  }

  try {
    if (action === 'read') {
      if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        return NextResponse.json({ error: 'File not found or is directory' }, { status: 404 });
      }
      const stat = fs.statSync(fullPath);
      if (stat.size > 500_000) {
        return NextResponse.json({ error: 'File too large (>500KB)' }, { status: 413 });
      }
      const content = fs.readFileSync(fullPath, 'utf-8');
      return NextResponse.json({ path: fullPath, content, size: stat.size });
    }

    // Default: list
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    }

    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) {
      return NextResponse.json({ error: 'Not a directory' }, { status: 400 });
    }

    const entries = fs.readdirSync(fullPath).map(name => {
      const entryPath = path.join(fullPath, name);
      try {
        const s = fs.statSync(entryPath);
        return { name, type: s.isDirectory() ? 'dir' : 'file', size: s.isDirectory() ? null : s.size };
      } catch {
        return { name, type: 'unknown', size: null };
      }
    });

    return NextResponse.json({ path: fullPath, entries });
  } catch (error) {
    return NextResponse.json({ error: 'MCP filesystem error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { path: target, content, action } = await req.json();
  const fullPath = path.join(MCP_ROOT, target || '');

  if (!isSafe(fullPath)) {
    return NextResponse.json({ error: 'Access denied — outside MCP boundary' }, { status: 403 });
  }

  if (action === 'write' && content !== undefined) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
    return NextResponse.json({ ok: true, path: fullPath });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
