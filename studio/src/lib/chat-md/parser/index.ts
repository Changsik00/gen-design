/**
 * spec.md parser — 공용 API.
 *
 * - parse(text) — 문자열 입력
 * - parseFile(path) — 파일 입력 (Node 환경 only)
 *
 * 결과는 ParseResult 로 통합:
 *   성공 → { ok: true, ast, errors: [] }
 *   실패 → { ok: false, errors: [ParseError] }
 *
 * peggy 의 raw exception 을 ParseError 로 정규화 (line/col/offset/length).
 */

import { parser } from "../grammar";
import type { Document, ParseError, ParseResult } from "./ast-types";
import { validateChatSchema } from "./schema";

export interface ParseOptions {
  /** schema 검증 단계 skip — frontmatter 검증 없이 grammar parse 만 수행. */
  skipSchema?: boolean;
}

export function parse(text: string, opts?: ParseOptions): ParseResult {
  try {
    const ast = parser.parse(text) as Document;
    if (opts?.skipSchema) return { ok: true, ast, errors: [] };
    const schemaErrors = validateChatSchema(ast);
    return { ok: schemaErrors.length === 0, ast, errors: schemaErrors };
  } catch (e) {
    return { ok: false, errors: [toParseError(e)] };
  }
}

interface PeggyError {
  message: string;
  location?: {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
  };
  expected?: { description?: string; text?: string }[];
  found?: string | null;
}

function toParseError(e: unknown): ParseError {
  const err = e as PeggyError;
  const start = err.location?.start;
  const end = err.location?.end;
  return {
    message: err.message,
    location: {
      line: start?.line ?? 0,
      col: start?.column ?? 0,
      offset: start?.offset ?? 0,
      length: end && start ? end.offset - start.offset : 0,
    },
    stage: "parse",
  };
}

export type { Document, ParseError, ParseResult };
