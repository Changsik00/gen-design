import type { ReactNode } from "react";

interface Props {
  reactTree: ReactNode[];
}

export function ReactPreviewPanel({ reactTree }: Props) {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card overflow-hidden">
      <header className="px-4 py-2 border-b text-sm font-medium text-muted-foreground">
        React preview
      </header>
      <div className="flex-1 overflow-auto p-4">
        {reactTree.length === 0 ? (
          <div className="text-muted-foreground text-sm">spec.md 를 입력하면 여기에 렌더됩니다</div>
        ) : (
          <>{reactTree}</>
        )}
      </div>
    </div>
  );
}
