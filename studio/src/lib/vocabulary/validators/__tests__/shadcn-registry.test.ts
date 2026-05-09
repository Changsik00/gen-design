import { describe, it, expect } from "vitest";
import { validateShadcnRegistryItem } from "../shadcn-registry";

describe("validateShadcnRegistryItem — 유효 케이스", () => {
  it("최소 필드 (name + type)", () => {
    const result = validateShadcnRegistryItem({
      name: "button",
      type: "registry:ui",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("registry:component + dependencies + files", () => {
    const result = validateShadcnRegistryItem({
      name: "login-form",
      type: "registry:component",
      title: "Login Form",
      description: "Composite for login pages",
      dependencies: ["@radix-ui/react-label"],
      registryDependencies: ["button", "input"],
      files: [
        {
          path: "components/composites/login-form.tsx",
          type: "registry:component",
          content: "export function LoginForm() { return null; }",
        },
      ],
    });
    expect(result.valid).toBe(true);
  });

  it("cssVars 스킴 (light + dark)", () => {
    const result = validateShadcnRegistryItem({
      name: "theme",
      type: "registry:theme",
      cssVars: {
        light: { "--primary": "240 10% 50%" },
        dark: { "--primary": "240 10% 70%" },
      },
    });
    expect(result.valid).toBe(true);
  });
});

describe("validateShadcnRegistryItem — 무효 케이스", () => {
  it("name 누락 → invalid", () => {
    const result = validateShadcnRegistryItem({ type: "registry:ui" });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("type 누락 → invalid", () => {
    const result = validateShadcnRegistryItem({ name: "x" });
    expect(result.valid).toBe(false);
  });

  it("type 의 enum 외 값 → invalid", () => {
    const result = validateShadcnRegistryItem({
      name: "x",
      type: "registry:invalid",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("type") || e.includes("enum"))).toBe(
      true,
    );
  });

  it("primitive 값 (객체 아닌 것) → invalid", () => {
    const result = validateShadcnRegistryItem("not an object");
    expect(result.valid).toBe(false);
  });
});
