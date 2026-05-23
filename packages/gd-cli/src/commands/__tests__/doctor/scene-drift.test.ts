import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  parseGdAnnotation,
  checkSceneDrift,
  checkOrphanScene,
} from "../../doctor/check-scene-drift";

describe("parseGdAnnotation — TSX 파일의 // @gd: 주석 파싱", () => {
  it("기본 형식 추출", () => {
    const tsx = `// @gd: chats/scenes/login.chat.md\nimport ...`;
    expect(parseGdAnnotation(tsx)).toBe("chats/scenes/login.chat.md");
  });

  it("공백 변동에도 추출", () => {
    const tsx = `//  @gd:   chats/scenes/x.chat.md  \n...`;
    expect(parseGdAnnotation(tsx)).toBe("chats/scenes/x.chat.md");
  });

  it("annotation 없으면 null", () => {
    const tsx = `import React from 'react';`;
    expect(parseGdAnnotation(tsx)).toBeNull();
  });

  it("첫 줄 외 위치는 무시 (최상단만 인식)", () => {
    const tsx = `import React from 'react';\n// @gd: too/late.chat.md`;
    expect(parseGdAnnotation(tsx)).toBeNull();
  });
});

describe("checkSceneDrift — chat.md mtime > TSX mtime 시 진단", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "scene-drift-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("TSX 가 chat.md 보다 최신이면 진단 없음", () => {
    mkdirSync(join(tempDir, "chats", "scenes"), { recursive: true });
    mkdirSync(join(tempDir, "src", "scenes"), { recursive: true });
    const chatPath = join(tempDir, "chats", "scenes", "x.chat.md");
    const tsxPath = join(tempDir, "src", "scenes", "x.tsx");
    writeFileSync(chatPath, "test");
    writeFileSync(tsxPath, `// @gd: chats/scenes/x.chat.md\nexport {};`);
    // chat 을 *과거* 로 설정 (TSX 가 더 최신)
    const past = new Date(Date.now() - 60_000);
    utimesSync(chatPath, past, past);

    const diags = checkSceneDrift(tempDir);
    expect(diags).toHaveLength(0);
  });

  it("chat.md 가 TSX 보다 최신이면 scene-drift error", () => {
    mkdirSync(join(tempDir, "chats", "scenes"), { recursive: true });
    mkdirSync(join(tempDir, "src", "scenes"), { recursive: true });
    const chatPath = join(tempDir, "chats", "scenes", "y.chat.md");
    const tsxPath = join(tempDir, "src", "scenes", "y.tsx");
    writeFileSync(tsxPath, `// @gd: chats/scenes/y.chat.md\nexport {};`);
    // TSX 를 *과거* 로 설정 (chat 이 더 최신)
    const past = new Date(Date.now() - 60_000);
    utimesSync(tsxPath, past, past);
    writeFileSync(chatPath, "test");

    const diags = checkSceneDrift(tempDir);
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0]?.category).toBe("scene-drift");
    expect(diags[0]?.hint).toContain("pnpm gd react");
  });

  it("annotation 없는 TSX 는 unmanaged 경고", () => {
    mkdirSync(join(tempDir, "src", "scenes"), { recursive: true });
    writeFileSync(join(tempDir, "src", "scenes", "manual.tsx"), `export const X = () => null;`);
    const diags = checkSceneDrift(tempDir);
    // unmanaged 는 orphan-scene 카테고리에서 처리 — 본 함수는 scene-drift 만
    // 따라서 여기는 진단 없음 (annotation 미존재 = 비교 대상 없음 = drift 없음)
    expect(diags.filter((d) => d.category === "scene-drift")).toHaveLength(0);
  });
});

describe("checkOrphanScene — TSX 만 남았거나 unmanaged TSX 진단", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "orphan-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("annotation 가리키는 chat 이 존재하면 진단 없음", () => {
    mkdirSync(join(tempDir, "chats", "scenes"), { recursive: true });
    mkdirSync(join(tempDir, "src", "scenes"), { recursive: true });
    writeFileSync(join(tempDir, "chats", "scenes", "a.chat.md"), "");
    writeFileSync(join(tempDir, "src", "scenes", "a.tsx"), `// @gd: chats/scenes/a.chat.md\n`);

    const diags = checkOrphanScene(tempDir);
    expect(diags).toHaveLength(0);
  });

  it("annotation chat.md 가 존재 안 하면 orphan error", () => {
    mkdirSync(join(tempDir, "src", "scenes"), { recursive: true });
    writeFileSync(join(tempDir, "src", "scenes", "b.tsx"), `// @gd: chats/scenes/missing.chat.md\n`);

    const diags = checkOrphanScene(tempDir);
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0]?.category).toBe("orphan-scene");
    expect(diags[0]?.message).toContain("missing");
  });

  it("annotation 없는 TSX 는 unmanaged warn", () => {
    mkdirSync(join(tempDir, "src", "scenes"), { recursive: true });
    writeFileSync(join(tempDir, "src", "scenes", "manual.tsx"), `export const X = () => null;`);

    const diags = checkOrphanScene(tempDir);
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0]?.category).toBe("orphan-scene");
    expect(diags[0]?.severity).toBe("warn");
  });
});
