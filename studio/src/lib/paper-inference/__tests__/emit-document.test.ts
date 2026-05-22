import { describe, it, expect } from "vitest";
import { emitDocument } from "../emit-document";
import { parse } from "../../chat-md/parser";
import type { ChatFrontmatter, Document } from "../../chat-md/parser/ast-types";

const NULL_LOC = { line: 0, col: 0, offset: 0, length: 0 };

const baseDoc = (overrides: Partial<Document> = {}): Document => ({
  type: "Document",
  body: [],
  frontmatter: null,
  title: null,
  narrative: null,
  structure: null,
  history: null,
  ...overrides,
});

describe("emitDocument — frontmatter serialize", () => {
  it("top-level scalar", () => {
    const fm: ChatFrontmatter = { type: "scene", name: "Login", identity: "chats/scenes/login" };
    const text = emitDocument(baseDoc({ frontmatter: fm }));
    expect(text).toMatch(/^---\n/);
    expect(text).toMatch(/type: scene/);
    expect(text).toMatch(/name: Login/);
    expect(text).toMatch(/identity: chats\/scenes\/login/);
    expect(text).toMatch(/\n---\n/);
  });

  it("nested object — shell", () => {
    const fm: ChatFrontmatter = {
      type: "scene",
      name: "Login",
      shell: { inherit: true, exclude: ["BrandHeader"] },
    };
    const text = emitDocument(baseDoc({ frontmatter: fm }));
    expect(text).toMatch(/shell:\n {2}inherit: true/);
    expect(text).toMatch(/exclude: \[BrandHeader\]/);
  });

  it("YAML list (references)", () => {
    const fm: ChatFrontmatter = {
      type: "scene",
      name: "X",
      references: ["chats/components/a.chat.md", "chats/components/b.chat.md"],
    };
    const text = emitDocument(baseDoc({ frontmatter: fm }));
    expect(text).toMatch(/references:\n {2}- chats\/components\/a\.chat\.md/);
    expect(text).toMatch(/ {2}- chats\/components\/b\.chat\.md/);
  });
});

describe("emitDocument — sections", () => {
  it("title # H1", () => {
    const text = emitDocument(baseDoc({ title: "LoginScene" }));
    expect(text).toMatch(/^# LoginScene\n/m);
  });

  it("Narrative section", () => {
    const text = emitDocument(
      baseDoc({
        narrative: { type: "Narrative", markdown: "자연어 설계 의도", location: NULL_LOC },
      }),
    );
    expect(text).toMatch(/## 💬 Narrative/);
    expect(text).toMatch(/자연어 설계 의도/);
  });

  it("Structure section with JSX fence", () => {
    const text = emitDocument(
      baseDoc({
        structure: {
          type: "Structure",
          body: [
            {
              type: "ComponentInstance",
              name: "LoginForm",
              props: {},
              children: [],
              location: NULL_LOC,
            },
          ],
          location: NULL_LOC,
        },
      }),
    );
    expect(text).toMatch(/## 🧩 Structure/);
    expect(text).toMatch(/```jsx/);
    expect(text).toMatch(/<LoginForm \/>/);
    expect(text).toMatch(/```$/m);
  });

  it("History section", () => {
    const text = emitDocument(
      baseDoc({
        history: {
          type: "History",
          markdown: "- **2026-05-12** 초안",
          location: NULL_LOC,
        },
      }),
    );
    expect(text).toMatch(/## 📜 History/);
    expect(text).toMatch(/2026-05-12/);
  });
});

describe("emitDocument — legacy (frontmatter 없음)", () => {
  it("body 만 있는 입력 → body 출력 (호환)", () => {
    const text = emitDocument(
      baseDoc({
        body: [
          {
            type: "ComponentInstance",
            name: "X",
            props: {},
            children: [],
            location: NULL_LOC,
          },
        ],
      }),
    );
    expect(text).toMatch(/<X \/>/);
    expect(text).not.toMatch(/^---/);
  });
});

describe("emitDocument — round-trip", () => {
  it("emit(parse(text)) 의 핵심 영역 보존 (frontmatter + Narrative + Structure)", () => {
    const original = `---
type: scene
name: LoginScene
identity: chats/scenes/login
---

# LoginScene

## 💬 Narrative

로그인 진입점.

## 🧩 Structure

\`\`\`jsx
<LoginForm />
\`\`\`

## 📜 History

- **2026-05-12** 초안
`;
    const r = parse(original, { skipSchema: true });
    expect(r.ok).toBe(true);
    const emitted = emitDocument(r.ast!);
    const r2 = parse(emitted, { skipSchema: true });
    expect(r2.ok).toBe(true);
    expect(r2.ast?.frontmatter?.name).toBe("LoginScene");
    expect(r2.ast?.title).toBe("LoginScene");
    expect(r2.ast?.narrative?.markdown).toMatch(/로그인 진입점/);
    expect(r2.ast?.history?.markdown).toMatch(/2026-05-12/);
  });
});
