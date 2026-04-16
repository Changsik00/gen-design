import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DashboardHeader } from ".";

afterEach(cleanup);

describe("DashboardHeader", () => {
  it("renders title", () => {
    render(<DashboardHeader title="Dashboard" searchPlaceholder="Search..." />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<DashboardHeader title="Dashboard" searchPlaceholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders profile avatar", () => {
    const { container } = render(
      <DashboardHeader title="Dashboard" searchPlaceholder="Search..." />
    );
    expect(container.querySelector(".rounded-full")).toBeTruthy();
  });
});
