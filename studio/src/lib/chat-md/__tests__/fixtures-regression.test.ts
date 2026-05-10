/**
 * 28 fixture (spec/*.spec.md) 회귀 테스트.
 *
 * 모든 fixture 가 parse + lint 통과해야 함.
 * 각 fixture 는 *대표 variant* 를 포함하며 향후 spec-7-03/04 의 입력으로 사용됨.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { lintFile } from "../lint";
import type { VocabularyCatalog } from "../../vocabulary/catalog";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const FIXTURE_DIR = join(PROJECT_ROOT, "spec");
const CATALOG_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "catalog.json");
const SCHEMA_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "spec-schema.json");

let catalog: VocabularyCatalog;
let schema: object;
let fixtures: string[];

beforeAll(() => {
  catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as VocabularyCatalog;
  schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf-8")) as object;
  fixtures = readdirSync(FIXTURE_DIR).filter((f) => f.endsWith(".spec.md"));
});

describe("fixtures — 28 컴포넌트 spec.md 회귀", () => {
  it("fixture 갯수", () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(26);
  });

  it("모든 fixture parse + lint PASS", () => {
    const failures: string[] = [];
    for (const file of fixtures) {
      const result = lintFile(join(FIXTURE_DIR, file), { catalog, schema });
      if (!result.ok) {
        failures.push(
          `${file}:\n${result.errors
            .map((e) => `  [${e.location.line}:${e.location.col}] ${e.stage}: ${e.message}`)
            .join("\n")}`,
        );
      }
    }
    if (failures.length > 0) {
      throw new Error(`Fixtures failed lint:\n\n${failures.join("\n\n")}`);
    }
    expect(failures).toEqual([]);
  });
});
