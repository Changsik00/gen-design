import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { EditableTokens } from "../types";

interface Props {
  tokens: EditableTokens;
  onChange: (patch: Partial<EditableTokens>) => void;
}

type TokenKey = keyof EditableTokens;

interface ColorRowDef {
  key: TokenKey;
  label: string;
}

interface GroupDef {
  title: string;
  rows: ColorRowDef[];
}

const GROUPS: GroupDef[] = [
  {
    title: "Brand",
    rows: [
      { key: "primary", label: "Primary" },
      { key: "primaryForeground", label: "Primary Foreground" },
      { key: "accent", label: "Accent" },
      { key: "accentForeground", label: "Accent Foreground" },
    ],
  },
  {
    title: "Surface",
    rows: [
      { key: "background", label: "Background" },
      { key: "card", label: "Card" },
      { key: "muted", label: "Muted" },
    ],
  },
  {
    title: "Text",
    rows: [
      { key: "foreground", label: "Foreground" },
      { key: "mutedForeground", label: "Muted Foreground" },
    ],
  },
  {
    title: "UI",
    rows: [
      { key: "border", label: "Border" },
      { key: "ring", label: "Ring" },
    ],
  },
  {
    title: "Status",
    rows: [
      { key: "destructive", label: "Destructive" },
      { key: "destructiveForeground", label: "Destructive Foreground" },
    ],
  },
];

function ColorRow({
  label,
  value,
  onUpdate,
}: {
  label: string;
  value: string;
  onUpdate: (val: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded border border-border flex-shrink-0 cursor-pointer overflow-hidden relative"
        title={value}
      >
        <input
          type="color"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          value={value.startsWith("#") && value.length === 7 ? value : "#000000"}
          onChange={(e) => onUpdate(e.target.value)}
        />
        <div className="w-full h-full" style={{ backgroundColor: value }} />
      </div>
      <Label className="w-44 text-sm flex-shrink-0">{label}</Label>
      <Input
        className="w-28 font-mono text-xs"
        value={value}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="#000000"
      />
    </div>
  );
}

export function ColorSection({ tokens, onChange }: Props) {
  return (
    <div className="space-y-4">
      {GROUPS.map((group) => (
        <Card key={group.title} className="p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {group.title}
          </p>
          {group.rows.map(({ key, label }) => (
            <ColorRow
              key={key}
              label={label}
              value={tokens[key] as string}
              onUpdate={(val) => onChange({ [key]: val })}
            />
          ))}
        </Card>
      ))}
    </div>
  );
}
