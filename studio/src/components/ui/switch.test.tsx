import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Switch } from "./switch";

afterEach(cleanup);

describe("Switch", () => {
  it("renders an interactive switch element", () => {
    render(<Switch aria-label="Notifications" />);
    expect(screen.getByRole("switch", { name: "Notifications" })).toBeInTheDocument();
  });

  it("reflects checked state via aria-checked", () => {
    render(<Switch aria-label="Email" defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange on click", () => {
    const handleChange = vi.fn();
    render(<Switch aria-label="Push" onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("does not toggle when disabled", () => {
    const handleChange = vi.fn();
    render(<Switch aria-label="Mentions" disabled onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(handleChange).not.toHaveBeenCalled();
  });
});
