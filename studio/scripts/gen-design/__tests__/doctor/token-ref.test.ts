import { describe, it, expect } from "vitest";
import {
  extractDesignMdTokenRefs,
  extractChatMdTokenClasses,
  checkTokenRef,
} from "../../doctor/check-token-ref";

describe("extractDesignMdTokenRefs — DESIGN.md 의 {token} 참조", () => {
  it("`{primary}` / `{muted-foreground}` 추출", () => {
    const text = "주요 색은 {primary} 이고, 보조 텍스트는 {muted-foreground}.";
    const refs = extractDesignMdTokenRefs(text);
    expect(refs).toContain("primary");
    expect(refs).toContain("muted-foreground");
  });

  it("코드 블록은 무시", () => {
    const text = "```\n{ignored}\n```\n실제 색: {primary}";
    const refs = extractDesignMdTokenRefs(text);
    expect(refs).toContain("primary");
    expect(refs).not.toContain("ignored");
  });

  it("placeholder 없으면 빈 배열", () => {
    const text = "토큰 참조 없는 문서";
    expect(extractDesignMdTokenRefs(text)).toEqual([]);
  });

  it("HTML 주석 안 placeholder 는 무시 (spec-11-05 fix #3)", () => {
    const text = "<!-- 예시: {fake-token} -->\n실제: {primary}";
    const refs = extractDesignMdTokenRefs(text);
    expect(refs).toContain("primary");
    expect(refs).not.toContain("fake-token");
  });
});

describe("extractChatMdTokenClasses — chat.md 의 Tailwind 토큰 클래스", () => {
  it("`bg-primary` / `text-muted-foreground` / `border-input` 추출", () => {
    const text = `<Card className="bg-primary text-primary-foreground border-input">`;
    const tokens = extractChatMdTokenClasses(text);
    expect(tokens).toContain("primary");
    expect(tokens).toContain("primary-foreground");
    expect(tokens).toContain("input");
  });

  it("토큰 무관 클래스는 추출 안 함 (`p-4`, `flex` 등)", () => {
    const text = `<div className="flex p-4 gap-2">`;
    const tokens = extractChatMdTokenClasses(text);
    expect(tokens).toHaveLength(0);
  });

  it("hover:bg-accent 등 prefix 도 추출", () => {
    const text = `<Button className="hover:bg-accent focus-visible:ring-ring">`;
    const tokens = extractChatMdTokenClasses(text);
    expect(tokens).toContain("accent");
    expect(tokens).toContain("ring");
  });
});

describe("checkTokenRef — 통합 검증", () => {
  const defined = new Set(["primary", "primary-foreground", "background", "foreground"]);

  it("정의된 토큰만 사용 시 진단 없음", () => {
    const designMd = "주요: {primary}";
    const chatFiles = [{ path: "chats/scenes/x.chat.md", content: "<Button className=\"bg-primary text-primary-foreground\">" }];
    const diags = checkTokenRef(designMd, "templates/DESIGN.md", chatFiles, defined);
    expect(diags).toHaveLength(0);
  });

  it("미정의 토큰 사용 시 token-ref error", () => {
    const designMd = "주요: {brand}"; // brand 미정의
    const diags = checkTokenRef(designMd, "templates/DESIGN.md", [], defined);
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0]?.category).toBe("token-ref");
    expect(diags[0]?.message).toContain("brand");
  });

  it("chat.md 의 미정의 토큰 클래스도 진단", () => {
    const chatFiles = [
      { path: "chats/scenes/y.chat.md", content: "<div className=\"bg-fake-color text-primary\">" },
    ];
    const diags = checkTokenRef("", "templates/DESIGN.md", chatFiles, defined);
    expect(diags.some((d) => d.message.includes("fake-color"))).toBe(true);
  });

  it("'Did you mean?' — Levenshtein 유사 토큰 제안", () => {
    const definedSet = new Set(["primary", "primary-foreground", "muted-foreground"]);
    const designMd = "보조: {muted-fg}"; // muted-foreground 의 오타
    const diags = checkTokenRef(designMd, "templates/DESIGN.md", [], definedSet);
    expect(diags[0]?.hint).toContain("muted-foreground");
  });
});
