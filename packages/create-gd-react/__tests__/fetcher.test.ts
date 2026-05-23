import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, existsSync, readFileSync, createReadStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { c as tarCreate } from "tar";
import { extractPresetFromStream } from "../src/fetcher";

describe("extractPresetFromStream (sparse extract)", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "fetcher-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  async function makeFixtureTarball(): Promise<string> {
    // GitHub tarball 구조 모방: gen-design-presets-main/presets/<preset>/...
    const sourceRoot = join(tempDir, "source");
    mkdirSync(join(sourceRoot, "gen-design-presets-main", "presets", "default", "src"), {
      recursive: true,
    });
    mkdirSync(join(sourceRoot, "gen-design-presets-main", "presets", "saas-dashboard"), {
      recursive: true,
    });

    writeFileSync(
      join(sourceRoot, "gen-design-presets-main", "presets", "default", "package.json"),
      JSON.stringify({ name: "{{project-name}}" }),
    );
    writeFileSync(
      join(sourceRoot, "gen-design-presets-main", "presets", "default", "README.md"),
      "# default",
    );
    writeFileSync(
      join(sourceRoot, "gen-design-presets-main", "presets", "default", "src", "main.tsx"),
      "export {};",
    );
    writeFileSync(
      join(sourceRoot, "gen-design-presets-main", "presets", "saas-dashboard", "package.json"),
      JSON.stringify({ name: "other" }),
    );

    const tarballPath = join(tempDir, "fixture.tar.gz");
    await tarCreate(
      { gzip: true, file: tarballPath, cwd: sourceRoot },
      ["gen-design-presets-main"],
    );
    return tarballPath;
  }

  it("지정 preset 의 파일만 추출 (saas-dashboard 는 제외)", async () => {
    const tarball = await makeFixtureTarball();
    const target = join(tempDir, "out");
    await extractPresetFromStream(createReadStream(tarball), "default", target);

    expect(existsSync(join(target, "package.json"))).toBe(true);
    expect(existsSync(join(target, "README.md"))).toBe(true);
    expect(existsSync(join(target, "src", "main.tsx"))).toBe(true);

    // saas-dashboard 는 추출되지 않아야 함
    expect(existsSync(join(target, "saas-dashboard"))).toBe(false);
  });

  it("`*-main/presets/<preset>/` prefix 제거 후 target 에 직접 추출", async () => {
    const tarball = await makeFixtureTarball();
    const target = join(tempDir, "out");
    await extractPresetFromStream(createReadStream(tarball), "default", target);

    // target/package.json 으로 와야 함, target/presets/default/package.json 이 아님
    const pkg = readFileSync(join(target, "package.json"), "utf-8");
    expect(pkg).toContain("{{project-name}}");
  });

  it("존재하지 않는 preset 이면 빈 디렉토리 또는 throw", async () => {
    const tarball = await makeFixtureTarball();
    const target = join(tempDir, "out");

    await expect(
      extractPresetFromStream(createReadStream(tarball), "nonexistent", target),
    ).rejects.toThrow();
  });

  it("target 디렉토리를 자동 생성", async () => {
    const tarball = await makeFixtureTarball();
    const target = join(tempDir, "deep", "nested", "out");
    await extractPresetFromStream(createReadStream(tarball), "default", target);

    expect(existsSync(target)).toBe(true);
    expect(existsSync(join(target, "package.json"))).toBe(true);
  });
});
