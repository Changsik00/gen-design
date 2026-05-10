interface Props {
  errors: string[];
}

export function ErrorPanel({ errors }: Props) {
  if (errors.length === 0) return null;
  return (
    <div className="border-t bg-destructive/10 px-4 py-2 text-xs font-mono text-destructive space-y-1 max-h-24 overflow-auto">
      {errors.map((e, i) => (
        <div key={i}>{e}</div>
      ))}
    </div>
  );
}
