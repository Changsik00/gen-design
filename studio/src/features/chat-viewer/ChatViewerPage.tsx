import { useState } from "react";
import { useChats, type ChatEntry } from "./useChats";
import { parseChatSections } from "./parseChatSections";
import { compileToPaper } from "@/lib/chat-md-compiler/paper/compile";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "narrative" | "structure" | "history";

// ---------------------------------------------------------------------------
// Shell preview
// ---------------------------------------------------------------------------

function buildShellPreviewHtml(shellText: string | null, sceneText: string): string {
  const combined = shellText ? `${shellText}\n\n${sceneText}` : sceneText;
  try {
    const result = compileToPaper(combined);
    return result.html ?? "";
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// File list sidebar
// ---------------------------------------------------------------------------

interface FileListProps {
  chats: ChatEntry[];
  selected: ChatEntry | null;
  onSelect: (entry: ChatEntry) => void;
}

function FileList({ chats, selected, onSelect }: FileListProps) {
  const groups: Record<string, ChatEntry[]> = { scene: [], component: [], shell: [] };
  for (const c of chats) groups[c.fileType]?.push(c);

  const groupLabel: Record<string, string> = {
    scene: "Scenes",
    component: "Components",
    shell: "Shell",
  };

  return (
    <aside className="w-56 shrink-0 border-r border-border overflow-y-auto bg-background p-3">
      {(["scene", "component", "shell"] as const).map((type) => {
        const items = groups[type];
        if (!items || items.length === 0) return null;
        return (
          <div key={type} className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {groupLabel[type]}
            </p>
            {items.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelect(entry)}
                className={`block w-full text-left px-2 py-1 rounded text-sm truncate hover:bg-accent transition-colors ${
                  selected?.id === entry.id ? "bg-accent text-accent-foreground font-medium" : "text-foreground"
                }`}
              >
                {entry.name}
                <span className="ml-1 text-xs text-muted-foreground">[{entry.source}]</span>
              </button>
            ))}
          </div>
        );
      })}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Chat viewer (3-tab + shell preview)
// ---------------------------------------------------------------------------

interface ChatViewerProps {
  entry: ChatEntry;
  shellEntry: ChatEntry | null;
}

function ChatViewer({ entry, shellEntry }: ChatViewerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("narrative");
  const sections = parseChatSections(entry.text);
  const isScene = entry.fileType === "scene";

  const tabs: { id: Tab; label: string }[] = [
    { id: "narrative", label: "Narrative" },
    { id: "structure", label: "Structure" },
    { id: "history", label: "History" },
  ];

  const shellHtml = isScene
    ? buildShellPreviewHtml(shellEntry?.text ?? null, entry.text)
    : null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border px-4 gap-1 pt-2 bg-background">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 text-sm rounded-t transition-colors ${
              activeTab === t.id
                ? "border-b-2 border-primary font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
        {activeTab === "narrative" && (
          <div>{sections.narrative || <span className="text-muted-foreground italic">No narrative section.</span>}</div>
        )}
        {activeTab === "structure" && (
          <div>{sections.structure || <span className="text-muted-foreground italic">No structure section.</span>}</div>
        )}
        {activeTab === "history" && (
          <div>{sections.history || <span className="text-muted-foreground italic">No history section.</span>}</div>
        )}
      </div>

      {/* Shell preview */}
      {isScene && (
        <div className="border-t border-border">
          <p className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted">
            Shell Preview
          </p>
          {shellHtml ? (
            <iframe
              srcDoc={shellHtml}
              sandbox="allow-scripts"
              className="w-full h-64 border-0"
              title="Shell Preview"
            />
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground italic">No shell preview available.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChatViewerPage
// ---------------------------------------------------------------------------

export function ChatViewerPage() {
  const { chats, loading, error } = useChats();
  const [selected, setSelected] = useState<ChatEntry | null>(null);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
        Loading chats…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-destructive text-sm">
        Error: {error}
      </div>
    );
  }

  const shellEntry = chats.find((c) => c.fileType === "shell") ?? null;

  return (
    <div className="flex flex-1 overflow-hidden">
      <FileList chats={chats} selected={selected} onSelect={setSelected} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {selected ? (
          <ChatViewer entry={selected} shellEntry={shellEntry} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
            파일을 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}
