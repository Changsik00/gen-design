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
    knownComponents: new Set(),
  };
}

describe("buildImports", () => {
  it("inserts i18n import when i18n keys used", () => {
    const result = buildImports(ctx(["ko.login"]), []);
    expect(result).toContain("import { useTranslation }");
    expect(result).toContain("react-i18next");
  });

  it("inserts tokens import when token keys used", () => {
    const result = buildImports(ctx([], ["semantic.color.primary"]), []);
    expect(result).toContain("tokens");
  });

  it("inserts component imports from used list", () => {
    const result = buildImports(ctx(), ["Button"]);
    expect(result).toContain("Button");
    expect(result).toContain("import");
  });

  it("returns empty string when nothing used", () => {
    expect(buildImports(ctx(), [])).toBe("");
  });
});
