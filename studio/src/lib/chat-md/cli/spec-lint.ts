/**
 * spec-lint CLI — `pnpm --filter studio spec-lint <file...>`
 *
 * 사용:
 *   pnpm --filter studio spec-lint spec/login-page.spec.md
 *   pnpm --filter studio spec-lint spec/*.spec.md
 *
 * 출력: `[line:col] <severity> [<stage>] <message>` + summary.
 * 종료 코드: 0 (모두 통과), 1 (에러 발견).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { lintFile } from "../lint";
import type { ParseError } from "../parser/ast-types";
import type { VocabularyCatalog } from "../../vocabulary/catalog";

export interface CliOptions {
  /** 검사 대상 .spec.md 파일들 (절대 또는 상대). */
  files: string[];
  /** catalog.json 경로 (기본: studio/src/lib/vocabulary/catalog/catalog.json). */
  catalogPath: string;
  /** spec-schema.json 경로 (기본: 동일 디렉토리). */
  schemaPath: string;
}

export interface CliReport {
  /** 파일별 결과. */
  files: Array<{
    path: string;
    errors: ParseError[];
  }>;
  /** 전체 에러 수. */
  totalErrors: number;
  /** 전체 종료 코드 (0 / 1). */
  exitCode: 0 | 1;
}

export function lintFiles(options: CliOptions): CliReport {
  const catalog = JSON.parse(readFileSync(options.catalogPath, "utf-8")) as VocabularyCatalog;
  const schema = JSON.parse(readFileSync(options.schemaPath, "utf-8")) as object;

  const fileReports: CliReport["files"] = [];
  let total = 0;
  for (const file of options.files) {
    const result = lintFile(resolve(file), { catalog, schema });
    const errs = result.ok ? [] : result.errors;
    fileReports.push({ path: file, errors: errs });
    total += errs.length;
  }
  return {
    files: fileReports,
    totalErrors: total,
    exitCode: total === 0 ? 0 : 1,
  };
}

/**
 * Report → 사람이 읽는 출력 문자열 (CLI stdout 또는 스냅샷 테스트용).
 */
export function formatReport(report: CliReport): string {
  const lines: string[] = [];
  for (const file of report.files) {
    if (file.errors.length === 0) {
      lines.push(`✓ ${file.path}`);
      continue;
    }
    lines.push(`✗ ${file.path}`);
    for (const e of file.errors) {
      lines.push(
        `  [${e.location.line}:${e.location.col}] error [${e.stage}] ${e.message}` +
          (e.suggestion ? `  (hint: ${e.suggestion})` : ""),
      );
    }
  }
  lines.push("");
  lines.push(
    `${report.totalErrors === 0 ? "PASS" : "FAIL"} — ${report.files.length} file${
      report.files.length === 1 ? "" : "s"
    }, ${report.totalErrors} error${report.totalErrors === 1 ? "" : "s"}.`,
  );
  return lines.join("\n");
}

// CLI entry — argv parse + run + output + exit.
function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    process.stderr.write("Usage: spec-lint <file.spec.md...>\n");
    process.exit(2);
  }
  const here = new URL(".", import.meta.url).pathname;
  const defaultCatalog = resolve(here, "..", "..", "vocabulary", "catalog", "catalog.json");
  const defaultSchema = resolve(here, "..", "..", "vocabulary", "catalog", "spec-schema.json");
  const report = lintFiles({
    files: args,
    catalogPath: defaultCatalog,
    schemaPath: defaultSchema,
  });
  process.stdout.write(formatReport(report) + "\n");
  process.exit(report.exitCode);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
