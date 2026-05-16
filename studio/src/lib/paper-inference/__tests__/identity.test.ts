import { describe, it, expect } from "vitest";
import { parseIdentity } from "../identity";

/**
 * spec-08-05 Task 1 — identity 파서 (TDD Red).
 *
 * Paper layer name 의 `[chat:type/slug]` 마커 → IdentityRef.
 * 컨벤션 (R7): kind ∈ {scenes, components, _shell}, slug = kebab-case.
 */

describe("parseIdentity — 정상 케이스", () => {
  it("[chat:scenes/login] → scene", () => {
    const r = parseIdentity("[chat:scenes/login]");
    expect(r).toEqual({
      kind: "scene",
      slug: "login",
      raw: "[chat:scenes/login]",
      expectedPath: "chats/scenes/login.chat.md",
    });
  });

  it("[chat:components/empty-state] → component (kebab slug)", () => {
    const r = parseIdentity("[chat:components/empty-state]");
    expect(r?.kind).toBe("component");
    expect(r?.slug).toBe("empty-state");
    expect(r?.expectedPath).toBe("chats/components/empty-state.chat.md");
  });

  it("[chat:_shell] → shell (특수 컨벤션)", () => {
    const r = parseIdentity("[chat:_shell]");
    expect(r?.kind).toBe("shell");
    expect(r?.slug).toBe("_shell");
    expect(r?.expectedPath).toBe("chats/_shell.chat.md");
  });

  it("layer name 안에 마커 + 다른 텍스트 — 추출 OK", () => {
    const r = parseIdentity("[chat:scenes/login] / 1024");
    expect(r?.kind).toBe("scene");
    expect(r?.slug).toBe("login");
  });

  it("multi-segment slug (a-b-c) 지원", () => {
    const r = parseIdentity("[chat:components/multi-step-form]");
    expect(r?.slug).toBe("multi-step-form");
  });

  it("숫자 포함 slug", () => {
    const r = parseIdentity("[chat:scenes/step-2-confirm]");
    expect(r?.slug).toBe("step-2-confirm");
  });
});

describe("parseIdentity — null 케이스", () => {
  it("마커 없음 → null", () => {
    expect(parseIdentity("BrandHeader")).toBeNull();
    expect(parseIdentity("Page / 1440")).toBeNull();
    expect(parseIdentity("")).toBeNull();
  });

  it("잘못된 kind → null", () => {
    expect(parseIdentity("[chat:invalid/foo]")).toBeNull();
    expect(parseIdentity("[chat:page/foo]")).toBeNull();
  });

  it("CamelCase slug → null (kebab-case 강제)", () => {
    expect(parseIdentity("[chat:scenes/CamelCase]")).toBeNull();
    expect(parseIdentity("[chat:scenes/snake_case]")).toBeNull();
  });

  it("공백 / 빈 slug → null", () => {
    expect(parseIdentity("[chat:scenes/]")).toBeNull();
    expect(parseIdentity("[chat:scenes/ login]")).toBeNull();
  });
});

describe("parseIdentity — 결정성 + 첫 매칭 우선", () => {
  it("같은 입력 → 같은 출력 (deterministic)", () => {
    const a = parseIdentity("[chat:scenes/login]");
    const b = parseIdentity("[chat:scenes/login]");
    expect(a).toEqual(b);
  });

  it("마커 다중 발견 시 첫번째만 추출", () => {
    const r = parseIdentity("[chat:scenes/login] [chat:scenes/main]");
    expect(r?.slug).toBe("login");
  });
});
