import { NextResponse } from "next/server";
import { z } from "zod";
import { convexMutation } from "@/lib/convexHttp";

const Body = z.object({
  kind: z.string().min(1),
  payload: z.unknown().optional(),
  runAt: z.number().optional(),
  maxAttempts: z.number().int().min(1).max(20).optional(),
  priority: z.number().int().optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = Body.parse(await req.json());
    const jobId = await convexMutation<string>("jobs:enqueue", parsed);
    return NextResponse.json({ status: "success", jobId });
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 400 }
    );
  }
}

