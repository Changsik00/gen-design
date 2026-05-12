import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { inferChatDiff, type DiffStats } from "../diff";
import type { CatalogMap } from "../ast-builder";
import type { PaperTreeNode } from "../tree-types";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const SCENARIOS = join(PROJECT_ROOT, "fixtures", "diff-scenarios");

const catalog: CatalogMap = new Map();
catalog.set("LoginForm", [
  { name: "variant", values: ["default", "filled"] },
  { name: "size", values: ["sm", "md", "lg"] },
]);
catalog.set("Button", [
  { name: "variant", values: ["primary", "ghost"] },
  { name: "size", values: ["sm", "md", "lg"] },
]);

interface Scenario {
  name: string;
  dir: string;
  narrative: string;
  expectedStats: DiffStats;
  shouldAppendHistory: boolean;
}

const SCENARIO_LIST: Scenario[] = [
  {
    name: "A-text-only (실제는 no-op — Paper tree 만으로는 텍스트 변경 모의 X)",
    dir: "A-text-only",
    narrative: "로그인 진입점. 디자이너의 자연어 설계 의도.",
    expectedStats: { textChanges: 0, variantChanges: 0, added: 0, removed: 0 },
    shouldAppendHistory: false,
  },
  {
    name: "B-variant — md → lg",
    dir: "B-variant",
    narrative: "로그인 진입점. 사이즈 md 로 시작.",
    expectedStats: { textChanges: 0, variantChanges: 1, added: 0, removed: 0 },
    shouldAppendHistory: true,
  },
  {
    name: "C-add — Button 추가",
    dir: "C-add",
    narrative: "로그인 진입점. 초안에는 폼만 있음.",
    expectedStats: { textChanges: 0, variantChanges: 0, added: 1, removed: 0 },
    shouldAppendHistory: true,
  },
  {
    name: "D-remove — Button 삭제",
    dir: "D-remove",
    narrative: "로그인 진입점. 초안에는 폼 + 보조 버튼.",
    expectedStats: { textChanges: 0, variantChanges: 0, added: 0, removed: 1 },
    shouldAppendHistory: true,
  },
  {
    name: "E-mixed — variant 변경 + Button 추가",
    dir: "E-mixed",
    narrative: "로그인 진입점. 변경 이력 누적 테스트.",
    expectedStats: { textChanges: 0, variantChanges: 1, added: 1, removed: 0 },
    shouldAppendHistory: true,
  },
];

describe("diff-scenarios — 5 통합 시나리오", () => {
  it.each(SCENARIO_LIST)("$name", (sc) => {
    const before = readFileSync(join(SCENARIOS, sc.dir, "before.chat.md"), "utf-8");
    const treeRaw = readFileSync(join(SCENARIOS, sc.dir, "new.tree.json"), "utf-8");
    const tree = JSON.parse(treeRaw) as PaperTreeNode;

    const r = inferChatDiff(before, tree, { catalog, date: "2026-05-12" });

    expect(r.stats).toEqual(sc.expectedStats);

    // Narrative bit-for-bit 보존
    expect(r.text).toContain(sc.narrative);
    expect(r.preserved.narrative).toBe(true);

    // 기존 History 라인 보존
    expect(r.text).toMatch(/- \*\*2026-05-10\*\* 초안/);
    expect(r.preserved.history).toBe(true);

    // History 자동 라인 추가 여부
    if (sc.shouldAppendHistory) {
      expect(r.historyLineAdded).toBeDefined();
      expect(r.text).toMatch(/2026-05-12.*Paper sync/);
    } else {
      expect(r.historyLineAdded).toBeUndefined();
      expect(r.text).not.toMatch(/Paper sync/);
    }

    // frontmatter 보존 (type / identity 키)
    expect(r.text).toMatch(/type: scene/);
    expect(r.text).toMatch(/identity: chats\/scenes\/login/);
  });
});
