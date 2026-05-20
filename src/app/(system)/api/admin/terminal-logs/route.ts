import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';

const execAsync = promisify(exec);
export const revalidate = 0;

async function run(cmd: string): Promise<string> {
  try {
    const { stdout } = await execAsync(cmd, { timeout: 5000 });
    return stdout.trim();
  } catch { return ''; }
}

export async function GET() {
  try {
    const home = os.homedir();
    const historyFile = path.join(home, '.zsh_history');

    // --- ZSH History ---
    let historyLines: { timestamp: string; command: string; category: string }[] = [];
    if (fs.existsSync(historyFile)) {
      const raw = fs.readFileSync(historyFile, 'latin1');
      const entries = raw.split('\n').reverse().slice(0, 200);
      historyLines = entries
        .map(line => {
          const extMatch = line.match(/^:\s*(\d+):\d+;(.+)$/);
          if (extMatch) return { ts: parseInt(extMatch[1]), cmd: extMatch[2].trim() };
          return line.trim() ? { ts: 0, cmd: line.trim() } : null;
        })
        .filter((e): e is { ts: number; cmd: string } => !!e && e.cmd.length > 0 && !e.cmd.startsWith(':'))
        .slice(0, 100)
        .map(e => ({
          timestamp: e.ts ? new Date(e.ts * 1000).toISOString() : new Date().toISOString(),
          command: e.cmd,
          category: categorize(e.cmd),
        }));
    }

    // --- Recently modified files in workspace ---
    const recentFiles = await run(
      `find "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS" -type f -newer /tmp/.nexus_check -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null | head -20`
    );
    // Create reference file if missing
    await run('touch /tmp/.nexus_check');

    // --- Current terminal processes ---
    const terminalProcs = await run(
      "ps aux | grep -E '(zsh|bash|node|npm|python|git|vercel)' | grep -v grep | head -15"
    );

    // --- Last logins ---
    const lastLogins = await run("last -5 2>/dev/null | head -10");

    // --- Recent git activity across all projects ---
    const gitLog = await run(
      `cd "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/m2-nexus" && git log --oneline --all -20 2>/dev/null`
    );

    const gitEntries = gitLog.split('\n').filter(Boolean).map(line => {
      const [hash, ...rest] = line.split(' ');
      return { hash: hash?.slice(0, 7), message: rest.join(' ') };
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      zshHistory: historyLines,
      recentFiles: recentFiles.split('\n').filter(Boolean).map(f => f.replace('/Volumes/MAC DATA/Antigraphity/', '~/')),
      terminalProcesses: terminalProcs.split('\n').filter(Boolean).map(line => {
        const parts = line.trim().split(/\s+/);
        return {
          pid: parts[1],
          cpu: parts[2],
          mem: parts[3],
          command: parts.slice(10).join(' ').slice(0, 80),
        };
      }),
      lastLogins: lastLogins.split('\n').filter(Boolean),
      gitLog: gitEntries,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch terminal logs' }, { status: 500 });
  }
}

function categorize(cmd: string): string {
  if (/^git/.test(cmd)) return 'git';
  if (/npm|yarn|pnpm|npx/.test(cmd)) return 'npm';
  if (/vercel/.test(cmd)) return 'deploy';
  if (/cd |ls |pwd|mkdir|rm |cp |mv /.test(cmd)) return 'filesystem';
  if (/python|node|ts-node/.test(cmd)) return 'runtime';
  if (/brew/.test(cmd)) return 'package';
  if (/ssh|curl|wget/.test(cmd)) return 'network';
  if (/grep|find|cat|less|head|tail/.test(cmd)) return 'search';
  return 'shell';
}
