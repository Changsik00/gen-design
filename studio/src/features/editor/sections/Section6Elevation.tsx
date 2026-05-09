import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DesignDocument, ElevationEntry } from "../types";

interface Props {
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}

const EMPTY_ROW: ElevationEntry = { level: "", treatment: "", use: "" };

function ElevationRow({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: ElevationEntry;
  onUpdate: (patch: Partial<ElevationEntry>) => void;
  onRemove: () => void;
}) {
  return (
    <Card className="p-2 flex gap-2 items-center">
      <Input
        className="w-28"
        value={entry.level}
        onChange={(e) => onUpdate({ level: e.target.value })}
        placeholder="Level 0"
      />
      <Input
        className="flex-1"
        value={entry.treatment}
        onChange={(e) => onUpdate({ treatment: e.target.value })}
        placeholder="No shadow | 0 1px 3px rgba(0,0,0,0.1)"
      />
      <Input
        className="w-36"
        value={entry.use}
        onChange={(e) => onUpdate({ use: e.target.value })}
        placeholder="배경 / 카드"
      />
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="text-destructive hover:text-destructive flex-shrink-0"
      >
        ✕
      </Button>
    </Card>
  );
}

export function Section6Elevation({ doc, onChange }: Props) {
  const addRow = () => onChange({ elevations: [...doc.elevations, { ...EMPTY_ROW }] });

  const updateRow = (i: number, patch: Partial<ElevationEntry>) => {
    const next = [...doc.elevations];
    next[i] = { ...next[i], ...patch };
    onChange({ elevations: next });
  };

  const removeRow = (i: number) =>
    onChange({ elevations: doc.elevations.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>엘리베이션 레벨</Label>
        <Button size="sm" variant="outline" onClick={addRow}>
          + 레벨 추가
        </Button>
      </div>
      {doc.elevations.length === 0 && (
        <p className="text-sm text-muted-foreground">
          엘리베이션 레벨을 추가하세요. Level · Treatment (그림자 값) · Use (용도).
        </p>
      )}
      {doc.elevations.length > 0 && (
        <p className="text-xs text-muted-foreground">Level · Treatment · Use</p>
      )}
      {doc.elevations.map((row, i) => (
        <ElevationRow
          key={i}
          entry={row}
          onUpdate={(patch) => updateRow(i, patch)}
          onRemove={() => removeRow(i)}
        />
      ))}
    </div>
  );
}
