import { describe, it, expect } from "vitest";
import { parseReactArgs } from "../react";

describe("parseReactArgs", () => {
  it("기본 slug", () => {
    const r = parseReactArgs(["login"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.slug).toBe("login");
  });

  it("--chat-root + --output + --no-shell", () => {
    const r = parseReactArgs(["login", "--chat-root", "playground/chats", "--output", "x.tsx", "--no-shell"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.chatRoot).toBe("playground/chats");
    expect(r.output).toBe("x.tsx");
    expect(r.noShell).toBe(true);
  });

  it("--help", () => {
    const r = parseReactArgs(["--help"]);
    if ("error" in r) throw new Error(r.error);
    expect(r.help).toBe(true);
  });

  it("slug 부재 → error", () => {
    const r = parseReactArgs([]);
    expect("error" in r).toBe(true);
  });

  it("미지의 옵션 → error", () => {
    const r = parseReactArgs(["login", "--unknown"]);
    expect("error" in r).toBe(true);
  });

  it("--chat-root 값 누락 → error", () => {
    const r = parseReactArgs(["login", "--chat-root"]);
    expect("error" in r).toBe(true);
  });
});
