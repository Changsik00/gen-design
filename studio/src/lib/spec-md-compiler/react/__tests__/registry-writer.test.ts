import { describe, it, expect } from "vitest";
import {
  toRegistryEntry,
  toKebabCase,
  validateShadcnRegistryItem,
} from "../registry-writer";

describe("toKebabCase", () => {
  it("converts PascalCase to kebab-case", () => {
    expect(toKebabCase("LoginPage")).toBe("login-page");
    expect(toKebabCase("Button")).toBe("button");
    expect(toKebabCase("DashboardHeader")).toBe("dashboard-header");
  });
});

describe("toRegistryEntry", () => {
  it("creates a basic registry entry", () => {
    const entry = toRegistryEntry("Button", "<Button />", []);
    expect(entry.name).toBe("button");
    expect(entry.type).toBe("registry:block");
    expect(entry.files[0].path).toBe("registry/button/button.tsx");
    expect(entry.files[0].content).toBe("<Button />");
    expect(entry.files[0].type).toBe("registry:component");
  });

  it("converts PascalCase deps to kebab-case (shadcn requirement)", () => {
    const entry = toRegistryEntry("LoginPage", "...", ["Sidebar", "Button", "LoginForm"]);
    expect(entry.registryDependencies).toEqual([
      "button",
      "login-form",
      "sidebar",
    ]);
  });

  it("preserves URL deps as-is (shadcn registry URL form)", () => {
    const entry = toRegistryEntry("LoginPage", "...", [
      "https://ui.shadcn.com/r/styles/default/button.json",
      "Sidebar",
    ]);
    expect(entry.registryDependencies).toEqual([
      "https://ui.shadcn.com/r/styles/default/button.json",
      "sidebar",
    ]);
  });

  it("converts multi-word PascalCase name to kebab", () => {
    const entry = toRegistryEntry("DashboardHeader", "...", []);
    expect(entry.name).toBe("dashboard-header");
    expect(entry.files[0].path).toBe("registry/dashboard-header/dashboard-header.tsx");
  });

  it("handles empty deps", () => {
    const entry = toRegistryEntry("Button", "...", []);
    expect(entry.registryDependencies).toEqual([]);
  });
});

describe("validateShadcnRegistryItem", () => {
  it("OK: kebab name + kebab deps", () => {
    const result = validateShadcnRegistryItem({
      name: "login-page",
      type: "registry:block",
      registryDependencies: ["button", "login-form"],
      files: [
        { path: "registry/login-page/login-page.tsx", content: "...", type: "registry:component" },
      ],
    });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("FAIL: PascalCase name", () => {
    const result = validateShadcnRegistryItem({
      name: "LoginPage",
      type: "registry:block",
      registryDependencies: [],
      files: [],
    });
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/name.*kebab/i);
  });

  it("FAIL: PascalCase dep", () => {
    const result = validateShadcnRegistryItem({
      name: "login-page",
      type: "registry:block",
      registryDependencies: ["Button"],
      files: [],
    });
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/dependency.*kebab|kebab.*dependency/i);
  });

  it("OK: URL dep allowed", () => {
    const result = validateShadcnRegistryItem({
      name: "login-page",
      type: "registry:block",
      registryDependencies: ["https://ui.shadcn.com/r/styles/default/button.json"],
      files: [],
    });
    expect(result.ok).toBe(true);
  });
});
