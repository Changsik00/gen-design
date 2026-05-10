/**
 * C5 — 생성 TSX 유효성 검증.
 *
 * compileToReact 가 생성하는 TSX 문자열이:
 * 1. 유효한 JS 식별자를 함수명으로 사용하는지
 * 2. 존재하지 않는 모듈 (react-i18next, @/lib/tokens) 을 import 하지 않는지
 * 3. export function 구문을 포함하는지
 *
 * 28 fixture 전체에 대해 검증.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { compileToReact } from "../compile";

const SPEC_DIR = join(__dirname, "..", "..", "..", "..", "..", "..", "spec");
const fixtures = readdirSync(SPEC_DIR).filter((f) => f.endsWith(".spec.md"));

const VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const BANNED_IMPORTS = ["react-i18next", "@/lib/tokens"];

describe("생성 TSX 유효성 — 28 fixture", () => {
  it("모든 fixture 가 ok 결과 반환", () => {
    const failures: string[] = [];
    for (const file of fixtures) {
      const text = readFileSync(join(SPEC_DIR, file), "utf-8");
      const name = file.replace(/\.spec\.md$/, "").replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
      const componentName = name.charAt(0).toUpperCase() + name.slice(1);
      const result = compileToReact({ text, componentName });
      if (!result.ok) failures.push(`${file}: ${result.errors.map((e) => e.message).join(", ")}`);
    }
    expect(failures).toHaveLength(0);
  });

  it("생성된 함수명이 유효한 JS 식별자", () => {
    const failures: string[] = [];
    for (const file of fixtures) {
      const text = readFileSync(join(SPEC_DIR, file), "utf-8");
      const componentName = file
        .replace(/\.spec\.md$/, "")
        .split(/[-_]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");
      const result = compileToReact({ text, componentName });
      if (!result.ok) continue;
      // export function <Name>() 패턴에서 이름 추출
      const match = result.tsx?.match(/export function ([A-Za-z_$][A-Za-z0-9_$]*)/);
      if (!match) {
        failures.push(`${file}: export function 없음`);
        continue;
      }
      if (!VALID_IDENTIFIER.test(match[1])) {
        failures.push(`${file}: 잘못된 식별자 "${match[1]}"`);
      }
    }
    expect(failures).toHaveLength(0);
  });

  it("금지된 모듈 import 없음 (react-i18next, @/lib/tokens)", () => {
    const failures: string[] = [];
    for (const file of fixtures) {
      const text = readFileSync(join(SPEC_DIR, file), "utf-8");
      const componentName = file.replace(/\.spec\.md$/, "").replace(/[-_](\w)/g, (_, c: string) => c.toUpperCase());
      const result = compileToReact({ text, componentName });
      if (!result.ok) continue;
      for (const banned of BANNED_IMPORTS) {
        if (result.tsx?.includes(`from '${banned}'`) || result.tsx?.includes(`from "${banned}"`)) {
          failures.push(`${file}: 금지 import "${banned}" 포함`);
        }
      }
    }
    expect(failures).toHaveLength(0);
  });
});
