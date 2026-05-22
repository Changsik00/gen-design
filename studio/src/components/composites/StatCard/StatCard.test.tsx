import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { StatCard } from ".";

afterEach(cleanup);

describe("StatCard", () => {
  it("renders label, value, and change", () => {
    render(
      <StatCard label="TOTAL USERS" value="12,847" change="12.5% from last month" trend="up" />
    );
    expect(screen.getByText("TOTAL USERS")).toBeInTheDocument();
    expect(screen.getByText("12,847")).toBeInTheDocument();
    expect(screen.getByText(/12\.5% from last month/)).toBeInTheDocument();
  });

  it("shows up arrow for upward trend", () => {
    const { container } = render(
      <StatCard label="Users" value="100" change="10%" trend="up" />
    );
    expect(container.querySelector(".text-green-600")).toBeTruthy();
    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });

  it("shows down arrow for downward trend", () => {
    const { container } = render(
      <StatCard label="Orders" value="50" change="5%" trend="down" />
    );
    expect(container.querySelector(".text-red-500")).toBeTruthy();
    expect(screen.getByText(/↓/)).toBeInTheDocument();
  });

  it("shows no arrow for stable trend", () => {
    render(
      <StatCard label="Uptime" value="99.9%" change="Stable" trend="stable" />
    );
    expect(screen.getByText(/Stable/)).toBeInTheDocument();
  });

  it("default variant renders without extra border", () => {
    const { container } = render(
      <StatCard label="X" value="1" change="-" trend="stable" variant="default" />
    );
    expect(container.querySelector(".border-primary")).toBeFalsy();
  });

  it("highlighted variant adds border-primary class", () => {
    const { container } = render(
      <StatCard label="X" value="1" change="-" trend="stable" variant="highlighted" />
    );
    expect(container.querySelector(".border-primary")).toBeTruthy();
  });

  it("compact variant adds compact class", () => {
    const { container } = render(
      <StatCard label="X" value="1" change="-" trend="stable" variant="compact" />
    );
    expect(container.firstChild).toHaveClass("compact");
  });
});
