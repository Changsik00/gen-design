/**
 * checkContrast — WCAG 2.1 AA 색 대비 자동 측정.
 *
 * - culori 로 OKLCH → XYZ65 → relative luminance (Y) 변환
 * - WCAG ratio = (L_lighter + 0.05) / (L_darker + 0.05)
 * - 8 페어 검증:
 *     foreground/background, primary-fg/primary, secondary-fg/secondary,
 *     muted-foreground/background, accent-fg/accent, destructive-fg/destructive,
 *     card-fg/card, popover-fg/popover
 * - 미달 시 가장 가까운 합격 OKLCH 제안 (L 만 조정 — Hue/Chroma 보존)
 */

import { parse, converter } from "culori";
import type { DoctorDiag } from "./types";
import { diag, contrastMsg } from "./messages";

const toXyz = converter("xyz65");

interface OklchColor {
  mode: string;
  l: number;
  c?: number;
  h?: number;
  alpha?: number;
}

function isOklch(v: unknown): v is OklchColor {
  return (
    typeof v === "object" &&
    v !== null &&
    "mode" in v &&
    (v as { mode: string }).mode === "oklch"
  );
}

function relativeLuminance(oklch: OklchColor): number {
  const xyz = toXyz(oklch);
  if (!xyz || typeof xyz !== "object") return 0;
  // XYZ65.y = relative luminance (CIE Y, normalized 0~1)
  const y = (xyz as { y?: number }).y;
  return typeof y === "number" ? Math.max(0, Math.min(1, y)) : 0;
}

export function contrastRatio(fgOklch: string, bgOklch: string): number {
  const fg = parse(fgOklch);
  const bg = parse(bgOklch);
  if (!fg || !bg || !isOklch(fg) || !isOklch(bg)) {
    throw new Error(`invalid OKLCH input: fg=${fgOklch}, bg=${bgOklch}`);
  }
  const lFg = relativeLuminance(fg);
  const lBg = relativeLuminance(bg);
  const lighter = Math.max(lFg, lBg);
  const darker = Math.min(lFg, lBg);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * fg 의 L 만 조정해서 bg 와의 대비 ≥ minRatio 를 달성하는 OKLCH 제안.
 * Hue / Chroma 보존 → 색 의도 유지.
 *
 * - fg 가 bg 보다 어두우면 L 감소 시도 (더 진하게)
 * - fg 가 bg 보다 밝으면 L 증가 시도 (더 밝게)
 * - L step = 0.01, 최대 100 iter (L 범위 0~1)
 *
 * 반환:
 *  - 이미 합격: null
 *  - 합격 가능: { value: "oklch(...)", ratio }
 *  - L 조정만으로 불가능: null
 */
export function suggestAccessibleL(
  fgOklch: string,
  bgOklch: string,
  minRatio: number,
): { value: string; ratio: number } | null {
  const fg = parse(fgOklch);
  const bg = parse(bgOklch);
  if (!fg || !bg || !isOklch(fg) || !isOklch(bg)) return null;

  if (contrastRatio(fgOklch, bgOklch) >= minRatio) return null;

  const lFg = fg.l;
  const lBg = relativeLuminance(bg);
  // fg 가 bg 보다 어두우면 더 어둡게, 밝으면 더 밝게
  const direction = lFg < lBg ? -1 : 1;

  const step = 0.01;
  for (let i = 1; i <= 100; i++) {
    const newL = Math.max(0, Math.min(1, fg.l + direction * step * i));
    const candidate: OklchColor = {
      mode: "oklch",
      l: newL,
      c: fg.c,
      h: fg.h,
    };
    const candidateStr = formatOklch(candidate);
    const ratio = contrastRatio(candidateStr, bgOklch);
    if (ratio >= minRatio) {
      return { value: candidateStr, ratio };
    }
    // L 이 0 또는 1 에 도달했는데도 미달 → 불가능
    if (newL === 0 || newL === 1) {
      return null;
    }
  }
  return null;
}

function formatOklch(c: OklchColor): string {
  const l = c.l.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  const ch = (c.c ?? 0).toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  const h = (c.h ?? 0).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return `oklch(${l} ${ch} ${h})`;
}

// 8 페어 — shadcn 표준 대비 검증 대상
const CONTRAST_PAIRS: Array<[fgKey: string, bgKey: string, label: string]> = [
  ["foreground", "background", "foreground on background"],
  ["primary-foreground", "primary", "primary-foreground on primary"],
  ["secondary-foreground", "secondary", "secondary-foreground on secondary"],
  ["muted-foreground", "background", "muted-foreground on background"],
  ["accent-foreground", "accent", "accent-foreground on accent"],
  ["destructive-foreground", "destructive", "destructive-foreground on destructive"],
  ["card-foreground", "card", "card-foreground on card"],
  ["popover-foreground", "popover", "popover-foreground on popover"],
];

const MIN_RATIO_AA = 4.5;

export function checkContrast(
  tokens: Record<string, string>,
  filePath: string,
  mode: "light" | "dark",
): DoctorDiag[] {
  const diags: DoctorDiag[] = [];

  for (const [fgKey, bgKey, label] of CONTRAST_PAIRS) {
    const fg = tokens[fgKey];
    const bg = tokens[bgKey];
    if (!fg || !bg) continue; // 누락된 토큰은 token-format 이 별도 진단

    let ratio: number;
    try {
      ratio = contrastRatio(fg, bg);
    } catch {
      continue;
    }

    if (ratio < MIN_RATIO_AA) {
      const suggestion = suggestAccessibleL(fg, bg, MIN_RATIO_AA);
      let hint: string;
      if (suggestion) {
        hint = contrastMsg.suggest(fgKey, suggestion.value, suggestion.ratio);
      } else {
        hint = contrastMsg.cannotMeet(fgKey);
      }
      diags.push(
        diag("contrast", "error", filePath, contrastMsg.belowAA(label, ratio, mode), {
          hint,
        }),
      );
    }
  }

  return diags;
}
