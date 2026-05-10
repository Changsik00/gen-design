/**
 * App smoke test — Studio shell + 라우트 렌더 검증.
 *
 * spec-7-06: 라우트 재구성 (spec/new/design/tokens/export) 에 맞게 갱신.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "@/App";

afterEach(cleanup);

beforeEach(() => {
  window.location.hash = "";
});

function setHash(hash: string) {
  window.location.hash = hash;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

describe("App smoke", () => {
  it("default route → Spec Editor + Sidebar 'Design Studio'", () => {
    render(<App />);
    expect(screen.getByText("Design Studio")).toBeInTheDocument();
    expect(screen.getAllByText("Spec Editor").length).toBeGreaterThanOrEqual(1);
  });

  it("hash #/new → BlueprintWizard 렌더", () => {
    setHash("#/new");
    render(<App />);
    expect(screen.getAllByText(/앱유형/).length).toBeGreaterThanOrEqual(1);
  });

  it("hash #/blueprint → #/new redirect → BlueprintWizard 렌더", () => {
    setHash("#/blueprint");
    render(<App />);
    expect(screen.getAllByText(/앱유형/).length).toBeGreaterThanOrEqual(1);
  });

  it("hash #/design → DesignEditor 렌더 (SectionNav + 미리보기 패널)", () => {
    setHash("#/design");
    render(<App />);
    expect(screen.getByText("앱 이름")).toBeInTheDocument();
    expect(screen.getByText("DESIGN.md 미리보기")).toBeInTheDocument();
  });

  it("hash #/editor → #/design redirect → DesignEditor 렌더", () => {
    setHash("#/editor");
    render(<App />);
    expect(screen.getByText("앱 이름")).toBeInTheDocument();
  });

  it("hash #/tokens → TokenEditor 렌더", () => {
    setHash("#/tokens");
    render(<App />);
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByText("컴포넌트 미리보기")).toBeInTheDocument();
  });

  it("hash #/export → ExportPanel 렌더", () => {
    setHash("#/export");
    render(<App />);
    expect(screen.getByText("프로젝트 설정")).toBeInTheDocument();
    expect(screen.getByText("파일 미리보기")).toBeInTheDocument();
  });

  it("hash #/__playground → Playground (Sidebar 미노출)", () => {
    setHash("#/__playground");
    render(<App />);
    expect(screen.queryByText("Design Studio")).not.toBeInTheDocument();
    expect(screen.getByText("Brand A")).toBeInTheDocument();
  });

  it("hash #/unknown → spec fallback (Spec Editor 렌더)", () => {
    setHash("#/unknown");
    render(<App />);
    expect(screen.getAllByText("Spec Editor").length).toBeGreaterThanOrEqual(1);
  });

  it("Sidebar nav 5 항목 노출 (Spec Editor / New Spec / Design MD / Tokens / Export)", () => {
    render(<App />);
    const nav = screen.getByText("Menu").closest("nav");
    expect(nav).toBeTruthy();
    if (nav) {
      for (const label of ["Spec Editor", "New Spec", "Design MD", "Tokens", "Export"]) {
        expect(nav.textContent).toContain(label);
      }
    }
  });
});
