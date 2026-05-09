import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateRequirements } from "./generator";
import type { BlueprintSession } from "./types";

interface Props {
  session: BlueprintSession;
  onBack: () => void;
  onRestart: () => void;
}

export function OutputPreview({ session, onBack, onRestart }: Props) {
  const markdown = generateRequirements(session);

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `REQUIREMENTS-${session.appName.replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown, session.appName]);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Output — REQUIREMENTS.md</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {session.appName} · {session.selectedPages.length}개 페이지
          </p>
        </div>
        <Button onClick={handleDownload}>⬇ 다운로드</Button>
      </div>

      <Card className="p-4 overflow-auto max-h-[60vh]">
        <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed">{markdown}</pre>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← 이전</Button>
        <Button variant="outline" onClick={onRestart}>처음부터 →</Button>
      </div>
    </div>
  );
}
