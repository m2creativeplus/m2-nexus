"use server";

import { inngest } from "../../inngest/client";

export async function triggerQAOrchestration(targetUrl: string, priority: "low" | "medium" | "high" | "critical" = "high") {
  try {
    await inngest.send({
      name: "qa/run.requested",
      data: {
        targetUrl,
        priority,
        initiator: "M2 Sovereign Admin",
      },
    });
    return { success: true, message: "Orchestration triggered successfully." };
  } catch (error: any) {
    console.error("Failed to trigger orchestration:", error);
    return { success: false, error: error.message };
  }
}
