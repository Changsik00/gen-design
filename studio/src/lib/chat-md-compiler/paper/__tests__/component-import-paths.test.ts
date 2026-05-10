import { describe, it, expect } from "vitest";
import { COMPONENT_IMPORT_PATHS, COMPONENT_REGISTRY } from "../component-registry";

describe("COMPONENT_IMPORT_PATHS", () => {
  it("Tier 2 (shadcn ui primitive) — Button → @/components/ui/button (lowercase file)", () => {
    expect(COMPONENT_IMPORT_PATHS.Button).toBe("@/components/ui/button");
  });

  it("Tier 3 composites — LoginForm → @/components/composites/LoginForm (PascalCase file)", () => {
    expect(COMPONENT_IMPORT_PATHS.LoginForm).toBe("@/components/composites/LoginForm");
    expect(COMPONENT_IMPORT_PATHS.StatCard).toBe("@/components/composites/StatCard");
    expect(COMPONENT_IMPORT_PATHS.ActivitySummary).toBe("@/components/composites/ActivitySummary");
  });

  it("Tier 3 templates — LoginScene → @/components/templates/LoginScene", () => {
    expect(COMPONENT_IMPORT_PATHS.LoginScene).toBe("@/components/templates/LoginScene");
    expect(COMPONENT_IMPORT_PATHS.DashboardScene).toBe("@/components/templates/DashboardScene");
    expect(COMPONENT_IMPORT_PATHS.VariantWrapper).toBe("@/components/templates/VariantWrapper");
  });

  it("모든 COMPONENT_REGISTRY 키가 COMPONENT_IMPORT_PATHS 에 1:1 존재", () => {
    const registryKeys = Object.keys(COMPONENT_REGISTRY).sort();
    const pathKeys = Object.keys(COMPONENT_IMPORT_PATHS).sort();
    expect(pathKeys).toEqual(registryKeys);
  });

  it("composites 20개 + templates 7개 + Button 1개 = 28 entries", () => {
    expect(Object.keys(COMPONENT_IMPORT_PATHS).length).toBe(28);
  });

  it("디렉토리 분류 — ui 1개, composites 20개, templates 7개", () => {
    const entries = Object.values(COMPONENT_IMPORT_PATHS);
    const ui = entries.filter((p) => p.startsWith("@/components/ui/"));
    const composites = entries.filter((p) => p.startsWith("@/components/composites/"));
    const templates = entries.filter((p) => p.startsWith("@/components/templates/"));
    expect(ui.length).toBe(1);
    expect(composites.length).toBe(20);
    expect(templates.length).toBe(7);
  });
});
