import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAGE_CATALOG } from "../catalog";
import type { PageSelection, PagePriority } from "../types";

const PRIORITY_LABELS: Record<PagePriority, string> = {
  required: "필수",
  recommended: "권장",
  optional: "선택",
};

const PRIORITY_CLASSES: Record<PagePriority, string> = {
  required: "bg-destructive/10 text-foreground",
  recommended: "bg-primary/10 text-primary",
  optional: "bg-muted text-muted-foreground",
};

interface Props {
  pages: PageSelection[];
  onChange: (pages: PageSelection[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Pages({ pages, onChange, onNext, onBack }: Props) {
  const [showCatalog, setShowCatalog] = useState(false);

  const selectedIds = new Set(pages.map((p) => p.id));

  function removePage(id: string) {
    onChange(pages.filter((p) => p.id !== id));
  }

  function addFromCatalog(entry: typeof PAGE_CATALOG[number]) {
    if (selectedIds.has(entry.id)) return;
    const variant = entry.variants[0];
    const newPage: PageSelection = {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      priority: "optional",
      variant,
      route: `/${entry.category}/${entry.id.split("-").slice(1).join("-")}`,
      layout: variant === "modal" ? "centered-card" : variant === "bottom-sheet" ? "sheet" : "default",
      requiredSections: [...entry.requiredSections],
      optionalSections: [...entry.optionalSections],
      templateMapping: { template: entry.templateName, status: entry.implemented ? "implemented" : "not-implemented" },
    };
    onChange([...pages, newPage]);
  }

  const unselected = PAGE_CATALOG.filter((e) => !selectedIds.has(e.id));

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div>
        <h2 className="text-xl font-semibold">Step 2 — 페이지 구성</h2>
        <p className="text-sm text-muted-foreground mt-1">
          앱유형 기반 추천 페이지입니다. 추가하거나 제거할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {pages.map((page) => (
          <Card key={page.id} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${PRIORITY_CLASSES[page.priority]}`}
              >
                {PRIORITY_LABELS[page.priority]}
              </span>
              <div>
                <p className="text-sm font-medium">{page.id}</p>
                <p className="text-xs text-muted-foreground">{page.name}</p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={() => removePage(page.id)}
            >
              제거
            </button>
          </Card>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={() => setShowCatalog((v) => !v)}>
        {showCatalog ? "카탈로그 닫기" : "+ 페이지 추가"}
      </Button>

      {showCatalog && (
        <Card className="p-3 flex flex-col gap-2 max-h-64 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground">추가 가능한 페이지</p>
          {unselected.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted text-left"
              onClick={() => addFromCatalog(entry)}
            >
              <span>{entry.id}</span>
              <span className="text-xs text-muted-foreground">{entry.name}</span>
            </button>
          ))}
          {unselected.length === 0 && (
            <p className="text-xs text-muted-foreground">모든 페이지가 선택되었습니다.</p>
          )}
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← 이전</Button>
        <Button disabled={pages.length === 0} onClick={onNext}>다음 →</Button>
      </div>
    </div>
  );
}
