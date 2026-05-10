import { describe, it, expect } from "vitest";
import { buildAst } from "../ast-builder";
import type { CatalogMap } from "../ast-builder";
import type { PaperTreeNode } from "../tree-types";

const CATALOG: CatalogMap = new Map([
  ["Button", [{ name: "variant", values: ["primary", "secondary"] }, { name: "size", values: ["sm", "md", "lg"] }]],
  ["LoginForm", []],
  ["BrandHeader", []],
]);

const node = (overrides: Partial<PaperTreeNode> & Pick<PaperTreeNode, "id" | "name">): PaperTreeNode => ({
  component: "Frame",
  ...overrides,
});

describe("buildAst — Paper tree → Document", () => {
  it("단순 — 단일 매칭 노드", () => {
    const root: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [node({ id: "n1", name: "Button.primary" })],
    };
    const { doc, nodeMetaMap } = buildAst(root, CATALOG);
    expect(doc.type).toBe("Document");
    expect(doc.body).toHaveLength(1);
    const block = doc.body[0];
    expect(block.type).toBe("ComponentInstance");
    if (block.type === "ComponentInstance") {
      expect(block.name).toBe("Button");
      expect(block.props).toEqual({ variant: "primary" });
    }
    expect(nodeMetaMap.get("n1")?.matched).toBe(true);
    expect(nodeMetaMap.get("n1")?.confidence).toBe(0.85);
  });

  it("nested — 중첩 구조 재귀 변환", () => {
    const root: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [
        {
          ...node({ id: "form", name: "LoginForm" }),
          children: [node({ id: "btn", name: "Button.primary" })],
        },
      ],
    };
    const { doc } = buildAst(root, CATALOG);
    const form = doc.body[0];
    expect(form.type).toBe("ComponentInstance");
    if (form.type === "ComponentInstance") {
      expect(form.name).toBe("LoginForm");
      expect(form.children).toHaveLength(1);
      expect(form.children[0].type).toBe("ComponentInstance");
    }
  });

  it("mixed — 매칭 + 미매칭 혼합", () => {
    const root: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [
        node({ id: "n1", name: "Button" }),
        node({ id: "n2", name: "UnknownWidget" }),
      ],
    };
    const { doc } = buildAst(root, CATALOG);
    expect(doc.body[0].type).toBe("ComponentInstance");
    expect(doc.body[1].type).toBe("Comment");
  });

  it("미매칭 + image fill → MarkdownText with <img>", () => {
    const root: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [
        {
          ...node({ id: "img", name: "HeroImage" }),
          fills: [{ type: "image", src: "/hero.jpg" }],
        },
      ],
    };
    const { doc } = buildAst(root, CATALOG);
    const block = doc.body[0];
    expect(block.type).toBe("MarkdownText");
    if (block.type === "MarkdownText") {
      expect(block.text).toContain("<img");
      expect(block.text).toContain("/hero.jpg");
    }
  });

  it("빈 트리 — children 없으면 빈 Document", () => {
    const root: PaperTreeNode = { id: "root", name: "Root", component: "Frame" };
    const { doc, nodeMetaMap } = buildAst(root, CATALOG);
    expect(doc.body).toHaveLength(0);
    expect(nodeMetaMap.size).toBe(0);
  });
});
