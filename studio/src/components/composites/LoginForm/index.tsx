import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitButton: string;
}

export function LoginForm({
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  submitButton,
}: LoginFormProps) {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-1.5">
        <Label>{emailLabel}</Label>
        <Input type="email" placeholder={emailPlaceholder} className="h-11" />
      </div>
      <div className="space-y-1.5">
        <Label>{passwordLabel}</Label>
        <Input type="password" placeholder={passwordPlaceholder} className="h-11" />
      </div>
      <Button type="submit" className="w-full h-11">
        {submitButton}
      </Button>
    </form>
  );
}
