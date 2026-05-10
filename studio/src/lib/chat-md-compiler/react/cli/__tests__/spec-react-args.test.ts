import { describe, it, expect } from "vitest";
import { parseArgs } from "../spec-react";

describe("parseArgs — componentName 도출", () => {
  it(".spec.md 파일 → .spec suffix 제거", () => {
    const r = parseArgs(["login-page.spec.md"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.name).toBeUndefined(); // --name 미지정
    // componentName 도출은 runCompile 내부이므로 basename 처리를 직접 테스트하기 위해
    // spec-react.ts 에서 deriveComponentName 을 export 해야 함
  });
});

// deriveComponentName 단위 테스트 (별도 export 필요)
import { deriveComponentName } from "../spec-react";

describe("deriveComponentName", () => {
  it(".spec.md → PascalCase (spec suffix 제거)", () => {
    expect(deriveComponentName("login-page.spec.md")).toBe("LoginPage");
  });

  it(".md → PascalCase", () => {
    expect(deriveComponentName("my-page.md")).toBe("MyPage");
  });

  it("단일 단어 .spec.md", () => {
    expect(deriveComponentName("dashboard.spec.md")).toBe("Dashboard");
  });

  it("언더스코어 구분자", () => {
    expect(deriveComponentName("login_page.spec.md")).toBe("LoginPage");
  });

  it("경로 포함 → basename 처리", () => {
    expect(deriveComponentName("/path/to/login-page.spec.md")).toBe("LoginPage");
  });
});
