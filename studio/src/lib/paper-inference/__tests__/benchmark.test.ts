/**
 * 28-fixture round-trip 벤치마크 + Go/No-Go gate.
 *
 * 전략:
 * 1. 각 fixture spec.md 파싱 → 지상 진실 AST
 * 2. AST → 합성 Paper tree (컴포넌트 이름 + variant props → dot-syntax 레이어명)
 * 3. inferSpec 실행 → 추론 AST
 * 4. 지상 진실 vs 추론 비교 → accuracy 3종 측정
 *
 * Go/No-Go: 종합 score ≥ 0.60 PASS / < 0.60 FAIL
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "../../spec-md/parser/index";
import { inferSpec } from "../infer";
import type { CatalogMap } from "../ast-builder";
import type { VocabularyCatalog } from "../../vocabulary/catalog";
import type { Document, ComponentInstance, Block } from "../../spec-md/parser/ast-types";
import type { PaperTreeNode } from "../tree-types";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const FIXTURE_DIR = join(PROJECT_ROOT, "spec");
const CATALOG_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "catalog.json");

let catalogMap: CatalogMap;
let fixtures: { name: string; text: string }[];

beforeAll(() => {
  const raw = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as VocabularyCatalog;
  catalogMap = buildCatalogMap(raw);

  fixtures = readdirSync(FIXTURE_DIR)
    .filter((f) => f.endsWith(".spec.md"))
    .map((f) => ({
      name: f.replace(".spec.md", ""),
      text: readFileSync(join(FIXTURE_DIR, f), "utf-8"),
    }));
});

function buildCatalogMap(catalog: VocabularyCatalog): CatalogMap {
  const map: CatalogMap = new Map();
  const all = [
    ...catalog.tiers.tier2Shadcn.components,
    ...catalog.tiers.tier3Project.composites,
    ...catalog.tiers.tier3Project.templates,
  ];
  for (const comp of all) {
    map.set(comp.name, comp.axes.map((a) => ({ name: a.name, values: a.values })));
  }
  return map;
}

// ─── AST → synthetic Paper tree ───────────────────────────────────────────
let _synId = 0;

function synId(): string {
  return `bench-${++_synId}`;
}

function astToSyntheticTree(doc: Document): PaperTreeNode {
  const children = doc.body
    .filter((b): b is ComponentInstance => b.type === "ComponentInstance")
    .map((b) => ciToNode(b));

  return { id: synId(), name: "Root", component: "Frame", children };
}

function ciToNode(ci: ComponentInstance): PaperTreeNode {
  const axes = catalogMap.get(ci.name) ?? [];
  const parts = [ci.name];
  for (const axis of axes) {
    const val = ci.props[axis.name];
    if (typeof val === "string") parts.push(val);
  }
  const layerName = parts.join(".");
  const children = (ci.children as Block[])
    .filter((b): b is ComponentInstance => b.type === "ComponentInstance")
    .map((b) => ciToNode(b));

  return {
    id: synId(),
    name: layerName,
    component: "Frame",
    children: children.length > 0 ? children : undefined,
  };
}

// ─── 정확도 측정 ───────────────────────────────────────────────────────────
interface AccuracyMetrics {
  structural: number;
  vocabulary: number;
  variant: number;
  combined: number;
}

interface FixtureResult {
  fixture: string;
  metrics: AccuracyMetrics;
  groundTruthNodes: number;
  inferredNodes: number;
}

function flattenCi(doc: Document): ComponentInstance[] {
  const result: ComponentInstance[] = [];
  function walk(blocks: Block[]) {
    for (const b of blocks) {
      if (b.type === "ComponentInstance") {
        result.push(b);
        walk(b.children);
      }
    }
  }
  walk(doc.body);
  return result;
}

function measureAccuracy(ground: Document, inferred: Document): AccuracyMetrics {
  const gtNodes = flattenCi(ground);
  const infNodes = flattenCi(inferred);

  // structural: min(gt, inf) / max(gt, inf) node count ratio
  const maxNodes = Math.max(gtNodes.length, infNodes.length, 1);
  const minNodes = Math.min(gtNodes.length, infNodes.length);
  const structural = minNodes / maxNodes;

  // vocabulary: 이름 집합 교집합 / 합집합 (Jaccard)
  const gtNames = new Set(gtNodes.map((c) => c.name));
  const infNames = new Set(infNodes.map((c) => c.name));
  const intersection = [...gtNames].filter((n) => infNames.has(n)).length;
  const union = new Set([...gtNames, ...infNames]).size;
  const vocabulary = union > 0 ? intersection / union : 1;

  // variant: 이름 일치 노드 중 props 일치율
  let variantTotal = 0;
  let variantMatch = 0;
  for (const gt of gtNodes) {
    const inf = infNodes.find((n) => n.name === gt.name);
    if (!inf) continue;
    const gtProps = Object.keys(gt.props);
    if (gtProps.length === 0) continue;
    variantTotal++;
    const matching = gtProps.filter((k) => gt.props[k] === inf.props[k]).length;
    variantMatch += matching / gtProps.length;
  }
  const variant = variantTotal > 0 ? variantMatch / variantTotal : 1;

  const combined = 0.4 * structural + 0.4 * vocabulary + 0.2 * variant;

  return { structural, vocabulary, variant, combined };
}

// ─── 벤치마크 테스트 ───────────────────────────────────────────────────────
describe("28-fixture round-trip benchmark", () => {
  it("fixture 28개 확인", () => {
    expect(fixtures.length).toBe(28);
  });

  it("Go/No-Go: 종합 accuracy ≥ 0.60", () => {
    _synId = 0; // counter reset
    const results: FixtureResult[] = [];

    for (const { name, text } of fixtures) {
      const parsed = parse(text);
      if (!parsed.ok || !parsed.ast) {
        results.push({
          fixture: name,
          metrics: { structural: 0, vocabulary: 0, variant: 0, combined: 0 },
          groundTruthNodes: 0,
          inferredNodes: 0,
        });
        continue;
      }

      const synTree = astToSyntheticTree(parsed.ast);
      const { ast: inferred } = inferSpec(synTree, catalogMap);
      const metrics = measureAccuracy(parsed.ast, inferred);

      results.push({
        fixture: name,
        metrics,
        groundTruthNodes: flattenCi(parsed.ast).length,
        inferredNodes: flattenCi(inferred).length,
      });
    }

    // bench-report.md 생성
    const report = generateReport(results);
    writeFileSync(join(STUDIO_ROOT, "..", "bench-report.md"), report, "utf-8");

    const totalCombined = results.reduce((s, r) => s + r.metrics.combined, 0) / results.length;

    console.log(`\n📊 Benchmark Results:`);
    console.log(`  Fixtures: ${results.length}`);
    console.log(`  Mean combined score: ${(totalCombined * 100).toFixed(1)}%`);
    console.log(`  Go/No-Go threshold: 60%`);
    console.log(`  Result: ${totalCombined >= 0.60 ? "✓ PASS" : "✗ FAIL"}`);

    expect(totalCombined).toBeGreaterThanOrEqual(0.60);
  });
});

function generateReport(results: FixtureResult[]): string {
  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  const combined = mean(results.map((r) => r.metrics.combined));
  const pass = combined >= 0.60;

  const lines = [
    "# Benchmark Report — spec-7-04 paper-to-spec",
    "",
    `**Go/No-Go**: ${pass ? "✓ PASS" : "✗ FAIL"}  `,
    `**Combined Score**: ${pct(combined)} (threshold: 60%)  `,
    `**Fixtures**: ${results.length}  `,
    "",
    "## Per-fixture Breakdown",
    "",
    "| Fixture | Structural | Vocabulary | Variant | Combined | GT nodes | Inf nodes |",
    "|---|:---:|:---:|:---:|:---:|:---:|:---:|",
    ...results.map((r) =>
      `| ${r.fixture} | ${pct(r.metrics.structural)} | ${pct(r.metrics.vocabulary)} | ${pct(r.metrics.variant)} | ${pct(r.metrics.combined)} | ${r.groundTruthNodes} | ${r.inferredNodes} |`
    ),
    "",
    "## Metric Averages",
    "",
    `| Metric | Score |`,
    `|---|:---:|`,
    `| Structural (×0.4) | ${pct(mean(results.map((r) => r.metrics.structural)))} |`,
    `| Vocabulary (×0.4) | ${pct(mean(results.map((r) => r.metrics.vocabulary)))} |`,
    `| Variant (×0.2) | ${pct(mean(results.map((r) => r.metrics.variant)))} |`,
    `| **Combined** | **${pct(combined)}** |`,
  ];

  return lines.join("\n") + "\n";
}
