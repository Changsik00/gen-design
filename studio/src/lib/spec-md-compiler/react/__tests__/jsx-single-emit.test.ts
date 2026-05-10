import { describe, it, expect } from "vitest";
import { compileToReact } from "../compile";

/**
 * JSX 단일 emit 검증 (Critical C2).
 *
 * 기존 compile.ts:72-91 은 jsxBody 를 함수 body (`bodyContent`) 와 return
 * statement 양쪽에 동시에 emit → 첫 블록은 syntax error.
 *
 * 단일 emit 후: jsxBody 는 return 의 `<>...</>` 안에만 한 번 등장.
 */
describe("compileToReact — JSX single emit (C2)", () => {
  it("<Button /> 컴파일: function body 에는 JSX 없음", () => {
    const result = compileToReact({
      text: "<Button />",
      componentName: "MyPage",
    });
    expect(result.ok).toBe(true);

    const tsx = result.tsx ?? "";
    const lines = tsx.split("\n");
    const fnHeader = lines.findIndex((l) => l.includes("export function MyPage"));
    const returnLine = lines.findIndex((l) => l.trim().startsWith("return ("));
    expect(fnHeader).toBeGreaterThanOrEqual(0);
    expect(returnLine).toBeGreaterThan(fnHeader);

    const beforeReturn = lines.slice(fnHeader + 1, returnLine).join("\n");
    expect(beforeReturn).not.toContain("<Button");
  });

  it("<Button /> 컴파일: return 안에는 1회만 등장", () => {
    const result = compileToReact({
      text: "<Button />",
      componentName: "MyPage",
    });
    expect(result.ok).toBe(true);
    const tsx = result.tsx ?? "";
    const matches = tsx.match(/<Button/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("hookLines + JSX 동시 보유 시: hook 만 body, JSX 만 return", () => {
    const input = [
      "<Button />",
      "## Behavior",
      "- state: open: boolean = false",
    ].join("\n");
    const result = compileToReact({ text: input, componentName: "MyPage" });
    expect(result.ok).toBe(true);

    const tsx = result.tsx ?? "";
    const lines = tsx.split("\n");
    const fnHeader = lines.findIndex((l) => l.includes("export function MyPage"));
    const returnLine = lines.findIndex((l) => l.trim().startsWith("return ("));
    const beforeReturn = lines.slice(fnHeader + 1, returnLine).join("\n");

    expect(beforeReturn).toContain("useState");
    expect(beforeReturn).not.toContain("<Button");

    const matches = tsx.match(/<Button/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("<LoginPage /> + componentName=LoginPage: self-import 생략 (C9)", () => {
    const result = compileToReact({
      text: "<LoginPage />",
      componentName: "LoginPage",
    });
    expect(result.ok).toBe(true);
    const tsx = result.tsx ?? "";
    expect(tsx).not.toMatch(
      /import\s*\{\s*LoginPage\s*\}\s*from\s*['"]@\/components\/templates\/LoginPage['"]/,
    );
    expect(tsx).toContain("export function LoginPage()");
  });

  it("<LoginPage /> + componentName=Other: 정상 import (excludeName 미적용)", () => {
    const result = compileToReact({
      text: "<LoginPage />",
      componentName: "Other",
    });
    expect(result.ok).toBe(true);
    const tsx = result.tsx ?? "";
    expect(tsx).toContain("@/components/templates/LoginPage");
  });
});
