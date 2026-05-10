/**
 * 4-stage lint 파이프라인.
 *
 * Stage 1: parse  (parser/index.ts 의 parse() — ParseError stage="parse")
 * Stage 2: schema (spec-schema.json + ajv — stage="schema")
 * Stage 3: catalog (catalog.json 어휘 매칭 — stage="catalog")
 * Stage 4: axis   (catalog 의 axis enum — stage="axis")
 *
 * Stage 1 실패 시 즉시 중단 (AST 없음). Stage 2-4 는 모두 실행하여 누적 에러 반환.
 */

import { parse } from "../parser";
import { parseFile } from "../parser/node";
import type { Document, ParseError, ParseResult } from "../parser/ast-types";
import type { VocabularyCatalog } from "../../vocabulary/catalog";
import { checkCatalog } from "./catalog-check";
import { validateAgainstSchema } from "./schema-validate";

export interface LintOptions {
  catalog: VocabularyCatalog;
  /** spec-schema.json 객체. 미지정 시 schema 단계 skip. */
  schema?: object;
}

export interface LintResult {
  ok: boolean;
  ast?: Document;
  errors: ParseError[];
}

export function lintAst(ast: Document, options: LintOptions): LintResult {
  const errors: ParseError[] = [];
  if (options.schema) {
    const r = validateAgainstSchema(ast, { schema: options.schema });
    errors.push(...r.errors);
  }
  const cat = checkCatalog(ast, options.catalog);
  errors.push(...cat.errors);
  return { ok: errors.length === 0, ast, errors };
}

export function lintText(text: string, options: LintOptions): LintResult {
  const parsed = parse(text);
  if (!parsed.ok || !parsed.ast) {
    return { ok: false, errors: parsed.errors };
  }
  return lintAst(parsed.ast, options);
}

export function lintFile(path: string, options: LintOptions): LintResult {
  const parsed: ParseResult = parseFile(path);
  if (!parsed.ok || !parsed.ast) {
    return { ok: false, errors: parsed.errors };
  }
  return lintAst(parsed.ast, options);
}

export { checkCatalog } from "./catalog-check";
export { validateAgainstSchema } from "./schema-validate";
