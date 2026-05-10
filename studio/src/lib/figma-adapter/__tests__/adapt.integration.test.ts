import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { adaptFigma } from "../adapt";
import { parse } from "../../chat-md/parser";
import type { FigmaNode } from "../figma-types";
import type { CatalogMap } from "../../paper-inference/ast-builder";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = join(__dirname, "../fixtures/sample-page.json");

const EMPTY_CATALOG: CatalogMap = new Map();

describe("adaptFigma 통합 테스트", () => {
  it("sample-page.json fixture 로드 성공", () => {
    const raw = readFileSync(FIXTURE_PATH, "utf-8");
    const node = JSON.parse(raw) as FigmaNode;
    expect(node.type).toBe("FRAME");
    expect(node.name).toBe("LoginPage");
  });

  it("fixture → adaptFigma → parse(text).ok === true", () => {
    const node = JSON.parse(readFileSync(FIXTURE_PATH, "utf-8")) as FigmaNode;
    const result = adaptFigma(node, EMPTY_CATALOG);

    expect(typeof result.text).toBe("string");

    const parsed = parse(result.text || "");
    expect(parsed.ok).toBe(true);
  });

  it("report 에 total >= 0 존재", () => {
    const node = JSON.parse(readFileSync(FIXTURE_PATH, "utf-8")) as FigmaNode;
    const result = adaptFigma(node, EMPTY_CATALOG);

    expect(result.report.total).toBeGreaterThanOrEqual(0);
  });

  it("빈 카탈로그 → 모두 unknown 분류 (미매칭)", () => {
    const node = JSON.parse(readFileSync(FIXTURE_PATH, "utf-8")) as FigmaNode;
    const result = adaptFigma(node, EMPTY_CATALOG);

    // 빈 카탈로그이므로 matched 없음 → confident 는 0
    expect(result.report.confident).toHaveLength(0);
    // unknown 에 노드들이 있음
    expect(result.report.unknown.length + result.report.confirm.length).toBeGreaterThan(0);
  });

  it("카탈로그에 Button 있으면 matched 발생", () => {
    const node = JSON.parse(readFileSync(FIXTURE_PATH, "utf-8")) as FigmaNode;
    const catalog: CatalogMap = new Map([["Button", [{ name: "variant", values: ["primary", "secondary"] }]]]);
    const result = adaptFigma(node, catalog);

    // "Button/Primary" → "Button.primary" → "Button" 매칭 → confident 또는 confirm
    const matchedCount = result.report.confident.length + result.report.confirm.length;
    expect(matchedCount).toBeGreaterThan(0);
  });
});
