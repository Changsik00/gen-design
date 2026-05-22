import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { postprocess } from "../src/postprocess";

describe("postprocess", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "postprocess-test-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("package.json 의 name 필드를 projectName 으로 치환", async () => {
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "{{project-name}}", version: "0.1.0" }, null, 2),
    );
    await postprocess(dir, "my-cool-app");
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.name).toBe("my-cool-app");
    expect(pkg.version).toBe("0.1.0");
  });

  it("README.md 의 {{project-name}} placeholder 치환", async () => {
    writeFileSync(join(dir, "README.md"), "# {{project-name}}\n\n> {{project-name}} 시작\n");
    await postprocess(dir, "my-app");
    const readme = readFileSync(join(dir, "README.md"), "utf-8");
    expect(readme).toContain("# my-app");
    expect(readme).toContain("> my-app 시작");
    expect(readme).not.toContain("{{project-name}}");
  });

  it(".gd/memory/MEMORY.md 초기 인덱스 생성", async () => {
    mkdirSync(join(dir, ".gd", "memory"), { recursive: true });
    await postprocess(dir, "my-app");
    const memoryPath = join(dir, ".gd", "memory", "MEMORY.md");
    expect(existsSync(memoryPath)).toBe(true);
    const content = readFileSync(memoryPath, "utf-8");
    expect(content).toContain("my-app");
  });

  it(".gd/memory/project.md placeholder 파일 생성", async () => {
    mkdirSync(join(dir, ".gd", "memory"), { recursive: true });
    await postprocess(dir, "my-app");
    expect(existsSync(join(dir, ".gd", "memory", "project.md"))).toBe(true);
  });

  it(".gd/memory/ 4 entry (designer/project/decisions/feedback) 모두 생성", async () => {
    mkdirSync(join(dir, ".gd", "memory"), { recursive: true });
    await postprocess(dir, "my-app");
    const memoryDir = join(dir, ".gd", "memory");
    expect(existsSync(join(memoryDir, "designer.md"))).toBe(true);
    expect(existsSync(join(memoryDir, "project.md"))).toBe(true);
    expect(existsSync(join(memoryDir, "decisions.md"))).toBe(true);
    expect(existsSync(join(memoryDir, "feedback.md"))).toBe(true);
  });

  it("memory entry 들이 Claude auto-memory 형식 frontmatter 를 갖음", async () => {
    mkdirSync(join(dir, ".gd", "memory"), { recursive: true });
    await postprocess(dir, "my-app");
    const memoryDir = join(dir, ".gd", "memory");
    for (const name of ["designer.md", "project.md", "decisions.md", "feedback.md"]) {
      const content = readFileSync(join(memoryDir, name), "utf-8");
      expect(content).toMatch(/^---\n/);
      expect(content).toContain("name:");
      expect(content).toContain("description:");
      expect(content).toContain("type:");
    }
  });

  it("idempotent (4 entry) — 두 번 호출 시 디자이너가 채운 내용 보존", async () => {
    mkdirSync(join(dir, ".gd", "memory"), { recursive: true });
    await postprocess(dir, "my-app");
    // 디자이너가 designer.md 에 한 줄 추가
    const designerPath = join(dir, ".gd", "memory", "designer.md");
    const original = readFileSync(designerPath, "utf-8");
    const customized = original + "\n- 이름: dennis\n";
    writeFileSync(designerPath, customized, "utf-8");
    // 두 번째 postprocess — 보존되어야 함
    await postprocess(dir, "my-app");
    const after = readFileSync(designerPath, "utf-8");
    expect(after).toBe(customized);
  });

  it(".gd/ 디렉토리가 없어도 무시 (silent)", async () => {
    writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "{{project-name}}" }));
    await expect(postprocess(dir, "my-app")).resolves.toBeUndefined();
  });

  it("package.json 이 없어도 무시 (silent)", async () => {
    writeFileSync(join(dir, "README.md"), "# {{project-name}}");
    await expect(postprocess(dir, "my-app")).resolves.toBeUndefined();
    const readme = readFileSync(join(dir, "README.md"), "utf-8");
    expect(readme).toContain("# my-app");
  });

  it("idempotent — 두 번 실행해도 결과 동일", async () => {
    writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "{{project-name}}" }));
    writeFileSync(join(dir, "README.md"), "# {{project-name}}");
    await postprocess(dir, "my-app");
    await postprocess(dir, "my-app");
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.name).toBe("my-app");
  });
});
