import { SignUpForm } from "@/features/auth/components/signup-form";
import { requireUnauth } from "@/lib/auth-utils";

export default async function Signup() {
  await requireUnauth();
  return (
    <div>
      <SignUpForm />
    </div>
  );
}
