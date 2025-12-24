import { requireAuth } from "@/lib/auth-utils";

export default async function CredentialsPage() {
    await requireAuth();
    return <div>Credentials Page</div>;
}