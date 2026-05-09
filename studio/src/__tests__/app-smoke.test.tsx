/**
 * App smoke test — Studio shell + 5 route 렌더 검증.
 *
 * jsdom 환경의 window.location.hash 를 직접 조작 후 renderApp 으로 검증.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "@/App";

afterEach(cleanup);

beforeEach(() => {
  // 각 테스트 시작 시 hash 초기화
  window.location.hash = "";
});

function setHash(hash: string) {
  window.location.hash = hash;
  // useEffect 의 hashchange listener 가 동기 호출되도록 직접 dispatch
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

describe("App smoke", () => {
  it("default route → BlueprintWizard 렌더 + Sidebar 'Design Studio'", () => {
    render(<App />);
    expect(screen.getByText("Design Studio")).toBeInTheDocument();
    expect(screen.getAllByText(/앱유형/).length).toBeGreaterThanOrEqual(1);
  });

  it("hash #/editor → DesignEditor 렌더 (SectionNav + 미리보기 패널)", () => {
    setHash("#/editor");
    render(<App />);
    expect(screen.getByText("앱 이름")).toBeInTheDocument();
    expect(screen.getByText("DESIGN.md 미리보기")).toBeInTheDocument();
  });

  it("hash #/tokens → TokenEditor 렌더 (TokenNav + 미리보기 패널)", () => {
    setHash("#/tokens");
    render(<App />);
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByText("컴포넌트 미리보기")).toBeInTheDocument();
  });

  it("hash #/export → ExportPanel 렌더 (프로젝트 설정 + 파일 미리보기)", () => {
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
    expect(screen.getByText("Brand B")).toBeInTheDocument();
  });

  it("hash #/unknown → blueprint fallback (위저드 렌더)", () => {
    setHash("#/unknown");
    render(<App />);
    expect(screen.getAllByText(/앱유형/).length).toBeGreaterThanOrEqual(1);
  });

  it("Sidebar nav 4 항목 모두 노출", () => {
    render(<App />);
    const nav = screen.getByText("Menu").closest("nav");
    expect(nav).toBeTruthy();
    if (nav) {
      const labels = ["Blueprint", "Editor", "Tokens", "Export"];
      for (const label of labels) {
        expect(nav.textContent).toContain(label);
      }
    }
  });
});
