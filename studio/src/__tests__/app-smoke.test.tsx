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
  it("default route → BlueprintPage placeholder 노출 + Sidebar 'Design Studio'", () => {
    render(<App />);
    expect(screen.getByText("Design Studio")).toBeInTheDocument();
    // "Blueprint" 는 Sidebar nav + Page heading 양쪽 등장 — getAllByText 사용
    expect(screen.getAllByText("Blueprint").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/spec-6-05/)).toBeInTheDocument();
  });

  it("hash #/editor → EditorPage placeholder", () => {
    setHash("#/editor");
    render(<App />);
    expect(screen.getByText("DESIGN.md Editor")).toBeInTheDocument();
    expect(screen.getByText(/spec-6-06/)).toBeInTheDocument();
  });

  it("hash #/tokens → TokensPage placeholder", () => {
    setHash("#/tokens");
    render(<App />);
    expect(screen.getByText("Token Editor")).toBeInTheDocument();
    expect(screen.getByText(/spec-6-07/)).toBeInTheDocument();
  });

  it("hash #/export → ExportPage placeholder", () => {
    setHash("#/export");
    render(<App />);
    expect(screen.getAllByText("Export").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/spec-6-08/)).toBeInTheDocument();
  });

  it("hash #/__playground → Playground (Sidebar 미노출)", () => {
    setHash("#/__playground");
    render(<App />);
    // Sidebar appName "Design Studio" 가 없어야 함 (Playground 는 StudioLayout 우회)
    expect(screen.queryByText("Design Studio")).not.toBeInTheDocument();
    // Playground 의 control panel 의 'Brand A' / 'Brand B' 버튼 등이 노출
    expect(screen.getByText("Brand A")).toBeInTheDocument();
    expect(screen.getByText("Brand B")).toBeInTheDocument();
  });

  it("hash #/unknown → blueprint fallback", () => {
    setHash("#/unknown");
    render(<App />);
    // BlueprintPage 가 렌더 (fallback)
    // "Blueprint" 는 Sidebar nav + Page heading 양쪽 등장 — getAllByText 사용
    expect(screen.getAllByText("Blueprint").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/spec-6-05/)).toBeInTheDocument();
  });

  it("Sidebar nav 4 항목 모두 노출", () => {
    render(<App />);
    // Sidebar 의 nav 링크 4 개 (Blueprint / Editor / Tokens / Export)
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
