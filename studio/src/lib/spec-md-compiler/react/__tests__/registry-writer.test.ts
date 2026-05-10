import { describe, it, expect } from "vitest";
import { toRegistryEntry, toKebabCase } from "../registry-writer";

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

  it("sorts registryDependencies alphabetically", () => {
    const entry = toRegistryEntry("LoginPage", "...", ["Sidebar", "Button", "LoginForm"]);
    expect(entry.registryDependencies).toEqual(["Button", "LoginForm", "Sidebar"]);
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
