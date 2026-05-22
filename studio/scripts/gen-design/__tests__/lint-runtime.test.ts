import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  scanChatFiles,
  checkFrontmatter,
  checkShellInherit,
  checkNaming,
  formatLintReport,
  type ChatFile,
  type ChatLintDiag,
} from "../lint";

// ── 헬퍼 ─────────────────────────────────────────────────────────────────────

const VALID_SHELL = `---
type: shell
name: AppShell
identity: chats/_shell
created: 2026-05-10
---

# AppShell

## 💬 Narrative

글로벌 외각.
`;

const VALID_SCENE = `---
type: scene
name: LoginScene
identity: chats/scenes/login
shell:
  inherit: true
created: 2026-05-10
---

# LoginScene

## 💬 Narrative

로그인 화면.
`;

const VALID_COMPONENT = `---
type: component
name: LoginForm
identity: chats/components/login-form
created: 2026-05-10
---

# LoginForm
`;

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "lint-test-"));
  mkdirSync(join(tmpDir, "scenes"));
  mkdirSync(join(tmpDir, "components"));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

// ── scanChatFiles ────────────────────────────────────────────────────────────

describe("scanChatFiles", () => {
  it("scenes + components + shell 모두 수집", () => {
    writeFileSync(join(tmpDir, "_shell.chat.md"), VALID_SHELL);
    writeFileSync(join(tmpDir, "scenes", "login.chat.md"), VALID_SCENE);
    writeFileSync(join(tmpDir, "components", "login-form.chat.md"), VALID_COMPONENT);

    const files = scanChatFiles(tmpDir);
    expect(files).toHaveLength(3);

    const types = files.map((f) => f.fileType).sort();
    expect(types).toEqual(["component", "scene", "shell"]);
  });

  it("비어있는 디렉토리 → 빈 배열", () => {
    const files = scanChatFiles(tmpDir);
    expect(files).toEqual([]);
  });
});

// ── checkFrontmatter ─────────────────────────────────────────────────────────

describe("checkFrontmatter", () => {
  it("유효한 frontmatter → 에러 없음", () => {
    writeFileSync(join(tmpDir, "_shell.chat.md"), VALID_SHELL);
    const files = scanChatFiles(tmpDir);
    const diags = checkFrontmatter(files);
    expect(diags).toHaveLength(0);
  });

  it("type 필드 누락 → error", () => {
    const content = `---
name: TestScene
identity: chats/scenes/test
created: 2026-05-22
---

# Test
`;
    writeFileSync(join(tmpDir, "scenes", "test.chat.md"), content);
    const files = scanChatFiles(tmpDir);
    const diags = checkFrontmatter(files);
    expect(diags.some((d) => d.message.includes("type"))).toBe(true);
    expect(diags.every((d) => d.category === "frontmatter")).toBe(true);
  });

  it("name 필드 누락 → error", () => {
    const content = `---
type: scene
identity: chats/scenes/test
created: 2026-05-22
---
`;
    writeFileSync(join(tmpDir, "scenes", "test.chat.md"), content);
    const files = scanChatFiles(tmpDir);
    const diags = checkFrontmatter(files);
    expect(diags.some((d) => d.message.includes("name"))).toBe(true);
  });

  it("잘못된 type 값 → error", () => {
    const content = `---
type: widget
name: Bad
identity: chats/scenes/bad
created: 2026-05-22
---
`;
    writeFileSync(join(tmpDir, "scenes", "bad.chat.md"), content);
    const files = scanChatFiles(tmpDir);
    const diags = checkFrontmatter(files);
    expect(diags.some((d) => d.message.includes("Invalid type"))).toBe(true);
  });

  it("잘못된 catalog.tier → error", () => {
    const content = `---
type: scene
name: BadTier
identity: chats/scenes/bad-tier
created: 2026-05-22
catalog:
  tier: 5
---
`;
    writeFileSync(join(tmpDir, "scenes", "bad-tier.chat.md"), content);
    const files = scanChatFiles(tmpDir);
    const diags = checkFrontmatter(files);
    expect(diags.some((d) => d.message.includes("catalog.tier"))).toBe(true);
  });
});

// ── checkShellInherit ────────────────────────────────────────────────────────

describe("checkShellInherit", () => {
  it("inherit=true + _shell.chat.md 존재 → 에러 없음", () => {
    writeFileSync(join(tmpDir, "_shell.chat.md"), VALID_SHELL);
    writeFileSync(join(tmpDir, "scenes", "login.chat.md"), VALID_SCENE);
    const files = scanChatFiles(tmpDir);
    const diags = checkShellInherit(files, tmpDir, "/nonexistent/catalog.json");
    expect(diags).toHaveLength(0);
  });

  it("inherit=true + _shell.chat.md 없음 → error", () => {
    writeFileSync(join(tmpDir, "scenes", "login.chat.md"), VALID_SCENE);
    const files = scanChatFiles(tmpDir);
    const diags = checkShellInherit(files, tmpDir, "/nonexistent/catalog.json");
    expect(diags.some((d) => d.message.includes("_shell.chat.md not found"))).toBe(true);
  });

  it("inherit=false → shell 관련 검사 skip", () => {
    const noInherit = `---
type: scene
name: StandaloneScene
identity: chats/scenes/standalone
created: 2026-05-22
---
`;
    writeFileSync(join(tmpDir, "scenes", "standalone.chat.md"), noInherit);
    const files = scanChatFiles(tmpDir);
    const diags = checkShellInherit(files, tmpDir, "/nonexistent/catalog.json");
    expect(diags).toHaveLength(0);
  });

  it("shell.exclude 미등록 컴포넌트 → catalog 없으면 skip (catalog 미지정)", () => {
    const withExclude = `---
type: scene
name: LoginScene
identity: chats/scenes/login
shell:
  inherit: true
  exclude: [UnknownWidget]
created: 2026-05-22
---
`;
    writeFileSync(join(tmpDir, "_shell.chat.md"), VALID_SHELL);
    writeFileSync(join(tmpDir, "scenes", "login.chat.md"), withExclude);
    const files = scanChatFiles(tmpDir);
    const diags = checkShellInherit(files, tmpDir, "/nonexistent/catalog.json");
    // catalog 없으면 exclude 검증 skip
    expect(diags).toHaveLength(0);
  });
});

// ── checkNaming ──────────────────────────────────────────────────────────────

describe("checkNaming", () => {
  it("유효한 kebab-case 파일명 → 에러 없음", () => {
    writeFileSync(join(tmpDir, "scenes", "login-page.chat.md"), VALID_SCENE);
    const files = scanChatFiles(tmpDir);
    const diags = checkNaming(files);
    expect(diags).toHaveLength(0);
  });

  it("대문자 포함 파일명 → error", () => {
    const file: ChatFile = {
      path: join(tmpDir, "scenes", "LoginPage.chat.md"),
      relPath: "scenes/LoginPage.chat.md",
      fileType: "scene",
    };
    const diags = checkNaming([file]);
    expect(diags.some((d) => d.message.includes("kebab-case"))).toBe(true);
  });

  it("fileType=scene 인데 components/ 에 위치 → error", () => {
    const file: ChatFile = {
      path: join(tmpDir, "components", "login.chat.md"),
      relPath: "components/login.chat.md",
      fileType: "scene",
    };
    const diags = checkNaming([file]);
    expect(diags.some((d) => d.message.includes("scenes/"))).toBe(true);
  });

  it("shell 파일은 naming 규칙 예외 처리 → 에러 없음", () => {
    writeFileSync(join(tmpDir, "_shell.chat.md"), VALID_SHELL);
    const files = scanChatFiles(tmpDir);
    const diags = checkNaming(files);
    expect(diags).toHaveLength(0);
  });
});

// ── formatLintReport ─────────────────────────────────────────────────────────

describe("formatLintReport", () => {
  it("에러 없음 → 'All checks passed.' 포함", () => {
    const report = formatLintReport([], 3);
    expect(report).toContain("All checks passed.");
    expect(report).toContain("3 files");
  });

  it("에러 있음 → 파일명 + 카테고리 + 메시지 포함", () => {
    const diags: ChatLintDiag[] = [
      { category: "frontmatter", file: "scenes/test.chat.md", message: "Missing required field: type", line: 0 },
      { category: "naming", file: "scenes/BadName.chat.md", message: "Filename must be kebab-case", line: 0 },
    ];
    const report = formatLintReport(diags, 2);
    expect(report).toContain("scenes/test.chat.md");
    expect(report).toContain("[frontmatter]");
    expect(report).toContain("Missing required field: type");
    expect(report).toContain("FAIL");
    expect(report).toContain("2 errors");
  });
});
