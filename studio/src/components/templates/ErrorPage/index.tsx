import { ErrorIcon } from "@/components/composites/ErrorIcon";
import { ErrorMessage } from "@/components/composites/ErrorMessage";
import { HomeButton } from "@/components/composites/HomeButton";
import type { ErrorPageProps } from "../types";

interface ErrorPageFullProps extends ErrorPageProps {
  onHomeClick?: () => void;
}

export function ErrorPage({
  texts,
  errorVariant,
  className,
  onHomeClick,
}: ErrorPageFullProps) {
  const title = errorVariant === "404" ? texts.title404 : texts.title500;
  const message = errorVariant === "404" ? texts.message404 : texts.message500;

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-background px-6 ${className ?? ""}`}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <ErrorIcon variant={errorVariant} />
        <ErrorMessage title={title} message={message} />
        <HomeButton label={texts.home} onClick={onHomeClick} />
      </div>
    </div>
  );
}
