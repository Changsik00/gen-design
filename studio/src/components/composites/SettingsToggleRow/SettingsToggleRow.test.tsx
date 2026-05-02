import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { SettingsToggleRow } from ".";

afterEach(cleanup);

describe("SettingsToggleRow", () => {
  it("renders label", () => {
    render(<SettingsToggleRow label="Email notifications" checked={false} />);
    expect(screen.getByText("Email notifications")).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    render(
      <SettingsToggleRow
        label="Email"
        helperText="Receive emails for important events"
        checked={false}
      />
    );
    expect(
      screen.getByText("Receive emails for important events")
    ).toBeInTheDocument();
  });

  it("calls onCheckedChange when toggled", () => {
    const handleChange = vi.fn();
    render(
      <SettingsToggleRow
        label="Push"
        checked={false}
        onCheckedChange={handleChange}
      />
    );
    fireEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
  });
});
