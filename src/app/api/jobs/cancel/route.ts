import { NextResponse } from "next/server";
import { z } from "zod";
import { convexMutation } from "@/lib/convexHttp";

const Body = z.object({ jobId: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const { jobId } = Body.parse(await req.json());
    const status = await convexMutation<string>("jobs:cancel", { jobId });
    return NextResponse.json({ status: "success", jobStatus: status });
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 400 }
    );
  }
}

