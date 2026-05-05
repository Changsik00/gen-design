import { LoginPage } from "studio/components/templates";
import { getLoginTexts } from "@/hooks/useTexts";

export function LoginRoute() {
  return <LoginPage variant="page" texts={getLoginTexts()} />;
}
