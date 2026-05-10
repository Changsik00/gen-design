/**
 * tree (Paper) ↔ chat.md 파일 (디스크) 매칭 헬퍼.
 *
 * - tree 안 모든 identity 마커 추출 → expectedPath
 * - chats/ 디렉토리 안 .chat.md 파일 목록 수집
 * - 3 상태 분류:
 *   - match      — 양쪽 다 존재
 *   - tree-only  — tree 에만 (chat 파일 부재)
 *   - chat-only  — chat 파일만 (tree 안 layer 부재)
 *
 * 본 spec 은 *분류만*. 실제 sync 액션 (생성/삭제/갱신) 은 spec-08-06.
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parseIdentity } from "./identity";
import type { IdentityRef } from "./identity";
import type { PaperTreeNode } from "./tree-types";

export type MatchResult =
  | { status: "match"; identity: IdentityRef; chatPath: string }
  | { status: "tree-only"; identity: IdentityRef; expectedPath: string }
  | { status: "chat-only"; chatPath: string };

export function matchPaperToChat(tree: PaperTreeNode, chatRoot: string): MatchResult[] {
  const treeIdentities = collectIdentities(tree);
  const chatFiles = listChatFiles(chatRoot);
  const chatRel = new Set(chatFiles.map((f) => relative(chatRoot, f)));

  const results: MatchResult[] = [];
  const seen = new Set<string>();

  for (const id of treeIdentities) {
    const expectedRel = id.expectedPath.replace(/^chats\//, "");
    seen.add(expectedRel);
    if (chatRel.has(expectedRel)) {
      results.push({ status: "match", identity: id, chatPath: join(chatRoot, expectedRel) });
    } else {
      results.push({ status: "tree-only", identity: id, expectedPath: id.expectedPath });
    }
  }

  for (const rel of chatRel) {
    if (!seen.has(rel)) {
      results.push({ status: "chat-only", chatPath: join(chatRoot, rel) });
    }
  }

  return results;
}

function collectIdentities(tree: PaperTreeNode): IdentityRef[] {
  const out: IdentityRef[] = [];
  function walk(node: PaperTreeNode): void {
    const id = parseIdentity(node.name ?? "");
    if (id) out.push(id);
    if (Array.isArray(node.children)) for (const c of node.children) walk(c);
  }
  walk(tree);
  return out;
}

function listChatFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  function walk(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else if (entry.endsWith(".chat.md")) out.push(full);
    }
  }
  walk(root);
  return out;
}
