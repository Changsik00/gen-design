import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ColorEntry, DesignDocument } from "../types";

interface Props {
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}

const EMPTY_COLOR: ColorEntry = { name: "", hex: "#000000", cssVar: "", usage: "" };

function ColorRow({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: ColorEntry;
  onUpdate: (patch: Partial<ColorEntry>) => void;
  onRemove: () => void;
}) {
  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded border border-border flex-shrink-0"
          style={{ backgroundColor: entry.hex || "#000000" }}
        />
        <Input
          className="w-28"
          value={entry.hex}
          onChange={(e) => onUpdate({ hex: e.target.value })}
          placeholder="#000000"
        />
        <Input
          className="flex-1"
          value={entry.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="색상 이름 (예: Primary Blue)"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="text-destructive hover:text-destructive flex-shrink-0"
        >
          ✕
        </Button>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">CSS 변수</Label>
          <Input
            value={entry.cssVar}
            onChange={(e) => onUpdate({ cssVar: e.target.value })}
            placeholder="--primary"
          />
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs">용도</Label>
          <Input
            value={entry.usage}
            onChange={(e) => onUpdate({ usage: e.target.value })}
            placeholder="CTA 버튼, 활성 nav 등"
          />
        </div>
      </div>
    </Card>
  );
}

export function Section2Colors({ doc, onChange }: Props) {
  const addColor = () => onChange({ colors: [...doc.colors, { ...EMPTY_COLOR }] });

  const updateColor = (i: number, patch: Partial<ColorEntry>) => {
    const next = [...doc.colors];
    next[i] = { ...next[i], ...patch };
    onChange({ colors: next });
  };

  const removeColor = (i: number) =>
    onChange({ colors: doc.colors.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>색상 항목</Label>
        <Button size="sm" variant="outline" onClick={addColor}>
          + 색상 추가
        </Button>
      </div>
      {doc.colors.length === 0 && (
        <p className="text-sm text-muted-foreground">색상 항목을 추가하세요. hex 값 + CSS 변수 + 용도를 입력합니다.</p>
      )}
      {doc.colors.map((entry, i) => (
        <ColorRow
          key={i}
          entry={entry}
          onUpdate={(patch) => updateColor(i, patch)}
          onRemove={() => removeColor(i)}
        />
      ))}
    </div>
  );
}
