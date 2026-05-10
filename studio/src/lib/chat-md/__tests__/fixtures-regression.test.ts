/**
 * fixtures/chats + playground/chats 회귀 테스트.
 *
 * - fixtures/chats/{scenes,components}/*.chat.md — 컴파일러 회귀 게이트 (lint 통과 필수).
 * - playground/chats/{,scenes/,components/}*.chat.md — phase-8 PoC 산출물 (parse + frontmatter schema 검증).
 *
 * 두 그룹을 분리한 이유: fixtures 는 catalog 어휘 lint 까지 통과해야 하지만,
 * playground 의 chat 은 신규 component (catalog 미등록) 를 자유롭게 만들 수 있어야 함.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { lintFile } from "../lint";
import { parse } from "../parser";
import type { VocabularyCatalog } from "../../vocabulary/catalog";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const SCENES_DIR = join(PROJECT_ROOT, "fixtures", "chats", "scenes");
const COMPONENTS_DIR = join(PROJECT_ROOT, "fixtures", "chats", "components");
const PLAYGROUND_DIR = join(PROJECT_ROOT, "playground", "chats");
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
let playgroundChats: FixtureFile[];

function listChatFiles(dir: string): FixtureFile[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".chat.md"))
    .map((f) => ({ dir, name: f, fullPath: join(dir, f) }));
}

function listPlaygroundChats(): FixtureFile[] {
  if (!existsSync(PLAYGROUND_DIR)) return [];
  const result: FixtureFile[] = [];
  for (const entry of readdirSync(PLAYGROUND_DIR)) {
    const fullPath = join(PLAYGROUND_DIR, entry);
    if (entry.endsWith(".chat.md")) {
      result.push({ dir: PLAYGROUND_DIR, name: entry, fullPath });
    } else if (statSync(fullPath).isDirectory()) {
      for (const file of listChatFiles(fullPath)) {
        result.push(file);
      }
    }
  }
  return result;
}

beforeAll(() => {
  catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as VocabularyCatalog;
  schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf-8")) as object;
  fixtures = [...listChatFiles(SCENES_DIR), ...listChatFiles(COMPONENTS_DIR)];
  playgroundChats = listPlaygroundChats();
});

describe("fixtures — chat.md 회귀 (scenes + components)", () => {
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

describe("playground/chats — PoC chat.md (frontmatter + 3 layers)", () => {
  it("playground 디렉토리 존재 + 6개 이상 chat 파일", () => {
    expect(playgroundChats.length).toBeGreaterThanOrEqual(6);
  });

  it("모든 playground chat parse + frontmatter schema PASS", () => {
    const failures: string[] = [];
    for (const file of playgroundChats) {
      const text = readFileSync(file.fullPath, "utf-8");
      const result = parse(text);
      if (!result.ok) {
        failures.push(
          `${file.name}:\n${result.errors
            .map((e) => `  [${e.location.line}:${e.location.col}] ${e.stage}: ${e.message}`)
            .join("\n")}`,
        );
      }
    }
    if (failures.length > 0) {
      throw new Error(`Playground chats failed parse/schema:\n\n${failures.join("\n\n")}`);
    }
    expect(failures).toEqual([]);
  });

  it("playground chat 모두 frontmatter 보유 (type 필드 인식)", () => {
    for (const file of playgroundChats) {
      const text = readFileSync(file.fullPath, "utf-8");
      const result = parse(text);
      expect(result.ast?.frontmatter, `${file.name} should have frontmatter`).not.toBeNull();
      expect(["shell", "scene", "component"]).toContain(result.ast?.frontmatter?.type);
    }
  });
});
