/**
 * full-Document emit — chat.md 4-layer (frontmatter + title + 3 sections) → 텍스트.
 *
 * 기존 `emit()` 은 body 만. inferChatDiff 의 결과 (병합된 Document) 를
 * 디스크 / stdout 으로 serialize 하려면 본 함수가 필수.
 *
 * 결정성: 같은 Document → 같은 텍스트. round-trip parse(emit(doc)) 의 핵심 영역
 * (frontmatter / title / narrative / history) 보존.
 */

import { emit } from "./emit";
import type { ChatFrontmatter, Document } from "../chat-md/parser/ast-types";

export function emitDocument(doc: Document): string {
  const parts: string[] = [];

  if (doc.frontmatter) {
    parts.push(emitFrontmatter(doc.frontmatter));
  }

  if (doc.title) {
    parts.push(`# ${doc.title}\n`);
  }

  if (doc.narrative) {
    parts.push(`## 💬 Narrative\n\n${doc.narrative.markdown.trim()}\n`);
  }

  if (doc.structure) {
    const inner = emit({
      ...doc,
      body: doc.structure.body,
      frontmatter: null,
      title: null,
      narrative: null,
      structure: null,
      history: null,
    }).trim();
    parts.push(`## 🧩 Structure\n\n\`\`\`jsx\n${inner}\n\`\`\`\n`);
  } else if (!doc.frontmatter && (doc.body?.length ?? 0) > 0) {
    // legacy mode — frontmatter 없고 sections 없으면 body 직접 emit
    parts.push(emit(doc));
  }

  if (doc.history) {
    parts.push(`## 📜 History\n\n${doc.history.markdown.trim()}\n`);
  }

  return parts.join("\n");
}

function emitFrontmatter(fm: ChatFrontmatter): string {
  const lines: string[] = ["---"];
  for (const [key, value] of Object.entries(fm)) {
    if (value === undefined) continue;
    emitFmField(lines, key, value, 0);
  }
  lines.push("---", "");
  return lines.join("\n");
}

function emitFmField(lines: string[], key: string, value: unknown, indent: number): void {
  const pad = "  ".repeat(indent);
  if (value === null) {
    lines.push(`${pad}${key}: null`);
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push(`${pad}${key}: []`);
    } else if (value.every((v) => typeof v !== "object" || v === null)) {
      // 스칼라 array — 인라인 또는 block sequence
      if (shouldUseBlockSequence(key, value)) {
        lines.push(`${pad}${key}:`);
        for (const item of value) {
          lines.push(`${pad}  - ${formatScalar(item)}`);
        }
      } else {
        lines.push(`${pad}${key}: [${value.map((v) => formatInlineItem(v)).join(", ")}]`);
      }
    } else {
      // 객체 array — block sequence
      lines.push(`${pad}${key}:`);
      for (const item of value) {
        lines.push(`${pad}  - ${formatScalar(item)}`);
      }
    }
  } else if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
    if (entries.length === 0) {
      lines.push(`${pad}${key}: {}`);
    } else {
      lines.push(`${pad}${key}:`);
      for (const [k, v] of entries) emitFmField(lines, k, v, indent + 1);
    }
  } else {
    lines.push(`${pad}${key}: ${formatScalar(value)}`);
  }
}

function shouldUseBlockSequence(key: string, _values: unknown[]): boolean {
  // references / paths 같은 긴 경로 list 는 block sequence 가 가독성 좋음.
  return key === "references";
}

function formatScalar(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  const s = String(value);
  if (needsQuotes(s)) return JSON.stringify(s);
  return s;
}

function formatInlineItem(value: unknown): string {
  if (typeof value === "string" && !needsQuotes(value) && !value.includes(",")) {
    return value;
  }
  return formatScalar(value);
}

function needsQuotes(s: string): boolean {
  // 특수 문자 / 공백 시작 / YAML 예약어 → 따옴표
  if (s === "" || /^\s|\s$/.test(s)) return true;
  if (/^(true|false|null|yes|no)$/i.test(s)) return true;
  if (/^-?\d/.test(s)) return /[a-zA-Z]/.test(s) ? false : /^-?\d+(\.\d+)?$/.test(s);
  if (/[:{}[\],&*#?|<>=!%@\\]/.test(s)) return true;
  return false;
}
