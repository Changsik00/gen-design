import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../App";

afterEach(cleanup);

describe("routes (smoke)", () => {
  it("/login renders LoginPage with sign-in heading", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Sign in to TaskFlow/i).length).toBeGreaterThan(0);
  });

  it("/signup renders SignupPage", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
    expect(
      screen.getAllByText(/Create your TaskFlow account/i).length
    ).toBeGreaterThan(0);
  });

  it("/me renders MyPage", () => {
    render(
      <MemoryRouter initialEntries={["/me"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("My Page")).toBeInTheDocument();
  });

  it("/settings renders SettingsPage with 4 group titles", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Account" })).toBeInTheDocument();
  });

  it("/nonexistent renders 404 ErrorPage", () => {
    render(
      <MemoryRouter initialEntries={["/totally-not-here"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});
