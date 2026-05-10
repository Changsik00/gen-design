import { describe, it, expect } from "vitest";
import { isImageNode, extractImageSrc, collectImageNodes } from "../image-classifier";
import type { PaperTreeNode } from "../tree-types";

const makeNode = (overrides: Partial<PaperTreeNode>): PaperTreeNode => ({
  id: "n1",
  name: "Frame",
  component: "Frame",
  ...overrides,
});

describe("image-classifier", () => {
  it("isImageNode — image fill 있으면 true", () => {
    const node = makeNode({ fills: [{ type: "image", src: "/img/logo.png" }] });
    expect(isImageNode(node)).toBe(true);
  });

  it("isImageNode — color fill 만 있으면 false", () => {
    const node = makeNode({ fills: [{ type: "color", color: "#fff" }] });
    expect(isImageNode(node)).toBe(false);
  });

  it("isImageNode — fills 없으면 false", () => {
    const node = makeNode({});
    expect(isImageNode(node)).toBe(false);
  });

  it("extractImageSrc — image fill 의 src 반환", () => {
    const node = makeNode({ fills: [{ type: "image", src: "/img/hero.jpg" }] });
    expect(extractImageSrc(node)).toBe("/img/hero.jpg");
  });

  it("collectImageNodes — 트리 전체에서 image 노드 수집", () => {
    const root: PaperTreeNode = {
      id: "root",
      name: "Page",
      component: "Frame",
      children: [
        makeNode({ id: "c1", name: "Hero", fills: [{ type: "image", src: "/hero.jpg" }] }),
        makeNode({ id: "c2", name: "Text", component: "Text" }),
        {
          id: "c3",
          name: "Card",
          component: "Frame",
          children: [
            makeNode({ id: "c3-1", name: "Thumb", fills: [{ type: "image", src: "/thumb.png" }] }),
          ],
        },
      ],
    };
    const found = collectImageNodes(root);
    expect(found).toHaveLength(2);
    expect(found[0].node.id).toBe("c1");
    expect(found[1].node.id).toBe("c3-1");
  });
});
