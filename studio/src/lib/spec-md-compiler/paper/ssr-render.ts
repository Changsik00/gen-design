/**
 * React 엘리먼트 트리 → HTML 문자열 (Server-Side Render).
 *
 * react-dom/server 의 `renderToStaticMarkup` 사용 — `data-react-checksum` 등의
 * hydration 메타 없이 순수 정적 HTML 만 emit.
 *
 * SSR 시 hydration mismatch 경고는 무시 — 본 컴파일러의 출력은 *정적 HTML* 이다.
 */

import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";

export function renderTreeToHtml(nodes: ReactNode[]): string {
  return nodes.map((node) => renderToStaticMarkup(node)).join("");
}
