import { describe, it, expect } from "vitest";
import { parse } from "../index";

/**
 * spec-08-04 Task 2 — frontmatter 문법 (TDD Red 단계).
 *
 * grammar 가 `^---\n...\n---\n` 영역을 YAML-lite subset 으로 parse 후
 * Document.frontmatter 에 객체로 노출해야 함.
 *
 * Schema 검증은 별도 (schema.test.ts) — 본 파일은 *문법* 만 검증.
 */

const FM = (body: string, fm: string) =>
  `---\n${fm}\n---\n${body}`;

describe("frontmatter — top-level scalar", () => {
  it("string (raw + quoted)", () => {
    const r = parse(FM("<X />", `name: AppShell\ntitle: "Hello World"\nslug: 'kebab-case'`), { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.name).toBe("AppShell");
    expect(r.ast?.frontmatter?.title).toBe("Hello World");
    expect(r.ast?.frontmatter?.slug).toBe("kebab-case");
  });

  it("number / boolean / null", () => {
    const r = parse(FM("<X />", `tier: 3\nactive: true\ndraft: false\nartboard: null`), { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.tier).toBe(3);
    expect(r.ast?.frontmatter?.active).toBe(true);
    expect(r.ast?.frontmatter?.draft).toBe(false);
    expect(r.ast?.frontmatter?.artboard).toBeNull();
  });

  it("inline array", () => {
    const r = parse(FM("<X />", `exclude: [BrandHeader, AppFooter]\nrefs: ["a/b", "c/d"]`), { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.exclude).toEqual(["BrandHeader", "AppFooter"]);
    expect(r.ast?.frontmatter?.refs).toEqual(["a/b", "c/d"]);
  });

  it("date-like raw string (2026-05-10)", () => {
    const r = parse(FM("<X />", `created: 2026-05-10`), { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.created).toBe("2026-05-10");
  });
});

describe("frontmatter — nested object (2-space indent)", () => {
  it("shell.{inherit, exclude}", () => {
    const r = parse(
      FM("<X />", `type: scene\nname: Login\nshell:\n  inherit: true\n  exclude: [BrandHeader]`),
      { skipSchema: true },
    );
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.shell).toEqual({
      inherit: true,
      exclude: ["BrandHeader"],
    });
  });

  it("catalog.{tier, family, status}", () => {
    const r = parse(
      FM("<X />", `type: component\nname: Btn\ncatalog:\n  tier: 1\n  family: button\n  status: existing`),
      { skipSchema: true },
    );
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.catalog).toEqual({
      tier: 1,
      family: "button",
      status: "existing",
    });
  });

  it("paper.{artboard, layerNameAnchor}", () => {
    const r = parse(
      FM("<X />", `paper:\n  artboard: null\n  layerNameAnchor: "[chat:scenes/login]"`),
      { skipSchema: true },
    );
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.paper).toEqual({
      artboard: null,
      layerNameAnchor: "[chat:scenes/login]",
    });
  });
});

describe("frontmatter — comments and blank lines", () => {
  it("# comment 무시", () => {
    const r = parse(
      FM("<X />", `# 헤더 코멘트\nname: A\n# 중간 코멘트\ntier: 2`),
      { skipSchema: true },
    );
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.name).toBe("A");
    expect(r.ast?.frontmatter?.tier).toBe(2);
  });

  it("blank line 무시", () => {
    const r = parse(FM("<X />", `name: A\n\ntier: 2`), { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.name).toBe("A");
    expect(r.ast?.frontmatter?.tier).toBe(2);
  });
});

describe("frontmatter — 부재 (legacy spec.md)", () => {
  it("frontmatter 없으면 frontmatter: null + body 보존 (backward-compat)", () => {
    const r = parse("<Login />");
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter).toBeNull();
    expect(r.ast?.body).toBeDefined();
    expect(r.ast?.body?.length).toBeGreaterThan(0);
  });

  it("`---` fence 없는 비-frontmatter 입력은 본문으로 인식", () => {
    const r = parse("Hello world\n<X />");
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter).toBeNull();
  });
});

describe("frontmatter — 에러", () => {
  it("닫히지 않은 `---` → ParseError stage:'parse'", () => {
    const r = parse(`---\nname: A\nbody-without-fence\n<X />`, { skipSchema: true });
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("parse");
  });

  it("array 안 닫힘 → ParseError", () => {
    const r = parse(FM("<X />", `exclude: [a, b`), { skipSchema: true });
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("parse");
  });
});
