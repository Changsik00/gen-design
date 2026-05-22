export interface ChatSections {
  narrative: string;
  structure: string;
  history: string;
}

const HEADERS: Record<keyof ChatSections, RegExp> = {
  narrative: /^## 💬 Narrative(?:\s.*)?$/m,
  structure: /^## 🧩 Structure(?:\s.*)?$/m,
  history:   /^## 📜 History(?:\s.*)?$/m,
};

export function parseChatSections(text: string): ChatSections {
  const result: ChatSections = { narrative: "", structure: "", history: "" };
  if (!text) return result;

  // frontmatter 제거
  const body = text.replace(/^---[\s\S]*?---\s*/m, "");

  // 각 헤더의 위치 수집
  const positions: Array<{ key: keyof ChatSections; index: number }> = [];
  for (const [key, re] of Object.entries(HEADERS) as [keyof ChatSections, RegExp][]) {
    const m = re.exec(body);
    if (m) positions.push({ key, index: m.index });
  }
  positions.sort((a, b) => a.index - b.index);

  for (let i = 0; i < positions.length; i++) {
    const { key, index } = positions[i];
    const start = body.indexOf("\n", index) + 1; // 헤더 라인 다음
    const end = i + 1 < positions.length ? positions[i + 1].index : body.length;
    result[key] = body.slice(start, end).trim();
  }

  return result;
}
