import { describe, it, expect } from "vitest";
import { runDoctor, parseDoctorArgs } from "../../doctor";

describe("runDoctor — 통합 동작", () => {
  it("--help 출력", async () => {
    const r = await runDoctor(["--help"]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("Usage:");
    expect(r.stdout).toContain("12");
  });

  it("--json 옵션 시 JSON 출력", async () => {
    const r = await runDoctor(["--json", "--chat-root", "/nonexistent"]);
    // JSON parse 가능해야
    const parsed = JSON.parse(r.stdout);
    expect(parsed).toHaveProperty("diags");
    expect(parsed).toHaveProperty("errorCount");
    expect(parsed).toHaveProperty("warnCount");
    expect(parsed).toHaveProperty("durationMs");
  });

  it("알 수 없는 옵션 거부 (exitCode 2)", async () => {
    const r = await runDoctor(["--unknown-flag"]);
    expect(r.exitCode).toBe(2);
    expect(r.stderr).toContain("Unknown option");
  });
});

describe("parseDoctorArgs", () => {
  it("--chat-root + --templates-root", () => {
    const r = parseDoctorArgs(["--chat-root", "/a", "--templates-root", "/b"]);
    expect(r).toEqual({ chatRoot: "/a", templatesRoot: "/b" });
  });

  it("--no-compile / --json / --help", () => {
    const r = parseDoctorArgs(["--no-compile", "--json", "--help"]);
    expect(r).toEqual({ noCompile: true, json: true, help: true });
  });

  it("--chat-root 값 누락 시 error", () => {
    const r = parseDoctorArgs(["--chat-root"]);
    expect(r).toEqual({ error: "--chat-root requires a path argument" });
  });
});
