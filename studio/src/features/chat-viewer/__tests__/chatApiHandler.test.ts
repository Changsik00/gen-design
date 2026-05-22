import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { scanChats } from "../chatApiPlugin";

const SCENE_CONTENT = `---
type: scene
name: LoginScene
identity: chats/scenes/login
created: 2026-05-10
---
# LoginScene
## 💬 Narrative
로그인 화면.
`;

const COMPONENT_CONTENT = `---
type: component
name: LoginForm
identity: chats/components/login-form
created: 2026-05-10
---
# LoginForm
`;

const SHELL_CONTENT = `---
type: shell
name: AppShell
identity: chats/_shell
created: 2026-05-10
---
# AppShell
`;

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "chat-api-test-"));
  mkdirSync(join(tmpDir, "scenes"));
  mkdirSync(join(tmpDir, "components"));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("scanChats", () => {
  it("scenes + components + shell 모두 수집", () => {
    writeFileSync(join(tmpDir, "_shell.chat.md"), SHELL_CONTENT);
    writeFileSync(join(tmpDir, "scenes", "login.chat.md"), SCENE_CONTENT);
    writeFileSync(join(tmpDir, "components", "login-form.chat.md"), COMPONENT_CONTENT);

    const entries = scanChats([tmpDir]);
    expect(entries).toHaveLength(3);

    const types = entries.map((e) => e.fileType).sort();
    expect(types).toEqual(["component", "scene", "shell"]);
  });

  it("빈 루트 → 빈 배열", () => {
    const entries = scanChats([tmpDir]);
    expect(entries).toEqual([]);
  });

  it("entry 에 text 포함", () => {
    writeFileSync(join(tmpDir, "scenes", "login.chat.md"), SCENE_CONTENT);
    const entries = scanChats([tmpDir]);
    expect(entries[0].text).toContain("LoginScene");
  });

  it("entry 에 source(루트 경로 기반 레이블) 포함", () => {
    writeFileSync(join(tmpDir, "scenes", "login.chat.md"), SCENE_CONTENT);
    const entries = scanChats([tmpDir]);
    expect(entries[0].source).toBeTruthy();
  });

  it("복수 루트 — 두 루트 파일 모두 수집", () => {
    const tmpDir2 = mkdtempSync(join(tmpdir(), "chat-api-test2-"));
    try {
      mkdirSync(join(tmpDir2, "scenes"));
      writeFileSync(join(tmpDir, "scenes", "login.chat.md"), SCENE_CONTENT);
      writeFileSync(join(tmpDir2, "scenes", "main.chat.md"), SCENE_CONTENT);

      const entries = scanChats([tmpDir, tmpDir2]);
      expect(entries).toHaveLength(2);
    } finally {
      rmSync(tmpDir2, { recursive: true, force: true });
    }
  });

  it(".chat.md 가 아닌 파일은 무시", () => {
    writeFileSync(join(tmpDir, "scenes", "readme.md"), "# readme");
    writeFileSync(join(tmpDir, "scenes", "login.chat.md"), SCENE_CONTENT);
    const entries = scanChats([tmpDir]);
    expect(entries).toHaveLength(1);
  });
});
