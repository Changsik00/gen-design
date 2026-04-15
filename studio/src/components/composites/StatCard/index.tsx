import { Card, CardContent } from "@/components/ui/card";
import type { StatCardData } from "@/components/templates/types";

export function StatCard({ label, value, change, trend }: StatCardData) {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
        <p className={`mt-1 text-xs ${trendColor}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {change}
        </p>
      </CardContent>
    </Card>
  );
}
