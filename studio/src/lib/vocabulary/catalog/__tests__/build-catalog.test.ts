import { describe, it, expect } from "vitest";
import {
  buildCatalog,
  buildLookup,
  allComponentNames,
} from "../index";

const SRC_ROOT = "src";

describe("buildCatalog — 3-tier 통합", () => {
  it("Tier 1 (ARIA) 가 70+ role 보유", () => {
    const c = buildCatalog({ studioSrcRoot: SRC_ROOT });
    expect(c.tiers.tier1Aria.roles.length).toBeGreaterThanOrEqual(70);
    expect(c.tiers.tier1Aria.specMeta.version).toContain("ARIA");
  });

  it("Tier 2 (shadcn ui) 에 Button 포함 + variants 정확", () => {
    const c = buildCatalog({ studioSrcRoot: SRC_ROOT });
    const button = c.tiers.tier2Shadcn.components.find((x) => x.name === "Button");
    expect(button).toBeDefined();
    expect(button?.ariaRole).toBe("button");
    const variant = button?.axes.find((a) => a.name === "variant");
    expect(variant?.values).toContain("destructive");
  });

  it("Tier 3 (composites) 에 BrandHeader / LoginForm / Sidebar 등 포함", () => {
    const c = buildCatalog({ studioSrcRoot: SRC_ROOT });
    const names = c.tiers.tier3Project.composites.map((x) => x.name);
    expect(names).toEqual(
      expect.arrayContaining(["BrandHeader", "LoginForm", "Sidebar"]),
    );
  });

  it("Tier 3 (templates) 에 LoginPage / DashboardPage 포함", () => {
    const c = buildCatalog({ studioSrcRoot: SRC_ROOT });
    const names = c.tiers.tier3Project.templates.map((x) => x.name);
    expect(names).toEqual(expect.arrayContaining(["LoginPage", "DashboardPage"]));
  });

  it("결정성 (deterministic): 같은 입력 → 같은 출력", () => {
    const a = buildCatalog({ studioSrcRoot: SRC_ROOT, generatedAt: "fixed" });
    const b = buildCatalog({ studioSrcRoot: SRC_ROOT, generatedAt: "fixed" });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("buildLookup: name 으로 컴포넌트 조회", () => {
    const c = buildCatalog({ studioSrcRoot: SRC_ROOT });
    const lookup = buildLookup(c);
    expect(lookup.has("Button")).toBe(true);
    expect(lookup.has("LoginPage")).toBe(true);
    expect(lookup.has("Madeup")).toBe(false);
  });

  it("allComponentNames: 정렬된 전체 이름", () => {
    const c = buildCatalog({ studioSrcRoot: SRC_ROOT });
    const names = allComponentNames(c);
    expect(names.length).toBeGreaterThan(20);
    // 정렬 확인
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });
});
