import { Card } from "@/components/ui/card";

export function ExportPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="max-w-md p-6 text-center">
        <h1 className="text-2xl font-semibold">Export</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          DESIGN.md + REQUIREMENTS.md + AGENT.md + assets 번들 — 곧 구현 (spec-6-08)
        </p>
      </Card>
    </div>
  );
}
