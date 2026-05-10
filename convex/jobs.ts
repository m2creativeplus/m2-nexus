import { v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

const now = () => Date.now();

export const enqueue = mutation({
  args: {
    kind: v.string(),
    payload: v.optional(v.any()),
    runAt: v.optional(v.number()),
    maxAttempts: v.optional(v.number()),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const jobId = await ctx.db.insert("jobs", {
      kind: args.kind,
      status: "queued",
      priority: args.priority,
      attempts: 0,
      maxAttempts: args.maxAttempts ?? 3,
      runAt: args.runAt ?? now(),
      payload: args.payload,
      createdByClerkId: identity.subject,
      createdAt: now(),
      updatedAt: now(),
    });

    // Kick the worker immediately.
    // `internal` is codegen'd; after adding `convex/jobs.ts` you must re-run Convex codegen.
    // @ts-expect-error - internal.jobs.runDue appears after codegen.
    await ctx.scheduler.runAfter(0, internal.jobs.runDue, {});
    return jobId;
  },
});

export const cancel = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    // For now: unknown authenticated user may cancel. Tighten to roles later.
    if (job.status === "succeeded" || job.status === "failed") return job.status;

    await ctx.db.patch(args.jobId, {
      status: "cancelled",
      updatedAt: now(),
      lastError: "Cancelled by user",
    });

    return "cancelled";
  },
});

export const get = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.get(args.jobId);
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const limit = Math.min(args.limit ?? 25, 100);
    return await ctx.db.query("jobs").order("desc").take(limit);
  },
});

/**
 * Internal helpers to support action-based job execution.
 */
export const leaseDueBatch = internalMutation({
  args: { batchSize: v.number(), leaseMs: v.number() },
  handler: async (ctx, args) => {
    const t = now();

    const due = await ctx.db
      .query("jobs")
      .withIndex("by_status_run_at", (q) => q.eq("status", "queued").lte("runAt", t))
      .take(args.batchSize);

    const leased: Array<{ jobId: (typeof due)[number]["_id"]; kind: string; payload: unknown; attempts: number; maxAttempts: number }> = [];

    for (const job of due) {
      if (job.lockedUntil && job.lockedUntil > t) continue;

      await ctx.db.patch(job._id, {
        status: "running",
        lockedUntil: t + args.leaseMs,
        updatedAt: t,
      });

      leased.push({
        jobId: job._id,
        kind: job.kind,
        payload: job.payload ?? null,
        attempts: job.attempts,
        maxAttempts: job.maxAttempts,
      });
    }

    return leased;
  },
});

export const markSucceeded = internalMutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "succeeded",
      lockedUntil: undefined,
      updatedAt: now(),
    });
  },
});

export const markFailed = internalMutation({
  args: { jobId: v.id("jobs"), error: v.string(), attempts: v.number(), maxAttempts: v.number() },
  handler: async (ctx, args) => {
    const isFinal = args.attempts >= args.maxAttempts;
    const backoffMs = Math.min(60_000, 2_000 * Math.pow(2, Math.max(0, args.attempts - 1)));
    const nextRunAt = now() + backoffMs;

    await ctx.db.patch(args.jobId, {
      status: isFinal ? "failed" : "queued",
      attempts: args.attempts,
      runAt: nextRunAt,
      lockedUntil: undefined,
      lastError: args.error,
      updatedAt: now(),
    });
  },
});

export const logTelemetryInternal = internalMutation({
  args: {
    action: v.string(),
    message: v.string(),
    type: v.union(v.literal("info"), v.literal("success"), v.literal("warning"), v.literal("error"), v.literal("mistake")),
    mistake: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aiTelemetryLogs", {
      projectName: "m2-nexus",
      agent: "control-plane",
      action: args.action,
      message: args.message,
      type: args.type,
      mistake: args.mistake,
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Internal worker action.
 * Executes job kinds that require fetch/networking.
 */
export const runDue = internalAction({
  args: {},
  handler: async (ctx) => {
    const leaseMs = 60_000;
    const batchSize = 5;

    // @ts-expect-error - internal.jobs.leaseDueBatch appears after codegen.
    const leased = await ctx.runMutation(internal.jobs.leaseDueBatch, { batchSize, leaseMs });

    for (const job of leased as Array<{ jobId: string; kind: string; payload: unknown; attempts: number; maxAttempts: number }>) {
      try {
        // Log start
        // @ts-expect-error - internal.jobs.logTelemetryInternal appears after codegen.
        await ctx.runMutation(internal.jobs.logTelemetryInternal, {
          action: `job:${job.kind}`,
          message: `Running job ${job.jobId}`,
          type: "info",
        });

        if (job.kind === "agent.run") {
          const payload = job.payload as { agentName?: string } | null;
          const agentName = payload?.agentName;
          if (!agentName) throw new Error("Missing payload.agentName");

          const baseUrl = process.env.M2_NEXUS_ORIGIN;
          if (!baseUrl) throw new Error("M2_NEXUS_ORIGIN is not set");

          const res = await fetch(`${baseUrl}/api/agents/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agentName }),
            signal: AbortSignal.timeout(25_000),
          });
          if (!res.ok) throw new Error(`Agent run failed (${res.status})`);
          const data = (await res.json()) as { output?: string; success?: boolean };

          // @ts-expect-error - internal.jobs.logTelemetryInternal appears after codegen.
          await ctx.runMutation(internal.jobs.logTelemetryInternal, {
            action: `job:${job.kind}`,
            message: `Agent "${agentName}" completed`,
            type: data.success ? "success" : "warning",
          });
        }

        // @ts-expect-error - internal.jobs.markSucceeded appears after codegen.
        await ctx.runMutation(internal.jobs.markSucceeded, { jobId: job.jobId });
      } catch (err) {
        const error = err instanceof Error ? err.message : "Unknown error";
        const attempts = job.attempts + 1;
        const maxAttempts = job.maxAttempts ?? 3;

        // @ts-expect-error - internal.jobs.logTelemetryInternal appears after codegen.
        await ctx.runMutation(internal.jobs.logTelemetryInternal, {
          action: `job:${job.kind}`,
          message: `Job ${job.jobId} failed (attempt ${attempts}/${maxAttempts})`,
          type: attempts >= maxAttempts ? "error" : "warning",
          mistake: error,
        });

        // @ts-expect-error - internal.jobs.markFailed appears after codegen.
        await ctx.runMutation(internal.jobs.markFailed, { jobId: job.jobId, error, attempts, maxAttempts });
      }
    }

    // If there may be more work, schedule another tick.
    if ((leased as unknown[]).length === batchSize) {
      // @ts-expect-error - internal.jobs.runDue appears after codegen.
      await ctx.scheduler.runAfter(0, internal.jobs.runDue, {});
    }

    return { processed: (leased as unknown[]).length };
  },
});

