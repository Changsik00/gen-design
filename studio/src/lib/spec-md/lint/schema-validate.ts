/**
 * spec-schema.json (spec-7-01) 기반 ajv 검증.
 *
 * 본 단계는 *raw 색상 거부* + *구조 무결성* 검증에 특화.
 * 정밀한 컴포넌트 어휘 + axis enum 검증은 catalog-check 에서 친화적 메시지로 수행.
 */

import Ajv2020 from "ajv";
import draft7Meta from "ajv/dist/refs/json-schema-draft-07.json";
import type { ErrorObject } from "ajv";
import type {
  Document,
  Block,
  ComponentInstance,
  ParseError,
} from "../parser/ast-types";

export interface SchemaValidateOptions {
  /** spec-7-01 의 spec-schema.json 객체. */
  schema: object;
}

export interface SchemaValidateResult {
  errors: ParseError[];
}

const ajvInstance = new Ajv2020({ allErrors: true, strict: false });
if (!ajvInstance.getSchema("http://json-schema.org/draft-07/schema")) {
  ajvInstance.addMetaSchema(draft7Meta);
}

let cachedValidator: ((value: unknown) => boolean) | null = null;
let cachedSchemaRef: object | null = null;

export function validateAgainstSchema(
  ast: Document,
  options: SchemaValidateOptions,
): SchemaValidateResult {
  const validator =
    cachedSchemaRef === options.schema && cachedValidator
      ? cachedValidator
      : (cachedValidator = ajvInstance.compile(options.schema));
  cachedSchemaRef = options.schema;

  const errors: ParseError[] = [];
  walk(ast.body, validator as unknown as { (v: unknown): boolean; errors?: ErrorObject[] | null }, errors);
  return { errors };
}

interface ValidatorFn {
  (v: unknown): boolean;
  errors?: ErrorObject[] | null;
}

function walk(blocks: Block[], validator: ValidatorFn, errors: ParseError[]): void {
  for (const b of blocks) {
    if (b.type !== "ComponentInstance") continue;
    const stripped = strip(b);
    const ok = validator(stripped);
    if (!ok && validator.errors) {
      for (const ajvErr of validator.errors) {
        errors.push({
          message: `${b.name}${ajvErr.instancePath || ""}: ${ajvErr.message ?? "schema error"}`,
          location: b.location,
          stage: "schema",
        });
      }
    }
    walk(b.children, validator, errors);
  }
}

/**
 * AST 의 ComponentInstance 를 schema-friendly 형태로 변환.
 *
 * - location 제거 (schema 외 메타)
 * - children: ComponentInstance 만 남김 (text/comment/placeholder 는 schema 모름)
 * - props: Placeholder 객체는 string 으로 (schema 가 단순 값 형식만 검증)
 */
function strip(c: ComponentInstance): object {
  const out: Record<string, unknown> = { name: c.name };
  if (c.theme !== undefined) out.theme = c.theme;
  if (c.tokens) out.tokens = c.tokens;
  out.props = stripProps(c.props);
  out.children = c.children
    .filter((x) => x.type === "ComponentInstance")
    .map((x) => strip(x as ComponentInstance));
  return out;
}

function stripProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v !== null && typeof v === "object" && "type" in v && (v as { type: string }).type === "Placeholder") {
      // Placeholder → token/i18n 참조 문자열로 representation
      const ph = v as { kind: string; path: string };
      out[k] = `{{${ph.kind}.${ph.path}}}`;
    } else {
      out[k] = v;
    }
  }
  return out;
}
