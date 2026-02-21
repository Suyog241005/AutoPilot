import { executionParamsLoader } from "@/features/executions/server/params-loader";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import {
  ExecutionsContainer,
  ExecutionsError,
  ExecutionsList,
  ExecutionsLoading,
} from "@/features/executions/components/executions";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ExecutionsPage({ searchParams }: Props) {
  await requireAuth();

  const param = await executionParamsLoader(searchParams);
  prefetchExecutions(param);

  return (
    <ExecutionsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionsError />}>
          <Suspense fallback={<ExecutionsLoading />}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionsContainer>
  );
}
