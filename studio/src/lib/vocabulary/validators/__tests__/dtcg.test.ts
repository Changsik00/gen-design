import { describe, it, expect } from "vitest";
import { validateDtcg } from "../dtcg";

describe("validateDtcg — 유효 케이스", () => {
  it("간단한 leaf (color $value + $type)", () => {
    const result = validateDtcg({
      primary: { $value: "#6366F1", $type: "color" },
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.unresolvedReferences).toEqual([]);
  });

  it("$type 그룹 상속 + 다중 leaf", () => {
    const result = validateDtcg({
      colors: {
        $type: "color",
        primary: { $value: "#6366F1" },
        secondary: { $value: "#F1F5F9" },
      },
    });
    expect(result.valid).toBe(true);
  });

  it("참조 해소 가능 (`{primitive.indigo.500}`)", () => {
    const result = validateDtcg({
      primitive: {
        indigo: {
          "500": { $value: "#6366F1", $type: "color" },
        },
      },
      semantic: {
        primary: { $value: "{primitive.indigo.500}", $type: "color" },
      },
    });
    expect(result.valid).toBe(true);
    expect(result.unresolvedReferences).toEqual([]);
  });

  it("$description 메타 보존", () => {
    const result = validateDtcg({
      brandPrimary: {
        $value: "#6366F1",
        $type: "color",
        $description: "Brand A primary — used for CTA backgrounds",
      },
    });
    expect(result.valid).toBe(true);
  });
});

describe("validateDtcg — 무효 케이스", () => {
  it("$type enum 외 값 → invalid", () => {
    const result = validateDtcg({
      primary: { $value: "x", $type: "unknown-type" },
    });
    expect(result.valid).toBe(false);
  });

  it("leaf 안에 사용자 키 (additionalProperties false 위반) → invalid", () => {
    const result = validateDtcg({
      primary: { $value: "#FF0000", $type: "color", customField: "x" },
    });
    expect(result.valid).toBe(false);
  });

  it("dangling reference → unresolvedReferences 보고 + invalid", () => {
    const result = validateDtcg({
      semantic: {
        primary: { $value: "{primitive.unknown.999}", $type: "color" },
      },
    });
    expect(result.valid).toBe(false);
    expect(result.unresolvedReferences.length).toBeGreaterThan(0);
    expect(result.unresolvedReferences[0]).toContain("primitive.unknown.999");
  });

  it("DTCG 외 키 (additional property, non-$ prefix) 는 그룹 또는 leaf 어느 한쪽으로 해석 — 둘 다 안 맞으면 invalid", () => {
    const result = validateDtcg({
      something: "not an object",
    });
    expect(result.valid).toBe(false);
  });
});
