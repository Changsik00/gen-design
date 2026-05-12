import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { inferChatDiff } from "../diff";
import type { CatalogMap } from "../ast-builder";
import type { PaperTreeNode } from "../tree-types";
import type { VocabularyCatalog } from "../../vocabulary/catalog";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..");
const CATALOG_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "catalog.json");

let catalog: CatalogMap;

beforeAll(() => {
  const raw = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as VocabularyCatalog;
  catalog = new Map();
  const all = [
    ...raw.tiers.tier2Shadcn.components,
    ...raw.tiers.tier3Project.composites,
    ...raw.tiers.tier3Project.templates,
  ] as Array<{ name: string; axes: { name: string; values: string[] }[] }>;
  for (const c of all) catalog.set(c.name, c.axes);
});

const baseChat = `---
type: scene
name: LoginScene
identity: chats/scenes/login
---

# LoginScene

## 💬 Narrative

로그인 진입점. 디자이너의 자연어 설계 의도.

## 🧩 Structure

\`\`\`jsx
<LoginForm extra_0="default" extra_1="md" />
\`\`\`

## 📜 History

- **2026-05-12** 초안
`;

const tree = (overrides: Partial<PaperTreeNode> = {}): PaperTreeNode => ({
  id: "root",
  name: "[chat:scenes/login]",
  component: "Frame",
  ...overrides,
});

describe("inferChatDiff — no-op", () => {
  it("동일 tree → stats 모두 0", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.md", component: "Frame" }],
    });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.stats).toEqual({ textChanges: 0, variantChanges: 0, added: 0, removed: 0 });
  });

  it("변경 0 → History 자동 라인 추가 X", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.md", component: "Frame" }],
    });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.historyLineAdded).toBeUndefined();
  });
});

describe("inferChatDiff — Structure diff", () => {
  it("variant 변경 (md → lg) → variantChanges=1", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.lg", component: "Frame" }],
    });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.stats.variantChanges).toBe(1);
    expect(r.stats.added).toBe(0);
    expect(r.stats.removed).toBe(0);
  });

  it("component 추가 → added=1", () => {
    const newTree = tree({
      children: [
        { id: "c1", name: "LoginForm.default.md", component: "Frame" },
        { id: "c2", name: "Button.primary.md", component: "Frame" },
      ],
    });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.stats.added).toBe(1);
    expect(r.stats.removed).toBe(0);
  });

  it("component 삭제 → removed=1", () => {
    const newTree = tree({ children: [] });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.stats.removed).toBe(1);
    expect(r.stats.added).toBe(0);
  });

  it("혼합 변경 (variant + add)", () => {
    const newTree = tree({
      children: [
        { id: "c1", name: "LoginForm.default.lg", component: "Frame" },
        { id: "c2", name: "Button.primary.md", component: "Frame" },
      ],
    });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.stats.variantChanges).toBe(1);
    expect(r.stats.added).toBe(1);
  });

  it("결정성 — 같은 입력 → 같은 결과 (text 포함)", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.lg", component: "Frame" }],
    });
    const a = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    const b = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(a.text).toBe(b.text);
    expect(a.stats).toEqual(b.stats);
  });
});

describe("inferChatDiff — 보존 (Narrative / History / frontmatter)", () => {
  it("Narrative bit-for-bit 보존", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.lg", component: "Frame" }],
    });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.text).toContain("로그인 진입점. 디자이너의 자연어 설계 의도.");
    expect(r.preserved.narrative).toBe(true);
  });

  it("frontmatter 보존", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.lg", component: "Frame" }],
    });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.text).toMatch(/type: scene/);
    expect(r.text).toMatch(/identity: chats\/scenes\/login/);
    expect(r.preserved.frontmatter).toBe(true);
  });

  it("기존 History 라인 보존 + 새 라인 append", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.lg", component: "Frame" }],
    });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.text).toMatch(/- \*\*2026-05-12\*\* 초안/);
    expect(r.text).toMatch(/Paper sync/);
    expect(r.preserved.history).toBe(true);
  });
});

describe("inferChatDiff — History 자동 라인 옵션", () => {
  it("기본 — variantChanges 1 → Paper sync 라인 추가", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.lg", component: "Frame" }],
    });
    const r = inferChatDiff(baseChat, newTree, { catalog, date: "2026-05-12" });
    expect(r.historyLineAdded).toMatch(/2026-05-12/);
    expect(r.historyLineAdded).toMatch(/variants 1/);
  });

  it("appendHistory: false → 자동 추가 X", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.lg", component: "Frame" }],
    });
    const r = inferChatDiff(baseChat, newTree, {
      catalog,
      date: "2026-05-12",
      appendHistory: false,
    });
    expect(r.historyLineAdded).toBeUndefined();
    expect(r.text).not.toMatch(/Paper sync/);
  });

  it("date 옵션 명시 시 형식 일치", () => {
    const newTree = tree({
      children: [{ id: "c1", name: "LoginForm.default.lg", component: "Frame" }],
    });
    const r = inferChatDiff(baseChat, newTree, {
      catalog,
      date: "2025-12-25",
    });
    expect(r.historyLineAdded).toMatch(/2025-12-25/);
  });
});
