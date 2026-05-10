import { CardContent } from "@/components/ui/card";
import { BrandHeader } from "@/components/composites/BrandHeader";
import { SignupForm } from "@/components/composites/SignupForm";
import { SocialAuthBlock } from "@/components/composites/SocialAuthBlock";
import { VariantWrapper } from "../VariantWrapper";
import type { SignupSceneProps } from "../types";

function SignupContent({ texts }: { texts: SignupSceneProps["texts"] }) {
  return (
    <div className="w-[380px] space-y-6">
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
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-border" />
        <span className="px-3 text-xs text-muted-foreground">or sign up with</span>
        <div className="flex-1 border-t border-border" />
      </div>
      <SocialAuthBlock
        googleLabel={texts.socialGoogle}
        githubLabel={texts.socialGithub}
      />
      <p className="text-center text-sm">
        <span className="text-muted-foreground">{texts.loginPrompt} </span>
        <a href="#" className="font-medium text-primary hover:underline">
          {texts.loginLink}
        </a>
      </p>
    </div>
  );
}

export function SignupScene({ variant, texts, className }: SignupSceneProps) {
  if (variant === "page") {
    // DESIGN.md §11 auth-signup: layout=split-screen
    return (
      <div className={`flex min-h-screen ${className ?? ""}`}>
        {/* Left panel — dark branding */}
        <div className="hidden w-1/2 flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-16 lg:flex">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            A
          </div>
          <p className="text-xs font-medium uppercase tracking-[3px] text-slate-400">
            Admin Console
          </p>
          <h1 className="text-4xl font-bold text-white">{texts.title}</h1>
          <p className="max-w-xs text-center text-sm text-slate-400">
            {texts.description}
          </p>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-1 items-center justify-center bg-background px-8 py-12">
          <SignupContent texts={texts} />
        </div>
      </div>
    );
  }

  // modal / bottom-sheet — VariantWrapper 그대로 사용
  return (
    <VariantWrapper variant={variant} triggerLabel={texts.title} className={className}>
      <BrandHeader title={texts.title} description={texts.description} />
      <CardContent className="space-y-4">
        <SignupContent texts={texts} />
      </CardContent>
    </VariantWrapper>
  );
}
