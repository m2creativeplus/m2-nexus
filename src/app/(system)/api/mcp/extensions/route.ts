import { NextResponse } from 'next/server';

export async function GET() {
  // Static configuration representing the connected MCP tools in the M2 Sovereign Engine.
  // In a robust implementation, these would perform actual ping checks.
  const extensions = [
    {
      id: 'supabase-mcp',
      name: 'Supabase Database & Auth',
      status: 'active',
      description: 'Manages PostgreSQL migrations, edge functions, and cost configs.',
      category: 'database'
    },
    {
      id: 'pinecone-mcp',
      name: 'Pinecone Vector RAG',
      status: 'active',
      description: 'Vector database for fast, scalable AI embeddings search.',
      category: 'ai'
    },
    {
      id: 'notebooklm-mcp',
      name: 'NotebookLM RAG',
      status: 'active',
      description: 'Connects to Google NotebookLM for document source ingestion and questioning.',
      category: 'ai'
    },
    {
      id: 'stitch-mcp',
      name: 'Stitch UI Engine',
      status: 'active',
      description: 'Generates screens, variants, and applies design systems directly to projects.',
      category: 'ui'
    },
    {
      id: 'gmp-code-assist',
      name: 'Google Maps Geospatial',
      status: 'active',
      description: 'Tools for location, mapping, routes, and geospatial analytics.',
      category: 'map'
    },
    {
      id: 'kilocode-mcp',
      name: 'Kilocode AI',
      status: 'active',
      description: 'Autonomous research and coding agent for deep codebase exploration.',
      category: 'agent'
    },
    {
      id: 'github-mcp',
      name: 'GitHub Integrations',
      status: 'active',
      description: 'Repository sync, commit automation, and webhook listener.',
      category: 'source'
    },
    {
      id: 'vercel-mcp',
      name: 'Vercel Deployment',
      status: 'active',
      description: 'Automated fleet deployments, route verification, and log streaming.',
      category: 'deployment'
    }
  ];

  return NextResponse.json({
    success: true,
    data: { extensions }
  });
}
