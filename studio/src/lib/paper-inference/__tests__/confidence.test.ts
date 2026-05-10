import { describe, it, expect } from "vitest";
import { score } from "../confidence";

const exactMatch = { matched: true, exact: true, distance: 0, suggestion: null };
const fuzzy1 = { matched: true, exact: false, distance: 1, suggestion: "Button" };
const fuzzy2 = { matched: true, exact: false, distance: 2, suggestion: "Button" };
const noMatch = { matched: false, exact: false, distance: null, suggestion: null };

describe("confidence score", () => {
  it("exact + styleAlign → 1.0", () => {
    expect(score({ match: exactMatch, styleAlign: { aligned: true } })).toBe(1.0);
  });

  it("exact + no styleAlign → 0.85", () => {
    expect(score({ match: exactMatch })).toBe(0.85);
  });

  it("exact + styleAlign.aligned=false → 0.85", () => {
    expect(score({ match: exactMatch, styleAlign: { aligned: false } })).toBe(0.85);
  });

  it("fuzzy distance 1 → 0.7", () => {
    expect(score({ match: fuzzy1 })).toBe(0.7);
  });

  it("fuzzy distance 2 → 0.5", () => {
    expect(score({ match: fuzzy2 })).toBe(0.5);
  });

  it("미매칭 → 0.0", () => {
    expect(score({ match: noMatch })).toBe(0.0);
  });
});
