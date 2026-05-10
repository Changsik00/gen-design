/**
 * i18n placeholder resolver.
 *
 * 입력: path (e.g. "ko.action.login") + bundle JSON 객체
 * 출력: { value: string; missing: boolean }
 *   - missing=false → bundle 의 dotted path 에 string value
 *   - missing=true  → 표시용 sentinel `[<path> missing]`
 *
 * 누락 케이스를 explicit 로 보고 → React-builder 가 빨간 background span 으로 시각화.
 */

export interface ResolvedI18n {
  value: string;
  missing: boolean;
}

export function resolveI18n(path: string, bundle: unknown): ResolvedI18n {
  const segments = path.split(".");
  let cur: unknown = bundle;
  for (const seg of segments) {
    if (cur === null || cur === undefined || typeof cur !== "object") {
      return { value: missingMarker(path), missing: true };
    }
    cur = (cur as Record<string, unknown>)[seg];
  }
  if (typeof cur === "string") {
    return { value: cur, missing: false };
  }
  return { value: missingMarker(path), missing: true };
}

function missingMarker(path: string): string {
  return `[${path} missing]`;
}

export const I18N_MISSING_STYLE = "background:#ff4d4d;color:#fff;padding:0 4px;border-radius:2px;";
