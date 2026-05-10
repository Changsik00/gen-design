import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { matchPaperToChat } from "../match";
import type { PaperTreeNode } from "../tree-types";

const node = (overrides: Partial<PaperTreeNode> = {}): PaperTreeNode => ({
  id: "n",
  name: "X",
  component: "Frame",
  ...overrides,
});

let chatRoot: string;

beforeEach(() => {
  chatRoot = mkdtempSync(join(tmpdir(), "match-test-"));
});

afterEach(() => {
  rmSync(chatRoot, { recursive: true });
});

function writeChat(rel: string): void {
  const full = join(chatRoot, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, "---\ntype: scene\nname: X\n---\n", "utf-8");
}

describe("matchPaperToChat", () => {
  it("match — tree identity 와 chat 파일 모두 존재", () => {
    writeChat("scenes/login.chat.md");
    const tree = node({ name: "[chat:scenes/login]" });
    const result = matchPaperToChat(tree, chatRoot);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("match");
  });

  it("tree-only — chat 파일 부재", () => {
    const tree = node({ name: "[chat:scenes/login]" });
    const result = matchPaperToChat(tree, chatRoot);
    expect(result[0].status).toBe("tree-only");
  });

  it("chat-only — tree 안 layer 부재 (chat 파일만)", () => {
    writeChat("scenes/login.chat.md");
    writeChat("scenes/main.chat.md");
    const tree = node({ name: "[chat:scenes/login]" });
    const result = matchPaperToChat(tree, chatRoot);
    const chatOnly = result.filter((r) => r.status === "chat-only");
    expect(chatOnly.length).toBeGreaterThan(0);
    expect(chatOnly.some((r) => r.status === "chat-only" && r.chatPath.includes("main.chat.md"))).toBe(true);
  });

  it("empty tree (마커 없음) → tree match 0", () => {
    const tree = node({ name: "Plain" });
    const result = matchPaperToChat(tree, chatRoot);
    const treeOriented = result.filter((r) => r.status !== "chat-only");
    expect(treeOriented).toEqual([]);
  });
});
