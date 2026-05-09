import { describe, it, expect } from "vitest";
import { tokensToPaperPayloads } from "../converter";
import type { ResolvedTokens } from "../types";

describe("tokensToPaperPayloads", () => {
  it("CSS 변수 레코드 → 노드 패턴 + styles 페이로드 배열", () => {
    const resolved: ResolvedTokens = {
      "--primary": "#6366F1",
      "--background": "#FFFFFF",
    };
    const payloads = tokensToPaperPayloads(resolved);
    expect(payloads).toHaveLength(2);
    expect(payloads).toContainEqual({
      nodePattern: "primary",
      styles: { fill: "#6366F1" },
    });
    expect(payloads).toContainEqual({
      nodePattern: "background",
      styles: { fill: "#FFFFFF" },
    });
  });

  it("빈 레코드는 빈 배열", () => {
    expect(tokensToPaperPayloads({})).toEqual([]);
  });

  it("CSS 변수 prefix `--` 없는 키도 nodePattern 으로 변환", () => {
    const payloads = tokensToPaperPayloads({ "--accent-foreground": "#4338CA" });
    expect(payloads).toContainEqual({
      nodePattern: "accent-foreground",
      styles: { fill: "#4338CA" },
    });
  });
});
