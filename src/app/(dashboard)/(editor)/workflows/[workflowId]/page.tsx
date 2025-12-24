import { requireAuth } from "@/lib/auth-utils";

interface WorkflowIdPageProps {
    params: Promise<{ workflowId: string }>;
}


export default async function WorkflowIdPage({
    params,
}: WorkflowIdPageProps) {
    const {workflowId} = await params;
    await requireAuth();
    
    return <div>Workflow Id: {workflowId}</div>;
}