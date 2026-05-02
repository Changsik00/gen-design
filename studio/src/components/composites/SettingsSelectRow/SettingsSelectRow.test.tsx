import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SettingsSelectRow } from ".";

afterEach(cleanup);

describe("SettingsSelectRow", () => {
  it("renders label and current value", () => {
    render(
      <SettingsSelectRow
        label="Theme"
        value="light"
        options={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
          { value: "system", label: "System" },
        ]}
      />
    );
    expect(screen.getByText("Theme")).toBeInTheDocument();
    // Value 가 trigger 에 표시 (Light)
    expect(screen.getByText("Light")).toBeInTheDocument();
  });
});
