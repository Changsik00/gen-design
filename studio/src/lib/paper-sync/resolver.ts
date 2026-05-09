import type { ResolvedTokens, TokenLeaf, TokensJson } from "./types";

const REFERENCE_RE = /^\{([^}]+)\}$/;

/**
 * tokens.json 의 `{primitive.xxx.yyy}` 참조 문자열을 실제 값으로 해소한다.
 * 리터럴(`#FFFFFF`, `0.5rem` 등)은 그대로 반환.
 *
 * primitives 인자는 `tokens.primitive` 서브트리. 참조 경로의 leading
 * `primitive.` 는 자동으로 strip 후 traversal 한다.
 */
export function resolveTokenValue(
  raw: string,
  primitives: Record<string, unknown>,
): string {
  const match = REFERENCE_RE.exec(raw.trim());
  if (!match) {
    return raw;
  }
  const path = match[1].replace(/^primitive\./, "");
  const segments = path.split(".");
  let cursor: unknown = primitives;
  for (const seg of segments) {
    if (
      cursor &&
      typeof cursor === "object" &&
      seg in (cursor as Record<string, unknown>)
    ) {
      cursor = (cursor as Record<string, unknown>)[seg];
    } else {
      throw new Error(`paper-sync: token reference not found: ${raw}`);
    }
  }
  const leaf = cursor as Partial<TokenLeaf> | null;
  if (!leaf || typeof leaf !== "object" || typeof leaf.$value !== "string") {
    throw new Error(`paper-sync: token leaf has no string $value: ${raw}`);
  }
  return leaf.$value;
}

/**
 * tokens.json 의 `semantic.color.light` 전체를 해소하여
 * CSS 변수 레코드 (`--<name>` → 값) 로 반환한다.
 */
export function resolveSemanticColors(tokens: TokensJson): ResolvedTokens {
  const out: ResolvedTokens = {};
  const light = tokens.semantic.color.light;
  for (const [key, leaf] of Object.entries(light)) {
    out[`--${key}`] = resolveTokenValue(leaf.$value, tokens.primitive);
  }
  return out;
}
