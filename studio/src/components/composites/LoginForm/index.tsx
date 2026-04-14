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
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <Label>{emailLabel}</Label>
        <Input type="email" placeholder={emailPlaceholder} />
      </div>
      <div className="space-y-2">
        <Label>{passwordLabel}</Label>
        <Input type="password" placeholder={passwordPlaceholder} />
      </div>
      <Button type="submit" className="w-full">
        {submitButton}
      </Button>
    </form>
  );
}
