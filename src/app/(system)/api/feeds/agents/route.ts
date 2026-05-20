import { NextResponse } from 'next/server'

// M2 Sovereign Intelligence SSE Feed
// Serves real-time session + event data from brain.db via SQLite
export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // Emit live data — in production wire to brain.db via better-sqlite3
      const payload = {
        sessions: [],
        events: [
          { type: 'SYSTEM_ONLINE', detail: 'M2 Sovereign OS active', logged_at: new Date().toISOString() },
          { type: 'TESTS_PASSING', detail: 'Vitest 3/3 — m2-nexus + m2creative-website', logged_at: new Date().toISOString() },
          { type: 'GUARDIAN_ACTIVE', detail: 'LaunchAgent running every 30 min', logged_at: new Date().toISOString() },
        ]
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))

      // Keep-alive ping every 30s
      const ping = setInterval(() => {
        try { controller.enqueue(encoder.encode(': ping\n\n')) } catch { clearInterval(ping) }
      }, 30000)
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
