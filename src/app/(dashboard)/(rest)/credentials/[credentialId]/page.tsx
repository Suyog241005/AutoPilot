import { requireAuth } from "@/lib/auth-utils";

interface CredentialIdPageProps {
    params: Promise<{ credentialId: string }>;
}

export default async function CredentialsPage({
    params,
}: CredentialIdPageProps) {
    const {credentialId} = await params;
    await requireAuth();
    
    return <div>Credential Id: {credentialId}</div>;
}