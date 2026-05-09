import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EditableTokens } from "../types";

interface Props {
  tokens: EditableTokens;
  onChange: (patch: Partial<EditableTokens>) => void;
}

export function TypographySection({ tokens, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fontSans">Sans 폰트 패밀리 (--font-sans)</Label>
        <Input
          id="fontSans"
          value={tokens.fontSans}
          onChange={(e) => onChange({ fontSans: e.target.value })}
          placeholder="'Inter', system-ui, sans-serif"
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fontHeading">Heading 폰트 패밀리 (--font-heading)</Label>
        <Input
          id="fontHeading"
          value={tokens.fontHeading}
          onChange={(e) => onChange({ fontHeading: e.target.value })}
          placeholder="'Inter', system-ui, sans-serif"
          className="font-mono text-sm"
        />
      </div>

      {/* 폰트 프리뷰 */}
      <Card className="p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Typography 프리뷰
        </p>
        <p
          className="text-2xl font-bold"
          style={{ fontFamily: tokens.fontHeading }}
        >
          Heading — 디자인 시스템
        </p>
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: tokens.fontSans }}
        >
          Body text — The quick brown fox jumps over the lazy dog. 빠른 갈색 여우가 게으른 개를 뛰어넘었다.
        </p>
      </Card>
    </div>
  );
}
