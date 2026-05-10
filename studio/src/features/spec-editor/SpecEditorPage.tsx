import { useState } from "react";
import { useCompileResult } from "./useCompileResult";
import { SpecTextEditor } from "./SpecTextEditor";
import { ReactPreviewPanel } from "./ReactPreviewPanel";
import { PaperPreviewPanel } from "./PaperPreviewPanel";
import { ErrorPanel } from "./ErrorPanel";
import { PaperImportPanel } from "./PaperImportPanel";

const DEFAULT_SPEC = "";

export function SpecEditorPage() {
  const [text, setText] = useState(DEFAULT_SPEC);
  const [showImport, setShowImport] = useState(false);
  const { reactTree, paperHtml, tsxContent, errors } = useCompileResult(text);

  const onDownloadTsx = () => {
    if (!tsxContent) return;
    const blob = new Blob([tsxContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spec-preview.tsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-card">
        <h1 className="text-lg font-semibold">Spec Editor</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImport((v) => !v)}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            {showImport ? "✕ Close Import" : "📥 Import from Paper"}
          </button>
          <button
            type="button"
            onClick={onDownloadTsx}
            disabled={!tsxContent}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            ⬇ Download TSX
          </button>
        </div>
      </header>

      {/* Paper import 패널 (슬라이드) */}
      {showImport && (
        <PaperImportPanel onResult={(inferred) => { setText(inferred); setShowImport(false); }} />
      )}

      {/* 3-panel 메인 */}
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* 좌: 편집기 */}
        <div className="flex w-1/2 flex-col rounded-xl border bg-card overflow-hidden">
          <SpecTextEditor value={text} onChange={setText} />
          <ErrorPanel errors={errors} />
        </div>

        {/* 우: 세로 2분할 */}
        <div className="flex w-1/2 flex-col gap-4">
          <div className="flex-1 min-h-0">
            <ReactPreviewPanel reactTree={reactTree} />
          </div>
          <div className="flex-1 min-h-0">
            <PaperPreviewPanel html={paperHtml} />
          </div>
        </div>
      </div>
    </div>
  );
}
