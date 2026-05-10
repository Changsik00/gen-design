import { describe, it, expect } from "vitest";
import { resolveI18n, I18N_MISSING_STYLE } from "../i18n-resolver";
import {
  tokenPathToCssVar,
  rootCssVars,
  normalizeInlineTokenString,
} from "../token-resolver";

const bundle = {
  ko: {
    action: { login: "로그인", signup: "회원가입" },
    error: { "not-found": "찾을 수 없음" },
    profile: { bio: "자기소개" },
  },
};

describe("i18n-resolver — happy", () => {
  it("단일 segment 후 leaf string", () => {
    const r = resolveI18n("ko.action.login", bundle);
    expect(r).toEqual({ value: "로그인", missing: false });
  });

  it("kebab-case segment 지원", () => {
    const r = resolveI18n("ko.error.not-found", bundle);
    expect(r.value).toBe("찾을 수 없음");
    expect(r.missing).toBe(false);
  });

  it("깊은 path", () => {
    const r = resolveI18n("ko.action.signup", bundle);
    expect(r.value).toBe("회원가입");
  });
});

describe("i18n-resolver — 누락", () => {
  it("최종 segment 누락 → missing=true + sentinel", () => {
    const r = resolveI18n("ko.action.unknown", bundle);
    expect(r.missing).toBe(true);
    expect(r.value).toBe("[ko.action.unknown missing]");
  });

  it("중간 segment 가 object 아님 → missing", () => {
    const r = resolveI18n("ko.action.login.deeper", bundle);
    expect(r.missing).toBe(true);
  });

  it("최상위 누락", () => {
    const r = resolveI18n("en.action.login", bundle);
    expect(r.missing).toBe(true);
    expect(r.value).toContain("missing");
  });

  it("I18N_MISSING_STYLE 상수 export", () => {
    expect(I18N_MISSING_STYLE).toContain("background");
    expect(I18N_MISSING_STYLE).toContain("#ff4d4d");
  });
});

describe("token-resolver — path → CSS var", () => {
  it("semantic.color.light.primary → var(--primary)", () => {
    expect(tokenPathToCssVar("semantic.color.light.primary")).toBe("var(--primary)");
  });

  it("semantic.brand-2 → var(--brand-2)", () => {
    expect(tokenPathToCssVar("semantic.brand-2")).toBe("var(--brand-2)");
  });

  it("단일 segment → var(--name)", () => {
    expect(tokenPathToCssVar("foreground")).toBe("var(--foreground)");
  });
});

describe("token-resolver — root CSS vars 블록", () => {
  it("CSS :root 블록을 string 으로 emit", () => {
    const block = rootCssVars();
    expect(block).toContain(":root");
    expect(block).toContain("--primary");
    expect(block).toContain("--background");
  });
});

describe("token-resolver — inline string 정규화", () => {
  it('"{{token.x}}" → "var(--x)"', () => {
    expect(normalizeInlineTokenString("{{token.semantic.brand-2}}")).toBe("var(--brand-2)");
  });

  it("일반 string 은 그대로 (e.g. raw color, 이미 var(...))", () => {
    expect(normalizeInlineTokenString("var(--primary)")).toBe("var(--primary)");
    expect(normalizeInlineTokenString("#ff0000")).toBe("#ff0000");
  });
});
