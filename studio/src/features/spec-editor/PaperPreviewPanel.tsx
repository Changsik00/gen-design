interface Props {
  html: string;
}

export function PaperPreviewPanel({ html }: Props) {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card overflow-hidden">
      <header className="px-4 py-2 border-b text-sm font-medium text-muted-foreground">
        Paper preview
      </header>
      <iframe
        title="Paper preview"
        srcDoc={html || "<body style='color:#888;font-family:sans-serif;padding:1rem'>spec.md 를 입력하면 여기에 렌더됩니다</body>"}
        className="flex-1 w-full"
        sandbox="allow-scripts"
      />
    </div>
  );
}
