import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ErrorIcon } from ".";

afterEach(cleanup);

describe("ErrorIcon", () => {
  it("renders an svg for 404 variant", () => {
    const { container } = render(<ErrorIcon variant="404" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders an svg for 500 variant", () => {
    const { container } = render(<ErrorIcon variant="500" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });
});
