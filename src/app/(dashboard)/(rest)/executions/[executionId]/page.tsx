import { requireAuth } from "@/lib/auth-utils";

interface ExecutionIdPageProps {
  params: Promise<{ executionId: string }>;
}

export default async function ExecutionIdPage({
  params,
}: ExecutionIdPageProps) {
  const { executionId } = await params;
  await requireAuth();
  return <div>Execution Id: {executionId}</div>;
}
