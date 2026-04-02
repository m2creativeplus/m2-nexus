import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE_ROOT = process.env.NEXT_PUBLIC_WORKSPACE_ROOT || '/Volumes/MAC DATA/Antigraphity';

async function scanDirectory(dirPath: string) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries;
  } catch (err) {
    return [];
  }
}

export async function GET() {
  try {
    const projectsHubPath = path.join(WORKSPACE_ROOT, 'M2_PROJECTS_HUB/01_ACTIVE_MISSIONS');
    const devLibraryPath = path.join(WORKSPACE_ROOT, 'M2_PROJECTS_HUB/02_ARCHIVE_VAULT/PAUSED_SESSIONS/2026_MARCH/m2-dev-library/registry');

    const [activeMissions, devLibraryEntries] = await Promise.all([
      scanDirectory(projectsHubPath),
      scanDirectory(devLibraryPath),
    ]);

    // Format active missions
    const projects = activeMissions
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        name: entry.name,
        path: path.join(projectsHubPath, entry.name),
        type: 'Active Mission'
      }));

    // Format dev library (just checking if it exists and what's inside roughly)
    const components = devLibraryEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        name: entry.name,
        path: path.join(devLibraryPath, entry.name),
        type: 'Reusable Component'
      }));

    return NextResponse.json({
      success: true,
      data: {
        projects,
        components,
        totalProjects: projects.length,
        totalComponents: components.length,
        workspaceRoot: WORKSPACE_ROOT
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
