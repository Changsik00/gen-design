import { DashboardPage } from "studio/components/templates";
import { getDashboardTexts } from "@/hooks/useTexts";

const stats = [
  { label: "ACTIVE TASKS", value: "24", change: "+3 this week", trend: "up" as const },
  { label: "DONE THIS WEEK", value: "18", change: "+12% vs last week", trend: "up" as const },
  { label: "OVERDUE", value: "3", change: "-1 from yesterday", trend: "down" as const },
  { label: "TEAM MEMBERS", value: "12", change: "stable", trend: "stable" as const },
];

const activities = [
  {
    userName: "Marketing site redesign",
    initials: "AP",
    action: "Alex Park",
    status: "In Review",
    statusColor: "blue" as const,
    time: "2h ago",
  },
  {
    userName: "API rate limit hardening",
    initials: "JK",
    action: "Jamie Kim",
    status: "Done",
    statusColor: "green" as const,
    time: "5h ago",
  },
  {
    userName: "Onboarding email copy",
    initials: "SL",
    action: "Sam Lee",
    status: "Overdue",
    statusColor: "red" as const,
    time: "1d ago",
  },
  {
    userName: "Analytics dashboard QA",
    initials: "MO",
    action: "Morgan Oh",
    status: "Backlog",
    statusColor: "gray" as const,
    time: "2d ago",
  },
];

export function DashboardRoute() {
  return (
    <DashboardPage
      variant="page"
      texts={getDashboardTexts()}
      appName="TaskFlow"
      stats={stats}
      activities={activities}
    />
  );
}
