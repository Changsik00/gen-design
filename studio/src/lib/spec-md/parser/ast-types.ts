/**
 * spec.md AST 타입 정의 — ADR-005 D-2 (자체 JSON tree IR) 의 구체화.
 *
 * spec.md 텍스트 → parser → 본 AST → spec-7-03/04 (Paper / React compiler).
 *
 * 4 layer 어휘 모두 명시적 필드:
 * - L1 명명된 variant: ComponentInstance.props["variant"]
 * - L2 다축 sub-variant: ComponentInstance.props (axis name 별)
 * - L3 theme context: ComponentInstance.theme
 * - L4 인라인 토큰 override: ComponentInstance.tokens (token 참조 only)
 *
 * 모든 노드는 SourceLocation 을 보유 → 친화적 에러 + AST → 컴파일 단계 추적.
 */

export interface SourceLocation {
  /** 1-based line number. */
  line: number;
  /** 1-based column number. */
  col: number;
  /** 0-based byte offset. */
  offset: number;
  /** 노드의 원문 길이 (문자 수). */
  length: number;
}

export type Block = ComponentInstance | Placeholder | MarkdownText | Comment;

export interface Document {
  type: "Document";
  body: Block[];
}

export interface ComponentInstance {
  type: "ComponentInstance";
  /** 컴포넌트 이름. catalog.json 의 등록된 어휘만 (lint 단계에서 검증). */
  name: string;
  /** 일반 속성 — variant / size / 임의 prop. */
  props: Record<string, AttrValue>;
  /** L4 인라인 토큰 override. 값은 token 참조 (`{{token.xxx}}`) 만. */
  tokens?: Record<string, string>;
  /** L3 theme context (예: "brand-a"). */
  theme?: string;
  children: Block[];
  location: SourceLocation;
}

export interface Placeholder {
  type: "Placeholder";
  /** placeholder 종류. */
  kind: "i18n" | "token";
  /** dotted path (예: "ko.login-input", "semantic.color.light.primary"). */
  path: string;
  location: SourceLocation;
}

export interface MarkdownText {
  type: "MarkdownText";
  /** raw markdown text — 컴포넌트 태그 외 영역. parser 가 가공하지 않음. */
  text: string;
  location: SourceLocation;
}

export interface Comment {
  type: "Comment";
  /** `<!--` 와 `-->` 사이 본문. */
  text: string;
  location: SourceLocation;
}

/**
 * 속성 값. 다음 중 하나:
 * - 문자열 리터럴: `"value"` 또는 `'value'`
 * - JSON literal: number / boolean / null / object / array
 * - placeholder: `{{i18n.x}}`, `{{token.x}}`
 */
export type AttrValue =
  | string
  | number
  | boolean
  | null
  | AttrObject
  | AttrArray
  | Placeholder;

export interface AttrObject {
  [key: string]: AttrValue;
}

export type AttrArray = AttrValue[];

/**
 * Parse 결과 — 성공 / 실패 통합.
 * 성공이면 ast 보유, 에러는 [].
 * 실패면 ast 없음 또는 부분, errors 비어있지 않음.
 */
export interface ParseResult {
  ok: boolean;
  ast?: Document;
  errors: ParseError[];
}

export interface ParseError {
  message: string;
  location: SourceLocation;
  /** parse / schema / catalog / axis enum */
  stage: "parse" | "schema" | "catalog" | "axis";
  /** 친화적 제안 (선택, 예: "<Buttn> → <Button> ?"). */
  suggestion?: string;
}
