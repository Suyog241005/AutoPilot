"use client";

import { useSuspenseExecution } from "../hooks/use-executions";
import type { ExecutionStatus } from "@/generated/prisma/client";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case "SUCCESS":
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case "FAILED":
      return <XCircleIcon className="size-5 text-red-600" />;
    case "RUNNING":
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-blue-600" />;
  }
};

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export const ExecutionView = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspenseExecution(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);

  const duration = execution.completedAt
    ? Math.round(
        new Date(execution.completedAt).getTime() -
          new Date(execution.staredAt).getTime(),
      ) / 1000
    : null;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon(execution.status)}
          <div>
            <CardTitle>{formatStatus(execution.status)}</CardTitle>
            <CardDescription>
              Execution for {execution.workflow.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Workflow
            </p>
            <Link
              href={`/workflows/${execution.workflowId}`}
              prefetch
              className="text-sm hover:underline text-primary"
            >
              {execution.workflow.name}
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{formatStatus(execution.status)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Started At
            </p>
            <p className="text-sm">
              {formatDistanceToNow(new Date(execution.staredAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          {execution.completedAt && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {execution.status === "SUCCESS" ? "Completed At" : "Failed At"}
              </p>
              <p className="text-sm">
                {formatDistanceToNow(new Date(execution.completedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          )}

          {duration !== null && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-sm">{`${duration}s`}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Inngest Event Id
            </p>
            <p className="text-sm">{`${execution.inngestEventId}`}</p>
          </div>
        </div>

        {execution.error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3 overflow-auto">
            <div>
              <p className="text-sm font-medium text-red-900 mb-2">Error</p>
              <p className="text-sm text-red-900 font-mono">{`${execution.error}`}</p>
            </div>

            {execution.errorStack && (
              <Collapsible
                open={showStackTrace}
                onOpenChange={setShowStackTrace}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="text-red-900 hover:bg-red-100"
                  >
                    {showStackTrace ? "Hide Stack Trace" : "Show Stack Trace"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="text-xs text-red-800 font-mono overflow-auto mt-2 p-2 bg-red-100 rounded">{`${execution.errorStack}`}</p>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {execution.output && (
          <div className="mt-6 p-4 bg-muted rounded-md overflow-auto">
            <p className="text-sm font-medium mb-2">Output</p>
            <pre className="text-sm font-mono overflow-auto">{`${JSON.stringify(execution.output, null, 2)}`}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
