import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/executions/lib/execution-registry";
import { NodeType } from "@/generated/prisma/enums";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflow/exectute.workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      return new NonRetriableError("Workflow Id is missing");
    }
    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    });

    // Initialize the context with any initial data from trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
      });
    }

    return { workflowId, result: context };
  },
);
