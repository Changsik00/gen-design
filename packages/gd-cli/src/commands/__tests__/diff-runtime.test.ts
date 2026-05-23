import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runDiff } from "../diff";
import type { CatalogMap } from "../../../../../studio/src/lib/paper-inference/ast-builder";

const catalog: CatalogMap = new Map();
catalog.set("LoginForm", [
  { name: "variant", values: ["default", "filled"] },
  { name: "size", values: ["sm", "md", "lg"] },
]);
catalog.set("Button", [
  { name: "variant", values: ["primary", "ghost"] },
  { name: "size", values: ["sm", "md", "lg"] },
]);

const BASE_CHAT = `---
type: scene
name: LoginScene
identity: chats/scenes/login
---

# LoginScene

## 💬 Narrative

로그인 진입점. 디자이너의 자연어 의도.

## 🧩 Structure

\`\`\`jsx
<LoginForm variant="default" size="md" />
\`\`\`

## 📜 History

- **2026-05-10** 초안
`;

const SAME_TREE = {
  id: "root",
  name: "[chat:scenes/login]",
  component: "Frame",
  children: [{ id: "c1", name: "LoginForm.default.md", component: "Frame" }],
};

const VARIANT_CHANGED_TREE = {
  id: "root",
  name: "[chat:scenes/login]",
  component: "Frame",
  children: [{ id: "c1", name: "LoginForm.default.lg", component: "Frame" }],
};

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "diff-runtime-"));
});

afterEach(() => {
  rmSync(workDir, { recursive: true });
});

function setup(treeContent: unknown): { chat: string; tree: string } {
  const chatPath = join(workDir, "login.chat.md");
  const treePath = join(workDir, "login.tree.json");
  writeFileSync(chatPath, BASE_CHAT, "utf-8");
  writeFileSync(treePath, JSON.stringify(treeContent), "utf-8");
  return { chat: chatPath, tree: treePath };
}

describe("runDiff — dry-run 기본", () => {
  it("변경 없음 → no changes 메시지", async () => {
    const { chat, tree } = setup(SAME_TREE);
    const r = await runDiff([chat, tree], { catalog });
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/no changes/);
  });

  it("variant 변경 → unified diff 출력 + stats stderr", async () => {
    const { chat, tree } = setup(VARIANT_CHANGED_TREE);
    const r = await runDiff([chat, tree], { catalog });
    expect(r.exitCode).toBe(0);
    expect(r.stderr).toMatch(/variants 1/);
    expect(r.stderr).toMatch(/preserved.*frontmatter=true/);
    expect(r.stderr).toMatch(/history\+/);
  });

  it("dry-run 은 파일 쓰기 X", async () => {
    const { chat, tree } = setup(VARIANT_CHANGED_TREE);
    await runDiff([chat, tree], { catalog });
    const after = readFileSync(chat, "utf-8");
    expect(after).toBe(BASE_CHAT);
  });
});

describe("runDiff — --apply", () => {
  it("chat.md 덮어쓰기 + Narrative 보존", async () => {
    const { chat, tree } = setup(VARIANT_CHANGED_TREE);
    const r = await runDiff([chat, tree, "--apply", "--date", "2026-05-12"], { catalog });
    expect(r.exitCode).toBe(0);
    const after = readFileSync(chat, "utf-8");
    expect(after).toContain("로그인 진입점. 디자이너의 자연어 의도.");
    expect(after).toMatch(/Paper sync/);
  });

  it("--output 으로 다른 경로 저장", async () => {
    const { chat, tree } = setup(VARIANT_CHANGED_TREE);
    const out = join(workDir, "out.chat.md");
    const r = await runDiff([chat, tree, "--apply", "--output", out], { catalog });
    expect(r.exitCode).toBe(0);
    const after = readFileSync(out, "utf-8");
    expect(after).toContain("로그인 진입점.");
    expect(readFileSync(chat, "utf-8")).toBe(BASE_CHAT); // 원본 보존
  });

  it("--no-history → Paper sync 라인 추가 X", async () => {
    const { chat, tree } = setup(VARIANT_CHANGED_TREE);
    const r = await runDiff([chat, tree, "--apply", "--no-history"], { catalog });
    expect(r.exitCode).toBe(0);
    const after = readFileSync(chat, "utf-8");
    expect(after).not.toMatch(/Paper sync/);
  });
});

describe("runDiff — 오류", () => {
  it("positional 부족 → exit 2", async () => {
    const r = await runDiff(["only-one"], { catalog });
    expect(r.exitCode).toBe(2);
  });

  it("파일 부재 → exit 1", async () => {
    const r = await runDiff(["/nonexistent.md", "/nonexistent.json"], { catalog });
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toMatch(/Failed to read/);
  });

  it("--help → 도움말 + exit 0", async () => {
    const r = await runDiff(["--help"], { catalog });
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/Usage/);
  });
});
