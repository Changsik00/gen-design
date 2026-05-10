/**
 * 회귀 lint — 코드 변경 후 vocab CLI 미실행 시 detect.
 *
 * git 에 commit 된 catalog.json / spec-schema.json 이 *현재 소스에서
 * 빌드한 결과* 와 일치하는지 검증. mismatch = ERROR.
 *
 * CI 통합: vitest 가 항상 본 테스트 실행 → drift 발생 시 PR fail.
 * 개발자 액션: `pnpm --filter studio vocab` 재실행 후 commit.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { describe, it, expect } from "vitest";
import { buildCatalog } from "../catalog";
import { generateSpecSchema } from "../catalog/spec-schema";

const STUDIO_SRC = "src";
const VOCAB_LIB = "src/lib/vocabulary/catalog";

function safeReadJson(filePath: string): unknown {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

describe("vocab regression — catalog.json / spec-schema.json drift", () => {
  it("catalog.json (committed) 이 라이브 추출 결과와 일치", () => {
    const committedPath = path.join(VOCAB_LIB, "catalog.json");
    const committed = safeReadJson(committedPath);
    if (!committed) {
      // 첫 빌드 전이면 skip 가능 — 로컬에서 vocab 한번 실행 후 commit 하면 활성화
      console.warn(`(skip) ${committedPath} 미존재 — \`pnpm --filter studio vocab\` 실행 필요`);
      return;
    }
    // 같은 일자 generatedAt 으로 빌드 (CLI 가 일자만 사용)
    const live = buildCatalog({
      studioSrcRoot: STUDIO_SRC,
      generatedAt: (committed as { generatedAt?: string }).generatedAt,
    });
    expect(live).toEqual(committed);
  });

  it("spec-schema.json (committed) 이 라이브 생성 결과와 일치", () => {
    const committedPath = path.join(VOCAB_LIB, "spec-schema.json");
    const committed = safeReadJson(committedPath);
    if (!committed) return;
    const live = generateSpecSchema(
      buildCatalog({
        studioSrcRoot: STUDIO_SRC,
        generatedAt: undefined,
      }),
    );
    // generatedAt 은 schema 가 아니라 catalog 에만. schema 는 deterministic.
    expect(live).toEqual(committed);
  });
});
