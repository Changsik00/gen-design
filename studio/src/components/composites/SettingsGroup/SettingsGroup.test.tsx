import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SettingsGroup } from ".";

afterEach(cleanup);

describe("SettingsGroup", () => {
  it("renders group title and children", () => {
    render(
      <SettingsGroup title="Notifications">
        <div data-testid="child">row</div>
      </SettingsGroup>
    );
    expect(screen.getByRole("heading", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders optional description", () => {
    render(
      <SettingsGroup title="Account" description="Manage your account">
        <div />
      </SettingsGroup>
    );
    expect(screen.getByText("Manage your account")).toBeInTheDocument();
  });
});
