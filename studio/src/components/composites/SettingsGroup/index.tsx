import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SettingsGroupProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsGroup({ title, description, children }: SettingsGroupProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold tracking-[-0.005em]">{title}</h2>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Card>
        <CardContent className="divide-y divide-border p-0">
          {children}
        </CardContent>
      </Card>
    </section>
  );
}
