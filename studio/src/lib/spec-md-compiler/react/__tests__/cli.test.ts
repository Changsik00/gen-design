import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseArgs, runCompile } from "../cli/spec-react";

describe("parseArgs", () => {
  it("parses file argument", () => {
    const result = parseArgs(["test.md"]);
    if ("error" in result) throw new Error(result.error);
    expect(result.file).toBe("test.md");
    expect(result.registry).toBe(false);
  });

  it("parses --registry flag", () => {
    const result = parseArgs(["test.md", "--registry"]);
    if ("error" in result) throw new Error(result.error);
    expect(result.registry).toBe(true);
  });

  it("parses --name override", () => {
    const result = parseArgs(["test.md", "--name", "MyComponent"]);
    if ("error" in result) throw new Error(result.error);
    expect(result.name).toBe("MyComponent");
  });

  it("returns error when no file provided", () => {
    const result = parseArgs([]);
    expect("error" in result).toBe(true);
  });
});

describe("runCompile", () => {
  it("returns error result for non-existent file", () => {
    const result = runCompile({
      file: "/non/existent/file.md",
      registry: false,
    });
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBeTruthy();
  });
});
