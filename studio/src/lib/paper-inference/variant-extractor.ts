/**
 * 레이어 명명 컨벤션: (D) dot syntax
 *
 * 형식: `ComponentName.axisValue1.axisValue2`
 * 예시: `Button.primary.lg`  → component="Button", axes={ variant:"primary", size:"lg" }
 *
 * 규칙:
 * - 첫 세그먼트 (PascalCase) = 컴포넌트 이름
 * - 이후 세그먼트 = axis 값 (순서대로 catalog axes 에 매핑)
 * - catalog 의 axis 수보다 많으면 나머지는 `extra_{i}` key 에 보관
 * - dot 이 없으면 component 이름만 (axes 없음)
 *
 * ADR-007 §5 결정 — 실 컨벤션 채택.
 */

export interface VariantExtractionResult {
  component: string;
  /** axis name → value 맵 */
  axes: Record<string, string>;
}

export interface CatalogAxisDef {
  name: string;
  values: string[];
}

/**
 * 레이어 이름을 dot syntax 로 파싱.
 *
 * @param layerName  Paper 레이어 이름 (예: "Button.primary.lg")
 * @param catalogAxes  컴포넌트의 axis 정의 목록 (순서 중요). 없으면 빈 배열.
 */
export function extractVariant(
  layerName: string,
  catalogAxes: CatalogAxisDef[],
): VariantExtractionResult {
  const segments = layerName.split(".");
  const component = segments[0] ?? "";
  const valueSegments = segments.slice(1);

  const axes: Record<string, string> = {};

  for (let i = 0; i < valueSegments.length; i++) {
    const value = valueSegments[i];
    const axisName = i < catalogAxes.length ? catalogAxes[i].name : `extra_${i}`;
    axes[axisName] = value;
  }

  return { component, axes };
}
