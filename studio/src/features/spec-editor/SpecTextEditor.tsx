interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SpecTextEditor({ value, onChange }: Props) {
  return (
    <div className="flex h-full flex-col">
      <header className="px-4 py-2 border-b text-sm font-medium text-muted-foreground flex items-center justify-between">
        <span>spec.md</span>
        <span className="text-xs">{value.length} chars</span>
      </header>
      <textarea
        className="flex-1 resize-none p-4 font-mono text-sm bg-background focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={'<Button variant="primary" />\n<LoginForm />'}
        spellCheck={false}
      />
    </div>
  );
}
