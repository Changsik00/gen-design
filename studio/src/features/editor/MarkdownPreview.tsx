import { Button } from "@/components/ui/button";
import { generateDesignMd } from "./generator";
import type { DesignDocument } from "./types";

interface Props {
  doc: DesignDocument;
}

export function MarkdownPreview({ doc }: Props) {
  const markdown = generateDesignMd(doc);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DESIGN-${doc.appName || "untitled"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="flex items-center justify-between pb-2 border-b border-border flex-shrink-0">
        <p className="text-sm font-medium">DESIGN.md 미리보기</p>
        <Button size="sm" onClick={handleDownload}>
          ⬇ 다운로드
        </Button>
      </div>
      <pre className="flex-1 overflow-auto text-xs font-mono bg-muted rounded-md p-4 mt-3 whitespace-pre-wrap leading-relaxed">
        {markdown}
      </pre>
    </div>
  );
}
