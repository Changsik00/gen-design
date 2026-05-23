import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runPaperImport } from "../../../../../packages/gd-cli/src/commands/paper-import";
import type { CatalogMap } from "../ast-builder";
import type { VocabularyCatalog } from "../../vocabulary/catalog";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const TREES_ROOT = join(PROJECT_ROOT, "fixtures", "paper-trees");
const CATALOG_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "catalog.json");

interface TreeFixture {
  name: string;
  treePath: string;
  expectedKind: "scene" | "component" | "shell";
  expectedSlug: string;
}

const FIXTURES: TreeFixture[] = [
  { name: "_shell", treePath: "_shell.tree.json", expectedKind: "shell", expectedSlug: "_shell" },
  { name: "scenes/login", treePath: "scenes/login.tree.json", expectedKind: "scene", expectedSlug: "login" },
  { name: "scenes/main", treePath: "scenes/main.tree.json", expectedKind: "scene", expectedSlug: "main" },
  { name: "components/brand-header", treePath: "components/brand-header.tree.json", expectedKind: "component", expectedSlug: "brand-header" },
  { name: "components/app-footer", treePath: "components/app-footer.tree.json", expectedKind: "component", expectedSlug: "app-footer" },
  { name: "components/empty-state", treePath: "components/empty-state.tree.json", expectedKind: "component", expectedSlug: "empty-state" },
];

let catalog: CatalogMap;

beforeAll(() => {
  const raw = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as VocabularyCatalog;
  catalog = new Map();
  const all = [
    ...raw.tiers.tier2Shadcn.components,
    ...raw.tiers.tier3Project.composites,
    ...raw.tiers.tier3Project.templates,
  ] as Array<{ name: string; axes: { name: string; values: string[] }[] }>;
  for (const c of all) catalog.set(c.name, c.axes);
});

describe("round-trip — 6 paper-tree fixtures", () => {
  it.each(FIXTURES)("$name → enriched JSON 의 identity 매칭", async (fx) => {
    const path = join(TREES_ROOT, fx.treePath);
    const r = await runPaperImport([path], { catalog });
    expect(r.exitCode).toBe(0);
    const enriched = JSON.parse(r.stdout) as { identity?: { kind: string; slug: string } };
    expect(enriched.identity?.kind).toBe(fx.expectedKind);
    expect(enriched.identity?.slug).toBe(fx.expectedSlug);
  });

  it.each(FIXTURES)("$name → validate-only PASS", async (fx) => {
    const path = join(TREES_ROOT, fx.treePath);
    const r = await runPaperImport([path, "--validate-only"], { catalog });
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/valid/);
  });

  it.each(FIXTURES)("$name → chain inferChat 출력 가능", async (fx) => {
    const path = join(TREES_ROOT, fx.treePath);
    const r = await runPaperImport([path, "--chain", "inferChat"], { catalog });
    expect(r.exitCode).toBe(0);
    expect(r.stdout.length).toBeGreaterThan(0);
  });
});
