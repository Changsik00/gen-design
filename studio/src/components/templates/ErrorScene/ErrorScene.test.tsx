import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ErrorScene } from ".";
import type { ErrorSceneProps, ErrorSceneTexts } from "../types";

afterEach(cleanup);

const texts: ErrorSceneTexts = {
  title404: "Page not found",
  message404: "We couldn't find the page you're looking for.",
  title500: "Something went wrong",
  message500: "Please try again in a moment.",
  home: "Back to Home",
};

const baseProps: ErrorSceneProps = {
  variant: "page",
  texts,
  errorVariant: "404",
};

describe("ErrorScene", () => {
  it("renders 404 title + message + home button", () => {
    render(<ErrorScene {...baseProps} />);
    expect(
      screen.getByRole("heading", { name: "Page not found" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("We couldn't find the page you're looking for.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to Home" })).toBeInTheDocument();
  });

  it("renders 500 title and message when errorVariant=500", () => {
    render(<ErrorScene {...baseProps} errorVariant="500" />);
    expect(
      screen.getByRole("heading", { name: "Something went wrong" })
    ).toBeInTheDocument();
    expect(screen.getByText("Please try again in a moment.")).toBeInTheDocument();
  });
});
