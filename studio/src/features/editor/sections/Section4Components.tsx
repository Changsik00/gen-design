import { Label } from "@/components/ui/label";
import type { DesignDocument } from "../types";

interface Props {
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}

export function Section4Components({ doc, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="componentStylings">컴포넌트 스타일 명세</Label>
      <p className="text-xs text-muted-foreground">
        마크다운 형식으로 자유 기술. 예: **Button Primary** &#10;- Background: #hex &#10;- Radius: 8px
      </p>
      <textarea
        id="componentStylings"
        className="w-full min-h-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder={"**Button Primary**\n- Background: #6366F1\n- Text: #FFFFFF\n- Padding: 10px 20px\n- Radius: 8px\n\n**Card**\n- Background: #FFFFFF\n- Border: 1px solid #E2E8F0\n- Radius: 12px\n- Shadow: 0 1px 3px rgba(0,0,0,0.1)"}
        value={doc.componentStylings}
        onChange={(e) => onChange({ componentStylings: e.target.value })}
      />
    </div>
  );
}
