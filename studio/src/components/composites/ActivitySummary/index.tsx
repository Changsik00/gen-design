import { Card, CardContent } from "@/components/ui/card";

interface ActivitySummaryProps {
  labels: {
    tasks: string;
    comments: string;
    completion: string;
  };
  values: {
    tasks: number;
    comments: number;
    completion: number;
  };
}

export function ActivitySummary({ labels, values }: ActivitySummaryProps) {
  return (
    <Card>
      <CardContent className="grid grid-cols-3 gap-4 pt-4">
        <Metric label={labels.tasks} value={String(values.tasks)} />
        <Metric label={labels.comments} value={String(values.comments)} />
        <Metric label={labels.completion} value={`${values.completion}%`} />
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 text-2xl font-bold">{value}</span>
    </div>
  );
}
