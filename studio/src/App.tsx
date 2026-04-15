import { useState } from "react";
import { LoginPage, DashboardPage } from "@/components/templates";
import { getLoginPageTexts, getDashboardPageTexts } from "@/lib/i18n";
import type { StatCardData, ActivityRowData } from "@/components/templates/types";

const loginTexts = getLoginPageTexts("ko");
const dashboardTexts = getDashboardPageTexts("ko");

const mockStats: StatCardData[] = [
  { label: "TOTAL USERS", value: "12,847", change: "12.5% from last month", trend: "up" },
  { label: "AI CONVERSATIONS", value: "3,429", change: "8.2% from last month", trend: "up" },
  { label: "DB RECORDS", value: "58,102", change: "2.1% from last month", trend: "down" },
  { label: "UPTIME", value: "99.98%", change: "Stable", trend: "stable" },
];

const mockActivities: ActivityRowData[] = [
  { userName: "Jiwon Kim", initials: "JK", action: "Created new record", status: "Completed", statusColor: "green", time: "2 min ago" },
  { userName: "Soohan Park", initials: "SH", action: "AI Chat session", status: "In Progress", statusColor: "blue", time: "5 min ago" },
  { userName: "Yejin Lee", initials: "YJ", action: "Updated 3 records", status: "Completed", statusColor: "green", time: "12 min ago" },
  { userName: "Minjun Choi", initials: "MJ", action: "Deleted record #4821", status: "Deleted", statusColor: "red", time: "28 min ago" },
];

type Page = "login" | "dashboard";

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <>
      <div className="fixed top-2 right-2 z-50 flex gap-1 rounded-lg bg-card p-1 ring-1 ring-foreground/10">
        <button
          onClick={() => setPage("login")}
          className={`rounded-md px-3 py-1 text-xs font-medium ${
            page === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setPage("dashboard")}
          className={`rounded-md px-3 py-1 text-xs font-medium ${
            page === "dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Dashboard
        </button>
      </div>

      {page === "login" && <LoginPage variant="page" texts={loginTexts} />}
      {page === "dashboard" && (
        <DashboardPage
          variant="page"
          texts={dashboardTexts}
          stats={mockStats}
          activities={mockActivities}
        />
      )}
    </>
  );
}

export default App;
