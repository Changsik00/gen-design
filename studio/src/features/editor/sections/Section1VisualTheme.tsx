import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DesignDocument } from "../types";

interface Props {
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}

export function Section1VisualTheme({ doc, onChange }: Props) {
  const addCharacteristic = () =>
    onChange({ keyCharacteristics: [...doc.keyCharacteristics, ""] });

  const updateCharacteristic = (i: number, value: string) => {
    const next = [...doc.keyCharacteristics];
    next[i] = value;
    onChange({ keyCharacteristics: next });
  };

  const removeCharacteristic = (i: number) =>
    onChange({ keyCharacteristics: doc.keyCharacteristics.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="atmosphere">브랜드 분위기 설명</Label>
        <textarea
          id="atmosphere"
          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="브랜드의 전체적인 시각적 인상과 디자인 철학을 서술하세요 (1~2 문단)"
          value={doc.atmosphereDescription}
          onChange={(e) => onChange({ atmosphereDescription: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Key Characteristics</Label>
          <Button size="sm" variant="outline" onClick={addCharacteristic}>
            + 항목 추가
          </Button>
        </div>
        {doc.keyCharacteristics.length === 0 && (
          <p className="text-sm text-muted-foreground">핵심 시각 특성 불릿을 추가하세요 (5~10항 권장).</p>
        )}
        {doc.keyCharacteristics.map((item, i) => (
          <Card key={i} className="flex items-center gap-2 p-2">
            <Input
              value={item}
              onChange={(e) => updateCharacteristic(i, e.target.value)}
              placeholder={`특성 ${i + 1}`}
              className="flex-1"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeCharacteristic(i)}
              className="text-destructive hover:text-destructive"
            >
              ✕
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
