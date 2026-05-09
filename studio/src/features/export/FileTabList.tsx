import { Button } from "@/components/ui/button";
import { FILE_TABS } from "./types";
import type { FileType } from "./types";

interface Props {
  activeTab: FileType;
  onSelectTab: (tab: FileType) => void;
  contents: Record<FileType, string>;
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function FileTabList({ activeTab, onSelectTab, contents }: Props) {
  const current = FILE_TABS.find((t) => t.id === activeTab)!;
  const mime = activeTab === "tokens" ? "application/json" : "text/markdown";

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border pb-2 flex-shrink-0 flex-wrap">
        {FILE_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onSelectTab(id)}
            className={[
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              activeTab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Preview + download */}
      <div className="flex items-center justify-between py-2 flex-shrink-0">
        <span className="text-xs text-muted-foreground font-mono">{current.filename}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => downloadFile(current.filename, contents[activeTab], mime)}
        >
          ⬇ {current.label}
        </Button>
      </div>

      <pre className="flex-1 overflow-auto text-xs font-mono bg-muted rounded-md p-4 whitespace-pre-wrap leading-relaxed min-h-0">
        {contents[activeTab]}
      </pre>
    </div>
  );
}
