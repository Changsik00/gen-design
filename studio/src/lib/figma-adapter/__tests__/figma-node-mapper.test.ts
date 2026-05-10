import { describe, it, expect } from "vitest";
import { normalizeLayerName, mapFigmaNode } from "../figma-node-mapper";
import type { FigmaNode } from "../figma-types";

describe("normalizeLayerName", () => {
  it("슬래시 → dot 변환, 이후 세그먼트 소문자", () => {
    expect(normalizeLayerName("Button/Primary/Large")).toBe("Button.primary.large");
  });

  it("단일 이름 (슬래시 없음) → 그대로", () => {
    expect(normalizeLayerName("Card")).toBe("Card");
  });

  it("두 세그먼트", () => {
    expect(normalizeLayerName("Input/Default")).toBe("Input.default");
  });

  it("첫 세그먼트 PascalCase 보존", () => {
    expect(normalizeLayerName("TextInput/Filled/Large")).toBe("TextInput.filled.large");
  });

  it("빈 문자열 → 빈 문자열", () => {
    expect(normalizeLayerName("")).toBe("");
  });

  it("앞뒤 공백 무시", () => {
    expect(normalizeLayerName(" Button/Primary ")).toBe("Button.primary");
  });
});

describe("mapFigmaNode", () => {
  it("FRAME → component='Frame'", () => {
    const node: FigmaNode = { id: "1", name: "LoginScene", type: "FRAME" };
    const result = mapFigmaNode(node);
    expect(result.component).toBe("Frame");
    expect(result.name).toBe("LoginScene");
    expect(result.id).toBe("1");
  });

  it("TEXT → component='Text'", () => {
    const node: FigmaNode = { id: "2", name: "제목", type: "TEXT" };
    expect(mapFigmaNode(node).component).toBe("Text");
  });

  it("RECTANGLE → component='Rectangle'", () => {
    const node: FigmaNode = { id: "3", name: "Divider", type: "RECTANGLE" };
    expect(mapFigmaNode(node).component).toBe("Rectangle");
  });

  it("GROUP → component='Group'", () => {
    const node: FigmaNode = { id: "4", name: "Group", type: "GROUP" };
    expect(mapFigmaNode(node).component).toBe("Group");
  });

  it("COMPONENT → component='Frame'", () => {
    const node: FigmaNode = { id: "5", name: "Button", type: "COMPONENT" };
    expect(mapFigmaNode(node).component).toBe("Frame");
  });

  it("INSTANCE → component='Frame', 이름 슬래시→dot 정규화", () => {
    const node: FigmaNode = { id: "6", name: "Button/Primary", type: "INSTANCE" };
    const result = mapFigmaNode(node);
    expect(result.component).toBe("Frame");
    expect(result.name).toBe("Button.primary");
  });

  it("VECTOR → component='Rectangle'", () => {
    const node: FigmaNode = { id: "7", name: "Icon", type: "VECTOR" };
    expect(mapFigmaNode(node).component).toBe("Rectangle");
  });

  it("children 재귀 변환", () => {
    const node: FigmaNode = {
      id: "10",
      name: "LoginScene",
      type: "FRAME",
      children: [
        { id: "11", name: "Button/Primary", type: "INSTANCE" },
        { id: "12", name: "Title", type: "TEXT" },
      ],
    };
    const result = mapFigmaNode(node);
    expect(result.children).toHaveLength(2);
    expect(result.children![0].name).toBe("Button.primary");
    expect(result.children![1].component).toBe("Text");
  });

  it("SOLID fill → PaperFill color", () => {
    const node: FigmaNode = {
      id: "20",
      name: "Rect",
      type: "RECTANGLE",
      fills: [{ type: "SOLID", color: { r: 1, g: 0, b: 0, a: 1 } }],
    };
    const result = mapFigmaNode(node);
    expect(result.fills).toBeDefined();
    expect(result.fills![0].type).toBe("color");
  });

  it("IMAGE fill → 무시 (빈 fills)", () => {
    const node: FigmaNode = {
      id: "21",
      name: "Img",
      type: "RECTANGLE",
      fills: [{ type: "IMAGE" }],
    };
    const result = mapFigmaNode(node);
    expect(result.fills ?? []).toHaveLength(0);
  });
});
