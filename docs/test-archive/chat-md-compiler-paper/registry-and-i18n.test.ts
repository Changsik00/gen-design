import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { COMPONENT_REGISTRY, lookupComponent, registeredNames } from "../component-registry";
import koBundle from "@/i18n/ko.json";
import type { VocabularyCatalog } from "@/lib/vocabulary/catalog";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const CATALOG = JSON.parse(
  readFileSync(join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "catalog.json"), "utf-8"),
) as VocabularyCatalog;

function allCatalogNames(catalog: VocabularyCatalog): string[] {
  const names = new Set<string>();
  for (const c of catalog.tiers.tier2Shadcn.components) names.add(c.name);
  for (const c of catalog.tiers.tier3Project.composites) names.add(c.name);
  for (const c of catalog.tiers.tier3Project.templates) names.add(c.name);
  return [...names].sort();
}

describe("component-registry — catalog 와 1:1 일치", () => {
  it("모든 catalog name 이 registry 에 있음", () => {
    const catalogNames = allCatalogNames(CATALOG);
    const missing = catalogNames.filter((n) => !COMPONENT_REGISTRY[n]);
    expect(missing).toEqual([]);
  });

  it("모든 registry name 이 catalog 에 있음 (가짜 등록 없음)", () => {
    const catalogNames = new Set(allCatalogNames(CATALOG));
    const extras = registeredNames().filter((n) => !catalogNames.has(n));
    expect(extras).toEqual([]);
  });

  it("등록 컴포넌트 갯수 ≥ 28", () => {
    expect(registeredNames().length).toBeGreaterThanOrEqual(28);
  });

  it("lookupComponent: 등록 / 미등록 분기", () => {
    expect(lookupComponent("Button")).toBeDefined();
    expect(typeof lookupComponent("Button")).toBe("function");
    expect(lookupComponent("Buttn")).toBeUndefined();
  });
});

describe("i18n ko bundle — 28 fixture 의 모든 placeholder 키 정의", () => {
  const scenesDir = join(PROJECT_ROOT, "fixtures", "chats", "scenes");
  const componentsDir = join(PROJECT_ROOT, "fixtures", "chats", "components");

  function getNested(obj: unknown, path: string[]): unknown {
    let cur: unknown = obj;
    for (const seg of path) {
      if (cur === null || cur === undefined || typeof cur !== "object") return undefined;
      cur = (cur as Record<string, unknown>)[seg];
    }
    return cur;
  }

  it("28 fixture 의 모든 {{i18n.ko.*}} placeholder 가 ko.json 에 존재", () => {
    const fixtures = [
      ...readdirSync(scenesDir).filter((f) => f.endsWith(".chat.md")).map((name) => ({ dir: scenesDir, name })),
      ...readdirSync(componentsDir).filter((f) => f.endsWith(".chat.md")).map((name) => ({ dir: componentsDir, name })),
    ];
    const allKeys = new Set<string>();
    const re = /\{\{i18n\.([a-zA-Z0-9._-]+)\}\}/g;
    for (const f of fixtures) {
      const txt = readFileSync(join(f.dir, f.name), "utf-8");
      let m: RegExpExecArray | null;
      while ((m = re.exec(txt)) !== null) {
        allKeys.add(m[1]);
      }
    }
    const missing: string[] = [];
    for (const dottedPath of allKeys) {
      const parts = dottedPath.split(".");
      const value = getNested(koBundle, parts);
      if (typeof value !== "string") missing.push(dottedPath);
    }
    expect(missing).toEqual([]);
  });
});
