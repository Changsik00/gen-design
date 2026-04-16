import { LoginForm } from "@/components/composites/LoginForm";
import { SocialAuthBlock } from "@/components/composites/SocialAuthBlock";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { LoginPageProps } from "../types";

function LoginContent({ texts }: { texts: LoginPageProps["texts"] }) {
  return (
    <div className="w-[380px] space-y-6">
      <LoginForm
        emailLabel={texts.emailLabel}
        emailPlaceholder={texts.emailPlaceholder}
        passwordLabel={texts.passwordLabel}
        passwordPlaceholder={texts.passwordPlaceholder}
        submitButton={texts.submitButton}
      />
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-border" />
        <span className="px-3 text-xs text-muted-foreground">or continue with</span>
        <div className="flex-1 border-t border-border" />
      </div>
      <SocialAuthBlock
        googleLabel={texts.socialGoogle}
        appleLabel={texts.socialApple}
        kakaoLabel={texts.socialKakao}
      />
      <p className="text-center text-sm">
        <span className="text-muted-foreground">{texts.signupPrompt} </span>
        <a href="#" className="font-medium text-primary hover:underline">
          {texts.signupLink}
        </a>
      </p>
    </div>
  );
}

export function LoginPage({ variant, texts, className }: LoginPageProps) {
  if (variant === "modal") {
    return (
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          {texts.title}
        </DialogTrigger>
        <DialogContent className={className}>
          <div className="space-y-4 p-2">
            <div>
              <h2 className="text-lg font-semibold">{texts.title}</h2>
              <p className="text-sm text-muted-foreground">{texts.description}</p>
            </div>
            <LoginContent texts={texts} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === "bottom-sheet") {
    return (
      <div className="min-h-screen flex items-end justify-center bg-background/80" data-variant="bottom-sheet">
        <div className="w-full max-w-md rounded-t-2xl bg-card p-6 shadow-2xl ring-1 ring-foreground/10">
          <div className="mx-auto mt-0 mb-4 h-1 w-10 rounded-full bg-muted-foreground/30" />
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{texts.title}</h2>
            <p className="text-sm text-muted-foreground">{texts.description}</p>
          </div>
          <LoginContent texts={texts} />
        </div>
      </div>
    );
  }

  // variant === "page" — split-screen layout (Paper "Login" design)
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
      <div className="flex flex-1 items-center justify-center bg-background px-8">
        <LoginContent texts={texts} />
      </div>
    </div>
  );
}
