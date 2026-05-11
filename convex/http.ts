import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Fetch a single pending task for a specific agent
http.route({
  path: "/api/tasks/pending",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    // Basic auth check (could be expanded)
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== "Bearer m2-sovereign-agent-secret") {
      return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const agentName = url.searchParams.get("agent");

    if (!agentName) {
      return new Response("Missing agent name", { status: 400 });
    }

    // Call our internal query
    const task = await ctx.runQuery(api.m2_agent.getPendingTask, { agentName });

    if (!task) {
      return new Response(JSON.stringify({ task: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ task }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Mark a task as completed/failed
http.route({
  path: "/api/tasks/complete",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== "Bearer m2-sovereign-agent-secret") {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const body = await request.json();
      const { taskId, status, result } = body;

      if (!taskId || !status) {
        return new Response("Missing taskId or status", { status: 400 });
      }

      await ctx.runMutation(api.m2_agent.updateTaskStatus, {
        taskId,
        status,
        result,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }
  }),
});

// Create new tasks (used by ingestion script)
http.route({
  path: "/api/tasks/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== "Bearer m2-sovereign-agent-secret") {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const body = await request.json();
      const { title, payload, assignedAgent } = body;

      if (!title || !assignedAgent) {
        return new Response("Missing title or assignedAgent", { status: 400 });
      }

      await ctx.runMutation(api.m2_agent.createTask, {
        title,
        payload,
        assignedAgent,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }
  }),
});

export default http;
