import { describe, it, expect } from "vitest";
import tokens from "@assets/tokens/tokens.json";
import { validateDtcg } from "../validators/dtcg";

describe("templates/assets/tokens/tokens.json — DTCG 1.0 strict", () => {
  it("DTCG schema 통과", () => {
    const result = validateDtcg(tokens);
    if (!result.valid) {
      console.error("DTCG errors:", result.errors);
      console.error("Unresolved refs:", result.unresolvedReferences);
    }
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.unresolvedReferences).toEqual([]);
  });
});
