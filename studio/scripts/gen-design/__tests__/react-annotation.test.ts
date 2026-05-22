import { describe, it, expect } from "vitest";
import { prependGdAnnotation } from "../react";

describe("prependGdAnnotation — TSX 출력에 // @gd: 자동 삽입", () => {
  it("annotation 없는 TSX 의 최상단에 삽입", () => {
    const tsx = `import { useTranslation } from "react-i18next";\nexport default function Login() { return <div />; }`;
    const out = prependGdAnnotation(tsx, "chats/scenes/login.chat.md");
    expect(out.split("\n", 1)[0]).toBe("// @gd: chats/scenes/login.chat.md");
    expect(out).toContain("export default function Login()");
  });

  it("이미 annotation 있는 TSX 는 *교체* (idempotent)", () => {
    const tsx = `// @gd: old/path.chat.md\nimport x from "y";\n`;
    const out = prependGdAnnotation(tsx, "chats/scenes/login.chat.md");
    expect(out.split("\n", 1)[0]).toBe("// @gd: chats/scenes/login.chat.md");
    expect(out).not.toContain("old/path.chat.md");
  });

  it("공백 변동 annotation 도 교체", () => {
    const tsx = `//  @gd:  weird-spacing.chat.md  \nimport x from "y";`;
    const out = prependGdAnnotation(tsx, "chats/scenes/x.chat.md");
    expect(out.split("\n", 1)[0]).toBe("// @gd: chats/scenes/x.chat.md");
    expect(out).not.toContain("weird-spacing");
  });

  it("빈 TSX 도 처리", () => {
    const out = prependGdAnnotation("", "chats/scenes/y.chat.md");
    expect(out).toBe("// @gd: chats/scenes/y.chat.md\n");
  });
});
