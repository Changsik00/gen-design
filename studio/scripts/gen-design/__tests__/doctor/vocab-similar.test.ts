import { describe, it, expect } from "vitest";
import { extractChatComponents, checkVocabSimilar } from "../../doctor/check-vocab-similar";

describe("extractChatComponents — chat.md 의 <Component> 태그 추출", () => {
  it("PascalCase 컴포넌트 추출", () => {
    const text = `<Card>\n  <CardHeader>\n    <CardTitle>제목</CardTitle>\n  </CardHeader>\n</Card>`;
    const names = extractChatComponents(text);
    expect(names).toContain("Card");
    expect(names).toContain("CardHeader");
    expect(names).toContain("CardTitle");
  });

  it("self-closing 태그 추출 (<Input />)", () => {
    const text = `<Input type="email" /> <Button />`;
    const names = extractChatComponents(text);
    expect(names).toContain("Input");
    expect(names).toContain("Button");
  });

  it("소문자 태그 (html) 는 제외", () => {
    const text = `<div><span>...</span></div> <Card>`;
    const names = extractChatComponents(text);
    expect(names).toContain("Card");
    expect(names).not.toContain("div");
    expect(names).not.toContain("span");
  });

  it("코드 블록 안은 무시 (예시 코드)", () => {
    const text = `예시:\n\`\`\`\n<NotARealComponent />\n\`\`\`\n실제: <Button>`;
    const names = extractChatComponents(text);
    expect(names).toContain("Button");
    expect(names).not.toContain("NotARealComponent");
  });

  it("HTML 주석 안은 무시 (spec-11-05 fix #3)", () => {
    const text = `<!-- 예시:\n<Header>\n  <Logo />\n  <Nav />\n</Header>\n-->\n실제: <Button>`;
    const names = extractChatComponents(text);
    expect(names).toContain("Button");
    expect(names).not.toContain("Header");
    expect(names).not.toContain("Logo");
    expect(names).not.toContain("Nav");
  });

  it("inline HTML 주석 안 어휘도 무시", () => {
    const text = `<Card> <!-- TODO: <Tooltip> 추가 --> </Card>`;
    const names = extractChatComponents(text);
    expect(names).toContain("Card");
    expect(names).not.toContain("Tooltip");
  });

  it("중복은 한 번만", () => {
    const text = `<Button> <Button variant="x"> <Button />`;
    const names = extractChatComponents(text);
    expect(names.filter((n) => n === "Button")).toHaveLength(1);
  });
});

describe("checkVocabSimilar — 카탈로그 외 어휘 + Did you mean?", () => {
  const catalog = new Set([
    "Button",
    "Card",
    "CardHeader",
    "CardTitle",
    "Input",
    "Label",
    "Separator",
  ]);

  it("모두 카탈로그 내 어휘면 진단 없음", () => {
    const chatFiles = [
      { path: "chats/scenes/x.chat.md", content: "<Card>\n  <Button>OK</Button>\n</Card>" },
    ];
    const diags = checkVocabSimilar(chatFiles, catalog);
    expect(diags).toHaveLength(0);
  });

  it("오타 컴포넌트 — Did you mean? 제안", () => {
    const chatFiles = [
      { path: "chats/scenes/y.chat.md", content: "<Buton>잘못</Buton>" },
    ];
    const diags = checkVocabSimilar(chatFiles, catalog);
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0]?.category).toBe("vocab-similar");
    expect(diags[0]?.message).toContain("Buton");
    expect(diags[0]?.hint).toContain("Button");
  });

  it("완전 새 어휘 — 카탈로그 등재 안내", () => {
    const chatFiles = [
      { path: "chats/scenes/z.chat.md", content: "<MagicalThing>새로운</MagicalThing>" },
    ];
    const diags = checkVocabSimilar(chatFiles, catalog);
    expect(diags[0]?.message).toContain("MagicalThing");
    // 유사 어휘 없으면 FRONT.md 카탈로그 / Tier 3 승격 안내
    expect(diags[0]?.hint).toMatch(/FRONT\.md|Tier 3/);
  });

  it("여러 chat 의 미정의 어휘 — 각각 진단", () => {
    const chatFiles = [
      { path: "chats/scenes/a.chat.md", content: "<UnknownA />" },
      { path: "chats/scenes/b.chat.md", content: "<UnknownB />" },
    ];
    const diags = checkVocabSimilar(chatFiles, catalog);
    expect(diags.length).toBe(2);
    expect(diags.map((d) => d.file).sort()).toEqual([
      "chats/scenes/a.chat.md",
      "chats/scenes/b.chat.md",
    ]);
  });
});
