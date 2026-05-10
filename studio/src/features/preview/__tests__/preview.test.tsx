import { afterEach, describe, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PreviewPage } from "../index";
import { FIXTURES } from "../fixtures.generated";

afterEach(cleanup);

describe("PreviewPage — mount + 기본 fixture 선택", () => {
  it("28 fixture 가 generated.ts 에 존재", () => {
    expect(FIXTURES.length).toBeGreaterThanOrEqual(28);
  });

  it("기본 fixture 가 화면에 렌더 (login-page)", () => {
    render(<PreviewPage />);
    // h1 "Paper Preview"
    expect(screen.getByText("Paper Preview")).toBeInTheDocument();
    // fixture select dropdown
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    // 좌측 React 패널 — login-page 의 LoginForm 안 button 존재
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("Copy / Send 버튼 존재", () => {
    render(<PreviewPage />);
    expect(screen.getByText(/Copy Paper HTML/)).toBeInTheDocument();
    expect(screen.getByText(/Send to Paper/)).toBeInTheDocument();
  });

  it("iframe (Paper preview) 존재", () => {
    const { container } = render(<PreviewPage />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe?.title).toBe("Paper preview");
  });
});
