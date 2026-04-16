import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Sidebar } from ".";

afterEach(cleanup);

describe("Sidebar", () => {
  const navItems = ["Dashboard", "AI Chat", "Database", "Settings"];

  it("renders app name and logo initial", () => {
    render(<Sidebar appName="Admin" navItems={navItems} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders all nav items", () => {
    render(<Sidebar appName="Admin" navItems={navItems} />);
    navItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("highlights active nav item (default index 0)", () => {
    const { container } = render(<Sidebar appName="Admin" navItems={navItems} />);
    const activeLink = container.querySelector("a.bg-primary");
    expect(activeLink).toBeTruthy();
    expect(activeLink?.textContent).toContain("Dashboard");
  });

  it("highlights custom active index", () => {
    const { container } = render(<Sidebar appName="Admin" navItems={navItems} activeIndex={2} />);
    const activeLink = container.querySelector("a.bg-primary");
    expect(activeLink?.textContent).toContain("Database");
  });

  it("renders Menu label", () => {
    render(<Sidebar appName="Admin" navItems={navItems} />);
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });
});
