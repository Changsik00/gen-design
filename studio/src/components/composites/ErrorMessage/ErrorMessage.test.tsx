import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ErrorMessage } from ".";

afterEach(cleanup);

describe("ErrorMessage", () => {
  it("renders title and message", () => {
    render(<ErrorMessage title="Page not found" message="We couldn't find the page" />);
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByText("We couldn't find the page")).toBeInTheDocument();
  });
});
