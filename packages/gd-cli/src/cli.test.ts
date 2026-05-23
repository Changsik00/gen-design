import { describe, it, expect } from "vitest";
import { runRouter } from "./cli";

describe("gen-design router", () => {
  it("--help → 도움말 + Subcommands 목록", async () => {
    const r = await runRouter(["--help"]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/Usage/);
    expect(r.stdout).toMatch(/paper-import/);
  });

  it("인자 없음 → 도움말", async () => {
    const r = await runRouter([]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/Usage/);
  });

  it("미지의 명령 → exitCode 2 + stderr", async () => {
    const r = await runRouter(["unknown-cmd"]);
    expect(r.exitCode).toBe(2);
    expect(r.stderr).toMatch(/Unknown command/);
  });

  it("paper-import --help 라우팅", async () => {
    const r = await runRouter(["paper-import", "--help"]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/paper-import/);
  });

  it("paper-import 인자 부재 → 라우팅은 됐지만 paper-import 가 exit 2", async () => {
    const r = await runRouter(["paper-import"]);
    expect(r.exitCode).toBe(2);
    expect(r.stderr).toMatch(/Missing/);
  });

  it("diff subcommand 라우팅", async () => {
    const r = await runRouter(["diff", "--help"]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/Usage: gen-design diff/);
  });

  it("--help 가 diff 도 표시", async () => {
    const r = await runRouter(["--help"]);
    expect(r.stdout).toMatch(/diff/);
  });

  it("react subcommand 라우팅", async () => {
    const r = await runRouter(["react", "--help"]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toMatch(/Usage: gen-design react/);
  });

  it("--help 가 react 도 표시", async () => {
    const r = await runRouter(["--help"]);
    expect(r.stdout).toMatch(/react/);
  });
});
