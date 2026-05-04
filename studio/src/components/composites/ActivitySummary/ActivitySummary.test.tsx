import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ActivitySummary } from ".";

afterEach(cleanup);

describe("ActivitySummary", () => {
  it("renders three metrics with labels", () => {
    render(
      <ActivitySummary
        labels={{ tasks: "Tasks", comments: "Comments", completion: "Completion Rate" }}
        values={{ tasks: 24, comments: 117, completion: 86 }}
      />
    );
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("117")).toBeInTheDocument();
    expect(screen.getByText("Completion Rate")).toBeInTheDocument();
    expect(screen.getByText(/86\s*%/)).toBeInTheDocument();
  });
});
