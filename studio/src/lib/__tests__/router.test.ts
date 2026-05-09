import { describe, it, expect } from "vitest";
import { parseHash, ROUTE_PATHS } from "../router";

describe("parseHash", () => {
  it("정상 hash → 매칭 라우트", () => {
    expect(parseHash("#/blueprint")).toBe("blueprint");
    expect(parseHash("#/editor")).toBe("editor");
    expect(parseHash("#/tokens")).toBe("tokens");
    expect(parseHash("#/export")).toBe("export");
    expect(parseHash("#/__playground")).toBe("playground");
  });

  it("# 없는 path 도 허용", () => {
    expect(parseHash("/editor")).toBe("editor");
  });

  it("빈 hash → blueprint (default)", () => {
    expect(parseHash("")).toBe("blueprint");
    expect(parseHash("#")).toBe("blueprint");
  });

  it("unknown path → blueprint fallback", () => {
    expect(parseHash("#/unknown")).toBe("blueprint");
    expect(parseHash("#/foo/bar")).toBe("blueprint");
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
});
