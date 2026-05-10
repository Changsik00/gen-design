import { describe, it, expect, beforeEach } from "vitest";
import { inferChat } from "../infer";
import { htmlToPaperTree, resetSyntheticCounter } from "../synthetic-tree";
import type { PaperTreeNode } from "../tree-types";
import type { CatalogMap } from "../ast-builder";

const CATALOG: CatalogMap = new Map([
  ["Button", [{ name: "variant", values: ["default", "primary", "ghost"] }, { name: "size", values: ["sm", "md", "lg"] }]],
  ["LoginForm", []],
  ["BrandHeader", []],
  ["LoginPage", []],
  ["SocialAuthBlock", []],
  ["ErrorMessage", []],
]);

beforeEach(() => {
  resetSyntheticCounter();
});

describe("inferChat — public API", () => {
  it("단순 tree → { ast, report, text } 반환", () => {
    const tree: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [
        { id: "n1", name: "Button.primary", component: "Frame" },
      ],
    };
    const { ast, report, text } = inferChat(tree, CATALOG);
    expect(ast.type).toBe("Document");
    expect(ast.body).toHaveLength(1);
    expect(report.total).toBe(1);
    expect(text).toContain("<Button");
  });

  it("전부 confident — 신뢰도 높은 결과", () => {
    const tree: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [
        { id: "n1", name: "Button", component: "Frame" },
        { id: "n2", name: "LoginForm", component: "Frame" },
      ],
    };
    const { report } = inferChat(tree, CATALOG);
    // exact match → confidence 0.85 (≥ 0.8 threshold)
    expect(report.confident).toHaveLength(2);
    expect(report.unknown).toHaveLength(0);
  });

  it("threshold 옵션 반영", () => {
    const tree: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [
        { id: "n1", name: "Buttton", component: "Frame" }, // fuzzy distance 1 → 0.7
      ],
    };
    const { report: defaultReport } = inferChat(tree, CATALOG);
    expect(defaultReport.confirm).toHaveLength(1); // 0.7 < 0.8 → confirm

    const { report: strictReport } = inferChat(tree, CATALOG, { confidentThreshold: 0.6 });
    expect(strictReport.confident).toHaveLength(1); // 0.7 ≥ 0.6 → confident
  });

  it("end-to-end: synthetic HTML → infer → emit 포함 텍스트 검증", () => {
    // LoginPage 와 유사한 synthetic tree
    const loginHtml = `
      <div class="LoginPage">
        <div class="BrandHeader"></div>
        <div class="LoginForm"></div>
        <button class="Button"></button>
      </div>
    `;
    const tree = htmlToPaperTree(loginHtml, "Root");
    const { text, report } = inferChat(tree, CATALOG);
    // 적어도 일부 컴포넌트가 텍스트에 포함되어야 함
    expect(text.length).toBeGreaterThan(0);
    expect(report.total).toBeGreaterThan(0);
  });
});
