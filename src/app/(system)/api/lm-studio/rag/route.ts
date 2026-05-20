import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const LMS_URL = process.env.LMS_BASE_URL || 'http://localhost:1234';
const DATA_LAKE = process.env.SOVEREIGN_DATA_LAKE || '/Volumes/MAC DATA/Antigraphity/Sovereign_Data_Lake';
const EMBED_MODEL = 'text-embedding-nomic-embed-text-v1.5';
const CHAT_MODEL = process.env.LMS_DEFAULT_MODEL || 'microsoft/phi-4-mini-reasoning';

// Simple in-memory vector store — production: swap with LanceDB
interface DocChunk { id: string; text: string; vector: number[]; source: string }
const vectorStore: DocChunk[] = [];

async function embed(text: string): Promise<number[]> {
  const res = await fetch(`${LMS_URL}/v1/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
  });
  const d = await res.json();
  return d.data?.[0]?.embedding || [];
}

function cosineSim(a: number[], b: number[]): number {
  if (!a.length || !b.length) return 0;
  const dot = a.reduce((s, v, i) => s + v * (b[i] ?? 0), 0);
  const ma = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const mb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return ma && mb ? dot / (ma * mb) : 0;
}

async function ingestDataLake() {
  if (vectorStore.length > 0) return; // already loaded
  const rawDir = path.join(DATA_LAKE, 'raw');
  if (!fs.existsSync(rawDir)) return;

  const files = fs.readdirSync(rawDir).slice(0, 20); // max 20 files per request
  for (const file of files) {
    const filePath = path.join(rawDir, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile() || stat.size > 100_000) continue; // skip large files
    const text = fs.readFileSync(filePath, 'utf-8').slice(0, 4000);
    const chunks = text.match(/.{1,500}/g) || [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vector = await embed(chunk);
      vectorStore.push({ id: `${file}-${i}`, text: chunk, vector, source: file });
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query, top_k = 3, stream = false } = await req.json();

    if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 });

    // Ingest data lake on first call
    await ingestDataLake();

    // Embed the query
    const queryVec = await embed(query);

    // Find top-k chunks
    const ranked = vectorStore
      .map(doc => ({ ...doc, score: cosineSim(queryVec, doc.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, top_k);

    const context = ranked.map(d => `[${d.source}]\n${d.text}`).join('\n\n---\n\n');

    const messages = [
      {
        role: 'system',
        content: `You are M2 NEXUS Intelligence — a sovereign AI assistant for Mahmoud Awaleh / M2 Creative & Consulting.\n\nContext from Sovereign Data Lake:\n${context || 'No context available.'}\n\nAnswer based on the context above. Be concise, strategic, and institutional.`,
      },
      { role: 'user', content: query },
    ];

    const llmRes = await fetch(`${LMS_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: CHAT_MODEL, messages, stream, max_tokens: 1024 }),
    });

    if (stream && llmRes.body) {
      return new Response(llmRes.body, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    }

    const result = await llmRes.json();
    const answer = result.choices?.[0]?.message?.content || '';

    return NextResponse.json({ answer, sources: ranked.map(d => ({ source: d.source, score: d.score.toFixed(3), text: d.text.slice(0, 120) })) });
  } catch (error) {
    console.error('[RAG]', error);
    return NextResponse.json({ error: 'RAG query failed' }, { status: 500 });
  }
}
