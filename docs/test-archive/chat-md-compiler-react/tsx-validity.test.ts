/**
 * 생성 TSX 유효성 검증 (chat-md compiler).
 *
 * compileToReact 가 생성하는 TSX 문자열이:
 * 1. 유효한 JS 식별자를 함수명으로 사용하는지
 * 2. 존재하지 않는 모듈 (react-i18next, @/lib/tokens) 을 import 하지 않는지
 * 3. export function 구문을 포함하는지
 *
 * 28 fixture 전체에 대해 검증 (fixtures/chats/{scenes,components}/).
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { compileToReact } from "../compile";

const SCENES_DIR = join(__dirname, "..", "..", "..", "..", "..", "..", "fixtures", "chats", "scenes");
const COMPONENTS_DIR = join(__dirname, "..", "..", "..", "..", "..", "..", "fixtures", "chats", "components");

interface Fix { dir: string; name: string }
const fixtures: Fix[] = [
  ...readdirSync(SCENES_DIR).filter((f) => f.endsWith(".chat.md")).map((name) => ({ dir: SCENES_DIR, name })),
  ...readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".chat.md")).map((name) => ({ dir: COMPONENTS_DIR, name })),
];

const VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const BANNED_IMPORTS = ["react-i18next", "@/lib/tokens"];

function deriveComponentName(filename: string): string {
  return filename
    .replace(/\.chat\.md$/, "")
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

describe("생성 TSX 유효성 — 28 fixture", () => {
  it("모든 fixture 가 ok 결과 반환", () => {
    const failures: string[] = [];
    for (const f of fixtures) {
      const text = readFileSync(join(f.dir, f.name), "utf-8");
      const componentName = deriveComponentName(f.name);
      const result = compileToReact({ text, componentName });
      if (!result.ok) failures.push(`${f.name}: ${result.errors.map((e) => e.message).join(", ")}`);
    }
    expect(failures).toHaveLength(0);
  });

  it("생성된 함수명이 유효한 JS 식별자", () => {
    const failures: string[] = [];
    for (const f of fixtures) {
      const text = readFileSync(join(f.dir, f.name), "utf-8");
      const componentName = deriveComponentName(f.name);
      const result = compileToReact({ text, componentName });
      if (!result.ok) continue;
      const match = result.tsx?.match(/export function ([A-Za-z_$][A-Za-z0-9_$]*)/);
      if (!match) {
        failures.push(`${f.name}: export function 없음`);
        continue;
      }
      if (!VALID_IDENTIFIER.test(match[1])) {
        failures.push(`${f.name}: 잘못된 식별자 "${match[1]}"`);
      }
    }
    expect(failures).toHaveLength(0);
  });

  it("금지된 모듈 import 없음 (react-i18next, @/lib/tokens)", () => {
    const failures: string[] = [];
    for (const f of fixtures) {
      const text = readFileSync(join(f.dir, f.name), "utf-8");
      const componentName = deriveComponentName(f.name);
      const result = compileToReact({ text, componentName });
      if (!result.ok) continue;
      for (const banned of BANNED_IMPORTS) {
        if (result.tsx?.includes(`from '${banned}'`) || result.tsx?.includes(`from "${banned}"`)) {
          failures.push(`${f.name}: 금지 import "${banned}" 포함`);
        }
      }
    }
    expect(failures).toHaveLength(0);
  });
});
