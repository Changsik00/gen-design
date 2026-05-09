/**
 * Peggy (peg.js) prototype — placeholder-only.
 *
 * 목적: chevrotain 과 비교하기 위한 *최소* 구현.
 * 입력: `{{i18n.ko.login-input}}` 또는 `{{token.semantic.color.primary}}`
 * 출력: { kind: "i18n" | "token", path: string, location: SourceLocation }
 *
 * peggy 는 grammar 문자열을 *런타임* 또는 *빌드 단계* 에서 컴파일합니다.
 * 본 prototype 은 단순화를 위해 런타임 컴파일.
 *
 * 본 파일은 비교 종료 후 채택된 도구만 남기고 제거됩니다.
 */

import peggy from "peggy";

const grammar = `
{
  function loc(location) {
    return {
      line: location.start.line,
      col: location.start.column,
      offset: location.start.offset,
      length: location.end.offset - location.start.offset,
    };
  }
}

Placeholder
  = "{{" kind:Kind "." path:PathSegments "}}" {
      return { kind, path: path.join("."), location: loc(location()) };
    }

Kind
  = "i18n" / "token"

PathSegments
  = head:Identifier tail:("." Identifier)* {
      return [head, ...tail.map(t => t[1])];
    }

Identifier
  = chars:[a-zA-Z0-9_-]+ { return chars.join(""); }
`;

const parser = peggy.generate(grammar);

export interface PrototypeResult {
  ok: boolean;
  kind?: "i18n" | "token";
  path?: string;
  location?: { line: number; col: number; offset: number; length: number };
  error?: string;
}

export function parsePlaceholder(text: string): PrototypeResult {
  try {
    const result = parser.parse(text) as {
      kind: "i18n" | "token";
      path: string;
      location: { line: number; col: number; offset: number; length: number };
    };
    return { ok: true, ...result };
  } catch (e) {
    const err = e as {
      message: string;
      location?: { start: { line: number; column: number } };
    };
    const line = err.location?.start.line ?? 0;
    const col = err.location?.start.column ?? 0;
    return {
      ok: false,
      error: `[peggy ${line}:${col}] ${err.message}`,
    };
  }
}
