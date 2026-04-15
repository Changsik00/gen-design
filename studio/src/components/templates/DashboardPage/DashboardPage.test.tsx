import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DashboardPage } from ".";
import { getDashboardPageTexts } from "@/lib/i18n";
import type { StatCardData, ActivityRowData } from "../types";

afterEach(cleanup);

const koTexts = getDashboardPageTexts("ko");

const mockStats: StatCardData[] = [
  { label: "TOTAL USERS", value: "12,847", change: "12.5% from last month", trend: "up" },
  { label: "AI CONVERSATIONS", value: "3,429", change: "8.2% from last month", trend: "up" },
  { label: "DB RECORDS", value: "58,102", change: "2.1% from last month", trend: "down" },
  { label: "UPTIME", value: "99.98%", change: "Stable", trend: "stable" },
];

const mockActivities: ActivityRowData[] = [
  { userName: "Jiwon Kim", initials: "JK", action: "Created new record", status: "Completed", statusColor: "green", time: "2 min ago" },
  { userName: "Soohan Park", initials: "SH", action: "AI Chat session", status: "In Progress", statusColor: "blue", time: "5 min ago" },
];

describe("DashboardPage", () => {
  it("renders title and navigation", () => {
    render(
      <DashboardPage variant="page" texts={koTexts} stats={mockStats} activities={mockActivities} />
    );
    expect(screen.getAllByText("대시보드")).toHaveLength(2); // nav + header
    expect(screen.getByText("AI 채팅")).toBeInTheDocument();
    expect(screen.getByText("데이터베이스")).toBeInTheDocument();
  });

  it("renders stat cards", () => {
    render(
      <DashboardPage variant="page" texts={koTexts} stats={mockStats} activities={mockActivities} />
    );
    expect(screen.getByText("12,847")).toBeInTheDocument();
    expect(screen.getByText("99.98%")).toBeInTheDocument();
    expect(screen.getByText("TOTAL USERS")).toBeInTheDocument();
  });

  it("renders activity table", () => {
    render(
      <DashboardPage variant="page" texts={koTexts} stats={mockStats} activities={mockActivities} />
    );
    expect(screen.getByText("최근 활동")).toBeInTheDocument();
    expect(screen.getByText("Jiwon Kim")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("사용자")).toBeInTheDocument();
  });
});
