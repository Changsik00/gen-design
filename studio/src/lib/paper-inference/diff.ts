/**
 * inferChatDiff — 기존 chat + 새 Paper tree → 변경분만 적용한 chat.
 *
 * 핵심 불변:
 * - Narrative / History / frontmatter / title 은 *그대로 복사* (디자이너 자연어 의도 보호)
 * - Structure 만 inferChat 결과로 *교체*
 * - 변경 0 시 History 라인 추가 X (git diff 깔끔)
 *
 * ADR-010 D-3 호응 — 본 함수는 *결과만* 생성. 실제 쓰기 결정은 호출자 (gen-design diff).
 */

import { parse } from "../chat-md/parser";
import { inferChat } from "./infer";
import { emitDocument } from "./emit-document";
import type { CatalogMap } from "./ast-builder";
import type { PaperTreeNode } from "./tree-types";
import type { Block, ComponentInstance, Document } from "../chat-md/parser/ast-types";

export interface DiffOptions {
  catalog: CatalogMap;
  /** History 라인 자동 추가 — 기본 true. */
  appendHistory?: boolean;
  /** History 라인의 날짜 (테스트 결정성). 기본 today. */
  date?: string;
  /** inferChat 의 confident threshold. 기본 0.8. */
  threshold?: number;
}

export interface DiffStats {
  textChanges: number;
  variantChanges: number;
  added: number;
  removed: number;
}

export interface DiffResult {
  /** 합쳐진 새 chat.md 텍스트 */
  text: string;
  stats: DiffStats;
  /** 자동 추가된 History 라인 (appendHistory=true 이고 변경 있을 때만). */
  historyLineAdded?: string;
  preserved: { frontmatter: boolean; narrative: boolean; history: boolean };
}

export function inferChatDiff(
  existingChatText: string,
  newTree: PaperTreeNode,
  options: DiffOptions,
): DiffResult {
  const old = parse(existingChatText, { skipSchema: true });
  if (!old.ok || !old.ast) {
    throw new Error("Failed to parse existing chat.md");
  }
  const oldDoc = old.ast;

  const newResult = inferChat(newTree, options.catalog, {
    confidentThreshold: options.threshold ?? 0.8,
  });
  const newDoc = newResult.ast;

  const oldStructureBody = oldDoc.structure?.body ?? oldDoc.body ?? [];
  const newStructureBody = newDoc.structure?.body ?? newDoc.body ?? [];

  const stats = diffStructure(oldStructureBody, newStructureBody);
  const hasChanges = totalChanges(stats) > 0;

  const appendHistory = options.appendHistory ?? true;
  const date = options.date ?? todayISO();

  let historyLineAdded: string | undefined;
  const newHistoryMarkdown: string = (() => {
    const existing = oldDoc.history?.markdown ?? "";
    if (!appendHistory || !hasChanges) return existing;
    historyLineAdded = formatHistoryLine(date, stats);
    return existing.trim().length > 0
      ? `${existing.trimEnd()}\n${historyLineAdded}`
      : historyLineAdded;
  })();

  const merged: Document = {
    type: "Document",
    frontmatter: oldDoc.frontmatter ?? null,
    title: oldDoc.title ?? null,
    narrative: oldDoc.narrative ?? null,
    structure: {
      type: "Structure",
      body: newStructureBody,
      location: oldDoc.structure?.location ?? { line: 0, col: 0, offset: 0, length: 0 },
    },
    history: oldDoc.history || historyLineAdded
      ? {
          type: "History",
          markdown: newHistoryMarkdown,
          location: oldDoc.history?.location ?? { line: 0, col: 0, offset: 0, length: 0 },
        }
      : null,
    body: newStructureBody,
  };

  const text = emitDocument(merged);

  return {
    text,
    stats,
    historyLineAdded,
    preserved: {
      frontmatter: oldDoc.frontmatter !== null && merged.frontmatter === oldDoc.frontmatter,
      narrative: oldDoc.narrative !== null
        ? merged.narrative?.markdown === oldDoc.narrative.markdown
        : true,
      history: oldDoc.history !== null
        ? newHistoryMarkdown.includes(oldDoc.history.markdown.trim())
        : true,
    },
  };
}

function diffStructure(oldBody: Block[], newBody: Block[]): DiffStats {
  const oldComps = oldBody.filter((b): b is ComponentInstance => b.type === "ComponentInstance");
  const newComps = newBody.filter((b): b is ComponentInstance => b.type === "ComponentInstance");

  const stats: DiffStats = { textChanges: 0, variantChanges: 0, added: 0, removed: 0 };

  const oldByName = groupBy(oldComps, (c) => c.name);
  const newByName = groupBy(newComps, (c) => c.name);

  const allNames = new Set([...oldByName.keys(), ...newByName.keys()]);
  for (const name of allNames) {
    const oldList = oldByName.get(name) ?? [];
    const newList = newByName.get(name) ?? [];
    if (oldList.length === 0) {
      stats.added += newList.length;
      continue;
    }
    if (newList.length === 0) {
      stats.removed += oldList.length;
      continue;
    }
    // pair up — for simplicity, compare index-by-index
    const pairs = Math.min(oldList.length, newList.length);
    for (let i = 0; i < pairs; i++) {
      const o = oldList[i];
      const n = newList[i];
      if (!sameProps(o.props, n.props)) {
        stats.variantChanges += 1;
      } else if (!sameTextChildren(o.children, n.children)) {
        stats.textChanges += 1;
      }
    }
    if (newList.length > pairs) stats.added += newList.length - pairs;
    if (oldList.length > pairs) stats.removed += oldList.length - pairs;
  }

  return stats;
}

function groupBy<T, K>(items: T[], keyFn: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return map;
}

function sameProps(a: ComponentInstance["props"], b: ComponentInstance["props"]): boolean {
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();
  if (ak.length !== bk.length) return false;
  if (ak.some((k, i) => k !== bk[i])) return false;
  return ak.every((k) => JSON.stringify(a[k]) === JSON.stringify(b[k]));
}

function sameTextChildren(a: Block[], b: Block[]): boolean {
  const aText = a
    .filter((b) => b.type === "MarkdownText" || b.type === "Placeholder")
    .map((b) => ("text" in b ? b.text : JSON.stringify(b)))
    .join("");
  const bText = b
    .filter((b) => b.type === "MarkdownText" || b.type === "Placeholder")
    .map((b) => ("text" in b ? b.text : JSON.stringify(b)))
    .join("");
  return aText === bText;
}

function totalChanges(stats: DiffStats): number {
  return stats.textChanges + stats.variantChanges + stats.added + stats.removed;
}

function formatHistoryLine(date: string, stats: DiffStats): string {
  return `- **${date}** Paper sync — texts ${stats.textChanges}, variants ${stats.variantChanges}, +${stats.added} / -${stats.removed}`;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
