import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { compileScene } from "../compile-scene";

let chatRoot: string;

beforeEach(() => {
  chatRoot = mkdtempSync(join(tmpdir(), "compile-scene-test-"));
  mkdirSync(join(chatRoot, "scenes"), { recursive: true });
});

afterEach(() => {
  rmSync(chatRoot, { recursive: true });
});

function writeChat(rel: string, content: string): void {
  const full = join(chatRoot, rel);
  writeFileSync(full, content, "utf-8");
}

const sceneWithInherit = `---
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

const sceneNoInherit = `---
type: scene
name: LoginScene
identity: chats/scenes/login
---

# LoginScene

## 🧩 Structure

\`\`\`jsx
<LoginForm />
\`\`\`
`;

const shellChat = `---
type: shell
name: AppShell
applies: scenes
---

# AppShell

## 🧩 Structure

\`\`\`jsx
<BrandHeader />
{{scene.content}}
<AppFooter />
\`\`\`
`;

describe("compileScene", () => {
  it("inherit=true → shell + scene merge → TSX 안에 LoginForm + AppFooter (BrandHeader X)", () => {
    writeChat("scenes/login.chat.md", sceneWithInherit);
    writeChat("_shell.chat.md", shellChat);
    const r = compileScene("login", { chatRoot });
    expect(r.ok).toBe(true);
    expect(r.tsx).toContain("LoginForm");
    expect(r.tsx).toContain("AppFooter");
    expect(r.tsx).not.toMatch(/<BrandHeader/);
  });

  it("inherit=false → scene 단독 (BrandHeader / AppFooter 없음)", () => {
    writeChat("scenes/login.chat.md", sceneNoInherit);
    writeChat("_shell.chat.md", shellChat);
    const r = compileScene("login", { chatRoot });
    expect(r.ok).toBe(true);
    expect(r.tsx).toContain("LoginForm");
    expect(r.tsx).not.toMatch(/<AppFooter/);
    expect(r.tsx).not.toMatch(/<BrandHeader/);
  });

  it("scene 파일 없음 → ok:false + 오류", () => {
    const r = compileScene("missing", { chatRoot });
    expect(r.ok).toBe(false);
    expect(r.errors[0].message).toMatch(/scene/i);
  });

  it("shell 파일 없음 (inherit=true) → ok:false + 오류", () => {
    writeChat("scenes/login.chat.md", sceneWithInherit);
    const r = compileScene("login", { chatRoot });
    expect(r.ok).toBe(false);
    expect(r.errors[0].message).toMatch(/shell/i);
  });

  it("frontmatter 부재 → scene 단독 컴파일", () => {
    const noFm = `# X\n\n## 🧩 Structure\n\n\`\`\`jsx\n<LoginForm />\n\`\`\`\n`;
    writeChat("scenes/login.chat.md", noFm);
    const r = compileScene("login", { chatRoot });
    expect(r.ok).toBe(true);
    expect(r.tsx).toContain("LoginForm");
  });

  it("결정성 — 2회 호출 동일 TSX", () => {
    writeChat("scenes/login.chat.md", sceneWithInherit);
    writeChat("_shell.chat.md", shellChat);
    const a = compileScene("login", { chatRoot });
    const b = compileScene("login", { chatRoot });
    expect(a.tsx).toBe(b.tsx);
  });
});
