import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync, mkdirSync, cpSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { main } from "../src/cli";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("cli main (--offline 모드)", () => {
  let tempDir: string;
  let prevCwd: string;
  let presetsBundledDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "cli-test-"));
    prevCwd = process.cwd();
    process.chdir(tempDir);

    // bundled preset 가 dist/../presets-bundled 에서 찾아지므로,
    // 테스트는 src/../presets-bundled 위치에서 동작
    // src 기준: packages/create-gd-react/src/cli.ts → packages/create-gd-react/presets-bundled/
    presetsBundledDir = join(__dirname, "..", "presets-bundled", "default");
    // 테스트용 임시 bundled preset (fixture 복사)
    if (!existsSync(presetsBundledDir)) {
      mkdirSync(presetsBundledDir, { recursive: true });
      cpSync(join(__dirname, "fixtures", "sample-preset"), presetsBundledDir, { recursive: true });
      mkdirSync(join(presetsBundledDir, ".gd", "memory"), { recursive: true });
      writeFileSync(join(presetsBundledDir, ".gd", "memory", ".gitkeep"), "");
    }
  });

  afterEach(() => {
    process.chdir(prevCwd);
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("--offline --no-install 로 scaffold 성공", async () => {
    const code = await main(["my-app", "--offline", "--no-install"]);
    expect(code).toBe(0);
    expect(existsSync(join(tempDir, "my-app", "package.json"))).toBe(true);
    expect(existsSync(join(tempDir, "my-app", "README.md"))).toBe(true);
  });

  it("scaffold 후 package.json 의 name 이 projectName 으로 치환", async () => {
    await main(["my-cool-app", "--offline", "--no-install"]);
    const pkg = JSON.parse(readFileSync(join(tempDir, "my-cool-app", "package.json"), "utf-8"));
    expect(pkg.name).toBe("my-cool-app");
  });

  it("scaffold 후 README placeholder 치환", async () => {
    await main(["app-with-placeholder", "--offline", "--no-install"]);
    const readme = readFileSync(join(tempDir, "app-with-placeholder", "README.md"), "utf-8");
    expect(readme).not.toContain("{{project-name}}");
  });

  it(".gd/memory/MEMORY.md 초기 인덱스 생성", async () => {
    await main(["memory-test-app", "--offline", "--no-install"]);
    expect(existsSync(join(tempDir, "memory-test-app", ".gd", "memory", "MEMORY.md"))).toBe(true);
  });

  it("유효하지 않은 이름은 거부", async () => {
    const code = await main(["My Bad Name!", "--offline", "--no-install"]);
    expect(code).toBe(1);
  });

  it("이름 누락 시 1 반환", async () => {
    const code = await main(["--offline", "--no-install"]);
    expect(code).toBe(1);
  });

  it("기존 디렉토리에 --force 없으면 거부", async () => {
    mkdirSync(join(tempDir, "existing"));
    writeFileSync(join(tempDir, "existing", "occupied.txt"), "x");
    const code = await main(["existing", "--offline", "--no-install"]);
    expect(code).toBe(1);
  });

  it("--help 출력 후 0 반환", async () => {
    const code = await main(["--help"]);
    expect(code).toBe(0);
  });

  it("--version 출력 후 0 반환", async () => {
    const code = await main(["--version"]);
    expect(code).toBe(0);
  });
});
