import { describe, it, expect } from "vitest";
import { checkTokenFormat } from "../../doctor/check-token-format";

describe("checkTokenFormat — DTCG strict + shadcn 24 토큰 잠금", () => {
  it("올바른 DTCG 토큰은 진단 없음", () => {
    const tokens = {
      color: {
        background: {
          $type: "color",
          $value: { light: "oklch(1 0 0)", dark: "oklch(0.145 0 0)" },
        },
        foreground: {
          $type: "color",
          $value: { light: "oklch(0.145 0 0)", dark: "oklch(0.985 0 0)" },
        },
      },
    };
    const diags = checkTokenFormat(tokens, "tokens.json", ["background", "foreground"]);
    expect(diags).toHaveLength(0);
  });

  it("$value 누락 시 token-format error", () => {
    const tokens = {
      color: {
        background: { $type: "color" }, // $value 누락
      },
    };
    const diags = checkTokenFormat(tokens, "tokens.json", ["background"]);
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0]?.category).toBe("token-format");
    expect(diags[0]?.severity).toBe("error");
    expect(diags[0]?.message).toContain("$value");
  });

  it("$type 누락 시 token-format error", () => {
    const tokens = {
      color: {
        background: { $value: { light: "oklch(1 0 0)", dark: "oklch(0 0 0)" } },
      },
    };
    const diags = checkTokenFormat(tokens, "tokens.json", ["background"]);
    expect(diags.some((d) => d.message.includes("$type"))).toBe(true);
  });

  it("light 또는 dark 한쪽만 정의 시 진단", () => {
    const tokens = {
      color: {
        primary: {
          $type: "color",
          $value: { light: "oklch(0.5 0 0)" }, // dark 누락
        },
      },
    };
    const diags = checkTokenFormat(tokens, "tokens.json", ["primary"]);
    expect(diags.some((d) => d.message.includes("dark"))).toBe(true);
  });

  it("shadcn 표준 토큰 누락 시 진단 (24 토큰 잠금)", () => {
    const tokens = {
      color: {
        background: {
          $type: "color",
          $value: { light: "oklch(1 0 0)", dark: "oklch(0.145 0 0)" },
        },
        // primary 등 23개 누락
      },
    };
    // shadcn 표준 토큰을 요청
    const required = ["background", "foreground", "primary", "primary-foreground"];
    const diags = checkTokenFormat(tokens, "tokens.json", required);
    expect(diags.some((d) => d.message.includes("--primary"))).toBe(true);
  });

  it("최상위가 객체가 아니면 진단 + 조기 종료", () => {
    const diags = checkTokenFormat("invalid" as unknown, "tokens.json", ["background"]);
    expect(diags.length).toBe(1);
    expect(diags[0]?.message).toContain("최상위가 객체");
  });

  it("한국어 메시지 + hint 포함", () => {
    const tokens = { color: { background: { $type: "color" } } };
    const diags = checkTokenFormat(tokens, "tokens.json", ["background"]);
    expect(diags[0]?.hint).toBeDefined();
    expect(diags[0]?.hint).toMatch(/→/);
  });
});
