import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SettingsHeader } from ".";

afterEach(cleanup);

describe("SettingsHeader", () => {
  it("renders page title", () => {
    render(<SettingsHeader title="Settings" />);
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
  });
});
