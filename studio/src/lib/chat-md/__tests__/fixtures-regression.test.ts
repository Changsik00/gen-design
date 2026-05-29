/**
 * fixtures/chats/scenes — lint 회귀 게이트.
 * 모든 fixture chat.md 가 catalog 어휘 lint 를 통과해야 한다.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { lintFile } from "../lint";
import type { VocabularyCatalog } from "../../vocabulary/catalog";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const SCENES_DIR = join(PROJECT_ROOT, "fixtures", "chats", "scenes");
const CATALOG_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "catalog.json");
const SCHEMA_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "spec-schema.json");

interface FixtureFile {
  name: string;
  fullPath: string;
}

let catalog: VocabularyCatalog;
let schema: object;
let fixtures: FixtureFile[];

beforeAll(() => {
  catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as VocabularyCatalog;
  schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf-8")) as object;
  if (!existsSync(SCENES_DIR)) {
    fixtures = [];
    return;
  }
  fixtures = readdirSync(SCENES_DIR)
    .filter((f) => f.endsWith(".chat.md"))
    .map((f) => ({ name: f, fullPath: join(SCENES_DIR, f) }));
});

describe("fixtures/chats/scenes — lint 회귀", () => {
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
