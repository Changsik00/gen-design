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
  /**
   * 전체 본문 — `parse()` 결과에서는 항상 채워짐. 컴파일러 / 빌더 가 합성한
   * Document 에서도 본 필드만 채우면 동작 (legacy 호환).
   * 신규 section-aware 코드는 `structure?.body` 를 우선 사용.
   */
  body: Block[];
  /**
   * chat.md frontmatter (`---` 펜스). `parse()` 가 항상 설정 (없으면 null).
   * 합성 Document 에서는 생략 가능 (undefined).
   */
  frontmatter?: ChatFrontmatter | null;
  /** 단일 H1 (`# Name`). `parse()` 가 항상 설정 (없으면 null). 합성에서는 생략 가능. */
  title?: string | null;
  /** `## Narrative` 섹션 — 자연어 설계 의도. */
  narrative?: NarrativeSection | null;
  /** `## Structure` 섹션 — JSX 본문 (4축 어휘). */
  structure?: StructureSection | null;
  /** `## History` 섹션 — 변경 기록. */
  history?: HistorySection | null;
}

/**
 * chat.md frontmatter — phase-8 PoC `poc-chat-agent-flow` 가 정착시킨 형식.
 * type 별 필수 필드는 `validateChatSchema()` 가 검증.
 */
export interface ChatFrontmatter {
  type: "shell" | "scene" | "component";
  name: string;
  /** Paper layerNameAnchor 매칭 — 예: `chats/scenes/login`. */
  identity?: string;
  /** scene 전용 — shell 글로벌 외각의 inherit / 부분 exclude. */
  shell?: { inherit?: boolean; exclude?: string[] };
  /** component 전용 — catalog.json 의 tier/family/status. */
  catalog?: { tier?: number; family?: string; status?: string };
  /** Paper 매칭 메타. */
  paper?: { artboard?: string | null; layerNameAnchor?: string };
  /** 다른 chat 파일 참조 (도구가 안 따라감 — 디자이너 조회 보조). */
  references?: string[];
  /** 작성 또는 갱신 일자. */
  created?: string;
  /** shell 전용 — 어떤 종류에 적용되는지. */
  applies?: "scenes" | "components";
  /** forward-compat — 추가 필드 raw 보존. */
  [key: string]: unknown;
}

export interface NarrativeSection {
  type: "Narrative";
  /** 영역 안 raw markdown (JSX 태그는 텍스트로). */
  markdown: string;
  location: SourceLocation;
}

export interface StructureSection {
  type: "Structure";
  /** JSX fenced code block 안 ComponentTag 파싱 결과. */
  body: Block[];
  location: SourceLocation;
}

export interface HistorySection {
  type: "History";
  /** 변경 기록 raw markdown (bullet / sub-heading 자유). */
  markdown: string;
  location: SourceLocation;
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
  /**
   * placeholder 종류:
   * - i18n: 번역 (ko.x, en.x)
   * - token: 디자인 토큰 (semantic.color.x)
   * - scene: shell inherit 시 scene 본문 삽입 마커 (`{{scene.content}}`)
   */
  kind: "i18n" | "token" | "scene";
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
