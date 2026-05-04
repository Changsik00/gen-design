import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ProfileHeader } from ".";

afterEach(cleanup);

describe("ProfileHeader", () => {
  it("renders name and role", () => {
    render(
      <ProfileHeader name="Alex Park" role="Senior Engineer" avatarUrl={null} />
    );
    expect(screen.getByText("Alex Park")).toBeInTheDocument();
    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
  });

  it("falls back to initials when avatarUrl is null", () => {
    render(<ProfileHeader name="Alex Park" role="Engineer" avatarUrl={null} />);
    expect(screen.getByText("AP")).toBeInTheDocument();
  });

  it("renders img when avatarUrl provided", () => {
    render(
      <ProfileHeader name="Alex" role="Engineer" avatarUrl="/avatar.png" />
    );
    expect(screen.getByRole("img")).toHaveAttribute("src", "/avatar.png");
  });
});
