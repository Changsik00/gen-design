import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SettingsSliderRow } from ".";

afterEach(cleanup);

describe("SettingsSliderRow", () => {
  it("renders label and current value", () => {
    render(
      <SettingsSliderRow
        label="Font size"
        value={14}
        min={12}
        max={24}
        displayValue="14 px"
      />
    );
    expect(screen.getByText("Font size")).toBeInTheDocument();
    expect(screen.getByText("14 px")).toBeInTheDocument();
  });

  it("uses raw value as default display when displayValue absent", () => {
    render(<SettingsSliderRow label="Volume" value={50} min={0} max={100} />);
    expect(screen.getByText("50")).toBeInTheDocument();
  });
});
