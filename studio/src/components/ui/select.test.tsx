import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "./select";

afterEach(cleanup);

describe("Select", () => {
  it("renders trigger with placeholder when no value", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose theme" />
        </SelectTrigger>
        <SelectPopup>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectPopup>
      </Select>
    );
    expect(screen.getByText("Choose theme")).toBeInTheDocument();
  });

  it("renders trigger that is keyboard-accessible (combobox role)", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Theme">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectPopup>
          <SelectItem value="light">Light</SelectItem>
        </SelectPopup>
      </Select>
    );
    expect(screen.getByRole("combobox", { name: "Theme" })).toBeInTheDocument();
  });
});
