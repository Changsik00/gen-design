import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { prependGdAnnotation, runReact } from "../react";

describe("prependGdAnnotation — TSX 출력에 // @gd: 자동 삽입", () => {
  it("annotation 없는 TSX 의 최상단에 삽입", () => {
    const tsx = `import { useTranslation } from "react-i18next";\nexport default function Login() { return <div />; }`;
    const out = prependGdAnnotation(tsx, "chats/scenes/login.chat.md");
    expect(out.split("\n", 1)[0]).toBe("// @gd: chats/scenes/login.chat.md");
    expect(out).toContain("export default function Login()");
  });

  it("이미 annotation 있는 TSX 는 *교체* (idempotent)", () => {
    const tsx = `// @gd: old/path.chat.md\nimport x from "y";\n`;
    const out = prependGdAnnotation(tsx, "chats/scenes/login.chat.md");
    expect(out.split("\n", 1)[0]).toBe("// @gd: chats/scenes/login.chat.md");
    expect(out).not.toContain("old/path.chat.md");
  });

  it("공백 변동 annotation 도 교체", () => {
    const tsx = `//  @gd:  weird-spacing.chat.md  \nimport x from "y";`;
    const out = prependGdAnnotation(tsx, "chats/scenes/x.chat.md");
    expect(out.split("\n", 1)[0]).toBe("// @gd: chats/scenes/x.chat.md");
    expect(out).not.toContain("weird-spacing");
  });

  it("빈 TSX 도 처리", () => {
    const out = prependGdAnnotation("", "chats/scenes/y.chat.md");
    expect(out).toBe("// @gd: chats/scenes/y.chat.md\n");
  });
});

describe("runReact annotation 경로 (spec-11-05 fix #2) — chatRoot 부모 기준", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "react-annotation-base-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("annotation 이 chatRoot 부모 (project root) 기준 상대 경로", async () => {
    // 구조: tempDir/proj/chats/scenes/x.chat.md
    const projDir = join(tempDir, "proj");
    const chatsDir = join(projDir, "chats");
    mkdirSync(join(chatsDir, "scenes"), { recursive: true });
    writeFileSync(
      join(chatsDir, "scenes", "x.chat.md"),
      `---\ntype: scene\nname: XScene\nidentity: chats/scenes/x\ncreated: 2026-05-23\n---\n\n## 💬 Narrative\n\ntest\n`,
    );

    const captured: Array<{ path: string; content: string }> = [];
    const result = await runReact(
      ["x", "--chat-root", chatsDir, "--output", join(projDir, "src", "scenes", "x.tsx"), "--no-shell"],
      { captureWrite: (path, content) => captured.push({ path, content }) },
    );

    expect(result.exitCode).toBe(0);
    expect(captured).toHaveLength(1);
    const firstLine = captured[0]!.content.split("\n", 1)[0];
    // ../proj/... 같은 cwd 기준이 아니라 chats/scenes/x.chat.md (project root 기준)
    expect(firstLine).toBe("// @gd: chats/scenes/x.chat.md");
  });
});
