/**
 * React 엘리먼트 트리 → 정적 HTML 문자열.
 *
 * **API 선택**: `renderToStaticMarkup` (NOT `renderToString`).
 *
 * 이유:
 *   - 본 컴파일러는 *디자인 도구 export* 가 목적 — Paper / iframe 미리보기에 hydration 불필요.
 *   - `renderToStaticMarkup` 은 `data-react-*` 메타 없이 깔끔한 HTML 만 emit (React 공식 권장).
 *   - 두 API 모두 동기 — Suspense / async data / streaming 미지원. 그러나 본 use case
 *     (28 컴포넌트 모두 순수 presentational, 0 useState/useEffect/Suspense) 에서는 *적합*.
 *   - 향후 컴포넌트가 async data 도입 시 → renderToReadableStream 으로 마이그레이션 필요.
 *
 * 참고: https://react.dev/reference/react-dom/server/renderToStaticMarkup
 *      https://react.dev/reference/react-dom/server/renderToString  (사용하지 않음)
 */

import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";

export function renderTreeToHtml(nodes: ReactNode[]): string {
  return nodes.map((node) => renderToStaticMarkup(node)).join("");
}
