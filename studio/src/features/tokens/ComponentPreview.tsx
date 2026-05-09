import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toCssVars, generateCssOutput } from "./utils";
import type { EditableTokens } from "./types";

interface Props {
  tokens: EditableTokens;
  onReset: () => void;
}

export function ComponentPreview({ tokens, onReset }: Props) {
  const cssVars = toCssVars(tokens);

  const handleDownload = () => {
    const css = generateCssOutput(tokens);
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tokens-custom.css";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="flex items-center justify-between pb-2 border-b border-border flex-shrink-0 gap-2">
        <p className="text-sm font-medium">컴포넌트 미리보기</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onReset}>
            초기화
          </Button>
          <Button size="sm" onClick={handleDownload}>
            ⬇ CSS 다운로드
          </Button>
        </div>
      </div>

      {/* CSS 변수 주입 컨테이너 */}
      <div
        className="flex-1 overflow-y-auto mt-3 space-y-4 rounded-md border border-border p-4"
        style={cssVars as React.CSSProperties}
      >
        {/* Buttons */}
        <Card className="p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Buttons
          </p>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </Card>

        {/* Cards & Text */}
        <Card className="p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Card & Text
          </p>
          <h3 className="text-base font-semibold text-foreground">카드 제목</h3>
          <p className="text-sm text-muted-foreground">
            보조 텍스트 — muted-foreground 색상이 적용됩니다.
          </p>
          <div className="flex gap-2 pt-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Primary Badge
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium border"
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              Outline Badge
            </span>
          </div>
        </Card>

        {/* Input */}
        <Card className="p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Input
          </p>
          <Input placeholder="텍스트를 입력하세요..." />
        </Card>

        {/* Radius preview */}
        <Card className="p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Surfaces
          </p>
          <div className="flex gap-3">
            <div
              className="flex-1 h-12 flex items-center justify-center text-xs font-medium text-primary-foreground"
              style={{ backgroundColor: "var(--primary)", borderRadius: "var(--radius)" }}
            >
              Primary
            </div>
            <div
              className="flex-1 h-12 flex items-center justify-center text-xs font-medium border"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
              }}
            >
              Accent
            </div>
            <div
              className="flex-1 h-12 flex items-center justify-center text-xs font-medium text-destructive-foreground"
              style={{ backgroundColor: "var(--destructive)", borderRadius: "var(--radius)" }}
            >
              Destructive
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
