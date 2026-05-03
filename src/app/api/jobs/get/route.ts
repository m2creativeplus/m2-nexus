import { NextResponse } from "next/server";
import { z } from "zod";
import { convexQuery } from "@/lib/convexHttp";

const Query = z.object({ jobId: z.string().min(1) });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const parsed = Query.parse({ jobId });
    const job = await convexQuery("jobs:get", parsed);
    return NextResponse.json({ status: "success", job });
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 400 }
    );
  }
}

