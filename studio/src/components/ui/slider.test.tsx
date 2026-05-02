import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Slider } from "./slider";

afterEach(cleanup);

describe("Slider", () => {
  it("renders a slider thumb with given value", () => {
    render(<Slider aria-label="Font size" value={50} min={0} max={100} />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
  });

  it("respects min and max bounds via native input attributes", () => {
    render(<Slider aria-label="Volume" value={75} min={0} max={100} />);
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("min", "0");
    expect(thumb).toHaveAttribute("max", "100");
  });

  it("renders disabled state on the native input", () => {
    render(<Slider aria-label="Brightness" value={30} min={0} max={100} disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });
});
