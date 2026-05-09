import { Label } from "@/components/ui/label";
import type { DesignDocument } from "../types";

interface Props {
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}

export function Section8Responsive({ doc, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="responsiveBehavior">반응형 동작 명세</Label>
      <p className="text-xs text-muted-foreground">
        브레이크포인트, 터치 타겟, 컬랩싱 전략 등을 기술하세요.
      </p>
      <textarea
        id="responsiveBehavior"
        className="w-full min-h-[240px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder={"**Breakpoints**:\n| Name | Width | Major Changes |\n|------|-------|---------------|\n| mobile | < 640px | Single column |\n| tablet | 640~1024px | 2-column grid |\n| desktop | > 1024px | Full layout |\n\n**Touch Targets**: 최소 44x44px\n**Collapsing**: Sidebar → bottom nav (mobile)"}
        value={doc.responsiveBehavior}
        onChange={(e) => onChange({ responsiveBehavior: e.target.value })}
      />
    </div>
  );
}
