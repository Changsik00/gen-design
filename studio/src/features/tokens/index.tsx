import { Card } from "@/components/ui/card";

export function TokensPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="max-w-md p-6 text-center">
        <h1 className="text-2xl font-semibold">Token Editor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          색상 / 타이포 / 간격 시각 편집 — 곧 구현 (spec-6-07)
        </p>
      </Card>
    </div>
  );
}
