import { describe, it, expect } from "vitest";
import { parseLintArgs } from "../lint";

describe("parseLintArgs", () => {
  it("기본값 반환 — 인수 없음", () => {
    const result = parseLintArgs([]);
    expect(result).toEqual({
      chatRoot: undefined,
      help: false,
    });
  });

  it("--chat-root 파싱", () => {
    const result = parseLintArgs(["--chat-root", "playground/chats"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.chatRoot).toBe("playground/chats");
  });

  it("--chat-root 값 누락 → error", () => {
    const result = parseLintArgs(["--chat-root"]);
    expect(result).toHaveProperty("error");
  });

  it("--no-compile 은 이제 unknown flag → error", () => {
    const result = parseLintArgs(["--no-compile"]);
    expect(result).toHaveProperty("error");
  });

  it("--help 파싱", () => {
    const result = parseLintArgs(["--help"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.help).toBe(true);
  });

  it("-h 단축 플래그", () => {
    const result = parseLintArgs(["-h"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.help).toBe(true);
  });

  it("알 수 없는 플래그 → error", () => {
    const result = parseLintArgs(["--unknown-flag"]);
    expect(result).toHaveProperty("error");
  });

  it("--chat-root + --help 조합", () => {
    const result = parseLintArgs(["--chat-root", "x", "--help"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.help).toBe(true);
    expect(result.chatRoot).toBe("x");
  });

  it("--chat-root 다음에 또 다른 --flag → error (값이 아닌 플래그)", () => {
    const result = parseLintArgs(["--chat-root", "--bad"]);
    expect(result).toHaveProperty("error");
  });
});
