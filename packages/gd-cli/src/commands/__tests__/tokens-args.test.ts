import { describe, it, expect } from "vitest";
import { parseTokensArgs } from "../tokens";

describe("parseTokensArgs", () => {
  // list
  it("list 서브명령", () => {
    const r = parseTokensArgs(["list"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.subcommand).toBe("list");
  });

  it("list --category color", () => {
    const r = parseTokensArgs(["list", "--category", "color"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.subcommand).toBe("list");
    expect(r.category).toBe("color");
  });

  it("list --category radius", () => {
    const r = parseTokensArgs(["list", "--category", "radius"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.category).toBe("radius");
  });

  it("list --tokens-root custom/path", () => {
    const r = parseTokensArgs(["list", "--tokens-root", "custom/path"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.tokensRoot).toBe("custom/path");
  });

  // find
  it("find 서브명령 + 키워드", () => {
    const r = parseTokensArgs(["find", "primary"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.subcommand).toBe("find");
    expect(r.keyword).toBe("primary");
  });

  it("find 키워드 누락 → error", () => {
    const r = parseTokensArgs(["find"]);
    expect("error" in r).toBe(true);
  });

  // show
  it("show 서브명령 + 이름", () => {
    const r = parseTokensArgs(["show", "background"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.subcommand).toBe("show");
    expect(r.name).toBe("background");
  });

  it("show 이름 누락 → error", () => {
    const r = parseTokensArgs(["show"]);
    expect("error" in r).toBe(true);
  });

  // help
  it("--help 플래그", () => {
    const r = parseTokensArgs(["--help"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.help).toBe(true);
  });

  it("list --help", () => {
    const r = parseTokensArgs(["list", "--help"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.help).toBe(true);
  });

  // 오류
  it("서브명령 없음 → error", () => {
    const r = parseTokensArgs([]);
    expect("error" in r).toBe(true);
  });

  it("알 수 없는 서브명령 → error", () => {
    const r = parseTokensArgs(["unknown"]);
    expect("error" in r).toBe(true);
  });

  it("list --category 값 누락 → error", () => {
    const r = parseTokensArgs(["list", "--category"]);
    expect("error" in r).toBe(true);
  });

  it("list --tokens-root 값 누락 → error", () => {
    const r = parseTokensArgs(["list", "--tokens-root"]);
    expect("error" in r).toBe(true);
  });

  it("알 수 없는 옵션 → error", () => {
    const r = parseTokensArgs(["list", "--unknown"]);
    expect("error" in r).toBe(true);
  });
});
