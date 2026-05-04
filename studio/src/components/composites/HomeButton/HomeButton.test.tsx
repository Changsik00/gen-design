import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { HomeButton } from ".";

afterEach(cleanup);

describe("HomeButton", () => {
  it("renders given label", () => {
    render(<HomeButton label="Back to Home" />);
    expect(screen.getByRole("button", { name: "Back to Home" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<HomeButton label="Back to Home" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
