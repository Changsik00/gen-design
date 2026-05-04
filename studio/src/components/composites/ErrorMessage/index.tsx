interface ErrorMessageProps {
  title: string;
  message: string;
}

export function ErrorMessage({ title, message }: ErrorMessageProps) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-[-0.015em]">{title}</h1>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
