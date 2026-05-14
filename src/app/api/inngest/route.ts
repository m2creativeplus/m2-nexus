import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { qaRunner } from "../../../inngest/functions/qa-runner";

// Serve the Inngest API endpoint
// This acts as the webhook receiver for the Event Bus
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    qaRunner,
    // Future agents will be registered here
    // e.g., siteCrawler, designSystemValidator
  ],
});
