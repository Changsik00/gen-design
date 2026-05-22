import { describe, it, expect } from "vitest";
import { parseMergeArgs } from "../merge";

describe("parseMergeArgs", () => {
  it("기본값 반환 — 인수 없음", () => {
    const result = parseMergeArgs([]);
    expect(result).toEqual({
      apply: false,
      yes: false,
      threshold: 3,
      chatRoot: undefined,
      help: false,
    });
  });

  it("--apply 플래그", () => {
    const result = parseMergeArgs(["--apply"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.apply).toBe(true);
  });

  it("--yes 플래그", () => {
    const result = parseMergeArgs(["--yes"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.yes).toBe(true);
  });

  it("--threshold 정상값", () => {
    const result = parseMergeArgs(["--threshold", "2"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.threshold).toBe(2);
  });

  it("--threshold 음수 → error", () => {
    const result = parseMergeArgs(["--threshold", "-1"]);
    expect(result).toHaveProperty("error");
  });

  it("--threshold 0 → error", () => {
    const result = parseMergeArgs(["--threshold", "0"]);
    expect(result).toHaveProperty("error");
  });

  it("--threshold 문자열 → error", () => {
    const result = parseMergeArgs(["--threshold", "abc"]);
    expect(result).toHaveProperty("error");
  });

  it("--threshold 인수 누락 → error", () => {
    const result = parseMergeArgs(["--threshold"]);
    expect(result).toHaveProperty("error");
  });

  it("--chat-root 설정", () => {
    const result = parseMergeArgs(["--chat-root", "/tmp/chats"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.chatRoot).toBe("/tmp/chats");
  });

  it("--chat-root 인수 누락 → error", () => {
    const result = parseMergeArgs(["--chat-root"]);
    expect(result).toHaveProperty("error");
  });

  it("--help 플래그", () => {
    const result = parseMergeArgs(["--help"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.help).toBe(true);
  });

  it("-h 플래그", () => {
    const result = parseMergeArgs(["-h"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.help).toBe(true);
  });

  it("복합 플래그: --apply --yes --threshold 5", () => {
    const result = parseMergeArgs(["--apply", "--yes", "--threshold", "5"]);
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.apply).toBe(true);
    expect(result.yes).toBe(true);
    expect(result.threshold).toBe(5);
  });

  it("알 수 없는 플래그 → error", () => {
    const result = parseMergeArgs(["--unknown-flag"]);
    expect(result).toHaveProperty("error");
  });
});
