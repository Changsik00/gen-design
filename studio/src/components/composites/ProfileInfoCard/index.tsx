import { Card, CardContent } from "@/components/ui/card";

interface ProfileInfoCardProps {
  labels: {
    email: string;
    joinedAt: string;
    team: string;
  };
  values: {
    email: string;
    joinedAt: string;
    team: string;
  };
}

export function ProfileInfoCard({ labels, values }: ProfileInfoCardProps) {
  const rows: Array<{ key: keyof ProfileInfoCardProps["labels"] }> = [
    { key: "email" },
    { key: "joinedAt" },
    { key: "team" },
  ];

  return (
    <Card>
      <CardContent className="pt-4">
        <dl className="divide-y divide-border">
          {rows.map(({ key }) => (
            <div key={key} className="flex justify-between py-3 first:pt-0 last:pb-0">
              <dt className="text-sm text-muted-foreground">{labels[key]}</dt>
              <dd className="text-sm font-medium">{values[key]}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
