import { useState } from "react";
import { inferSpec } from "@/lib/paper-inference/infer";
import type { CatalogMap } from "@/lib/paper-inference/ast-builder";

interface Props {
  onResult: (specText: string) => void;
}

// catalog.json 이 없는 경우 빈 Map fallback — 컴포넌트 이름 매칭은 되지만 axis 추론 불가
const EMPTY_CATALOG: CatalogMap = new Map();

export function PaperImportPanel({ onResult }: Props) {
  const [json, setJson] = useState("");
  const [error, setError] = useState("");
  const [report, setReport] = useState<string | null>(null);

  const onInfer = () => {
    setError("");
    setReport(null);
    let tree: unknown;
    try {
      tree = JSON.parse(json);
    } catch {
      setError("JSON 파싱 실패 — 올바른 Paper tree JSON 을 붙여넣으세요");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = inferSpec(tree as any, EMPTY_CATALOG);
      setReport(
        `confident ${result.report.confident.length} / confirm ${result.report.confirm.length} / unknown ${result.report.unknown.length}`
      );
      onResult(result.text);
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div className="border-b bg-muted/50 px-6 py-4 space-y-3">
      <p className="text-sm font-medium">Paper tree JSON 붙여넣기 → spec.md 자동 생성</p>
      <textarea
        className="w-full h-28 rounded-md border bg-background p-3 font-mono text-xs focus:outline-none"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder='{"id":"root","name":"Root","component":"Frame","children":[...]}'
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onInfer}
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Infer spec.md
        </button>
        {report && <span className="text-xs text-muted-foreground">{report}</span>}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    </div>
  );
}
