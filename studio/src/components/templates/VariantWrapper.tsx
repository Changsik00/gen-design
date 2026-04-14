import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PageTemplateVariant } from "./types";

interface VariantWrapperProps {
  variant: PageTemplateVariant;
  triggerLabel?: string;
  children: ReactNode;
  className?: string;
}

export function VariantWrapper({
  variant,
  triggerLabel = "Open",
  children,
  className,
}: VariantWrapperProps) {
  if (variant === "page") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className={className ?? "w-[400px]"}>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          {triggerLabel}
        </DialogTrigger>
        <DialogContent className={className}>
          <div className="space-y-4">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  // bottom-sheet: 향후 구현, 현재는 page fallback
  return (
    <div className="min-h-screen flex items-end justify-center bg-background">
      <Card className={className ?? "w-full max-w-[400px] rounded-b-none"}>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  );
}
