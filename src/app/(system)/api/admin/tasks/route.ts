import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
export const revalidate = 0;

const WORKSPACE = '/Volumes/MAC DATA/Antigraphity';

async function run(cmd: string): Promise<string> {
  try {
    const { stdout } = await execAsync(cmd, { timeout: 8000 });
    return stdout.trim();
  } catch { return ''; }
}

const ACTIVE_PROJECTS = [
  { name: 'M2 Nexus', path: 'M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/m2-nexus', url: 'https://m2-nexus.vercel.app', tech: 'Next.js + Convex' },
  { name: 'Smart School SMS', path: 'M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/smart-school-sms', url: 'https://smart-school-sms.vercel.app', tech: 'Next.js + Convex' },
  { name: 'M2 Creative Website', path: 'm2creative-website', url: 'https://m2creative-website.vercel.app', tech: 'Next.js' },
  { name: 'SNPA Knowledge Base', path: 'snpa-knowledge-base', url: 'https://snpa-print-intelligence.vercel.app', tech: 'Vite + React' },
  { name: 'Moving Ads', path: 'm2-moving-ads', url: 'https://m2-moving-ads-web.vercel.app', tech: 'Next.js' },
  { name: 'M2 Dev Library', path: 'm2-dev-library', url: null, tech: 'npm registry' },
];

export async function GET() {
  try {
    const projects = await Promise.all(ACTIVE_PROJECTS.map(async proj => {
      const fullPath = path.join(WORKSPACE, proj.path);
      const exists = fs.existsSync(fullPath);
      if (!exists) return { ...proj, status: 'missing', commits: 0, lastCommit: null, uncommitted: 0, branch: 'unknown' };

      const [gitLog, gitStatus, gitBranch] = await Promise.all([
        run(`cd "${fullPath}" && git log --oneline -5 2>/dev/null`),
        run(`cd "${fullPath}" && git status --short 2>/dev/null`),
        run(`cd "${fullPath}" && git branch --show-current 2>/dev/null`),
      ]);

      const lastCommitLine = gitLog.split('\n')[0] ?? '';
      const [hash, ...msgParts] = lastCommitLine.split(' ');
      const uncommittedCount = gitStatus.split('\n').filter(Boolean).length;

      // Get last modified time
      const pkgPath = path.join(fullPath, 'package.json');
      let tech = proj.tech;
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps.convex) tech = tech.includes('Convex') ? tech : tech + ' + Convex';
      }

      return {
        ...proj,
        tech,
        status: uncommittedCount > 0 ? 'dirty' : 'clean',
        branch: gitBranch || 'main',
        lastCommit: { hash: hash?.slice(0, 7), message: msgParts.join(' ').slice(0, 60) },
        uncommitted: uncommittedCount,
        recentCommits: gitLog.split('\n').filter(Boolean).map(l => {
          const [h, ...m] = l.split(' ');
          return { hash: h?.slice(0,7), message: m.join(' ').slice(0, 60) };
        }),
      };
    }));

    // Active tasks from task files in brain
    const taskFiles: Array<{ project: string; tasks: Array<{ text: string; done: boolean }> }> = [];
    const brainDir = '/Users/m2creative/.gemini/antigravity/brain';
    if (fs.existsSync(brainDir)) {
      const convDirs = fs.readdirSync(brainDir).slice(0, 5);
      for (const conv of convDirs) {
        const taskPath = path.join(brainDir, conv, 'task.md');
        if (fs.existsSync(taskPath)) {
          const content = fs.readFileSync(taskPath, 'utf-8');
          const tasks = content.split('\n')
            .filter(l => l.match(/^\s*-\s*\[/))
            .map(l => ({
              text: l.replace(/^\s*-\s*\[.\]\s*/, '').trim(),
              done: l.includes('[x]'),
            }));
          if (tasks.length > 0) taskFiles.push({ project: conv.slice(0, 8), tasks });
        }
      }
    }

    // Total workspace stats
    const totalUncommitted = projects.reduce((s, p) => s + (p.uncommitted ?? 0), 0);
    const cleanProjects = projects.filter(p => p.status === 'clean').length;
    const dirtyProjects = projects.filter(p => p.status === 'dirty').length;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      summary: {
        total: projects.length,
        clean: cleanProjects,
        dirty: dirtyProjects,
        totalUncommitted,
      },
      projects,
      activeTasks: taskFiles,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
