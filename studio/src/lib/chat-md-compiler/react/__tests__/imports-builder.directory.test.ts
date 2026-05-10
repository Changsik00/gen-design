import { describe, it, expect } from "vitest";
import { buildImports } from "../imports-builder";
import type { EmitContext } from "../jsx-emitter";

function ctx(components: string[] = []): EmitContext {
  return {
    usedI18nKeys: new Set(),
    usedTokenKeys: new Set(),
    knownComponents: new Set(components),
  };
}

describe("buildImports — directory-aware paths", () => {
  it("Button → @/components/ui/button (lowercase ui)", () => {
    const result = buildImports(ctx(["Button"]), ["Button"]);
    expect(result).toContain("import { Button } from '@/components/ui/button';");
  });

  it("LoginForm → @/components/composites/LoginForm (PascalCase composites)", () => {
    const result = buildImports(ctx(["LoginForm"]), ["LoginForm"]);
    expect(result).toContain(
      "import { LoginForm } from '@/components/composites/LoginForm';",
    );
  });

  it("LoginScene → @/components/templates/LoginScene (PascalCase templates)", () => {
    const result = buildImports(ctx(["LoginScene"]), ["LoginScene"]);
    expect(result).toContain(
      "import { LoginScene } from '@/components/templates/LoginScene';",
    );
  });

  it("여러 컴포넌트 → 알파벳 정렬, 각자 정확한 경로", () => {
    const result = buildImports(
      ctx(["Button", "LoginForm", "LoginScene"]),
      ["LoginScene", "Button", "LoginForm"],
    );
    const lines = result.split("\n").filter((l) => l.startsWith("import"));
    expect(lines[0]).toContain("@/components/ui/button");
    expect(lines[1]).toContain("@/components/composites/LoginForm");
    expect(lines[2]).toContain("@/components/templates/LoginScene");
  });

  it("미등록 컴포넌트는 fallback (@/components/ui/{lowercase}) — 호환성 유지", () => {
    const result = buildImports(ctx(["UnknownThing"]), ["UnknownThing"]);
    expect(result).toContain(
      "import { UnknownThing } from '@/components/ui/unknownthing';",
    );
  });

  it("excludeName 옵션 — 일치하는 컴포넌트 import 생략", () => {
    const result = buildImports(
      ctx(["LoginScene", "Button"]),
      ["LoginScene", "Button"],
      { excludeName: "LoginScene" },
    );
    expect(result).not.toContain("LoginScene");
    expect(result).toContain("Button");
  });

  it("excludeName 미일치 시 모두 emit", () => {
    const result = buildImports(
      ctx(["Button", "LoginForm"]),
      ["Button", "LoginForm"],
      { excludeName: "LoginScene" },
    );
    expect(result).toContain("Button");
    expect(result).toContain("LoginForm");
  });
});
