import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  extractComponents,
  detectCandidates,
  buildPreview,
  applyPromotion,
  type SceneFile,
} from "../merge";

// ── extractComponents ────────────────────────────────────────────────────────

describe("extractComponents", () => {
  it("JSX 셀프 클로징 태그 추출", () => {
    const section = `
\`\`\`jsx
<LoginForm />
<AppFooter />
\`\`\`
`;
    const result = extractComponents(section);
    expect(result).toContain("LoginForm");
    expect(result).toContain("AppFooter");
  });

  it("JSX 열린 태그 추출", () => {
    const section = `
\`\`\`jsx
<BrandHeader slot="top">
  <NavMenu />
</BrandHeader>
\`\`\`
`;
    const result = extractComponents(section);
    expect(result).toContain("BrandHeader");
    expect(result).toContain("NavMenu");
  });

  it("소문자 HTML 태그는 제외", () => {
    const section = `<div><span><p>text</p></span></div>`;
    expect(extractComponents(section)).toHaveLength(0);
  });

  it("빈 섹션 → 빈 배열", () => {
    expect(extractComponents("")).toEqual([]);
  });

  it("중복 컴포넌트 중복 제거", () => {
    const section = `<Button />\n<Button />\n<Button />`;
    expect(extractComponents(section)).toEqual(["Button"]);
  });
});

// ── detectCandidates ─────────────────────────────────────────────────────────

describe("detectCandidates", () => {
  const makeScene = (path: string, components: string[]): SceneFile => ({
    path,
    components,
    hasShellInherit: false,
  });

  it("threshold=3, 2 scene → 후보 아님", () => {
    const scenes = [
      makeScene("a.chat.md", ["NavBar"]),
      makeScene("b.chat.md", ["NavBar"]),
    ];
    expect(detectCandidates(scenes, [], 3)).toHaveLength(0);
  });

  it("threshold=3, 3 scene → 후보 포함", () => {
    const scenes = [
      makeScene("a.chat.md", ["NavBar"]),
      makeScene("b.chat.md", ["NavBar"]),
      makeScene("c.chat.md", ["NavBar"]),
    ];
    const candidates = detectCandidates(scenes, [], 3);
    expect(candidates).toHaveLength(1);
    expect(candidates[0].component).toBe("NavBar");
    expect(candidates[0].scenes).toHaveLength(3);
  });

  it("이미 shell 에 있는 컴포넌트 제외", () => {
    const scenes = [
      makeScene("a.chat.md", ["BrandHeader"]),
      makeScene("b.chat.md", ["BrandHeader"]),
      makeScene("c.chat.md", ["BrandHeader"]),
    ];
    expect(detectCandidates(scenes, ["BrandHeader"], 3)).toHaveLength(0);
  });

  it("threshold=2, 복수 후보", () => {
    const scenes = [
      makeScene("a.chat.md", ["NavBar", "SidePanel"]),
      makeScene("b.chat.md", ["NavBar", "SidePanel"]),
    ];
    const candidates = detectCandidates(scenes, [], 2);
    const names = candidates.map((c) => c.component).sort();
    expect(names).toEqual(["NavBar", "SidePanel"]);
  });

  it("scene 목록 비어있으면 후보 0", () => {
    expect(detectCandidates([], [], 3)).toHaveLength(0);
  });
});

// ── buildPreview ──────────────────────────────────────────────────────────────

describe("buildPreview", () => {
  it("후보 없을 때 no-candidates 메시지", () => {
    const output = buildPreview([]);
    expect(output).toContain("No shell promotion candidates found.");
  });

  it("후보 있을 때 컴포넌트명 + scene 경로 포함", () => {
    const output = buildPreview([
      {
        component: "NavBar",
        scenes: [
          "scenes/main.chat.md",
          "scenes/dashboard.chat.md",
          "scenes/profile.chat.md",
        ],
      },
    ]);
    expect(output).toContain("NavBar");
    expect(output).toContain("scenes/main.chat.md");
    expect(output).toContain("--apply");
  });
});

// ── applyPromotion (실제 파일시스템) ─────────────────────────────────────────

const SHELL_CONTENT = `---
type: shell
name: AppShell
---

# AppShell

## 💬 Narrative

기본 외각.

## 🧩 Structure

\`\`\`jsx
<AppShell>
  <BrandHeader slot="top" />
  {/* {{scene.content}} */}
</AppShell>
\`\`\`

## 📜 History

- **2026-05-10** 초안.
`;

const SCENE_NO_SHELL = `---
type: scene
name: HomeScene
---

# HomeScene

## 🧩 Structure

\`\`\`jsx
<HomeScene>
  <NavBar />
</HomeScene>
\`\`\`

## 📜 History
`;

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "gen-design-merge-test-"));
  mkdirSync(join(tmpDir, "playground", "chats", "scenes"), { recursive: true });
  mkdirSync(join(tmpDir, "chats", "scenes"), { recursive: true });
  writeFileSync(join(tmpDir, "playground", "chats", "_shell.chat.md"), SHELL_CONTENT, "utf-8");
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("applyPromotion", () => {
  it("후보 없으면 파일 변경 없음", () => {
    const originalShell = readFileSync(
      join(tmpDir, "playground", "chats", "_shell.chat.md"),
      "utf-8",
    );
    applyPromotion([], tmpDir, "2026-05-22");
    const afterShell = readFileSync(
      join(tmpDir, "playground", "chats", "_shell.chat.md"),
      "utf-8",
    );
    expect(afterShell).toBe(originalShell);
  });

  it("_shell.chat.md 에 컴포넌트 + History 추가", () => {
    const scenePath = join(tmpDir, "playground", "chats", "scenes", "home.chat.md");
    writeFileSync(scenePath, SCENE_NO_SHELL, "utf-8");

    applyPromotion(
      [{ component: "NavBar", scenes: [scenePath] }],
      tmpDir,
      "2026-05-22",
    );

    const shell = readFileSync(
      join(tmpDir, "playground", "chats", "_shell.chat.md"),
      "utf-8",
    );
    expect(shell).toContain("NavBar");
    expect(shell).toContain("2026-05-22");
  });

  it("_shell.chat.md 없으면 throw", () => {
    rmSync(join(tmpDir, "playground", "chats", "_shell.chat.md"));
    expect(() =>
      applyPromotion([{ component: "X", scenes: [] }], tmpDir, "2026-05-22"),
    ).toThrow("_shell.chat.md not found");
  });

  it("scene frontmatter 에 shell.inherit: true 추가", () => {
    const scenePath = join(tmpDir, "playground", "chats", "scenes", "home.chat.md");
    writeFileSync(scenePath, SCENE_NO_SHELL, "utf-8");

    applyPromotion(
      [{ component: "NavBar", scenes: [scenePath] }],
      tmpDir,
      "2026-05-22",
    );

    const scene = readFileSync(scenePath, "utf-8");
    expect(scene).toContain("shell:");
    expect(scene).toContain("inherit: true");
  });

  it("이미 shell.inherit: true 인 scene 은 중복 추가 안 함", () => {
    const sceneWithShell = SCENE_NO_SHELL.replace(
      "---\ntype: scene",
      "---\ntype: scene\nshell:\n  inherit: true",
    );
    const scenePath = join(tmpDir, "playground", "chats", "scenes", "home.chat.md");
    writeFileSync(scenePath, sceneWithShell, "utf-8");

    applyPromotion(
      [{ component: "NavBar", scenes: [scenePath] }],
      tmpDir,
      "2026-05-22",
    );

    const scene = readFileSync(scenePath, "utf-8");
    const inheritCount = (scene.match(/inherit: true/g) ?? []).length;
    expect(inheritCount).toBe(1);
  });
});
