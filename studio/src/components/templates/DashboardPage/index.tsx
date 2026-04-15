import { Sidebar } from "@/components/composites/Sidebar";
import { DashboardHeader } from "@/components/composites/DashboardHeader";
import { StatCard } from "@/components/composites/StatCard";
import { ActivityTable } from "@/components/composites/ActivityTable";
import type { DashboardPageProps, StatCardData, ActivityRowData } from "../types";

interface DashboardPageFullProps extends DashboardPageProps {
  appName?: string;
  stats: StatCardData[];
  activities: ActivityRowData[];
}

export function DashboardPage({
  texts,
  appName = "Admin",
  stats,
  activities,
}: DashboardPageFullProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        appName={appName}
        navItems={texts.navItems}
        activeIndex={0}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          title={texts.title}
          searchPlaceholder={texts.searchPlaceholder}
        />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
          <ActivityTable
            title={texts.activityTitle}
            viewAllLabel={texts.activityViewAll}
            columns={texts.activityColumns}
            rows={activities}
          />
        </main>
      </div>
    </div>
  );
}
