import { describe, it, expect } from "vitest";
import { buildCatalog } from "../../catalog";
import { renderFrontMd } from "../front-md";

const SRC_ROOT = "src";

describe("renderFrontMd", () => {
  const catalog = buildCatalog({ studioSrcRoot: SRC_ROOT });
  const md = renderFrontMd(catalog);

  it("AUTO-GENERATED 마커 + 4 layer 설명 + Paper 컨벤션 포함", () => {
    expect(md).toContain("AUTO-GENERATED");
    expect(md).toContain("# FRONT.md");
    expect(md).toContain("4 축 어휘 정합");
    expect(md).toContain("L1");
    expect(md).toContain("L4");
    expect(md).toContain("Paper 노드명 컨벤션");
  });

  it("Tier 1 ARIA roles 카운트 + 카테고리별 표시", () => {
    expect(md).toContain("Tier 1 — ARIA roles");
    expect(md).toContain("widget");
    expect(md).toContain("`button`");
    expect(md).toContain("`dialog`");
  });

  it("Tier 2 shadcn ui — Button + axis 표시", () => {
    expect(md).toContain("Tier 2 — shadcn/ui primitives");
    expect(md).toContain("### Button");
    expect(md).toContain("`variant`");
    expect(md).toContain("destructive");
    // default 는 ** 으로 강조
    expect(md).toMatch(/\*\*default\*\*/);
  });

  it("Tier 3 composites + templates 분리", () => {
    expect(md).toContain("Tier 3 — Project composites");
    expect(md).toContain("Tier 3 — Project templates");
    expect(md).toContain("### LoginPage");
  });

  it("raw 색상 금지 + 미등록 어휘 금지 강제 명시", () => {
    expect(md).toContain("raw 색상 금지");
    expect(md).toContain("미등록 어휘 금지");
  });

  it("shadcn registry install 안내", () => {
    expect(md).toContain("npx shadcn@latest add");
  });

  it("결정성 (deterministic)", () => {
    const a = renderFrontMd(catalog);
    const b = renderFrontMd(catalog);
    expect(a).toBe(b);
  });
});
