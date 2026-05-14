import { Inngest } from "inngest";

// Define the event payloads
type QA_Requested = {
  data: {
    targetUrl: string;
    priority: "low" | "medium" | "high" | "critical";
    initiator: string;
  };
};

type Agent_TaskAssigned = {
  data: {
    agentId: string;
    taskDescription: string;
    context?: any;
  };
};

type Deployment_Completed = {
  data: {
    deploymentId: string;
    url: string;
    status: "success" | "failure";
  };
};

type Events = {
  "qa/run.requested": QA_Requested;
  "agent/task.assigned": Agent_TaskAssigned;
  "deployment/completed": Deployment_Completed;
};

// Initialize the Inngest client
export const inngest = new Inngest({
  id: "m2-nexus-os",
  name: "M2 Sovereign OS Kernel"
});
