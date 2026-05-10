import { describe, it, expect } from "vitest";
import { extractVariant } from "../variant-extractor";
import type { CatalogAxisDef } from "../variant-extractor";

const BUTTON_AXES: CatalogAxisDef[] = [
  { name: "variant", values: ["primary", "secondary", "ghost"] },
  { name: "size", values: ["sm", "md", "lg"] },
];

const NO_AXES: CatalogAxisDef[] = [];

describe("extractVariant — dot syntax 레이어명 파싱", () => {
  it("단일 axis — Button.primary", () => {
    const result = extractVariant("Button.primary", BUTTON_AXES);
    expect(result.component).toBe("Button");
    expect(result.axes).toEqual({ variant: "primary" });
  });

  it("multi-axis — Button.primary.lg", () => {
    const result = extractVariant("Button.primary.lg", BUTTON_AXES);
    expect(result.component).toBe("Button");
    expect(result.axes).toEqual({ variant: "primary", size: "lg" });
  });

  it("미등록 axis — 초과 세그먼트는 extra_N 키로 보관", () => {
    const result = extractVariant("Button.primary.lg.outline", BUTTON_AXES);
    expect(result.component).toBe("Button");
    expect(result.axes).toEqual({ variant: "primary", size: "lg", extra_2: "outline" });
  });

  it("미등록 value — catalogAxes 에 values 검증 없음 (extractor 는 파싱만)", () => {
    // axis value 검증은 component-matcher 와 통합 단계에서 수행
    const result = extractVariant("Button.unknown-value", BUTTON_AXES);
    expect(result.component).toBe("Button");
    expect(result.axes).toEqual({ variant: "unknown-value" });
  });

  it("컨벤션 위반 — dot 없음 (컴포넌트 이름만)", () => {
    const result = extractVariant("Button", BUTTON_AXES);
    expect(result.component).toBe("Button");
    expect(result.axes).toEqual({});
  });

  it("axes 정의 없는 컴포넌트 + 세그먼트 있음 → extra_N 로 수집", () => {
    const result = extractVariant("Frame.main.center", NO_AXES);
    expect(result.component).toBe("Frame");
    expect(result.axes).toEqual({ extra_0: "main", extra_1: "center" });
  });

  it("빈 컴포넌트 이름 (dot 시작) — 첫 세그먼트 빈 문자열", () => {
    const result = extractVariant(".primary", BUTTON_AXES);
    expect(result.component).toBe("");
    expect(result.axes).toEqual({ variant: "primary" });
  });

  it("다중 dot 연속 — 빈 세그먼트 보존", () => {
    const result = extractVariant("Button..lg", BUTTON_AXES);
    expect(result.component).toBe("Button");
    expect(result.axes).toEqual({ variant: "", size: "lg" });
  });
});
