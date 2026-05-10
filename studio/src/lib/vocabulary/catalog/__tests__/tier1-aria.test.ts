import { describe, it, expect } from "vitest";
import {
  ARIA_ROLES,
  ARIA_BY_NAME,
  ARIA_SPEC_META,
  ariaRolesByCategory,
  isAriaRole,
} from "../tier1-aria";

describe("ARIA Tier 1 카탈로그", () => {
  it("핵심 widget role 들이 모두 등록됨", () => {
    expect(isAriaRole("button")).toBe(true);
    expect(isAriaRole("checkbox")).toBe(true);
    expect(isAriaRole("link")).toBe(true);
    expect(isAriaRole("textbox")).toBe(true);
    expect(isAriaRole("switch")).toBe(true);
    expect(isAriaRole("slider")).toBe(true);
    expect(isAriaRole("tab")).toBe(true);
  });

  it("composite role 들이 등록됨", () => {
    expect(isAriaRole("listbox")).toBe(true);
    expect(isAriaRole("combobox")).toBe(true);
    expect(isAriaRole("menu")).toBe(true);
    expect(isAriaRole("tablist")).toBe(true);
  });

  it("dialog 가 windowLike 에 등록됨", () => {
    const dialog = ARIA_BY_NAME.get("dialog");
    expect(dialog).toBeDefined();
    expect(dialog?.category).toBe("windowLike");
  });

  it("landmark role 카운트가 최소 5 개", () => {
    const landmarks = ariaRolesByCategory("landmark");
    expect(landmarks.length).toBeGreaterThanOrEqual(5);
    expect(landmarks.some((r) => r.name === "navigation")).toBe(true);
  });

  it("미등록 이름은 false", () => {
    expect(isAriaRole("madeup")).toBe(false);
    expect(isAriaRole("")).toBe(false);
  });

  it("총 role 수 ≥ 70 (ARIA 1.3 기준)", () => {
    expect(ARIA_ROLES.length).toBeGreaterThanOrEqual(70);
  });

  it("spec version + source 메타 노출", () => {
    expect(ARIA_SPEC_META.version).toContain("ARIA");
    expect(ARIA_SPEC_META.source).toMatch(/^https?:\/\//);
  });
});
