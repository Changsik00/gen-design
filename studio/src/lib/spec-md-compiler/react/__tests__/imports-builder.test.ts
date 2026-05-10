import { describe, it, expect } from "vitest";
import { buildImports } from "../imports-builder";
import type { EmitContext } from "../jsx-emitter";

function ctx(
  i18n: string[] = [],
  tokens: string[] = [],
  components: string[] = []
): EmitContext {
  return {
    usedI18nKeys: new Set(i18n),
    usedTokenKeys: new Set(tokens),
    knownComponents: new Set(components),
  };
}

describe("buildImports", () => {
  it("i18n keys 사용 시 react-i18next import 없음 (존재하지 않는 패키지)", () => {
    const result = buildImports(ctx(["ko.login"]), []);
    expect(result).not.toContain("react-i18next");
  });

  it("i18n keys 사용 시 주석 힌트 포함", () => {
    const result = buildImports(ctx(["ko.login"]), []);
    expect(result).toContain("i18n");
  });

  it("token keys 사용 시 @/lib/tokens import 없음 (존재하지 않는 모듈)", () => {
    const result = buildImports(ctx([], ["semantic.color.primary"]), []);
    expect(result).not.toContain("@/lib/tokens");
  });

  it("token keys 사용 시 주석 힌트 포함", () => {
    const result = buildImports(ctx([], ["semantic.color.primary"]), []);
    expect(result).toContain("token");
  });

  it("컴포넌트 import 생성", () => {
    const result = buildImports(ctx(), ["Button"]);
    expect(result).toContain("Button");
    expect(result).toContain("import");
  });

  it("아무것도 없으면 빈 문자열", () => {
    expect(buildImports(ctx(), [])).toBe("");
  });
});
