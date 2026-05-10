import { describe, it, expect } from "vitest";
import { adaptFigma } from "../adapt";
import type { FigmaNode } from "../figma-types";
import type { CatalogMap } from "../../paper-inference/ast-builder";

const EMPTY_CATALOG: CatalogMap = new Map();

const MINIMAL_FRAME: FigmaNode = {
  id: "1",
  name: "Page",
  type: "FRAME",
};

describe("adaptFigma", () => {
  it("최소 FRAME → result.text 비어있지 않음", () => {
    const result = adaptFigma(MINIMAL_FRAME, EMPTY_CATALOG);
    expect(typeof result.text).toBe("string");
    expect(result.text.length).toBeGreaterThan(0);
  });

  it("result.ast 반환 (Document 타입)", () => {
    const result = adaptFigma(MINIMAL_FRAME, EMPTY_CATALOG);
    expect(result.ast).toBeDefined();
    expect(result.ast.kind).toBe("Document");
  });

  it("result.report 반환 (InferReport 타입)", () => {
    const result = adaptFigma(MINIMAL_FRAME, EMPTY_CATALOG);
    expect(result.report).toBeDefined();
    expect(Array.isArray(result.report.items)).toBe(true);
  });

  it("자식이 있는 FRAME → 자식 노드 반영", () => {
    const node: FigmaNode = {
      id: "10",
      name: "LoginPage",
      type: "FRAME",
      children: [
        { id: "11", name: "Button/Primary", type: "INSTANCE" },
        { id: "12", name: "Title", type: "TEXT" },
      ],
    };
    const result = adaptFigma(node, EMPTY_CATALOG);
    expect(result.text.length).toBeGreaterThan(0);
  });
});
