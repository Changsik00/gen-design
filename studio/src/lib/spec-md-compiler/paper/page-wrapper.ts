/**
 * 컴파일 결과를 두 형식으로 wrap:
 *
 * 1. **payload** — Paper write_html 에 직접 전달할 fragment.
 *    paper-e2e 의 pageWrapper 가 만드는 `<style>` + `<div class="paper-e2e-root">` 형식.
 *
 * 2. **html** — Studio iframe 의 srcDoc 으로 사용할 *전체* HTML.
 *    DOCTYPE + Tailwind play CDN + same `<style>` + body.
 *
 * 두 형식 모두 동일한 CSS vars (paper-sync.resolveSemanticColors) + base style 을 공유.
 */

import { pageWrapper } from "../../paper-e2e/render-helpers";

export interface WrappedOutput {
  /** Studio iframe 용 — 전체 HTML 문서. */
  html: string;
  /** Paper write_html 용 — `<style>` + `<div>` fragment. */
  payload: string;
}

export interface WrapOptions {
  /** SSR 결과 body HTML. */
  bodyHtml: string;
  /** 추가 CSS (e.g. theme override). */
  extraCss?: string;
  /** body padding (기본 32). */
  padding?: number;
  /** Tailwind play CDN 포함 여부 (기본 true — html 출력에만 적용; payload 는 Paper 환경 의존). */
  withTailwind?: boolean;
}

const TAILWIND_CDN = '<script src="https://cdn.tailwindcss.com"></script>';

export function wrapPage(opts: WrapOptions): WrappedOutput {
  const payload = pageWrapper({
    bodyHtml: opts.bodyHtml,
    extraCss: opts.extraCss,
    padding: opts.padding,
  });

  const tailwindScript = opts.withTailwind === false ? "" : TAILWIND_CDN;
  const html = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>spec.md preview</title>
    ${tailwindScript}
  </head>
  <body>
${payload}
  </body>
</html>`;

  return { html, payload };
}
