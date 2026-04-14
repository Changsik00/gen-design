import { BrandHeader } from "@/components/composites/BrandHeader";
import { SignupForm } from "@/components/composites/SignupForm";
import { VariantWrapper } from "../VariantWrapper";
import type { SignupPageProps } from "../types";

export function SignupPage({ variant, texts, className }: SignupPageProps) {
  return (
    <VariantWrapper variant={variant} triggerLabel={texts.title} className={className}>
      <BrandHeader title={texts.title} description={texts.description} />
      <SignupForm
        nameLabel={texts.nameLabel}
        namePlaceholder={texts.namePlaceholder}
        emailLabel={texts.emailLabel}
        emailPlaceholder={texts.emailPlaceholder}
        passwordLabel={texts.passwordLabel}
        passwordPlaceholder={texts.passwordPlaceholder}
        confirmPasswordLabel={texts.confirmPasswordLabel}
        confirmPasswordPlaceholder={texts.confirmPasswordPlaceholder}
        termsAgreement={texts.termsAgreement}
        submitButton={texts.submitButton}
      />
      <p className="text-center text-sm">
        <span className="text-muted-foreground">{texts.loginPrompt} </span>
        <a href="#" className="underline font-medium">
          {texts.loginLink}
        </a>
      </p>
    </VariantWrapper>
  );
}
