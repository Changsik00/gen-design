/**
 * Public API — `compileToPaper`.
 *
 * 입력 형식:
 *   - string: spec.md 텍스트
 *   - Document: 미리 파싱된 AST
 *
 * 파일 경로 입력은 브라우저 호환을 위해 CLI 레이어에서 처리 (readFileSync → string 변환 후 전달).
 *
 * 출력:
 *   { html, payload, ast?, errors? }
 *     html    — Studio iframe 의 srcDoc (DOCTYPE + Tailwind CDN + body)
 *     payload — Paper write_html fragment
 *     ast     — 파싱 성공 시 AST (snapshot 또는 디버깅용)
 *     errors  — parse 실패 시 ParseError[]; 부분 컴파일 + 노출
 *
 * 파이프라인 (FR-1 ~ FR-3):
 *   1. parse spec.md → AST
 *   2. AST → React 트리 (i18n + token + theme + tokens 해소)
 *   3. SSR → HTML
 *   4. Tailwind CDN + CSS vars wrap
 */

import { parse } from "../../spec-md/parser";
import type { Document, ParseError } from "../../spec-md/parser/ast-types";
import koBundle from "../../../i18n/ko.json";
import { COMPONENT_REGISTRY } from "./component-registry";
import { buildReactTree } from "./react-builder";
import { renderTreeToHtml } from "./ssr-render";
import { wrapPage } from "./page-wrapper";

export type CompileInput = string | Document;

export interface CompileOptions {
  /** Tailwind play CDN 포함 (기본 true). offline 환경에서 false. */
  withTailwind?: boolean;
  /** i18n bundle (기본: ko.json). */
  bundle?: unknown;
}

export interface CompileResult {
  html: string;
  payload: string;
  ast?: Document;
  errors?: ParseError[];
}

export function compileToPaper(
  input: CompileInput,
  options: CompileOptions = {},
): CompileResult {
  const { ast, errors } = resolveAst(input);
  if (!ast) {
    // parse 실패 — 빈 body 로 wrapping
    const empty = wrapPage({
      bodyHtml: '<div style="color:#ff4d4d">[parse failed]</div>',
      withTailwind: options.withTailwind,
    });
    return { ...empty, errors };
  }

  const nodes = buildReactTree(ast, {
    registry: COMPONENT_REGISTRY,
    bundle: options.bundle ?? koBundle,
  });
  const bodyHtml = renderTreeToHtml(nodes);
  const wrapped = wrapPage({
    bodyHtml,
    withTailwind: options.withTailwind,
  });

  return {
    html: wrapped.html,
    payload: wrapped.payload,
    ast,
    errors: errors && errors.length > 0 ? errors : undefined,
  };
}

function resolveAst(input: CompileInput): {
  ast?: Document;
  errors?: ParseError[];
} {
  if (typeof input === "string") {
    const r = parse(input);
    return r.ok ? { ast: r.ast } : { errors: r.errors };
  }
  return { ast: input };
}
