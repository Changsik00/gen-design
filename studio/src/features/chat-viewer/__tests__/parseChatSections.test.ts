import { describe, it, expect } from "vitest";
import { parseChatSections } from "../parseChatSections";

const FULL_CHAT = `---
type: scene
name: LoginScene
identity: chats/scenes/login
created: 2026-05-10
---

# LoginScene

## 💬 Narrative

로그인 진입점. 집중 의도.
헤더 chrome 제거, 본문만 부각.

## 🧩 Structure

\`\`\`jsx
<LoginForm />
<AppFooter />
\`\`\`

## 📜 History

| 날짜 | 변경 |
|---|---|
| 2026-05-10 | 초기 작성 |
`;

describe("parseChatSections", () => {
  it("3섹션 모두 추출", () => {
    const result = parseChatSections(FULL_CHAT);
    expect(result.narrative).toContain("로그인 진입점");
    expect(result.structure).toContain("LoginForm");
    expect(result.history).toContain("2026-05-10");
  });

  it("Narrative 내용 Structure 헤더 직전까지만 포함", () => {
    const result = parseChatSections(FULL_CHAT);
    expect(result.narrative).not.toContain("LoginForm");
    expect(result.narrative).not.toContain("History");
  });

  it("Structure 헤더에 suffix 있어도 추출 — '🧩 Structure (4축)'", () => {
    const text = `## 💬 Narrative\n\n내러티브\n\n## 🧩 Structure (4축)\n\n\`\`\`jsx\n<Button />\n\`\`\`\n\n## 📜 History\n\n히스토리`;
    const result = parseChatSections(text);
    expect(result.structure).toContain("Button");
  });

  it("섹션 없는 텍스트 → 빈 문자열 반환", () => {
    const result = parseChatSections("# Title\n\nsome text without sections");
    expect(result.narrative).toBe("");
    expect(result.structure).toBe("");
    expect(result.history).toBe("");
  });

  it("Narrative 만 있음 → narrative 채워짐, 나머지 빈 문자열", () => {
    const text = `## 💬 Narrative\n\n내용만 있는 파일`;
    const result = parseChatSections(text);
    expect(result.narrative).toContain("내용만 있는 파일");
    expect(result.structure).toBe("");
    expect(result.history).toBe("");
  });

  it("Structure 만 있음 → structure 채워짐, 나머지 빈 문자열", () => {
    const text = `## 🧩 Structure\n\n\`\`\`jsx\n<Card />\n\`\`\``;
    const result = parseChatSections(text);
    expect(result.structure).toContain("Card");
    expect(result.narrative).toBe("");
    expect(result.history).toBe("");
  });

  it("History 만 있음 → history 채워짐", () => {
    const text = `## 📜 History\n\n| 날짜 | 내용 |`;
    const result = parseChatSections(text);
    expect(result.history).toContain("날짜");
    expect(result.narrative).toBe("");
  });

  it("빈 문자열 입력 → 모두 빈 문자열", () => {
    const result = parseChatSections("");
    expect(result.narrative).toBe("");
    expect(result.structure).toBe("");
    expect(result.history).toBe("");
  });

  it("섹션 내용 앞뒤 공백 trim", () => {
    const text = `## 💬 Narrative\n\n  내용  \n\n## 🧩 Structure\n\n구조`;
    const result = parseChatSections(text);
    expect(result.narrative.trim()).toBe("내용");
  });

  it("frontmatter 포함된 전체 파일에서도 올바르게 추출", () => {
    const result = parseChatSections(FULL_CHAT);
    expect(result.narrative).not.toContain("type: scene");
    expect(result.narrative).not.toContain("---");
  });
});
