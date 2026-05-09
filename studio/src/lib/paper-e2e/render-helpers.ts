/**
 * paper-e2e — Paper ↔ React fresh-page round-trip 검증을 위한 HTML 렌더 헬퍼.
 *
 * spec-6-10 의 핵심 모듈. paper-sync.resolveSemanticColors 를 통해 tokens.json
 * light scheme 을 CSS 변수 레코드로 변환 후, Paper write_html 호출에 사용할
 * `<style>` 블록과 페이지 래퍼를 생성한다.
 *
 * 본 모듈을 통해 paper-sync 라이브러리가 production 코드에서 실제로 import 되어
 * spec-6-10 회고의 C2 (unused lib) 가 해소된다.
 */

import tokensSource from "@assets/tokens/tokens.json";
import { resolveSemanticColors, type TokensJson } from "../paper-sync";

const tokens = tokensSource as unknown as TokensJson;

/** semantic.color.light 전체를 해소한 CSS 변수 레코드. */
export const RESOLVED_LIGHT = resolveSemanticColors(tokens);

interface SemanticLeafMap {
  [key: string]: { $value?: unknown } | undefined;
}

function extractSimpleValue(map: unknown, key: string, fallback: string): string {
  const leaf = (map as SemanticLeafMap | undefined)?.[key];
  const value = leaf?.$value;
  return typeof value === "string" ? value : fallback;
}

/** semantic.{radius,size,font} 의 단순 (참조 없음) leaf 값. */
export const SIMPLE_TOKENS: Record<string, string> = {
  "--radius": extractSimpleValue(tokens.semantic.radius, "base", "0.5rem"),
  "--sidebar-width": extractSimpleValue(tokens.semantic.size, "sidebar-width", "240px"),
  "--font-sans": extractSimpleValue(
    tokens.semantic.font,
    "sans",
    "'Inter', system-ui, sans-serif",
  ),
  "--font-heading": extractSimpleValue(
    tokens.semantic.font,
    "heading",
    "'Inter', system-ui, sans-serif",
  ),
};

/** 모든 (color light + simple) 토큰을 합친 CSS 변수 레코드. */
export const ALL_TOKENS: Record<string, string> = {
  ...RESOLVED_LIGHT,
  ...SIMPLE_TOKENS,
};

/** `:root { --xxx: ...; }` 형식 CSS 블록 문자열. */
export function cssVarsBlock(vars: Record<string, string> = ALL_TOKENS): string {
  const lines = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${lines}\n}`;
}

export interface PageWrapperOptions {
  bodyHtml: string;
  /** 추가 CSS (컴포넌트별 스코프). 본 문자열이 cssVarsBlock 뒤에 그대로 붙는다. */
  extraCss?: string;
  /** 본문 패딩 (기본 32). */
  padding?: number;
  /** 배경 토큰 (기본 var(--background)). */
  background?: string;
}

/**
 * write_html 에 직접 전달할 수 있는 단일 HTML 문자열을 만든다.
 * style 블록 + 정렬된 컨테이너를 포함한다.
 */
export function pageWrapper(opts: PageWrapperOptions): string {
  const padding = opts.padding ?? 32;
  const background = opts.background ?? "var(--background)";
  const baseCss = `${cssVarsBlock()}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  padding: ${padding}px;
  font-family: var(--font-sans);
  background: ${background};
  color: var(--foreground);
  line-height: 1.5;
}
.paper-e2e-root { display: flex; flex-direction: column; gap: 24px; }
.paper-e2e-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.paper-e2e-label { font-size: 12px; color: var(--muted-foreground); margin-bottom: 4px; }
`;
  const extra = opts.extraCss ? `\n${opts.extraCss}\n` : "";
  return `<style>${baseCss}${extra}</style>
<div class="paper-e2e-root">
${opts.bodyHtml}
</div>`;
}

/**
 * 컴포넌트 HTML 템플릿 레지스트리.
 * 각 항목은 인자 없이 호출되어 HTML 문자열을 반환한다.
 *
 * Task 2/3/4 에서 채워진다 (현 시점은 빈 레지스트리 = 스캐폴드 단계).
 */
export const COMPOSITES: Record<string, () => string> = {};
export const TEMPLATES: Record<string, () => string> = {};
