import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { copyPreset } from "../src/fallback";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SAMPLE_PRESET = join(__dirname, "fixtures", "sample-preset");

describe("copyPreset (fallback)", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "create-gd-react-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("preset 디렉토리의 모든 파일을 target 으로 복사", async () => {
    const target = join(tempDir, "my-app");
    await copyPreset(SAMPLE_PRESET, target);

    expect(existsSync(join(target, "package.json"))).toBe(true);
    expect(existsSync(join(target, "README.md"))).toBe(true);
    expect(existsSync(join(target, "src", "main.tsx"))).toBe(true);
  });

  it("dot-prefixed 디렉토리도 복사 (.claude/)", async () => {
    const target = join(tempDir, "my-app");
    await copyPreset(SAMPLE_PRESET, target);

    expect(existsSync(join(target, ".claude", "skills", "gd-start.md"))).toBe(true);
  });

  it("파일 내용을 보존 (변환 없이)", async () => {
    const target = join(tempDir, "my-app");
    await copyPreset(SAMPLE_PRESET, target);

    const pkg = readFileSync(join(target, "package.json"), "utf-8");
    expect(pkg).toContain("{{project-name}}"); // 후처리 전이므로 placeholder 그대로
  });

  it("source 가 존재하지 않으면 throw", async () => {
    await expect(copyPreset(join(tempDir, "nonexistent"), join(tempDir, "out"))).rejects.toThrow();
  });

  it("target 디렉토리를 자동 생성", async () => {
    const target = join(tempDir, "deep", "nested", "my-app");
    await copyPreset(SAMPLE_PRESET, target);

    expect(existsSync(target)).toBe(true);
    expect(existsSync(join(target, "package.json"))).toBe(true);
  });
});
