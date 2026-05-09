import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { PageSelection, PageVariant } from "../types";
import { PAGE_CATALOG } from "../catalog";

interface Props {
  pages: PageSelection[];
  onChange: (pages: PageSelection[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const VARIANTS: PageVariant[] = ["page", "modal", "bottom-sheet"];

export function Step3Variants({ pages, onChange, onNext, onBack }: Props) {
  function updatePage(id: string, patch: Partial<PageSelection>) {
    onChange(pages.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function applyDefaults() {
    const reset = pages.map((p) => {
      const entry = PAGE_CATALOG.find((e) => e.id === p.id);
      return entry
        ? { ...p, variant: entry.variants[0], optionalSections: [...entry.optionalSections] }
        : p;
    });
    onChange(reset);
  }

  function toggleOptional(page: PageSelection, section: string) {
    const current = page.optionalSections;
    const next = current.includes(section)
      ? current.filter((s) => s !== section)
      : [...current, section];
    updatePage(page.id, { optionalSections: next });
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Step 3 — Variant / 섹션 조정</h2>
          <p className="text-sm text-muted-foreground mt-1">각 페이지의 variant 와 선택 섹션을 확인합니다.</p>
        </div>
        <Button variant="outline" size="sm" onClick={applyDefaults}>기본값 적용</Button>
      </div>

      {pages.map((page) => {
        const catalogEntry = PAGE_CATALOG.find((e) => e.id === page.id);
        const allOptional = catalogEntry?.optionalSections ?? [];
        const availableVariants = catalogEntry?.variants ?? VARIANTS;

        return (
          <Card key={page.id} className="p-4 flex flex-col gap-3">
            <div>
              <p className="font-medium text-sm">{page.id}</p>
              <p className="text-xs text-muted-foreground">{page.name}</p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">variant</span>
              <div className="flex gap-2">
                {availableVariants.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updatePage(page.id, { variant: v })}
                    className={`rounded-md border px-3 py-1 text-xs transition-colors ${
                      page.variant === v
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:border-primary"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {allOptional.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">선택 섹션</span>
                {allOptional.map((section) => (
                  <div key={section} className="flex items-center gap-2">
                    <Switch
                      checked={page.optionalSections.includes(section)}
                      onCheckedChange={() => toggleOptional(page, section)}
                    />
                    <span className="text-xs">{section}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← 이전</Button>
        <Button onClick={onNext}>결과 보기 →</Button>
      </div>
    </div>
  );
}
