/**
 * spec.md 컴포넌트 인스턴스 검증을 위한 JSON Schema 자동 생성기.
 *
 * 카탈로그 (3-tier) 를 입력으로, *spec-7-02 grammar* 의 lint ground 를 출력.
 *
 * 생성 schema 는 다음을 강제:
 * - 컴포넌트 이름은 등록된 카탈로그 enum 만
 * - 각 컴포넌트의 axis (variant/size/tone 등) 값은 해당 컴포넌트 cva enum 만
 * - tokens prop 의 값은 `{{token.xxx}}` / `{{i18n.xxx}}` 참조 형식만
 * - raw 색상값 (`#FF0000`, `rgb(...)`, `oklch(...)` 등) 거부
 *
 * ADR-004 D-3 (4 layer variant) + D-4 (raw 값 금지 lint) 의 schema 차원 강제.
 */

import type { VocabularyCatalog } from "./index";
import type { ExtractedComponent } from "../extractor";

// JSON Schema 의 가벼운 타입 정의 (ajv-friendly).
export type JsonSchema = Record<string, unknown>;

const TOKEN_REF_PATTERN = "^\\{\\{(token|i18n)\\.[A-Za-z0-9._-]+\\}\\}$";

// 색상 / 인라인 raw 값 패턴 — *거부* 대상.
const RAW_COLOR_PATTERN =
  "^(#[0-9a-fA-F]{3,8}|rgb\\(|rgba\\(|hsl\\(|hsla\\(|oklch\\(|oklab\\(|color\\()";

/**
 * spec.md 의 컴포넌트 인스턴스 객체를 검증하는 JSON Schema 를 생성한다.
 *
 * 검증 대상 객체 형태 (parser 산출 가정):
 * ```json
 * {
 *   "name": "Button",
 *   "props": { "variant": "primary", "size": "lg" },
 *   "tokens": { "--primary": "{{token.semantic.brand-2}}" },
 *   "theme": "brand-a",
 *   "children": [...]
 * }
 * ```
 */
export function generateSpecSchema(catalog: VocabularyCatalog): JsonSchema {
  const allComponents: ExtractedComponent[] = [
    ...catalog.tiers.tier2Shadcn.components,
    ...catalog.tiers.tier3Project.composites,
    ...catalog.tiers.tier3Project.templates,
  ];

  const componentSchemas: JsonSchema[] = allComponents.map(
    componentToInstanceSchema,
  );

  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://design-project.local/schemas/spec-instance.json",
    title: "spec.md ComponentInstance",
    description:
      "AUTO-GENERATED — spec-7-02 grammar 의 lint ground. ADR-004 D-3, D-4 강제.",
    definitions: {
      tokenReference: {
        type: "string",
        pattern: TOKEN_REF_PATTERN,
        description: "Only token / i18n references allowed in token override values.",
      },
      stringNoRawColor: {
        type: "string",
        not: { pattern: RAW_COLOR_PATTERN },
        description: "Raw color literals (hex, rgb, hsl, oklch, ...) forbidden.",
      },
      ComponentInstance: {
        oneOf: componentSchemas,
      },
    },
    $ref: "#/definitions/ComponentInstance",
  };
}

/** 단일 컴포넌트의 인스턴스 schema. */
function componentToInstanceSchema(c: ExtractedComponent): JsonSchema {
  const propsSchema: JsonSchema = {
    type: "object",
    properties: axesToPropertyMap(c),
    additionalProperties: {
      // axis 외 props 는 raw 색상 금지 string 또는 number/boolean
      anyOf: [
        { $ref: "#/definitions/stringNoRawColor" },
        { type: "number" },
        { type: "boolean" },
        { type: "object" },
        { type: "array" },
      ],
    },
  };

  return {
    type: "object",
    required: ["name"],
    properties: {
      name: { const: c.name, description: c.ariaRole ? `ARIA role: ${c.ariaRole}` : undefined },
      props: propsSchema,
      tokens: {
        // L4 인라인 토큰 override — 모든 값이 token reference 만
        type: "object",
        additionalProperties: { $ref: "#/definitions/tokenReference" },
      },
      theme: { type: "string", description: "Theme context name (brand-a / brand-b / ...)" },
      children: {
        type: "array",
        items: { $ref: "#/definitions/ComponentInstance" },
      },
    },
    additionalProperties: false,
  };
}

/** axes 를 properties 객체로 변환 (axis name → enum). */
function axesToPropertyMap(c: ExtractedComponent): Record<string, JsonSchema> {
  const map: Record<string, JsonSchema> = {};
  for (const axis of c.axes) {
    map[axis.name] = {
      enum: axis.values,
      description: `cva axis. defaults: ${c.defaultVariants[axis.name] ?? "(none)"}`,
    };
  }
  return map;
}
