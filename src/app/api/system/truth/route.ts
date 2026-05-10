import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const truthPath = path.join(process.env.NEXT_PUBLIC_WORKSPACE_ROOT || "/Volumes/MAC DATA/Antigraphity", "M2_SOVEREIGN_TRUTH.json");
    
    if (!fs.existsSync(truthPath)) {
      return NextResponse.json({ error: "Truth file not found. Run m2_universal_sync.py first." }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(truthPath, "utf-8"));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read truth data" }, { status: 500 });
  }
}
