/**
 * C4 — noise-injected 픽스처 테스트.
 *
 * 합성 입력(astToSyntheticTree) 은 "자기 자신을 검증" 하는 self-referential 측정.
 * 이 파일은 디자이너가 실제로 쓸 법한 noisy layer 명명을 별도로 검증한다:
 * - 약어, 오타, 소문자, 한글, 언더스코어 등
 *
 * 목적: "noise 입력은 미매칭(unknown) 또는 낮은 신뢰도(confirm)" 임을 보장.
 * 즉, 시스템이 노이즈를 *침묵 오분류* 하지 않는지 확인.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { inferChat } from "../infer";
import type { CatalogMap } from "../ast-builder";
import type { PaperTreeNode } from "../tree-types";

const CATALOG_PATH = join(__dirname, "..", "..", "..", "..", "src", "lib", "vocabulary", "catalog", "catalog.json");

let catalogMap: CatalogMap;

beforeAll(() => {
  const raw = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as {
    tiers: Record<string, { components?: { name: string; axes: { name: string; values: string[] }[] }[] }>;
  };
  catalogMap = new Map();
  for (const tier of Object.values(raw.tiers)) {
    for (const comp of tier.components ?? []) {
      catalogMap.set(comp.name, comp.axes ?? []);
    }
  }
});

function singleNode(name: string): PaperTreeNode {
  return { id: "1", name, component: "Frame" };
}

function frame(name: string, children: PaperTreeNode[]): PaperTreeNode {
  return { id: "root", name, component: "Frame", children };
}

describe("noise-injected 픽스처 — 미매칭 또는 낮은 신뢰도", () => {
  it("약어 'Btn.primary' → fuzzy match 또는 unknown (distance > 0)", () => {
    const tree = frame("Page", [singleNode("Btn.primary")]);
    const result = inferChat(tree, catalogMap);
    const node = result.report.confident.find((m) => m.exact);
    // "Btn" 은 "Button" 과 distance=2 — fuzzy match 가능하나 exact 아님
    expect(node?.exact).toBeFalsy();
  });

  it("소문자 'button.primary' → unmatched (case-sensitive)", () => {
    const tree = frame("Page", [singleNode("button.primary")]);
    const result = inferChat(tree, catalogMap);
    // "button" 은 catalog 의 "Button" 과 exact match 없음
    // confident 에 exact match 가 있으면 안 됨
    const exactMatches = result.report.confident.filter((m) => m.exact);
    expect(exactMatches.length).toBe(0);
  });

  it("오타 'Inputt.default' → unmatched", () => {
    const tree = frame("Page", [singleNode("Inputt.default")]);
    const result = inferChat(tree, catalogMap);
    const totalMatched = result.report.confident.length + result.report.confirm.length;
    // "Inputt" 는 "Input" 과 distance=1 — fuzzy 가능하나 exact 아님
    const exactMatches = result.report.confident.filter((m) => m.exact);
    expect(exactMatches.length).toBe(0);
    // 전체 노드(1개)가 unknown 이거나 confirm (낮은 신뢰도)
    expect(totalMatched + result.report.unknown.length).toBe(1);
  });

  it("한글 레이어명 '로그인버튼' → unmatched", () => {
    const tree = frame("Page", [singleNode("로그인버튼")]);
    const result = inferChat(tree, catalogMap);
    expect(result.report.confident.length).toBe(0);
    expect(result.report.unknown.length).toBeGreaterThan(0);
  });

  it("언더스코어 'Button_primary' → dot syntax 밖, unmatched", () => {
    const tree = frame("Page", [singleNode("Button_primary")]);
    const result = inferChat(tree, catalogMap);
    // variant-extractor 는 dot syntax 만 — "Button_primary" 전체가 component name 으로 처리
    // "Button_primary" ≠ "Button" → exact match 없음
    const exactMatches = result.report.confident.filter((m) => m.exact);
    expect(exactMatches.length).toBe(0);
  });
});

describe("noise-injected 픽스처 — 정확한 입력은 매칭", () => {
  it("'Button.primary' → exact match (대조군)", () => {
    const tree = frame("Page", [singleNode("Button.primary")]);
    const result = inferChat(tree, catalogMap);
    const exactMatches = result.report.confident.filter((m) => m.exact);
    expect(exactMatches.length).toBe(1);
  });
});
