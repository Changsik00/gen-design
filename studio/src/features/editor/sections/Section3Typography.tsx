import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DesignDocument, TypographyEntry } from "../types";

interface Props {
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}

const EMPTY_ROW: TypographyEntry = {
  role: "",
  font: "",
  size: "",
  weight: "",
  lineHeight: "",
  letterSpacing: "",
  notes: "",
};

function TypographyRow({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: TypographyEntry;
  onUpdate: (patch: Partial<TypographyEntry>) => void;
  onRemove: () => void;
}) {
  const field = (key: keyof TypographyEntry, placeholder: string, width = "w-24") => (
    <Input
      className={width}
      value={entry[key]}
      onChange={(e) => onUpdate({ [key]: e.target.value })}
      placeholder={placeholder}
    />
  );

  return (
    <Card className="p-2 flex flex-wrap gap-2 items-center">
      {field("role", "Role", "w-32")}
      {field("font", "Font", "w-28")}
      {field("size", "Size", "w-20")}
      {field("weight", "Weight", "w-20")}
      {field("lineHeight", "LH", "w-20")}
      {field("letterSpacing", "LS", "w-20")}
      {field("notes", "Notes", "flex-1")}
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="text-destructive hover:text-destructive"
      >
        ✕
      </Button>
    </Card>
  );
}

export function Section3Typography({ doc, onChange }: Props) {
  const addRow = () =>
    onChange({ typographyHierarchy: [...doc.typographyHierarchy, { ...EMPTY_ROW }] });

  const updateRow = (i: number, patch: Partial<TypographyEntry>) => {
    const next = [...doc.typographyHierarchy];
    next[i] = { ...next[i], ...patch };
    onChange({ typographyHierarchy: next });
  };

  const removeRow = (i: number) =>
    onChange({ typographyHierarchy: doc.typographyHierarchy.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fontPrimary">Primary 폰트 패밀리</Label>
          <Input
            id="fontPrimary"
            value={doc.fontPrimary}
            onChange={(e) => onChange({ fontPrimary: e.target.value })}
            placeholder="Inter, system-ui, sans-serif"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fontMono">Mono 폰트 패밀리</Label>
          <Input
            id="fontMono"
            value={doc.fontMono}
            onChange={(e) => onChange({ fontMono: e.target.value })}
            placeholder="JetBrains Mono, monospace"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>타이포 계층 (Hierarchy)</Label>
          <Button size="sm" variant="outline" onClick={addRow}>
            + 행 추가
          </Button>
        </div>
        {doc.typographyHierarchy.length === 0 && (
          <p className="text-sm text-muted-foreground">
            타이포 계층을 추가하세요. Role / Font / Size / Weight / Line Height / Letter Spacing / Notes.
          </p>
        )}
        {doc.typographyHierarchy.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Role · Font · Size · Weight · Line Height · Letter Spacing · Notes
          </p>
        )}
        {doc.typographyHierarchy.map((row, i) => (
          <TypographyRow
            key={i}
            entry={row}
            onUpdate={(patch) => updateRow(i, patch)}
            onRemove={() => removeRow(i)}
          />
        ))}
      </div>
    </div>
  );
}
