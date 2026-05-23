/**
 * checkTokenFormat — DTCG 1.0 strict + shadcn 24 토큰 잠금.
 *
 * 검증 항목:
 *   1. 최상위가 객체인지
 *   2. 각 토큰이 $value + $type 필드 보유
 *   3. $value 가 { light, dark } 두 모드 모두 정의 (본 프로젝트 컨벤션)
 *   4. shadcn 표준 토큰 (required 목록) 모두 존재
 */

import type { DoctorDiag } from "./types";
import { diag, tokenFormatMsg } from "./messages";

interface DtcgToken {
  $value?: unknown;
  $type?: unknown;
  $description?: unknown;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isDtcgToken(v: unknown): v is DtcgToken {
  if (!isObject(v)) return false;
  return "$value" in v || "$type" in v;
}

/**
 * tokens.json 의 모든 leaf token 을 (path, token) 으로 평탄화.
 * 예: `{ color: { background: {$value, $type} } }` → `[["color.background", {...}]]`
 */
function flattenTokens(
  obj: Record<string, unknown>,
  prefix = "",
): Array<[string, DtcgToken]> {
  const out: Array<[string, DtcgToken]> = [];
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("$")) continue; // metadata
    const path = prefix ? `${prefix}.${k}` : k;
    if (isDtcgToken(v)) {
      out.push([path, v]);
    } else if (isObject(v)) {
      out.push(...flattenTokens(v, path));
    }
  }
  return out;
}

export function checkTokenFormat(
  tokens: unknown,
  filePath: string,
  requiredShadcnNames: string[],
): DoctorDiag[] {
  const diags: DoctorDiag[] = [];

  if (!isObject(tokens)) {
    diags.push(
      diag("token-format", "error", filePath, tokenFormatMsg.invalidStructure()),
    );
    return diags;
  }

  const flat = flattenTokens(tokens);
  const foundNames = new Set<string>();

  for (const [path, token] of flat) {
    // shadcn 토큰 이름은 마지막 segment (color.background → background)
    const name = path.split(".").pop()!;
    foundNames.add(name);

    if (!("$value" in token) || token.$value === undefined) {
      diags.push(
        diag("token-format", "error", filePath, tokenFormatMsg.missingValue(path), {
          hint: tokenFormatMsg.hintAddValue,
        }),
      );
      continue;
    }
    if (!("$type" in token) || token.$type === undefined) {
      diags.push(
        diag("token-format", "error", filePath, tokenFormatMsg.missingType(path), {
          hint: tokenFormatMsg.hintAddType,
        }),
      );
    }

    // light/dark 동기 검증 — color 타입이고 $value 가 객체일 때만
    if (token.$type === "color" && isObject(token.$value)) {
      const value = token.$value;
      if ("light" in value && !("dark" in value)) {
        diags.push(
          diag("token-format", "error", filePath, tokenFormatMsg.lightDarkMismatch(path, "dark"), {
            hint: tokenFormatMsg.hintSyncMode,
          }),
        );
      } else if ("dark" in value && !("light" in value)) {
        diags.push(
          diag("token-format", "error", filePath, tokenFormatMsg.lightDarkMismatch(path, "light"), {
            hint: tokenFormatMsg.hintSyncMode,
          }),
        );
      }
    }
  }

  // shadcn 표준 토큰 잠금 — required 명시된 이름이 모두 있어야 함
  for (const required of requiredShadcnNames) {
    if (!foundNames.has(required)) {
      diags.push(
        diag(
          "token-format",
          "error",
          filePath,
          tokenFormatMsg.missingShadcnToken(required),
          { hint: tokenFormatMsg.hintShadcnLock },
        ),
      );
    }
  }

  return diags;
}

/**
 * shadcn 표준 24 토큰 이름 (이름 잠금 대상).
 */
export const SHADCN_REQUIRED_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;
