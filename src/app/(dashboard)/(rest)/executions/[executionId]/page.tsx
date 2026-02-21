import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { ExecutionView } from "@/features/executions/components/execution";
import {
  ExecutionsError,
  ExecutionsLoading,
} from "@/features/executions/components/executions";
import { prefetchExecution } from "@/features/executions/server/prefetch";

interface ExecutionIdPageProps {
  params: Promise<{ executionId: string }>;
}

export default async function ExecutionIdPage({
  params,
}: ExecutionIdPageProps) {
  const { executionId } = await params;
  await requireAuth();
  prefetchExecution(executionId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ExecutionsError />}>
        <Suspense fallback={<ExecutionsLoading />}>
          <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
              <ExecutionView executionId={executionId} />
            </div>
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
