import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runTokens } from "../tokens";

let workDir: string;
let tokensRoot: string;

const TOKENS_JSON = JSON.stringify({
  $schema: "https://design-tokens.github.io/community-group/format/",
  $description: "테스트용 tokens",
  color: {
    background: {
      $type: "color",
      $value: { light: "oklch(1 0 0)", dark: "oklch(0.145 0 0)" },
      $description: "페이지 배경",
    },
    foreground: {
      $type: "color",
      $value: { light: "oklch(0.145 0 0)", dark: "oklch(0.985 0 0)" },
      $description: "본문 텍스트",
    },
    primary: {
      $type: "color",
      $value: { light: "oklch(0.205 0 0)", dark: "oklch(0.922 0 0)" },
      $description: "브랜드 메인",
    },
    "primary-foreground": {
      $type: "color",
      $value: { light: "oklch(0.985 0 0)", dark: "oklch(0.205 0 0)" },
      $description: "primary 위 텍스트",
    },
    secondary: {
      $type: "color",
      $value: { light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
      $description: "보조 surface",
    },
  },
  radius: {
    sm: {
      $type: "dimension",
      $value: "0.125rem",
      $description: "소형 반경",
    },
    md: {
      $type: "dimension",
      $value: "0.375rem",
      $description: "중형 반경",
    },
  },
  fontFamily: {
    sans: {
      $type: "fontFamily",
      $value: "Inter, sans-serif",
      $description: "기본 폰트",
    },
  },
});

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "tokens-runtime-"));
  tokensRoot = join(workDir, "tokens-dir");
  mkdirSync(tokensRoot, { recursive: true });
  writeFileSync(join(tokensRoot, "tokens.json"), TOKENS_JSON, "utf-8");
});

afterEach(() => {
  rmSync(workDir, { recursive: true });
});

describe("runTokens — list", () => {
  it("전체 목록 — 8개 토큰 출력, exitCode 0", async () => {
    const r = await runTokens(["list", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stderr).toBe("");
    // 총 토큰 수 line
    expect(r.stdout).toContain("총 8개 토큰");
  });

  it("color 카테고리만 — 5개 포함", async () => {
    const r = await runTokens(["list", "--category", "color", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("background");
    expect(r.stdout).toContain("primary");
    expect(r.stdout).not.toContain("sans");
  });

  it("radius 카테고리만 — sm/md 포함", async () => {
    const r = await runTokens(["list", "--category", "radius", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("sm");
    expect(r.stdout).toContain("md");
    expect(r.stdout).not.toContain("background");
  });

  it("존재하지 않는 카테고리 → exitCode 1", async () => {
    const r = await runTokens(["list", "--category", "nonexistent", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(1);
  });

  it("light/dark 값 모두 출력", async () => {
    const r = await runTokens(["list", "--category", "color", "--tokens-root", tokensRoot]);
    expect(r.stdout).toContain("oklch(1 0 0)");
    expect(r.stdout).toContain("oklch(0.145 0 0)");
  });
});

describe("runTokens — find", () => {
  it("'primary' 검색 → primary, primary-foreground 매칭", async () => {
    const r = await runTokens(["find", "primary", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("primary");
    expect(r.stdout).toContain("primary-foreground");
  });

  it("'배경' 검색 (설명 매칭) → background 포함", async () => {
    const r = await runTokens(["find", "배경", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("background");
  });

  it("존재하지 않는 키워드 → exitCode 0 + 안내 메시지", async () => {
    const r = await runTokens(["find", "존재하지않는키워드xyz", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("없습니다");
  });
});

describe("runTokens — show", () => {
  it("background 상세 — CSS 변수명, light, dark, 설명 포함", async () => {
    const r = await runTokens(["show", "background", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("--background");
    expect(r.stdout).toContain("oklch(1 0 0)");
    expect(r.stdout).toContain("oklch(0.145 0 0)");
    expect(r.stdout).toContain("페이지 배경");
  });

  it("단일값 토큰 (radius.sm) — value 포함", async () => {
    const r = await runTokens(["show", "sm", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("--sm");
    expect(r.stdout).toContain("0.125rem");
  });

  it("존재하지 않는 이름 → exitCode 1", async () => {
    const r = await runTokens(["show", "nonexistent", "--tokens-root", tokensRoot]);
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toContain("찾을 수 없습니다");
  });
});

describe("runTokens — 공통", () => {
  it("--help → exitCode 0, list/find/show 안내 포함", async () => {
    const r = await runTokens(["--help"]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("list");
    expect(r.stdout).toContain("find");
    expect(r.stdout).toContain("show");
  });

  it("tokens.json 없는 경로 → exitCode 1", async () => {
    const r = await runTokens(["list", "--tokens-root", "/nonexistent/path/to/tokens"]);
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toContain("찾을 수 없습니다");
  });
});
