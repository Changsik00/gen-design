/**
 * Task 2 비교 결과 — peggy 채택 후 smoke test 만 유지.
 *
 * 비교 결정 기록은 spec-7-02 의 walkthrough.md 에 명문화 (Task 10 ship 단계).
 * chevrotain prototype 은 비교 직후 제거.
 *
 * 본 prototype 디렉토리 자체는 Task 6 (parser public API) 합류 시 정리됨.
 */

import { describe, it, expect } from "vitest";
import { parsePlaceholder } from "../peggy-placeholder";

describe("peggy prototype — placeholder happy path", () => {
  const cases = [
    { input: "{{i18n.ko.login-input}}", kind: "i18n", path: "ko.login-input" },
    { input: "{{token.semantic.color.primary}}", kind: "token", path: "semantic.color.primary" },
    { input: "{{i18n.x}}", kind: "i18n", path: "x" },
  ];
  for (const c of cases) {
    it(c.input, () => {
      const r = parsePlaceholder(c.input);
      expect(r.ok, r.error).toBe(true);
      expect(r.kind).toBe(c.kind);
      expect(r.path).toBe(c.path);
    });
  }
});

describe("peggy prototype — friendly error messages", () => {
  const cases = [
    { input: "{{xxx.foo}}", expectIn: 'Expected "i18n" or "token"' },
    { input: "{{i18n}}", expectIn: 'Expected "."' },
    { input: "{i18n.x}}", expectIn: 'Expected "{{"' },
  ];
  for (const c of cases) {
    it(c.input, () => {
      const r = parsePlaceholder(c.input);
      expect(r.ok).toBe(false);
      expect(r.error).toContain(c.expectIn);
    });
  }
});
