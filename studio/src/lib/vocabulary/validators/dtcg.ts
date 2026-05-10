/**
 * DTCG 1.0 strict 검증기.
 *
 * W3C Design Tokens Community Group format (2025-10 stable). 본 프로젝트의
 * `templates/assets/tokens/tokens.json` 이 표준에 맞는지 검증.
 * ADR-004 D-2 — 외부 호환성 무료 확보를 위한 *공통* 형식.
 *
 * 참조: https://www.designtokens.org/tr/drafts/format/
 */

import Ajv from "ajv";
import addFormats from "ajv-formats";
import draft7Meta from "ajv/dist/refs/json-schema-draft-07.json";
import schema from "./schemas/dtcg-tokens.json";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
if (!ajv.getSchema(draft7Meta.$id ?? "http://json-schema.org/draft-07/schema#")) {
  ajv.addMetaSchema(draft7Meta);
}

const validate = ajv.compile(schema);

const REFERENCE_RE = /^\{[^}]+\}$/;

export interface DtcgValidationResult {
  valid: boolean;
  errors: string[];
  /** 참조 (`{path.to.token}`) 의 dangling check 결과. valid=true 라도 별도 확인. */
  unresolvedReferences: string[];
}

/**
 * DTCG 형식 검증 + 참조 해소 가능성 점검.
 *
 * 단계:
 * 1. JSON Schema (DTCG strict subset) 통과
 * 2. `$value` 가 reference 형태 (`{a.b.c}`) 일 때 실제 가리키는 leaf 가 존재하는지
 */
export function validateDtcg(tokens: unknown): DtcgValidationResult {
  const isValid = validate(tokens);
  const errors = isValid
    ? []
    : (validate.errors ?? []).map(
        (e) => `${e.instancePath || "(root)"} ${e.message ?? "invalid"}`,
      );

  const unresolvedReferences: string[] = [];
  if (isValid && tokens && typeof tokens === "object") {
    walkReferences(tokens as Record<string, unknown>, "", tokens as Record<string, unknown>, unresolvedReferences);
  }

  return {
    valid: isValid && unresolvedReferences.length === 0,
    errors,
    unresolvedReferences,
  };
}

function walkReferences(
  node: Record<string, unknown>,
  path: string,
  root: Record<string, unknown>,
  unresolved: string[],
): void {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const childPath = path ? `${path}.${key}` : key;
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      if ("$value" in obj) {
        const v = obj.$value;
        if (typeof v === "string" && REFERENCE_RE.test(v)) {
          const refPath = v.slice(1, -1);
          if (!resolvePath(root, refPath)) {
            unresolved.push(`${childPath} → ${v}`);
          }
        }
      } else {
        walkReferences(obj, childPath, root, unresolved);
      }
    }
  }
}

function resolvePath(root: Record<string, unknown>, dottedPath: string): boolean {
  const segments = dottedPath.split(".");
  let cursor: unknown = root;
  for (const seg of segments) {
    if (cursor && typeof cursor === "object" && seg in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[seg];
    } else {
      return false;
    }
  }
  return cursor !== undefined && cursor !== null;
}
