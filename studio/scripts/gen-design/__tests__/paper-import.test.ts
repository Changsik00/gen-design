import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runPaperImport } from "../paper-import";
import type { CatalogMap } from "../../../src/lib/paper-inference/ast-builder";

const tinyCatalog: CatalogMap = new Map();
tinyCatalog.set("Button", [
  { name: "variant", values: ["primary", "ghost"] },
  { name: "size", values: ["sm", "md", "lg"] },
]);

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "paper-import-test-"));
});

afterEach(() => {
  rmSync(workDir, { recursive: true });
});

function writeTree(content: object): string {
  const path = join(workDir, "tree.json");
  writeFileSync(path, JSON.stringify(content), "utf-8");
  return path;
}

const sampleTree = {
  id: "root",
  name: "[chat:scenes/login]",
  component: "Frame",
  children: [
    { id: "c1", name: "Button.primary.sm", component: "Frame" },
  ],
};

describe("runPaperImport — validate-only", () => {
  it("정상 tree → exitCode 0 + ✓ valid", async () => {
    const path = writeTree(sampleTree);
    const r = await runPaperImport([path, "--validate-only"], { catalog: tinyCatalog });
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/valid/);
  });

  it("구조 오류 (id 누락) → exitCode 1", async () => {
    const path = writeTree({ name: "X", component: "Frame" });
    const r = await runPaperImport([path, "--validate-only"], { catalog: tinyCatalog });
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toMatch(/id/);
  });

  it("잘못된 JSON → exitCode 1", async () => {
    const path = join(workDir, "bad.json");
    writeFileSync(path, "{not json", "utf-8");
    const r = await runPaperImport([path, "--validate-only"], { catalog: tinyCatalog });
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toMatch(/Invalid JSON/);
  });
});

describe("runPaperImport — enrich (default)", () => {
  it("출력 JSON 에 identity 채워짐", async () => {
    const path = writeTree(sampleTree);
    const r = await runPaperImport([path], { catalog: tinyCatalog });
    expect(r.exitCode).toBe(0);
    const enriched = JSON.parse(r.stdout) as { identity?: { kind: string; slug: string } };
    expect(enriched.identity?.kind).toBe("scene");
    expect(enriched.identity?.slug).toBe("login");
  });

  it("--output <path> 로 파일 저장", async () => {
    const path = writeTree(sampleTree);
    const out = join(workDir, "enriched.json");
    const r = await runPaperImport([path, "--output", out], { catalog: tinyCatalog });
    expect(r.exitCode).toBe(0);
    const written = JSON.parse(readFileSync(out, "utf-8")) as { identity?: { slug: string } };
    expect(written.identity?.slug).toBe("login");
  });
});

describe("runPaperImport — chain inferChat", () => {
  it("--chain inferChat → chat.md 출력", async () => {
    const path = writeTree(sampleTree);
    const r = await runPaperImport([path, "--chain", "inferChat"], { catalog: tinyCatalog });
    expect(r.exitCode).toBe(0);
    expect(r.stdout.length).toBeGreaterThan(0);
    expect(r.stdout).toMatch(/Button/);
  });

  it("--threshold 0.5 적용", async () => {
    const path = writeTree(sampleTree);
    const r = await runPaperImport([path, "--chain", "inferChat", "--threshold", "0.5"], {
      catalog: tinyCatalog,
    });
    expect(r.exitCode).toBe(0);
  });
});

describe("runPaperImport — stdin / 도움말", () => {
  it("--from-stdin 으로 입력 받음", async () => {
    const r = await runPaperImport(["--from-stdin", "--validate-only"], {
      stdin: async () => JSON.stringify(sampleTree),
      catalog: tinyCatalog,
    });
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/valid/);
  });

  it("--help → 사용법 출력", async () => {
    const r = await runPaperImport(["--help"], { catalog: tinyCatalog });
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/Usage/);
  });

  it("file 부재 → exitCode 2", async () => {
    const r = await runPaperImport([], { catalog: tinyCatalog });
    expect(r.exitCode).toBe(2);
    expect(r.stderr).toMatch(/Missing/);
  });
});
