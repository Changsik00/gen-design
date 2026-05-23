import { describe, it, expect } from "vitest";
import { parsePaperImportArgs } from "../paper-import";

describe("parsePaperImportArgs — 정상", () => {
  it("기본 file 인자", () => {
    const r = parsePaperImportArgs(["foo/tree.json"]);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.file).toBe("foo/tree.json");
      expect(r.fromStdin).toBeFalsy();
    }
  });

  it("--from-stdin (file 없음 허용)", () => {
    const r = parsePaperImportArgs(["--from-stdin"]);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.fromStdin).toBe(true);
    }
  });

  it("--validate-only", () => {
    const r = parsePaperImportArgs(["foo.json", "--validate-only"]);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.validateOnly).toBe(true);
    }
  });

  it("--output <path>", () => {
    const r = parsePaperImportArgs(["foo.json", "--output", "out.json"]);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.output).toBe("out.json");
    }
  });

  it("--chain inferChat", () => {
    const r = parsePaperImportArgs(["foo.json", "--chain", "inferChat"]);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.chain).toBe("inferChat");
    }
  });

  it("--threshold 0.7", () => {
    const r = parsePaperImportArgs(["foo.json", "--chain", "inferChat", "--threshold", "0.7"]);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.threshold).toBe(0.7);
    }
  });

  it("--help", () => {
    const r = parsePaperImportArgs(["--help"]);
    if ("error" in r) throw new Error("not error");
    expect(r.help).toBe(true);
  });
});

describe("parsePaperImportArgs — 오류", () => {
  it("file 인자 부재 + --from-stdin 부재 → error", () => {
    const r = parsePaperImportArgs([]);
    expect("error" in r).toBe(true);
  });

  it("--threshold 범위 외 (1.5) → error", () => {
    const r = parsePaperImportArgs(["foo.json", "--threshold", "1.5"]);
    expect("error" in r).toBe(true);
  });

  it("--chain 의 미지의 값 → error", () => {
    const r = parsePaperImportArgs(["foo.json", "--chain", "unknown"]);
    expect("error" in r).toBe(true);
  });

  it("미지의 옵션 → error", () => {
    const r = parsePaperImportArgs(["foo.json", "--unknown"]);
    expect("error" in r).toBe(true);
  });

  it("--output 값 누락 → error", () => {
    const r = parsePaperImportArgs(["foo.json", "--output"]);
    expect("error" in r).toBe(true);
  });
});
