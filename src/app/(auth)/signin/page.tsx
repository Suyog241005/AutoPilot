import { SignInForm } from "@/features/auth/components/signin-form";
import { requireUnauth } from "@/lib/auth-utils";


export default async function Login() {
    await requireUnauth();
    return (
        <div>
            <SignInForm/>
        </div>
    )
}