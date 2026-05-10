import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { parseArgs, runCompile } from "../spec-paper";

const SPEC_DIR = join(__dirname, "..", "..", "..", "..", "..", "..", "spec");

describe("CLI parseArgs", () => {
  it("file 만", () => {
    const r = parseArgs(["spec/login-page.spec.md"]);
    expect(r).toEqual({ file: "spec/login-page.spec.md" });
  });

  it("--payload 플래그", () => {
    const r = parseArgs(["spec/x.spec.md", "--payload"]);
    expect(r).toEqual({ file: "spec/x.spec.md", payload: true });
  });

  it("--output <path>", () => {
    const r = parseArgs(["spec/x.spec.md", "--output", "out.html"]);
    expect(r).toEqual({ file: "spec/x.spec.md", output: "out.html" });
  });

  it("--no-tailwind", () => {
    const r = parseArgs(["spec/x.spec.md", "--no-tailwind"]);
    expect(r).toEqual({ file: "spec/x.spec.md", withTailwind: false });
  });

  it("파일 누락 → error", () => {
    const r = parseArgs(["--payload"]);
    expect("error" in r).toBe(true);
  });
});

describe("CLI runCompile", () => {
  it("LoginPage → 전체 HTML 기본", () => {
    const r = runCompile({ file: join(SPEC_DIR, "login-page.spec.md") });
    expect(r.exitCode).toBe(0);
    expect(r.output).toContain("<!DOCTYPE html>");
    expect(r.output).toContain("cdn.tailwindcss.com");
    expect(r.output).toContain("로그인");
  });

  it("--payload 시 fragment", () => {
    const r = runCompile({
      file: join(SPEC_DIR, "login-page.spec.md"),
      payload: true,
    });
    expect(r.output).not.toContain("<!DOCTYPE html>");
    expect(r.output).toContain("<style>");
    expect(r.output).toContain("로그인");
  });

  it("--no-tailwind 시 CDN 제외", () => {
    const r = runCompile({
      file: join(SPEC_DIR, "login-page.spec.md"),
      withTailwind: false,
    });
    expect(r.output).not.toContain("cdn.tailwindcss.com");
  });
});
