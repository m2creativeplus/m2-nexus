/**
 * M2 SOVEREIGN LANGFUSE CLIENT
 * Singleton tracing client for all AI observability in M2 Nexus.
 * Every agent call, prompt, and tool invocation is traced here.
 */

import Langfuse from "langfuse";

let _langfuse: Langfuse | null = null;

export function getLangfuse(): Langfuse {
  if (!_langfuse) {
    _langfuse = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY || "m2pk-sovereign-langfuse-2026",
      secretKey: process.env.LANGFUSE_SECRET_KEY || "m2sk-sovereign-langfuse-2026",
      baseUrl: process.env.LANGFUSE_BASEURL || "http://localhost:3002",
      flushAt: 5,       // Batch flush every 5 events
      flushInterval: 3000, // Or every 3 seconds
    });
    _langfuse.debug(false); // Set to true to see raw traces in terminal
  }
  return _langfuse;
}

/**
 * Trace a complete agent interaction end-to-end.
 * Call this wrapping any AI SDK call in your API routes.
 */
export async function traceAgentCall({
  agentName,
  userId,
  sessionId,
  input,
  output,
  model,
  usage,
  metadata,
}: {
  agentName: string;
  userId?: string;
  sessionId?: string;
  input: string | object;
  output: string | object;
  model?: string;
  usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number };
  metadata?: Record<string, unknown>;
}) {
  const lf = getLangfuse();
  const trace = lf.trace({
    name: agentName,
    userId: userId || "mahmoud-m2-sovereign",
    sessionId: sessionId || `session-${Date.now()}`,
    metadata: {
      project: "M2-Nexus",
      environment: process.env.NODE_ENV || "development",
      ...metadata,
    },
  });

  trace.generation({
    name: `${agentName}-generation`,
    model: model || "claude-sonnet-4-6",
    input: typeof input === "string" ? input : JSON.stringify(input),
    output: typeof output === "string" ? output : JSON.stringify(output),
    usage: {
      input: usage?.promptTokens,
      output: usage?.completionTokens,
      total: usage?.totalTokens,
      unit: "TOKENS",
    },
    metadata,
  });

  await lf.flushAsync();
  return trace;
}

/**
 * Trace a tool call (file read, web search, command execution, etc.)
 */
export function traceToolCall({
  traceId,
  toolName,
  input,
  output,
  isError = false,
}: {
  traceId: string;
  toolName: string;
  input: object;
  output: object;
  isError?: boolean;
}) {
  const lf = getLangfuse();
  const span = lf.span({
    traceId,
    name: toolName,
    input,
    output,
    level: isError ? "ERROR" : "DEFAULT",
  });
  return span;
}

export default getLangfuse;
