/**
 * gd order — .order.md 파일 파서 + TSX 코드 생성.
 *
 * .order.md 포맷 (YAML frontmatter):
 * ```yaml
 * ---
 * scene: login
 * validation:
 *   email:
 *     - required
 *     - email
 *   password:
 *     - required
 *     - min(8)
 * actions:
 *   submit:
 *     type: form-submit
 *     target: POST /auth/login
 *   signup-link:
 *     type: nav
 *     target: /signup
 * data:
 *   - queryKey: tasks.list
 *     endpoint: GET /tasks
 * ---
 * ```
 */

import { existsSync, readFileSync } from "node:fs";
import { load } from "js-yaml";

export type ZodRuleKind = "required" | "email" | "min" | "max" | "url" | "oneOf";

export interface ZodRule {
  kind: ZodRuleKind;
  arg?: string | number;
}

export type ActionType = "form-submit" | "nav" | "modal" | "mutation";

export interface ActionSpec {
  type: ActionType;
  target: string;
}

export interface DataSpec {
  queryKey: string;
  endpoint: string;
}

export interface OrderSpec {
  scene: string;
  validation?: Record<string, ZodRule[]>;
  actions?: Record<string, ActionSpec>;
  data?: DataSpec[];
}

export interface OrderTsxChunks {
  /** zod / useForm / zodResolver import 줄 */
  imports: string;
  /** const schema = z.object({...}) */
  schemaDecl: string;
  /** const form = useForm<z.infer<typeof schema>>({...}) */
  formInit: string;
  /** async onSubmit(values: z.infer<typeof schema>) { fetch(...) } */
  onSubmit: string;
}

const KNOWN_RULE_KINDS: ZodRuleKind[] = ["required", "email", "min", "max", "url", "oneOf"];
const KNOWN_ACTION_TYPES: ActionType[] = ["form-submit", "nav", "modal", "mutation"];

// ─── YAML frontmatter 추출 ────────────────────────────────────────────────────

function extractFrontmatter(text: string): string | null {
  const match = text.match(/^---\r?\n([\s\S]*?)\n?---(\r?\n|$)/);
  return match ? match[1] : null;
}

// ─── ZodRule 문자열 파싱 ("required" / "email" / "min(8)") ───────────────────

function parseRuleString(rule: string): ZodRule | null {
  const trimmed = rule.trim();
  const minMax = trimmed.match(/^(min|max)\((\d+)\)$/);
  if (minMax) {
    return { kind: minMax[1] as "min" | "max", arg: parseInt(minMax[2], 10) };
  }
  if (KNOWN_RULE_KINDS.includes(trimmed as ZodRuleKind)) {
    return { kind: trimmed as ZodRuleKind };
  }
  return null;
}

// ─── raw YAML 객체 → OrderSpec ────────────────────────────────────────────────

function coerceOrderSpec(raw: unknown): OrderSpec | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const scene = typeof obj["scene"] === "string" ? obj["scene"] : "";

  const validation: Record<string, ZodRule[]> = {};
  if (obj["validation"] && typeof obj["validation"] === "object") {
    for (const [field, rules] of Object.entries(obj["validation"] as Record<string, unknown>)) {
      if (Array.isArray(rules)) {
        validation[field] = rules
          .map((r) => {
            if (typeof r === "string") return parseRuleString(r);
            if (r && typeof r === "object" && "kind" in r) return r as ZodRule;
            return null;
          })
          .filter((r): r is ZodRule => r !== null);
      }
    }
  }

  const actions: Record<string, ActionSpec> = {};
  if (obj["actions"] && typeof obj["actions"] === "object") {
    for (const [id, spec] of Object.entries(obj["actions"] as Record<string, unknown>)) {
      if (spec && typeof spec === "object") {
        const s = spec as Record<string, unknown>;
        if (typeof s["type"] === "string" && typeof s["target"] === "string") {
          actions[id] = { type: s["type"] as ActionType, target: s["target"] };
        }
      }
    }
  }

  const data: DataSpec[] = [];
  if (Array.isArray(obj["data"])) {
    for (const item of obj["data"]) {
      if (item && typeof item === "object") {
        const d = item as Record<string, unknown>;
        if (typeof d["queryKey"] === "string" && typeof d["endpoint"] === "string") {
          data.push({ queryKey: d["queryKey"], endpoint: d["endpoint"] });
        }
      }
    }
  }

  return {
    scene,
    ...(Object.keys(validation).length > 0 && { validation }),
    ...(Object.keys(actions).length > 0 && { actions }),
    ...(data.length > 0 && { data }),
  };
}

// ─── public API ──────────────────────────────────────────────────────────────

/** .order.md 파일을 읽어 OrderSpec 반환. 파일 없으면 null. */
export function parseOrderFile(path: string): OrderSpec | null {
  if (!existsSync(path)) return null;
  const text = readFileSync(path, "utf-8");
  const fm = extractFrontmatter(text);
  if (!fm) return null;
  const raw = load(fm);
  return coerceOrderSpec(raw);
}

/** OrderSpec 의 기본 유효성 검사. 오류 메시지 배열 반환 (비어 있으면 유효). */
export function validateOrderSpec(spec: OrderSpec): string[] {
  const errors: string[] = [];

  if (!spec.scene || spec.scene.trim() === "") {
    errors.push("scene 필드가 비어 있습니다");
  }

  if (spec.validation) {
    for (const [field, rules] of Object.entries(spec.validation)) {
      for (const rule of rules) {
        if (!KNOWN_RULE_KINDS.includes(rule.kind)) {
          errors.push(`validation.${field}: 알 수 없는 규칙 '${rule.kind}'`);
        }
      }
    }
  }

  if (spec.actions) {
    for (const [id, action] of Object.entries(spec.actions)) {
      if (!KNOWN_ACTION_TYPES.includes(action.type)) {
        errors.push(`actions.${id}: 알 수 없는 type '${action.type}'`);
      }
      if (!action.target) {
        errors.push(`actions.${id}: target 이 비어 있습니다`);
      }
    }
  }

  return errors;
}

// ─── TSX 코드 생성 ────────────────────────────────────────────────────────────

function buildZodField(rules: ZodRule[]): string {
  let chain = "z";
  const hasEmail = rules.some((r) => r.kind === "email");
  const hasUrl = rules.some((r) => r.kind === "url");

  if (hasEmail || hasUrl) {
    chain += ".string()";
  } else {
    chain += ".string()";
  }

  for (const rule of rules) {
    switch (rule.kind) {
      case "required":
        chain += ".min(1)";
        break;
      case "email":
        chain += ".email()";
        break;
      case "url":
        chain += ".url()";
        break;
      case "min":
        chain += `.min(${rule.arg})`;
        break;
      case "max":
        chain += `.max(${rule.arg})`;
        break;
      case "oneOf":
        break;
    }
  }

  return chain;
}

function queryKeyToCamel(queryKey: string): string {
  return queryKey.replace(/\./g, "_");
}

function buildQueryHook(dataSpec: DataSpec): string {
  const camel = queryKeyToCamel(dataSpec.queryKey);
  const [, ...pathParts] = dataSpec.endpoint.split(" ");
  const endpoint = pathParts.join(" ");
  return [
    `const { data: ${camel}Data, isPending: ${camel}Pending } = useQuery({`,
    `  queryKey: ['${dataSpec.queryKey}'],`,
    `  queryFn: () => fetch('${endpoint}').then(r => r.json()),`,
    `});`,
  ].join("\n");
}

/** OrderSpec → TSX 코드 청크 생성. */
export function generateOrderTsx(spec: OrderSpec): OrderTsxChunks {
  const hasValidation = spec.validation && Object.keys(spec.validation).length > 0;
  const hasData = spec.data && spec.data.length > 0;
  const submitAction = spec.actions
    ? Object.entries(spec.actions).find(([, a]) => a.type === "form-submit")
    : null;

  if (!hasValidation && !submitAction && !hasData) {
    return { imports: "", schemaDecl: "", formInit: "", onSubmit: "" };
  }

  const importLines: string[] = [];
  if (hasValidation || submitAction) {
    importLines.push(`import { z } from 'zod';`);
    importLines.push(`import { useForm } from 'react-hook-form';`);
    importLines.push(`import { zodResolver } from '@hookform/resolvers/zod';`);
  }
  if (hasData) {
    importLines.push(`import { useQuery } from '@tanstack/react-query';`);
    importLines.push(`import { Skeleton } from '@/components/ui/skeleton';`);
  }
  const imports = importLines.join("\n");

  let schemaDecl = "";
  if (hasValidation) {
    const fields = Object.entries(spec.validation!)
      .map(([name, rules]) => `  ${name}: ${buildZodField(rules)},`)
      .join("\n");
    schemaDecl = `const schema = z.object({\n${fields}\n});`;
  }

  const formInitLines: string[] = [];
  if (hasValidation) {
    formInitLines.push(
      `const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });`,
    );
  }
  if (hasData) {
    for (const d of spec.data!) {
      formInitLines.push(buildQueryHook(d));
    }
  }
  const formInit = formInitLines.join("\n");

  const onSubmitLines: string[] = [];
  if (hasData) {
    for (const d of spec.data!) {
      const camel = queryKeyToCamel(d.queryKey);
      onSubmitLines.push(`if (${camel}Pending) return <Skeleton />;`);
    }
  }
  if (submitAction) {
    const [, action] = submitAction;
    const [method, ...pathParts] = action.target.split(" ");
    const endpoint = pathParts.join(" ");
    onSubmitLines.push(
      ...[
        `async function onSubmit(values: z.infer<typeof schema>) {`,
        `  await fetch('${endpoint}', {`,
        `    method: '${method}',`,
        `    headers: { 'Content-Type': 'application/json' },`,
        `    body: JSON.stringify(values),`,
        `  });`,
        `}`,
      ],
    );
  }
  const onSubmit = onSubmitLines.join("\n");

  return { imports, schemaDecl, formInit, onSubmit };
}
