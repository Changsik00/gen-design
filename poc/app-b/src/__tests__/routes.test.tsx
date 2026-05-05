import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../App";

afterEach(cleanup);

describe("routes (smoke, ko)", () => {
  it("/login renders LoginPage with korean heading", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/플로우데스크 로그인/).length).toBeGreaterThan(0);
  });

  it("/signup renders SignupPage with korean heading", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
    expect(
      screen.getAllByText(/플로우데스크 계정 만들기/).length
    ).toBeGreaterThan(0);
  });

  it("/me renders MyPage with korean title", () => {
    render(
      <MemoryRouter initialEntries={["/me"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("마이페이지")).toBeInTheDocument();
  });

  it("/settings renders SettingsPage with korean group titles", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "알림" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "계정" })).toBeInTheDocument();
  });

  it("/nonexistent renders 404 ErrorPage with korean copy", () => {
    render(
      <MemoryRouter initialEntries={["/totally-not-here"]}>
        <App />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: "페이지를 찾을 수 없습니다" })
    ).toBeInTheDocument();
  });
});
