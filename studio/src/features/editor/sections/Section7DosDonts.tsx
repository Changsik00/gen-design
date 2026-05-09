import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DesignDocument } from "../types";

interface Props {
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}

function EditableList({
  label,
  items,
  placeholder,
  onUpdate,
}: {
  label: string;
  items: string[];
  placeholder: string;
  onUpdate: (items: string[]) => void;
}) {
  const add = () => onUpdate([...items, ""]);
  const update = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    onUpdate(next);
  };
  const remove = (i: number) => onUpdate(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button size="sm" variant="outline" onClick={add}>
          + 추가
        </Button>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      )}
      {items.map((item, i) => (
        <Card key={i} className="flex items-center gap-2 p-2">
          <Input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`항목 ${i + 1}`}
            className="flex-1"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => remove(i)}
            className="text-destructive hover:text-destructive"
          >
            ✕
          </Button>
        </Card>
      ))}
    </div>
  );
}

export function Section7DosDonts({ doc, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <EditableList
        label="✅ Do"
        items={doc.dos}
        placeholder="권장 패턴을 추가하세요."
        onUpdate={(items) => onChange({ dos: items })}
      />
      <EditableList
        label="❌ Don't"
        items={doc.donts}
        placeholder="금지 패턴을 추가하세요."
        onUpdate={(items) => onChange({ donts: items })}
      />
    </div>
  );
}
