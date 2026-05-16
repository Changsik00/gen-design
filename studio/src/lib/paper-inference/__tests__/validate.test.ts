import { describe, it, expect } from "vitest";
import { validateTree } from "../validate";
import type { PaperTreeNode } from "../tree-types";

const node = (overrides: Partial<PaperTreeNode> = {}): PaperTreeNode => ({
  id: "n-1",
  name: "Frame",
  component: "Frame",
  ...overrides,
});

describe("validateTree — 구조", () => {
  it("정상 트리 → errors []", () => {
    const tree = node({ name: "[chat:scenes/login]", children: [node({ id: "n-2" })] });
    const errors = validateTree(tree);
    expect(errors).toEqual([]);
  });

  it("id 누락 → error", () => {
    const errors = validateTree({ name: "X", component: "Frame" } as unknown as PaperTreeNode);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/id/);
    expect(errors[0].severity).toBe("error");
  });

  it("name 누락 → error", () => {
    const errors = validateTree({ id: "x", component: "Frame" } as unknown as PaperTreeNode);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/name/);
  });

  it("component 누락 → error", () => {
    const errors = validateTree({ id: "x", name: "X" } as unknown as PaperTreeNode);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/component/);
  });

  it("중첩 자식의 누락도 감지", () => {
    const tree = node({
      children: [{ id: "" } as unknown as PaperTreeNode],
    });
    const errors = validateTree(tree);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe("validateTree — identity 컨벤션", () => {
  it("잘못된 kind ([chat:page/foo]) → warning (마커는 *없는 것* 으로 처리되어 null, 오류 X)", () => {
    const tree = node({ name: "[chat:page/foo]" });
    const errors = validateTree(tree);
    expect(errors.filter((e) => e.severity === "error")).toEqual([]);
  });

  it("중복 identity 검출 → warning", () => {
    const tree = node({
      name: "Root",
      children: [node({ id: "a", name: "[chat:scenes/login]" }), node({ id: "b", name: "[chat:scenes/login]" })],
    });
    const errors = validateTree(tree);
    const dups = errors.filter((e) => e.message.match(/duplicate/i));
    expect(dups.length).toBeGreaterThan(0);
    expect(dups[0].severity).toBe("warning");
  });
});
