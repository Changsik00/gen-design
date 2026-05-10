import { describe, it, expect } from "vitest";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { lintFiles, formatReport } from "../spec-lint";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..", "..");
const CATALOG = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "catalog.json");
const SCHEMA = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "spec-schema.json");

function withTemp(fn: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), "spec-lint-test-"));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true });
  }
}

describe("CLI lintFiles — 결과 envelope", () => {
  it("PASS — 모든 파일 통과", () => {
    withTemp((dir) => {
      const a = join(dir, "ok.spec.md");
      writeFileSync(a, "<Button />\n", "utf-8");
      const r = lintFiles({
        files: [a],
        catalogPath: CATALOG,
        schemaPath: SCHEMA,
      });
      expect(r.exitCode).toBe(0);
      expect(r.totalErrors).toBe(0);
      expect(r.files).toHaveLength(1);
      expect(r.files[0].errors).toEqual([]);
    });
  });

  it("FAIL — 미등록 컴포넌트", () => {
    withTemp((dir) => {
      const a = join(dir, "bad.spec.md");
      writeFileSync(a, "<Buttn />\n", "utf-8");
      const r = lintFiles({
        files: [a],
        catalogPath: CATALOG,
        schemaPath: SCHEMA,
      });
      expect(r.exitCode).toBe(1);
      expect(r.totalErrors).toBeGreaterThan(0);
      // 미등록 컴포넌트는 schema (oneOf 실패) + catalog (Unknown component) 둘 다 검출
      const stages = r.files[0].errors.map((e) => e.stage);
      expect(stages).toContain("catalog");
    });
  });

  it("multi-file: 일부 PASS, 일부 FAIL → exitCode 1", () => {
    withTemp((dir) => {
      const ok = join(dir, "ok.spec.md");
      const bad = join(dir, "bad.spec.md");
      writeFileSync(ok, "<Button />\n", "utf-8");
      writeFileSync(bad, "<Buttn />\n", "utf-8");
      const r = lintFiles({
        files: [ok, bad],
        catalogPath: CATALOG,
        schemaPath: SCHEMA,
      });
      expect(r.exitCode).toBe(1);
      expect(r.files).toHaveLength(2);
      expect(r.files[0].errors).toEqual([]);
      expect(r.files[1].errors.length).toBeGreaterThan(0);
    });
  });
});

describe("CLI formatReport — stdout 형식", () => {
  it("PASS 형식 (single file)", () => {
    const out = formatReport({
      files: [{ path: "spec/login.spec.md", errors: [] }],
      totalErrors: 0,
      exitCode: 0,
    });
    expect(out).toContain("✓ spec/login.spec.md");
    expect(out).toContain("PASS — 1 file, 0 errors.");
  });

  it("FAIL 형식 (errors 디테일 포함)", () => {
    const out = formatReport({
      files: [
        {
          path: "spec/bad.spec.md",
          errors: [
            {
              message: "Unknown component: <Buttn>",
              location: { line: 3, col: 1, offset: 0, length: 9 },
              stage: "catalog",
              suggestion: "<Button> ?",
            },
          ],
        },
      ],
      totalErrors: 1,
      exitCode: 1,
    });
    expect(out).toContain("✗ spec/bad.spec.md");
    expect(out).toContain("[3:1] error [catalog] Unknown component: <Buttn>");
    expect(out).toContain("(hint: <Button> ?)");
    expect(out).toContain("FAIL — 1 file, 1 error.");
  });

  it("multi-file 요약 (파일 갯수 / 에러 갯수)", () => {
    const out = formatReport({
      files: [
        { path: "a.spec.md", errors: [] },
        {
          path: "b.spec.md",
          errors: [
            {
              message: "x",
              location: { line: 1, col: 1, offset: 0, length: 0 },
              stage: "parse",
            },
            {
              message: "y",
              location: { line: 2, col: 1, offset: 0, length: 0 },
              stage: "axis",
            },
          ],
        },
      ],
      totalErrors: 2,
      exitCode: 1,
    });
    expect(out).toContain("FAIL — 2 files, 2 errors.");
  });
});
