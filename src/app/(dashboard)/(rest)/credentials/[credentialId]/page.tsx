import { requireAuth } from "@/lib/auth-utils";
import { CredentialView } from "@/features/credentials/components/credential";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import {
  CredentialsError,
  CredentialsLoading,
} from "@/features/credentials/components/credentials";
import { prefetchCredential } from "@/features/credentials/server/prefetch";

interface CredentialIdPageProps {
  params: Promise<{ credentialId: string }>;
}

export default async function CredentialsPage({
  params,
}: CredentialIdPageProps) {
  const { credentialId } = await params;
  await requireAuth();
  prefetchCredential(credentialId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<CredentialsError />}>
        <Suspense fallback={<CredentialsLoading />}>
          <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
              <CredentialView credentialId={credentialId} />
            </div>
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
