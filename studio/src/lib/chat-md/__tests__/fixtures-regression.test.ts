/**
 * 28 fixture (fixtures/chats/{scenes,components}/*.chat.md) 회귀 테스트.
 *
 * 모든 fixture 가 parse + lint 통과해야 함.
 * 각 fixture 는 *대표 variant* 를 포함하며 컴파일러의 회귀 게이트.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { lintFile } from "../lint";
import type { VocabularyCatalog } from "../../vocabulary/catalog";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const SCENES_DIR = join(PROJECT_ROOT, "fixtures", "chats", "scenes");
const COMPONENTS_DIR = join(PROJECT_ROOT, "fixtures", "chats", "components");
const CATALOG_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "catalog.json");
const SCHEMA_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "spec-schema.json");

interface FixtureFile {
  dir: string;
  name: string;
  fullPath: string;
}

let catalog: VocabularyCatalog;
let schema: object;
let fixtures: FixtureFile[];

function listChatFiles(dir: string): FixtureFile[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".chat.md"))
    .map((f) => ({ dir, name: f, fullPath: join(dir, f) }));
}

beforeAll(() => {
  catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as VocabularyCatalog;
  schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf-8")) as object;
  fixtures = [...listChatFiles(SCENES_DIR), ...listChatFiles(COMPONENTS_DIR)];
});

describe("fixtures — 28 chat.md 회귀 (scenes + components)", () => {
  it("fixture 갯수", () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(26);
  });

  it("모든 fixture parse + lint PASS", () => {
    const failures: string[] = [];
    for (const file of fixtures) {
      const result = lintFile(file.fullPath, { catalog, schema });
      if (!result.ok) {
        failures.push(
          `${file.name}:\n${result.errors
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
