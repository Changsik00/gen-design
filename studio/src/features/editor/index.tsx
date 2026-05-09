import { Card } from "@/components/ui/card";

export function EditorPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="max-w-md p-6 text-center">
        <h1 className="text-2xl font-semibold">DESIGN.md Editor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          섹션별 폼 편집 + 마크다운 미리보기 — 곧 구현 (spec-6-06)
        </p>
      </Card>
    </div>
  );
}
