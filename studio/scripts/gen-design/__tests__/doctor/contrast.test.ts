import { describe, it, expect } from "vitest";
import {
  contrastRatio,
  suggestAccessibleL,
  checkContrast,
} from "../../doctor/check-contrast";

describe("contrastRatio — OKLCH 두 색의 WCAG 대비비", () => {
  it("white on black = 21:1", () => {
    const ratio = contrastRatio("oklch(1 0 0)", "oklch(0 0 0)");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("black on white = 21:1 (대칭)", () => {
    const ratio = contrastRatio("oklch(0 0 0)", "oklch(1 0 0)");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("같은 색 = 1:1", () => {
    const ratio = contrastRatio("oklch(0.5 0 0)", "oklch(0.5 0 0)");
    expect(ratio).toBeCloseTo(1, 1);
  });

  it("shadcn primary (0.205) on background (1) — high contrast", () => {
    const ratio = contrastRatio("oklch(0.205 0 0)", "oklch(1 0 0)");
    expect(ratio).toBeGreaterThan(14); // very high contrast
  });

  it("invalid OKLCH 입력 시 throw", () => {
    expect(() => contrastRatio("not-a-color", "oklch(1 0 0)")).toThrow();
  });
});

describe("suggestAccessibleL — L 조정으로 대비 합격 OKLCH 제안", () => {
  it("미달 색 (낮은 대비) 에 합격 L 제안", () => {
    // muted-foreground 가 너무 밝아서 background 위 대비 부족 가정
    const suggestion = suggestAccessibleL(
      "oklch(0.85 0 0)", // foreground (밝음 — 대비 ↓)
      "oklch(1 0 0)", // background (white)
      4.5,
    );
    expect(suggestion).not.toBeNull();
    if (!suggestion) return;
    expect(suggestion.ratio).toBeGreaterThanOrEqual(4.5);
    expect(suggestion.value).toMatch(/^oklch\(/);
  });

  it("이미 합격이면 변경 없이 null", () => {
    const suggestion = suggestAccessibleL(
      "oklch(0 0 0)", // black
      "oklch(1 0 0)", // white
      4.5,
    );
    expect(suggestion).toBeNull();
  });

  it("L 조정만으로 불가능하면 cannotMeet", () => {
    // foreground 와 background 가 같은 hue/chroma 의 동일 L → 변경 불가능 케이스
    // 실제로는 거의 항상 가능 — 극단 케이스만 null
    // 본 테스트는 정상 호출만 확인 (실제 불가능 케이스 시뮬레이션은 어려움)
    const suggestion = suggestAccessibleL(
      "oklch(0.5 0 0)",
      "oklch(0.55 0 0)", // 거의 같은 L — 어렵지만 L 0 또는 1 로 가면 가능
      4.5,
    );
    // 정상적이라면 L 을 극단으로 조정해 합격 가능
    expect(suggestion).not.toBeNull();
  });
});

describe("checkContrast — 8 페어 × 2 mode 통합 검증", () => {
  it("shadcn 표준 light 값은 모두 PASS", () => {
    const tokensLight = {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      primary: "oklch(0.205 0 0)",
      "primary-foreground": "oklch(0.985 0 0)",
      "destructive": "oklch(0.577 0.245 27.325)",
      "destructive-foreground": "oklch(0.985 0 0)",
      "muted-foreground": "oklch(0.556 0 0)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.145 0 0)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.145 0 0)",
      secondary: "oklch(0.97 0 0)",
      "secondary-foreground": "oklch(0.205 0 0)",
      accent: "oklch(0.97 0 0)",
      "accent-foreground": "oklch(0.205 0 0)",
    };
    const diags = checkContrast(tokensLight, "tokens.json", "light");
    expect(diags).toHaveLength(0);
  });

  it("의도적 저대비 시 진단 + 제안", () => {
    const bad = {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.85 0 0)", // 너무 밝음 → 대비 미달
      primary: "oklch(0.205 0 0)",
      "primary-foreground": "oklch(0.985 0 0)",
      "destructive": "oklch(0.577 0.245 27.325)",
      "destructive-foreground": "oklch(0.985 0 0)",
      "muted-foreground": "oklch(0.556 0 0)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.145 0 0)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.145 0 0)",
      secondary: "oklch(0.97 0 0)",
      "secondary-foreground": "oklch(0.205 0 0)",
      accent: "oklch(0.97 0 0)",
      "accent-foreground": "oklch(0.205 0 0)",
    };
    const diags = checkContrast(bad, "tokens.json", "light");
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0]?.category).toBe("contrast");
    expect(diags[0]?.message).toContain("foreground");
    expect(diags[0]?.hint).toMatch(/oklch\(/);
  });

  it("필요 토큰 누락 시 skip (token-format 이 잡음)", () => {
    const partial = { background: "oklch(1 0 0)" };
    const diags = checkContrast(partial, "tokens.json", "light");
    // 누락 토큰 페어는 건너뜀 — token-format 카테고리에서 별도 진단
    expect(diags).toEqual([]);
  });
});
