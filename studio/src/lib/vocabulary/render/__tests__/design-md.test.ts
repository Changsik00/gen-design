import { describe, it, expect } from "vitest";
import tokens from "@assets/tokens/tokens.json";
import { buildCatalog } from "../../catalog";
import { renderDesignMd } from "../design-md";
import { exportStitchSubset } from "../stitch-export";

const SRC_ROOT = "src";

describe("renderDesignMd — Stitch superset 9 섹션 + extensions", () => {
  const catalog = buildCatalog({ studioSrcRoot: SRC_ROOT });
  const md = renderDesignMd({
    catalog,
    tokens: tokens as Record<string, unknown>,
    project: { name: "Test Project", version: "1.0.0", description: "Hello" },
  });

  it("frontmatter 가 schema + supersetOf 명시", () => {
    expect(md).toContain("schema: design-md/0.1");
    expect(md).toContain("supersetOf: stitch-design-md/0.1");
    expect(md).toContain("name: Test Project");
  });

  it("Stitch 9 섹션 모두 포함", () => {
    expect(md).toContain("## 1. Overview");
    expect(md).toContain("## 2. Colors");
    expect(md).toContain("## 3. Typography");
    expect(md).toContain("## 4. Layout");
    expect(md).toContain("## 5. Elevation");
    expect(md).toContain("## 6. Shapes");
    expect(md).toContain("## 7. Components");
    expect(md).toContain("## 8. Do's and Don'ts");
    expect(md).toContain("## 9. Iconography");
  });

  it("본 프로젝트 확장 §10~12 포함", () => {
    expect(md).toContain("## 10. i18n Schema (extension)");
    expect(md).toContain("## 11. Component Instance Vocabulary (extension)");
    expect(md).toContain("## 12. Paper Mapping Convention (extension)");
  });

  it("Color 섹션에 light scheme 토큰 표시", () => {
    expect(md).toContain("--primary");
    expect(md).toContain("semantic.color.light");
  });

  it("Components 섹션에 Tier 2 + Tier 3 컴포넌트 명시", () => {
    expect(md).toContain("Tier 2 — shadcn/ui");
    expect(md).toContain("`Button`");
    expect(md).toContain("Tier 3 — composites");
    expect(md).toContain("`LoginForm`");
    expect(md).toContain("Tier 3 — templates");
    expect(md).toContain("`LoginScene`");
  });

  it("Do's / Don'ts 명시 — raw 색상 금지", () => {
    expect(md).toContain("raw 색상");
    expect(md).toContain("Tailwind class");
  });
});

describe("exportStitchSubset — Stitch 0.1 호환 추출", () => {
  const catalog = buildCatalog({ studioSrcRoot: SRC_ROOT });
  const stitchMd = exportStitchSubset({
    catalog,
    tokens: tokens as Record<string, unknown>,
    project: { name: "T", version: "0", description: "x" },
  });

  it("frontmatter 의 schema 가 Stitch 표준", () => {
    expect(stitchMd).toContain("schema: stitch-design-md/0.1");
    expect(stitchMd).not.toContain("supersetOf");
  });

  it("§9 까지만 (§10 부터 제거)", () => {
    expect(stitchMd).toContain("## 9. Iconography");
    expect(stitchMd).not.toContain("## 10.");
    expect(stitchMd).not.toContain("§10");
  });

  it("Stitch 9 섹션 모두 보존", () => {
    expect(stitchMd).toContain("## 1. Overview");
    expect(stitchMd).toContain("## 2. Colors");
    expect(stitchMd).toContain("## 7. Components");
    expect(stitchMd).toContain("## 9. Iconography");
  });
});
