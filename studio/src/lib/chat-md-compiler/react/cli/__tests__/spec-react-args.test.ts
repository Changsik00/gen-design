import { describe, it, expect } from "vitest";
import { parseArgs } from "../spec-react";

describe("parseArgs — componentName 도출", () => {
  it(".chat.md 파일 → .chat suffix 제거", () => {
    const r = parseArgs(["login.chat.md"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.name).toBeUndefined(); // --name 미지정
  });
});

// deriveComponentName 단위 테스트
import { deriveComponentName } from "../spec-react";

describe("deriveComponentName", () => {
  it(".chat.md → PascalCase (chat suffix 제거)", () => {
    expect(deriveComponentName("login.chat.md")).toBe("Login");
  });

  it(".md → PascalCase (suffix 없음)", () => {
    expect(deriveComponentName("dashboard.md")).toBe("Dashboard");
  });

  it("단일 단어 .chat.md", () => {
    expect(deriveComponentName("dashboard.chat.md")).toBe("Dashboard");
  });

  it("하이픈 구분자 — 다단어", () => {
    expect(deriveComponentName("brand-header.chat.md")).toBe("BrandHeader");
  });

  it("언더스코어 구분자", () => {
    expect(deriveComponentName("brand_header.chat.md")).toBe("BrandHeader");
  });

  it("경로 포함 → basename 처리", () => {
    expect(deriveComponentName("/path/to/login.chat.md")).toBe("Login");
  });

  // NOTE: scene componentName 의 *Scene suffix 자동 추가 는 spec-8-04 (chat-md-grammar)
  // 의 frontmatter type:scene 도입 후. 현재는 --name 으로 명시 또는 derived basename.
});
