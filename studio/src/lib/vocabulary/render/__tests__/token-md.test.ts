import { describe, it, expect } from "vitest";
import tokens from "@assets/tokens/tokens.json";
import { renderTokenMd } from "../token-md";

describe("renderTokenMd", () => {
  it("AUTO-GENERATED 마커 + 제목 + 표 헤더 포함", () => {
    const md = renderTokenMd({ tokens });
    expect(md).toContain("AUTO-GENERATED");
    expect(md).toContain("# TOKEN.md");
    expect(md).toContain("| Path | Value | Type | Description |");
  });

  it("주요 토큰 포함 — primitive.indigo.500 = #6366F1", () => {
    const md = renderTokenMd({ tokens });
    expect(md).toContain("primitive.indigo.500");
    expect(md).toContain("#6366F1");
  });

  it("semantic 참조 토큰 표시 — semantic.color.light.primary", () => {
    const md = renderTokenMd({ tokens });
    expect(md).toContain("semantic.color.light.primary");
    expect(md).toContain("{primitive.indigo.500}");
  });

  it("총 토큰 수 표시", () => {
    const md = renderTokenMd({ tokens });
    expect(md).toMatch(/\*\*Total tokens\*\*: \d+/);
  });

  it("결정성 (deterministic) — 같은 입력 → 같은 출력", () => {
    const a = renderTokenMd({ tokens });
    const b = renderTokenMd({ tokens });
    expect(a).toBe(b);
  });
});
