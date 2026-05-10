import { useState } from "react";
import { inferChat } from "@/lib/paper-inference/infer";
import type { CatalogMap } from "@/lib/paper-inference/ast-builder";
import type { CatalogAxisDef } from "@/lib/paper-inference/variant-extractor";
import catalogJson from "@/lib/vocabulary/catalog/catalog.json";

interface Props {
  onResult: (specText: string) => void;
}

interface CatalogComponent {
  name: string;
  axes: CatalogAxisDef[];
}

function buildCatalogMap(): CatalogMap {
  const map: CatalogMap = new Map();
  const tiers = (catalogJson as { tiers: Record<string, { components?: CatalogComponent[] }> }).tiers;
  for (const tier of Object.values(tiers)) {
    for (const comp of tier.components ?? []) {
      map.set(comp.name, comp.axes ?? []);
    }
  }
  return map;
}

const CATALOG: CatalogMap = buildCatalogMap();

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
      const result = inferChat(tree as any, CATALOG);
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
