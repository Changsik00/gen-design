/**
 * shadcn registry-item.json 검증기.
 *
 * 본 프로젝트의 React 컴파일 출력 (spec-7-04) 이 그대로 외부 codebase 에
 * `npx shadcn@latest add` 로 install 가능한 형식인지 검증한다.
 *
 * 공개 schema: https://ui.shadcn.com/schema/registry-item.json (정적 보존)
 * ADR-004 D-6 — 컴파일러 출력 = registry-item.json 형식 그대로.
 */

import Ajv from "ajv";
import addFormats from "ajv-formats";
import draft7Meta from "ajv/dist/refs/json-schema-draft-07.json";
import schema from "./schemas/shadcn-registry-item.json";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
if (!ajv.getSchema(draft7Meta.$id ?? "http://json-schema.org/draft-07/schema#")) {
  ajv.addMetaSchema(draft7Meta);
}

const validate = ajv.compile(schema);

export interface ShadcnRegistryItem {
  name: string;
  type: string;
  description?: string;
  title?: string;
  author?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: Array<{ path: string; type: string; content?: string; target?: string }>;
  tailwind?: unknown;
  cssVars?: Record<string, Record<string, string>>;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** registry-item.json 객체 검증. 유효성 + 에러 메시지 반환. */
export function validateShadcnRegistryItem(item: unknown): ValidationResult {
  const isValid = validate(item);
  if (isValid) {
    return { valid: true, errors: [] };
  }
  const errors = (validate.errors ?? []).map(
    (e) => `${e.instancePath || "(root)"} ${e.message ?? "invalid"}`,
  );
  return { valid: false, errors };
}
