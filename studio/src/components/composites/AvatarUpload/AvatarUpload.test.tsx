import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { AvatarUpload } from ".";

afterEach(cleanup);

describe("AvatarUpload", () => {
  it("renders the upload button with given label", () => {
    render(<AvatarUpload label="Change avatar" avatarUrl={null} initials="AP" />);
    expect(screen.getByRole("button", { name: "Change avatar" })).toBeInTheDocument();
  });

  it("calls onUpload when button clicked", () => {
    const handleUpload = vi.fn();
    render(
      <AvatarUpload
        label="Change avatar"
        avatarUrl={null}
        initials="AP"
        onUpload={handleUpload}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Change avatar" }));
    expect(handleUpload).toHaveBeenCalledTimes(1);
  });
});
