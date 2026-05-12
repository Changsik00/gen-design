import { describe, it, expect } from "vitest";
import { parseDiffArgs } from "../diff";

describe("parseDiffArgs — 정상", () => {
  it("기본 chat + tree", () => {
    const r = parseDiffArgs(["chat.md", "tree.json"]);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.chat).toBe("chat.md");
      expect(r.tree).toBe("tree.json");
      expect(r.apply).toBeFalsy();
    }
  });

  it("--apply + --output", () => {
    const r = parseDiffArgs(["chat.md", "tree.json", "--apply", "--output", "out.md"]);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.apply).toBe(true);
      expect(r.output).toBe("out.md");
    }
  });

  it("--threshold + --date + --no-history", () => {
    const r = parseDiffArgs([
      "chat.md",
      "tree.json",
      "--threshold",
      "0.7",
      "--date",
      "2026-05-12",
      "--no-history",
    ]);
    if ("error" in r) throw new Error(r.error);
    expect(r.threshold).toBe(0.7);
    expect(r.date).toBe("2026-05-12");
    expect(r.noHistory).toBe(true);
  });

  it("--help", () => {
    const r = parseDiffArgs(["--help"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.help).toBe(true);
  });
});

describe("parseDiffArgs — 오류", () => {
  it("positional 부족 → error", () => {
    const r = parseDiffArgs(["chat.md"]);
    expect("error" in r).toBe(true);
  });

  it("positional 초과 → error", () => {
    const r = parseDiffArgs(["chat.md", "tree.json", "extra.md"]);
    expect("error" in r).toBe(true);
  });

  it("--threshold 범위 외 → error", () => {
    const r = parseDiffArgs(["chat.md", "tree.json", "--threshold", "2"]);
    expect("error" in r).toBe(true);
  });

  it("--date 형식 X → error", () => {
    const r = parseDiffArgs(["chat.md", "tree.json", "--date", "yesterday"]);
    expect("error" in r).toBe(true);
  });

  it("미지의 옵션 → error", () => {
    const r = parseDiffArgs(["chat.md", "tree.json", "--unknown"]);
    expect("error" in r).toBe(true);
  });
});
