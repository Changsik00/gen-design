import { describe, it, expect } from "vitest";
import { parse } from "../index";

/**
 * spec-08-04 Task 6 — chat type 별 schema 검증 (TDD Red 단계).
 *
 * validateChatSchema(ast) 가 frontmatter.type 기반 필수 필드를 검증.
 * stage: "schema" 의 ParseError 반환.
 *
 * - shell: name + applies 필수, shell.* 금지
 * - scene: name + identity 필수, identity prefix 검증
 * - component: name + identity + catalog.tier + catalog.family 필수
 */

const fm = (body: string) => `---\n${body}\n---\n`;

describe("schema — shell type", () => {
  it("OK — name + applies 모두 있음", () => {
    const r = parse(fm(`type: shell\nname: AppShell\napplies: scenes`) + "<X />");
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("FAIL — applies 누락", () => {
    const r = parse(fm(`type: shell\nname: AppShell`) + "<X />");
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("schema");
    expect(r.errors[0]?.message).toMatch(/applies/);
  });

  it("FAIL — shell type 이 shell.inherit 사용", () => {
    const r = parse(
      fm(`type: shell\nname: AppShell\napplies: scenes\nshell:\n  inherit: true`) + "<X />",
    );
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("schema");
    expect(r.errors[0]?.message).toMatch(/shell/);
  });
});

describe("schema — scene type", () => {
  it("OK — name + identity (chats/scenes/x prefix)", () => {
    const r = parse(fm(`type: scene\nname: Login\nidentity: chats/scenes/login`) + "<X />");
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("FAIL — identity 누락", () => {
    const r = parse(fm(`type: scene\nname: Login`) + "<X />");
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("schema");
    expect(r.errors[0]?.message).toMatch(/identity/);
  });

  it("FAIL — identity prefix 잘못됨", () => {
    const r = parse(fm(`type: scene\nname: X\nidentity: somewhere/else`) + "<X />");
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("schema");
    expect(r.errors[0]?.message).toMatch(/chats\/scenes/);
  });
});

describe("schema — component type", () => {
  it("OK — name + identity + catalog.tier + catalog.family", () => {
    const r = parse(
      fm(
        `type: component\nname: Btn\nidentity: chats/components/btn\ncatalog:\n  tier: 1\n  family: button`,
      ) + "<X />",
    );
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("FAIL — catalog.tier 누락", () => {
    const r = parse(
      fm(`type: component\nname: Btn\nidentity: chats/components/btn\ncatalog:\n  family: button`) +
        "<X />",
    );
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("schema");
    expect(r.errors[0]?.message).toMatch(/catalog\.tier/);
  });

  it("FAIL — identity prefix 잘못됨", () => {
    const r = parse(
      fm(
        `type: component\nname: Btn\nidentity: chats/scenes/btn\ncatalog:\n  tier: 1\n  family: button`,
      ) + "<X />",
    );
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("schema");
    expect(r.errors[0]?.message).toMatch(/chats\/components/);
  });
});

describe("schema — type 자체 오류", () => {
  it("FAIL — 미지의 type", () => {
    const r = parse(fm(`type: unknown\nname: X`) + "<X />");
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("schema");
    expect(r.errors[0]?.suggestion).toBeDefined();
  });

  it("FAIL — type 누락", () => {
    const r = parse(fm(`name: X`) + "<X />");
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.stage).toBe("schema");
    expect(r.errors[0]?.message).toMatch(/type/);
  });
});

describe("schema — opt-out", () => {
  it("skipSchema: true → schema 검증 건너뜀", () => {
    const r = parse(fm(`type: scene\nname: Login`) + "<X />", { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("frontmatter 부재 → schema 검증 skip (legacy spec.md)", () => {
    const r = parse("<Login />");
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });
});
