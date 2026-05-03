import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        status: "disabled",
        error:
          "This endpoint runs local workstation automation and is disabled in production. Use Convex-backed orchestration for cloud deployments.",
      },
      { status: 501 }
    );
  }

  try {
    // Run the Python script that was generated in the M2_EPD_MASTER_HUB
    const { stdout, stderr } = await execAsync("python3 '/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/06_SYSTEM_OPS/m2_data_organizer.py'");
    
    if (stderr && !stdout) {
      return NextResponse.json({ status: "error", error: stderr }, { status: 500 });
    }

    // Try to parse the JSON output from the python script
    const lines = stdout.trim().split("\n");
    const lastLine = lines[lines.length - 1];
    
    let resultData = { stats: {} };
    try {
      resultData = JSON.parse(lastLine);
    } catch (e) {
      console.log("Raw output:", stdout);
    }

    return NextResponse.json({ 
      status: "success", 
      stats: resultData.stats || {},
      raw: stdout
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 500 });
  }
}
