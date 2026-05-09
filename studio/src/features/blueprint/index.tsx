import { Card } from "@/components/ui/card";

export function BlueprintPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="max-w-md p-6 text-center">
        <h1 className="text-2xl font-semibold">Blueprint</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          질의서 위저드 — 곧 구현 (spec-6-05)
        </p>
      </Card>
    </div>
  );
}
