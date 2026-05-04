import { FileSearch, ServerCrash } from "lucide-react";
import type { ErrorVariant } from "@/components/templates/types";

interface ErrorIconProps {
  variant: ErrorVariant;
}

export function ErrorIcon({ variant }: ErrorIconProps) {
  const Icon = variant === "404" ? FileSearch : ServerCrash;
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Icon className="size-10" aria-hidden="true" />
    </div>
  );
}
