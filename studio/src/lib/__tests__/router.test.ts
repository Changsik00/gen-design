import { describe, it, expect } from "vitest";
import { parseHash, ROUTE_PATHS } from "../router";

describe("parseHash — 새 라우트", () => {
  it("spec / new / design 라우트 인식", () => {
    expect(parseHash("#/spec")).toBe("spec");
    expect(parseHash("#/new")).toBe("new");
    expect(parseHash("#/design")).toBe("design");
  });

  it("tokens / export / playground 유지", () => {
    expect(parseHash("#/tokens")).toBe("tokens");
    expect(parseHash("#/export")).toBe("export");
    expect(parseHash("#/__playground")).toBe("playground");
  });

  it("# 없는 path 도 허용", () => {
    expect(parseHash("/spec")).toBe("spec");
  });

  it("빈 hash → spec (새 기본 라우트)", () => {
    expect(parseHash("")).toBe("spec");
    expect(parseHash("#")).toBe("spec");
  });

  it("unknown path → spec fallback", () => {
    expect(parseHash("#/unknown")).toBe("spec");
  });
});

describe("parseHash — backward-compat redirect", () => {
  it("#/blueprint → new", () => {
    expect(parseHash("#/blueprint")).toBe("new");
  });

  it("#/editor → design", () => {
    expect(parseHash("#/editor")).toBe("design");
  });

  it("#/preview → spec", () => {
    expect(parseHash("#/preview")).toBe("spec");
  });
});

describe("ROUTE_PATHS", () => {
  it("모든 라우트가 / 로 시작", () => {
    for (const path of Object.values(ROUTE_PATHS)) {
      expect(path.startsWith("/")).toBe(true);
    }
  });

  it("playground 는 __ prefix (숨김 route)", () => {
    expect(ROUTE_PATHS.playground).toBe("/__playground");
  });

  it("spec 이 기본 라우트로 존재", () => {
    expect(ROUTE_PATHS.spec).toBe("/spec");
  });
});
