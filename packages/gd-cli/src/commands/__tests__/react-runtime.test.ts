import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runReact } from "../react";

let workDir: string;
let chatRoot: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "react-runtime-"));
  chatRoot = join(workDir, "chats");
  mkdirSync(join(chatRoot, "scenes"), { recursive: true });
});

afterEach(() => {
  rmSync(workDir, { recursive: true });
});

const SCENE = `---
type: scene
name: LoginScene
identity: chats/scenes/login
shell:
  inherit: true
  exclude: [BrandHeader]
---

# LoginScene

## 🧩 Structure

\`\`\`jsx
<LoginForm />
\`\`\`
`;

const SHELL = `---
type: shell
name: AppShell
applies: scenes
---

## 🧩 Structure

\`\`\`jsx
<BrandHeader />
{{scene.content}}
<AppFooter />
\`\`\`
`;

describe("runReact", () => {
  it("slug + chat-root → stdout TSX (BrandHeader 없음, LoginForm + AppFooter 있음)", async () => {
    writeFileSync(join(chatRoot, "scenes", "login.chat.md"), SCENE, "utf-8");
    writeFileSync(join(chatRoot, "_shell.chat.md"), SHELL, "utf-8");
    const r = await runReact(["login", "--chat-root", chatRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/LoginForm/);
    expect(r.stdout).toMatch(/AppFooter/);
    expect(r.stdout).not.toMatch(/<BrandHeader/);
  });

  it("--output 으로 파일 저장", async () => {
    writeFileSync(join(chatRoot, "scenes", "login.chat.md"), SCENE, "utf-8");
    writeFileSync(join(chatRoot, "_shell.chat.md"), SHELL, "utf-8");
    const out = join(workDir, "LoginScene.tsx");
    const r = await runReact(["login", "--chat-root", chatRoot, "--output", out]);
    expect(r.exitCode).toBe(0);
    const written = readFileSync(out, "utf-8");
    expect(written).toMatch(/LoginForm/);
  });

  it("--no-shell → scene 단독 (AppFooter 없음)", async () => {
    writeFileSync(join(chatRoot, "scenes", "login.chat.md"), SCENE, "utf-8");
    writeFileSync(join(chatRoot, "_shell.chat.md"), SHELL, "utf-8");
    const r = await runReact(["login", "--chat-root", chatRoot, "--no-shell"]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/LoginForm/);
    expect(r.stdout).not.toMatch(/<AppFooter/);
  });

  it("scene 부재 → exit 1", async () => {
    const r = await runReact(["nonexistent", "--chat-root", chatRoot]);
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toMatch(/scene/i);
  });

  it("--help → 도움말 + exit 0", async () => {
    const r = await runReact(["--help"]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/Usage/);
  });
});
