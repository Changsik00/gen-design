import { describe, it, expect } from "vitest";
import {
  RESOLVED_LIGHT,
  SIMPLE_TOKENS,
  ALL_TOKENS,
  cssVarsBlock,
  pageWrapper,
  COMPOSITES,
  TEMPLATES,
} from "../render-helpers";

describe("RESOLVED_LIGHT (paper-sync resolver 통합)", () => {
  it("primary 토큰이 indigo.500 으로 해소", () => {
    expect(RESOLVED_LIGHT["--primary"]).toBe("#6366F1");
  });

  it("background 토큰이 neutral.50 으로 해소", () => {
    expect(RESOLVED_LIGHT["--background"]).toBe("#F8FAFC");
  });

  it("destructive 토큰이 red.500 으로 해소", () => {
    expect(RESOLVED_LIGHT["--destructive"]).toBe("#EF4444");
  });

  it("light scheme 의 모든 키가 -- prefix", () => {
    for (const key of Object.keys(RESOLVED_LIGHT)) {
      expect(key.startsWith("--")).toBe(true);
    }
  });
});

describe("SIMPLE_TOKENS", () => {
  it("radius / sidebar-width / font 값 존재", () => {
    expect(SIMPLE_TOKENS["--radius"]).toBeTruthy();
    expect(SIMPLE_TOKENS["--sidebar-width"]).toBeTruthy();
    expect(SIMPLE_TOKENS["--font-sans"]).toBeTruthy();
    expect(SIMPLE_TOKENS["--font-heading"]).toBeTruthy();
  });
});

describe("ALL_TOKENS", () => {
  it("RESOLVED_LIGHT + SIMPLE_TOKENS 의 합집합", () => {
    expect(ALL_TOKENS["--primary"]).toBe(RESOLVED_LIGHT["--primary"]);
    expect(ALL_TOKENS["--radius"]).toBe(SIMPLE_TOKENS["--radius"]);
  });
});

describe("cssVarsBlock", () => {
  it(":root 블록을 생성하고 모든 토큰을 포함", () => {
    const block = cssVarsBlock();
    expect(block).toMatch(/^:root \{/);
    expect(block).toContain("--primary: #6366F1;");
    expect(block).toContain("--radius:");
    expect(block).toMatch(/\}$/);
  });

  it("커스텀 vars 를 받아 그것만 포함", () => {
    const block = cssVarsBlock({ "--accent": "#FFF" });
    expect(block).toContain("--accent: #FFF;");
    expect(block).not.toContain("--primary");
  });
});

describe("pageWrapper", () => {
  it("body html 을 .paper-e2e-root 안에 감싸고 style 블록 포함", () => {
    const out = pageWrapper({ bodyHtml: "<button>X</button>" });
    expect(out).toContain("<style>");
    expect(out).toContain(":root {");
    expect(out).toContain('class="paper-e2e-root"');
    expect(out).toContain("<button>X</button>");
  });

  it("padding / background 옵션 적용", () => {
    const out = pageWrapper({ bodyHtml: "<div/>", padding: 64, background: "#FF0" });
    expect(out).toContain("padding: 64px;");
    expect(out).toContain("background: #FF0;");
  });

  it("extraCss 가 base CSS 뒤에 추가됨", () => {
    const out = pageWrapper({ bodyHtml: "<div/>", extraCss: ".foo { color: red; }" });
    expect(out).toContain(".foo { color: red; }");
  });
});

describe("registry shape", () => {
  it("COMPOSITES / TEMPLATES 는 함수 객체 (Task 2~4 에서 채워질 예정)", () => {
    expect(typeof COMPOSITES).toBe("object");
    expect(typeof TEMPLATES).toBe("object");
    for (const [name, fn] of Object.entries({ ...COMPOSITES, ...TEMPLATES })) {
      expect(typeof fn).toBe("function");
      const html = fn();
      expect(typeof html).toBe("string");
      expect(html.length).toBeGreaterThan(0);
      expect(name).toMatch(/^[A-Z][A-Za-z0-9]+$/);
    }
  });
});
