import { describe, it, expect } from "vitest";
import { classify } from "../classify";
import type { NodeMeta } from "../ast-builder";

function makeMeta(id: string, confidence: number): NodeMeta {
  return { paperId: id, confidence, matched: confidence > 0, exact: confidence >= 0.85, suggestion: null };
}

function makeMap(...entries: NodeMeta[]): Map<string, NodeMeta> {
  return new Map(entries.map((m) => [m.paperId, m]));
}

describe("classify — 3분류 (confident / confirm / unknown)", () => {
  it("전부 confident — 모두 임계값 이상", () => {
    const map = makeMap(makeMeta("a", 1.0), makeMeta("b", 0.85), makeMeta("c", 0.8));
    const report = classify(map);
    expect(report.confident).toHaveLength(3);
    expect(report.confirm).toHaveLength(0);
    expect(report.unknown).toHaveLength(0);
    expect(report.total).toBe(3);
  });

  it("혼합 — confident / confirm / unknown 각 1개", () => {
    const map = makeMap(makeMeta("a", 0.9), makeMeta("b", 0.6), makeMeta("c", 0.3));
    const report = classify(map);
    expect(report.confident).toHaveLength(1);
    expect(report.confirm).toHaveLength(1);
    expect(report.unknown).toHaveLength(1);
  });

  it("전부 unknown — 모두 임계값 미만", () => {
    const map = makeMap(makeMeta("a", 0.0), makeMeta("b", 0.3), makeMeta("c", 0.4));
    const report = classify(map);
    expect(report.confident).toHaveLength(0);
    expect(report.confirm).toHaveLength(0);
    expect(report.unknown).toHaveLength(3);
  });

  it("임계값 변경 — confidentThreshold=0.9 로 재분류", () => {
    const map = makeMap(makeMeta("a", 0.85), makeMeta("b", 0.95));
    const report = classify(map, { confidentThreshold: 0.9 });
    expect(report.confident).toHaveLength(1);
    expect(report.confirm).toHaveLength(1);
    expect(report.thresholds.confident).toBe(0.9);
  });
});
