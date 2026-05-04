import { SignupPage } from "studio/components/templates";
import { getSignupTexts } from "@/hooks/useTexts";

export function SignupRoute() {
  return <SignupPage variant="page" texts={getSignupTexts()} />;
}
