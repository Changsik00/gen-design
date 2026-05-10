import { describe, it, expect } from "vitest";
import { parseArgs, runInfer } from "../cli/paper-to-spec";
import type { CatalogMap } from "../ast-builder";
import type { PaperTreeNode } from "../tree-types";
import { writeFileSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const CATALOG: CatalogMap = new Map([
  ["Button", [{ name: "variant", values: ["primary", "default"] }]],
  ["LoginForm", []],
]);

function writeTempJson(data: unknown): string {
  const dir = mkdtempSync(join(tmpdir(), "paper-to-spec-"));
  const path = join(dir, "tree.json");
  writeFileSync(path, JSON.stringify(data), "utf-8");
  return path;
}

describe("parseArgs", () => {
  it("파일 인수 파싱", () => {
    const result = parseArgs(["/tmp/tree.json"]);
    expect("error" in result).toBe(false);
    if (!("error" in result)) expect(result.file).toBe("/tmp/tree.json");
  });

  it("--report 플래그", () => {
    const result = parseArgs(["/tmp/tree.json", "--report"]);
    if (!("error" in result)) expect(result.report).toBe(true);
  });

  it("--threshold 파싱", () => {
    const result = parseArgs(["/tmp/tree.json", "--threshold", "0.7"]);
    if (!("error" in result)) expect(result.threshold).toBe(0.7);
  });

  it("파일 없으면 error", () => {
    const result = parseArgs([]);
    expect("error" in result).toBe(true);
  });
});

describe("runInfer", () => {
  it("유효한 tree JSON → spec.md 텍스트 출력", () => {
    const tree: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [{ id: "n1", name: "Button.primary", component: "Frame" }],
    };
    const path = writeTempJson(tree);
    const result = runInfer({ file: path }, CATALOG);
    expect(result.exitCode).toBe(0);
    expect(result.text).toContain("<Button");
  });

  it("존재하지 않는 파일 → exitCode 1", () => {
    const result = runInfer({ file: "/nonexistent/tree.json" }, CATALOG);
    expect(result.exitCode).toBe(1);
  });

  it("threshold 옵션 전달", () => {
    const tree: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [{ id: "n1", name: "Button", component: "Frame" }],
    };
    const path = writeTempJson(tree);
    const result = runInfer({ file: path, threshold: 0.5 }, CATALOG);
    expect(result.exitCode).toBe(0);
  });

  it("report JSON 포함 여부 확인", () => {
    const tree: PaperTreeNode = {
      id: "root",
      name: "Root",
      component: "Frame",
      children: [{ id: "n1", name: "Button", component: "Frame" }],
    };
    const path = writeTempJson(tree);
    const result = runInfer({ file: path, report: true }, CATALOG);
    expect(result.exitCode).toBe(0);
    expect(result.report).toContain("total");
  });
});
