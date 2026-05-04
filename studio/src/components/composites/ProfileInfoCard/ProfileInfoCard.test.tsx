import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ProfileInfoCard } from ".";

afterEach(cleanup);

describe("ProfileInfoCard", () => {
  it("renders email, joinedAt, and team labels and values", () => {
    render(
      <ProfileInfoCard
        labels={{
          email: "Email",
          joinedAt: "Joined",
          team: "Team",
        }}
        values={{
          email: "alex@example.com",
          joinedAt: "Jan 12, 2024",
          team: "Platform",
        }}
      />
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("alex@example.com")).toBeInTheDocument();
    expect(screen.getByText("Joined")).toBeInTheDocument();
    expect(screen.getByText("Jan 12, 2024")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByText("Platform")).toBeInTheDocument();
  });
});
