import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { EditableTokens } from "../types";

interface Props {
  tokens: EditableTokens;
  onChange: (patch: Partial<EditableTokens>) => void;
}

function remToNum(rem: string): number {
  return parseFloat(rem.replace("rem", "")) || 0;
}

export function RadiusSection({ tokens, onChange }: Props) {
  const value = remToNum(tokens.radiusBase);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Border Radius Base</Label>
          <span className="font-mono text-sm text-muted-foreground">{tokens.radiusBase}</span>
        </div>
        <Slider
          min={0}
          max={2}
          step={0.05}
          value={value}
          onValueChange={(val) => {
            const n = Array.isArray(val) ? (val as number[])[0] : (val as number);
            onChange({ radiusBase: `${n.toFixed(2)}rem` });
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0rem (sharp)</span>
          <span>1rem (rounded)</span>
          <span>2rem (pill)</span>
        </div>
      </div>

      {/* 시각적 프리뷰 */}
      <Card className="p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Radius 프리뷰
        </p>
        <div className="flex gap-4 items-center">
          {(["sm", "md", "lg"] as const).map((size, i) => (
            <div
              key={size}
              className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
              style={{ borderRadius: `calc(${tokens.radiusBase} * ${[0.5, 1, 1.5][i]})` }}
            >
              {size}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
