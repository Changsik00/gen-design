import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DesignDocument } from "../types";

interface Props {
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}

export function Section5Layout({ doc, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spacingBase">Spacing Base Unit</Label>
          <Input
            id="spacingBase"
            value={doc.spacingBase}
            onChange={(e) => onChange({ spacingBase: e.target.value })}
            placeholder="4px"
          />
          <p className="text-xs text-muted-foreground">모든 간격의 기본 단위 (예: 4px, 8px)</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gridMaxWidth">Grid 최대 너비</Label>
          <Input
            id="gridMaxWidth"
            value={doc.gridMaxWidth}
            onChange={(e) => onChange({ gridMaxWidth: e.target.value })}
            placeholder="1280px"
          />
          <p className="text-xs text-muted-foreground">컨테이너 최대 너비 (예: 1280px, 1440px)</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="layoutPrinciples">레이아웃 원칙</Label>
        <textarea
          id="layoutPrinciples"
          className="w-full min-h-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder={"그리드 / 컬럼 구조, 여백 철학, 컨테이너 규칙 등을 기술하세요.\n\n예:\n- 8-point grid system 사용\n- 12-column grid (desktop)\n- 컨테이너 padding: 24px (mobile), 48px (desktop)"}
          value={doc.layoutPrinciples}
          onChange={(e) => onChange({ layoutPrinciples: e.target.value })}
        />
      </div>
    </div>
  );
}
