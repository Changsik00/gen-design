/**
 * Catalog 어휘 + axis enum 검증.
 *
 * 입력: spec.md AST + VocabularyCatalog
 * 검증:
 *   1. 모든 ComponentInstance.name 이 catalog (Tier 2 + Tier 3) 에 등록됨
 *   2. props 의 axis name 별 value 가 catalog 의 axes[*].values enum 에 포함됨
 *   3. tokens 의 값은 `{{token.path}}` 형식만 (raw 값 금지)
 *
 * stage: "catalog" / "axis"
 */

import type {
  Document,
  Block,
  ComponentInstance,
  ParseError,
  Placeholder,
  AttrValue,
} from "../parser/ast-types";
import type {
  VocabularyCatalog,
  ExtractedComponent,
} from "../../vocabulary/catalog";
import { buildLookup } from "../../vocabulary/catalog";

export interface CatalogCheckResult {
  errors: ParseError[];
}

export function checkCatalog(
  ast: Document,
  catalog: VocabularyCatalog,
): CatalogCheckResult {
  const lookup = buildLookup(catalog);
  const errors: ParseError[] = [];
  walk(ast.body, lookup, errors);
  return { errors };
}

function walk(
  blocks: Block[],
  lookup: Map<string, ExtractedComponent>,
  errors: ParseError[],
): void {
  for (const b of blocks) {
    if (b.type === "ComponentInstance") {
      checkComponent(b, lookup, errors);
      walk(b.children, lookup, errors);
    }
  }
}

function checkComponent(
  c: ComponentInstance,
  lookup: Map<string, ExtractedComponent>,
  errors: ParseError[],
): void {
  const meta = lookup.get(c.name);
  if (!meta) {
    errors.push({
      message: `Unknown component: <${c.name}>`,
      location: c.location,
      stage: "catalog",
      suggestion: suggestComponent(c.name, lookup),
    });
    return;
  }

  // Axis enum 검증
  for (const axis of meta.axes) {
    const value = c.props[axis.name];
    if (value === undefined) continue;
    // placeholder 값은 catalog 검증 skip (런타임에서 결정)
    if (isPlaceholder(value)) continue;
    if (typeof value !== "string") continue;
    if (!axis.values.includes(value)) {
      errors.push({
        message: `Invalid axis value: ${axis.name}="${value}" (allowed: ${axis.values.join(", ")})`,
        location: c.location,
        stage: "axis",
      });
    }
  }

  // tokens 의 값은 token reference 형식만
  if (c.tokens) {
    for (const [k, v] of Object.entries(c.tokens)) {
      if (!isTokenReferenceString(v)) {
        errors.push({
          message: `Invalid token reference for tokens["${k}"]: must be {{token.path}} (got: ${JSON.stringify(v)})`,
          location: c.location,
          stage: "catalog",
        });
      }
    }
  }
}

function isPlaceholder(v: AttrValue): v is Placeholder {
  return (
    v !== null &&
    typeof v === "object" &&
    "type" in v &&
    (v as { type: string }).type === "Placeholder"
  );
}

function isTokenReferenceString(v: unknown): boolean {
  return typeof v === "string" && /^\{\{token\.[A-Za-z0-9._-]+\}\}$/.test(v);
}

function suggestComponent(
  name: string,
  lookup: Map<string, ExtractedComponent>,
): string | undefined {
  // 가장 단순한 fuzzy: 같은 첫 글자 중 길이 차 ≤ 2 짜리 첫 후보
  const candidates = [...lookup.keys()].filter(
    (n) =>
      n[0] === name[0] &&
      Math.abs(n.length - name.length) <= 2 &&
      n.toLowerCase().includes(name.toLowerCase().slice(0, 3)),
  );
  if (candidates.length === 0) return undefined;
  return `<${candidates[0]}> ?`;
}
