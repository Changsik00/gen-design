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
  it("최소 FRAME → result.text 는 string", () => {
    const result = adaptFigma(MINIMAL_FRAME, EMPTY_CATALOG);
    expect(typeof result.text).toBe("string");
  });

  it("result.ast 반환 (Document 타입)", () => {
    const result = adaptFigma(MINIMAL_FRAME, EMPTY_CATALOG);
    expect(result.ast).toBeDefined();
    expect(result.ast.type).toBe("Document");
  });

  it("result.report 반환 (InferReport 타입)", () => {
    const result = adaptFigma(MINIMAL_FRAME, EMPTY_CATALOG);
    expect(result.report).toBeDefined();
    expect(typeof result.report.total).toBe("number");
    expect(Array.isArray(result.report.confident)).toBe(true);
  });

  it("자식이 있는 FRAME → 미매칭 Comment 로 text 생성", () => {
    const node: FigmaNode = {
      id: "10",
      name: "LoginScene",
      type: "FRAME",
      children: [
        { id: "11", name: "Button/Primary", type: "INSTANCE" },
        { id: "12", name: "Title", type: "TEXT" },
      ],
    };
    const result = adaptFigma(node, EMPTY_CATALOG);
    // 빈 카탈로그 → 미매칭 → Comment 블록 → text 비어있지 않음
    expect(result.text.length).toBeGreaterThan(0);
    expect(result.text).toContain("unmatched");
  });
});
