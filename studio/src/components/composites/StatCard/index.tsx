import { cva } from "class-variance-authority";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StatCardData } from "@/components/templates/types";

const statCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      compact: "compact",
      highlighted: "border-2 border-primary",
    },
  },
  defaultVariants: { variant: "default" },
});

export function StatCard({ label, value, change, trend, variant }: StatCardData) {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <Card className={cn(statCardVariants({ variant }))}>
      <CardContent className={cn("pt-4", variant === "compact" && "pt-2")}>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className={cn("mt-1 text-2xl font-bold", variant === "compact" && "text-xl")}>
          {value}
        </p>
        <p className={`mt-1 text-xs ${trendColor}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {change}
        </p>
      </CardContent>
    </Card>
  );
}
