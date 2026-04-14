import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupFormProps {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  termsAgreement: string;
  submitButton: string;
}

export function SignupForm({
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  confirmPasswordLabel,
  confirmPasswordPlaceholder,
  termsAgreement,
  submitButton,
}: SignupFormProps) {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <Label>{nameLabel}</Label>
        <Input placeholder={namePlaceholder} />
      </div>
      <div className="space-y-2">
        <Label>{emailLabel}</Label>
        <Input type="email" placeholder={emailPlaceholder} />
      </div>
      <div className="space-y-2">
        <Label>{passwordLabel}</Label>
        <Input type="password" placeholder={passwordPlaceholder} />
      </div>
      <div className="space-y-2">
        <Label>{confirmPasswordLabel}</Label>
        <Input type="password" placeholder={confirmPasswordPlaceholder} />
      </div>
      <div className="flex items-start gap-2">
        <input type="checkbox" id="terms" className="mt-1" />
        <label htmlFor="terms" className="text-sm text-muted-foreground">
          {termsAgreement}
        </label>
      </div>
      <Button type="submit" className="w-full">
        {submitButton}
      </Button>
    </form>
  );
}
