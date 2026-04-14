import { BrandHeader } from "@/components/composites/BrandHeader";
import { LoginForm } from "@/components/composites/LoginForm";
import { SocialAuthBlock } from "@/components/composites/SocialAuthBlock";
import { VariantWrapper } from "../VariantWrapper";
import type { LoginPageProps } from "../types";

export function LoginPage({ variant, texts, className }: LoginPageProps) {
  return (
    <VariantWrapper variant={variant} triggerLabel={texts.title} className={className}>
      <BrandHeader title={texts.title} description={texts.description} />
      <LoginForm
        emailLabel={texts.emailLabel}
        emailPlaceholder={texts.emailPlaceholder}
        passwordLabel={texts.passwordLabel}
        passwordPlaceholder={texts.passwordPlaceholder}
        submitButton={texts.submitButton}
      />
      <SocialAuthBlock
        googleLabel={texts.socialGoogle}
        appleLabel={texts.socialApple}
        kakaoLabel={texts.socialKakao}
      />
      <div className="text-center text-sm">
        <a href="#" className="text-sm text-muted-foreground hover:underline">
          {texts.forgotPassword}
        </a>
      </div>
      <p className="text-center text-sm">
        <span className="text-muted-foreground">{texts.signupPrompt} </span>
        <a href="#" className="underline font-medium">
          {texts.signupLink}
        </a>
      </p>
    </VariantWrapper>
  );
}
