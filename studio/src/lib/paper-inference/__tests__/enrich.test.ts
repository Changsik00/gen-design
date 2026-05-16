import { describe, it, expect } from "vitest";
import { enrichWithIdentity } from "../enrich";
import type { PaperTreeNode } from "../tree-types";

const node = (overrides: Partial<PaperTreeNode> = {}): PaperTreeNode => ({
  id: "n-1",
  name: "Frame",
  component: "Frame",
  ...overrides,
});

describe("enrichWithIdentity — 단순 트리", () => {
  it("최상위 노드의 layer name 마커 → identity 채움", () => {
    const tree = node({ name: "[chat:scenes/login] / 1024" });
    const r = enrichWithIdentity(tree);
    expect(r.identity?.kind).toBe("scene");
    expect(r.identity?.slug).toBe("login");
  });

  it("마커 없는 노드 → identity 부재 (undefined)", () => {
    const tree = node({ name: "BrandHeader" });
    const r = enrichWithIdentity(tree);
    expect(r.identity).toBeUndefined();
  });
});

describe("enrichWithIdentity — 중첩", () => {
  it("자식 노드의 identity 도 채움", () => {
    const tree = node({
      name: "Root",
      children: [
        node({ id: "c1", name: "[chat:components/empty-state]" }),
        node({ id: "c2", name: "Plain" }),
      ],
    });
    const r = enrichWithIdentity(tree);
    expect(r.identity).toBeUndefined();
    expect(r.children?.[0].identity?.slug).toBe("empty-state");
    expect(r.children?.[1].identity).toBeUndefined();
  });

  it("3단 중첩에도 모두 walk", () => {
    const tree = node({
      children: [
        node({
          id: "c1",
          children: [node({ id: "g1", name: "[chat:_shell]" })],
        }),
      ],
    });
    const r = enrichWithIdentity(tree);
    expect(r.children?.[0].children?.[0].identity?.kind).toBe("shell");
  });

  it("결정성 — 같은 입력 → 같은 출력", () => {
    const tree = node({ name: "[chat:scenes/login]" });
    const a = enrichWithIdentity(tree);
    const b = enrichWithIdentity(tree);
    expect(a).toEqual(b);
  });

  it("입력 불변 (immutable) — 원본 tree 변경 X", () => {
    const tree = node({ name: "[chat:scenes/login]" });
    const original = JSON.parse(JSON.stringify(tree));
    enrichWithIdentity(tree);
    expect(tree).toEqual(original);
  });
});
