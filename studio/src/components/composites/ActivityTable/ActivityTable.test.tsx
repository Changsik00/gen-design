import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ActivityTable } from ".";
import type { ActivityRowData } from "@/components/templates/types";

afterEach(cleanup);

const columns = { user: "User", action: "Action", status: "Status", time: "Time" };

const rows: ActivityRowData[] = [
  { userName: "Jiwon Kim", initials: "JK", action: "Created record", status: "Completed", statusColor: "green", time: "2 min ago" },
  { userName: "Soohan Park", initials: "SH", action: "AI Chat", status: "In Progress", statusColor: "blue", time: "5 min ago" },
];

describe("ActivityTable", () => {
  it("renders title and view all link", () => {
    render(
      <ActivityTable title="Recent Activity" viewAllLabel="View all →" columns={columns} rows={rows} />
    );
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getByText("View all →")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(
      <ActivityTable title="Activity" viewAllLabel="All" columns={columns} rows={rows} />
    );
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(
      <ActivityTable title="Activity" viewAllLabel="All" columns={columns} rows={rows} />
    );
    expect(screen.getByText("Jiwon Kim")).toBeInTheDocument();
    expect(screen.getByText("JK")).toBeInTheDocument();
    expect(screen.getByText("Created record")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("2 min ago")).toBeInTheDocument();
  });

  it("applies status color classes", () => {
    const { container } = render(
      <ActivityTable title="Activity" viewAllLabel="All" columns={columns} rows={rows} />
    );
    expect(container.querySelector(".text-green-600")).toBeTruthy();
    expect(container.querySelector(".text-blue-600")).toBeTruthy();
  });

  it("renders user initials avatar", () => {
    render(
      <ActivityTable title="Activity" viewAllLabel="All" columns={columns} rows={rows} />
    );
    expect(screen.getByText("SH")).toBeInTheDocument();
  });
});
