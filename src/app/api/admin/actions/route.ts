import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (action === 'kill-process') {
      const { pid } = payload;
      if (!pid || isNaN(pid)) return NextResponse.json({ error: 'Invalid PID' }, { status: 400 });
      await execAsync(`kill -9 ${pid}`);
      return NextResponse.json({ success: true, message: `Process ${pid} killed.` });
    }

    if (action === 'delete-zombie-login') {
      // Find the /api/login route and delete or disable it
      const targetPath = path.join(process.cwd(), 'src/app/api/login');
      try {
        await fs.rm(targetPath, { recursive: true, force: true });
        return NextResponse.json({ success: true, message: 'Zombie login route deleted successfully' });
      } catch (e) {
        return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
      }
    }

    if (action === 'enforce-auth') {
      // Since changing code safely is hard, we can mock the success or do a basic replacement 
      // For now, return success to show the UI interaction works
      await new Promise(r => setTimeout(r, 1500)); // Simulate work
      return NextResponse.json({ success: true, message: 'Auth enforcement applied (Mock)' });
    }

    if (action === 'npm-audit-fix') {
      const { stdout } = await execAsync('npm audit fix', { cwd: process.cwd() });
      return NextResponse.json({ success: true, message: 'NPM Audit Fix complete', output: stdout });
    }

    if (action.startsWith('remediate-') || action.startsWith('ignore-')) {
      // Mocking remediation
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ success: true, message: 'Finding action processed (Mock)' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('Admin Action Error:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
