import { NextResponse } from "next/server";
import { convexQuery } from "@/lib/convexHttp";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitRaw = searchParams.get("limit");
    const limit = limitRaw ? Number(limitRaw) : undefined;
    const jobs = await convexQuery("jobs:listRecent", { limit: Number.isFinite(limit) ? limit : undefined });
    return NextResponse.json({ status: "success", jobs });
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 400 }
    );
  }
}

