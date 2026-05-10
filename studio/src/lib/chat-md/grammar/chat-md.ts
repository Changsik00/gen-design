/**
 * spec.md grammar — peggy 문법 소스 (string).
 *
 * 점진적 작성:
 * - Task 3: Placeholder + MarkdownText + Comment
 * - Task 4: ComponentTag (self-closing + paired)
 * - Task 5: Attributes (string + JSON + placeholder)
 *
 * 채택된 도구: peggy (Task 2 비교 결과 — plan.md 참조).
 *
 * 본 string 은 grammar/index.ts 가 런타임 컴파일하여 parser 생성.
 */

export const CHAT_MD_GRAMMAR = String.raw`
{
  function loc(location) {
    return {
      line: location.start.line,
      col: location.start.column,
      offset: location.start.offset,
      length: location.end.offset - location.start.offset,
    };
  }

  // Attributes 의 [name, value] 배열을 ComponentInstance 의 props/theme/tokens 로 분배.
  // theme  → string (L3 theme context)
  // tokens → Record<string, string> (L4 인라인 토큰 override)
  // 그 외  → props (L1/L2 axis variant)
  function buildComponentInstance(name, attrs, children, srcLoc) {
    const result = {
      type: "ComponentInstance",
      name,
      props: {},
      children,
      location: srcLoc,
    };
    for (const [k, v] of attrs) {
      if (k === "theme")  result.theme = v;
      else if (k === "tokens") result.tokens = v;
      else result.props[k] = v;
    }
    return result;
  }

  // ─── Frontmatter helpers ────────────────────────────────────────────────
  // YAML-lite subset — see spec-08-04 plan.md F-1.

  function parseFmScalar(raw) {
    const s = raw.trim();
    if (s === "true")  return true;
    if (s === "false") return false;
    if (s === "null")  return null;
    if (/^-?\d+$/.test(s))           return parseInt(s, 10);
    if (/^-?\d+\.\d+$/.test(s))      return parseFloat(s);
    return s;
  }

  // lines: array of { indent, key, value, isListItem? }
  // - value === undefined ⇒ nested object parent
  // - isListItem === true ⇒ block sequence item (key=null)
  // null entries (comment / blank) already filtered.
  function parseFmTree(lines) {
    const filtered = lines.filter(l => l !== null);
    let i = 0;
    function walk(parentIndent) {
      const out = {};
      while (i < filtered.length) {
        const line = filtered[i];
        if (line.indent <= parentIndent) break;
        if (line.isListItem) break; // list items handled by parent key
        i++;
        if (line.value === undefined) {
          // Check if following lines are list items at greater indent
          if (i < filtered.length && filtered[i].isListItem && filtered[i].indent > line.indent) {
            const itemIndent = filtered[i].indent;
            const items = [];
            while (i < filtered.length && filtered[i].isListItem && filtered[i].indent === itemIndent) {
              items.push(filtered[i].value);
              i++;
            }
            out[line.key] = items;
          } else {
            out[line.key] = walk(line.indent);
          }
        } else {
          out[line.key] = line.value;
        }
      }
      return out;
    }
    return walk(-1);
  }

  // ─── Section split helpers ────────────────────────────────────────────
  // Document body 의 Block[] 을 ## Heading 단위로 분할 → narrative/structure/history.

  function classifySection(headingText) {
    const lower = String(headingText).toLowerCase();
    if (/narrative/.test(lower)) return "narrative";
    if (/structure/.test(lower)) return "structure";
    if (/history/.test(lower))   return "history";
    return "other";
  }

  // raw markdown text 를 H1/H2 헤딩 기준으로 part 배열로 분할.
  // returns: [{ kind: "text"|"h1"|"h2", text }]
  function splitMarkdownByHeadings(text) {
    const parts = [];
    const lines = text.split(/\r\n|\r|\n/);
    let buffer = [];
    function flushBuffer() {
      if (buffer.length === 0) return;
      parts.push({ kind: "text", text: buffer.join("\n") });
      buffer = [];
    }
    for (const line of lines) {
      const m = line.match(/^(#{1,2})\s+(.+?)\s*$/);
      if (m) {
        flushBuffer();
        const level = m[1].length;
        parts.push({ kind: level === 1 ? "h1" : "h2", text: m[2].trim() });
      } else {
        buffer.push(line);
      }
    }
    flushBuffer();
    return parts;
  }

  function isStructureNoise(block) {
    if (block.type !== "MarkdownText") return false;
    // 0x60 = backtick. String.raw 안에서 literal backtick 회피.
    const FENCE = String.fromCharCode(96, 96, 96);
    const lines = String(block.text).split(/\r\n|\r|\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return true;
    return lines.every(l => l.startsWith(FENCE));
  }

  function blocksToMarkdown(items) {
    return items.map(b => b.type === "MarkdownText" ? b.text : "").join("");
  }

  function splitDocumentByHeadings(blocks, defaultLoc) {
    // Section split 은 *recognized* section (Narrative/Structure/History) 가 있을 때만.
    // 그 외 (## Behavior, ## Variants 등) 는 compile 파이프라인이 사용하므로 보존.
    const hasRecognized = blocks.some(b => {
      if (b.type !== "MarkdownText") return false;
      const parts = splitMarkdownByHeadings(b.text);
      return parts.some(p => p.kind === "h2" && classifySection(p.text) !== "other");
    });
    if (!hasRecognized) {
      return { title: null, narrative: null, structure: null, history: null, legacyBody: undefined };
    }

    let title = null;
    // ordered sections: [{ kind, items, heading }]
    const ordered = [];
    let current = { kind: "preamble", items: [], heading: null };

    for (const block of blocks) {
      if (block.type !== "MarkdownText") {
        current.items.push(block);
        continue;
      }
      const parts = splitMarkdownByHeadings(block.text);
      for (const part of parts) {
        if (part.kind === "h1") {
          if (title === null) title = part.text;
          // H1 itself is consumed (not added to body)
        } else if (part.kind === "h2") {
          ordered.push(current);
          current = {
            kind: classifySection(part.text),
            items: [],
            heading: { name: part.text, location: block.location },
          };
        } else {
          if (part.text !== "") {
            current.items.push({
              type: "MarkdownText",
              text: part.text,
              location: block.location,
            });
          }
        }
      }
    }
    ordered.push(current);

    let narrative = null;
    let structure = null;
    let history = null;
    for (const sec of ordered) {
      const loc = sec.heading?.location ?? defaultLoc;
      if (sec.kind === "narrative") {
        narrative = { type: "Narrative", markdown: blocksToMarkdown(sec.items).trim(), location: loc };
      } else if (sec.kind === "structure") {
        structure = {
          type: "Structure",
          body: sec.items.filter(b => !isStructureNoise(b)),
          location: loc,
        };
      } else if (sec.kind === "history") {
        history = { type: "History", markdown: blocksToMarkdown(sec.items).trim(), location: loc };
      }
    }

    let legacyBody;
    if (narrative === null && structure === null && history === null) {
      legacyBody = ordered.flatMap(s => s.items);
    }

    return { title, narrative, structure, history, legacyBody };
  }
}

Document
  = fm:Frontmatter blocks:Block* {
      const split = splitDocumentByHeadings(blocks, loc(location()));
      const doc = {
        type: "Document",
        frontmatter: fm,
        title: split.title,
        narrative: split.narrative,
        structure: split.structure,
        history: split.history,
      };
      if (split.legacyBody !== undefined) doc.body = split.legacyBody;
      else doc.body = blocks;
      return doc;
    }
  / blocks:Block* {
      const split = splitDocumentByHeadings(blocks, loc(location()));
      const doc = {
        type: "Document",
        frontmatter: null,
        title: split.title,
        narrative: split.narrative,
        structure: split.structure,
        history: split.history,
      };
      if (split.legacyBody !== undefined) doc.body = split.legacyBody;
      else doc.body = blocks;
      return doc;
    }

// ─── Frontmatter ──────────────────────────────────────────────────────────
Frontmatter "frontmatter"
  = "---" FmEol lines:FmLine* "---" FmEol { return parseFmTree(lines); }
  / "---" FmEol FmLine* {
      error("Frontmatter '---' opened but missing closing fence");
    }

FmLine
  = indent:FmIndent !"---" key:FmKey ":" FmInlineWs? value:FmValue FmInlineComment? FmEol {
      return { indent: indent.length, key, value };
    }
  / indent:FmIndent !"---" key:FmKey ":" FmInlineComment? FmEol {
      return { indent: indent.length, key, value: undefined };
    }
  / indent:FmIndent "-" FmInlineWs+ value:FmValue FmInlineComment? FmEol {
      return { indent: indent.length, key: null, value, isListItem: true };
    }
  / FmIndent? "#" (!FmEol .)* FmEol { return null; }
  / FmIndent? FmEol { return null; }

FmInlineComment = FmInlineWs? "#" (!FmEol .)*

FmIndent = chars:" "* { return chars; }

FmKey
  = first:[a-zA-Z_] rest:[a-zA-Z0-9_-]* { return first + rest.join(""); }

FmValue
  = FmQuoted
  / FmInlineArray
  / FmBareScalar

FmQuoted
  = '"' chars:FmDoubleChar* '"' { return chars.join(""); }
  / "'" chars:FmSingleChar* "'" { return chars.join(""); }

FmDoubleChar = !'"' c:. { return c; }
FmSingleChar = !"'" c:. { return c; }

FmInlineArray
  = "[" FmInlineWs? items:FmInlineArrayItems? FmInlineWs? "]" { return items ?? []; }
  / "[" FmInlineWs? FmInlineArrayItems? {
      error("Frontmatter inline array '[' opened but missing closing ']'");
    }

FmInlineArrayItems
  = head:FmInlineItem tail:(FmInlineWs? "," FmInlineWs? FmInlineItem)* {
      return [head, ...tail.map(t => t[3])];
    }

FmInlineItem
  = FmQuoted
  / chars:FmInlineBareChar+ { return parseFmScalar(chars.join("")); }

FmInlineBareChar
  = !"," !"]" !"\r" !"\n" c:. { return c; }

FmBareScalar
  = !FmEol !"[" !"{" chars:FmBareChar+ {
      return parseFmScalar(chars.join(""));
    }

FmBareChar
  = !"\r" !"\n" c:. { return c; }

FmInlineWs = [ \t]+

FmEol = "\r\n" / "\n" / "\r"

Block
  = Comment
  / ComponentTag
  / Placeholder
  / MarkdownText

// ─── ComponentTag ─────────────────────────────────────────────────────────
ComponentTag
  = SelfClosingTag
  / PairedTag

SelfClosingTag
  = "<" name:ComponentName attrs:Attributes _ "/>" {
      return buildComponentInstance(name, attrs, [], loc(location()));
    }

PairedTag
  = "<" openName:ComponentName attrs:Attributes _ ">" body:Block* "</" closeName:ComponentName _ ">" {
      if (openName !== closeName) {
        error("Mismatched closing tag: expected </" + openName + "> but got </" + closeName + ">");
      }
      return buildComponentInstance(openName, attrs, body, loc(location()));
    }

ComponentName
  = head:ComponentNameHead tail:("." part:ComponentNameHead)* {
      return tail.length === 0 ? head : head + "." + tail.map(t => t[1]).join(".");
    }

ComponentNameHead
  = first:[A-Z] rest:[a-zA-Z0-9_]* { return first + rest.join(""); }

_ "whitespace"
  = [ \t\n\r]*

// ─── Attributes ───────────────────────────────────────────────────────────
// theme="brand-a" / variant="primary" / tokens={{ "--primary": "{{token.x}}" }}
Attributes
  = pairs:(__ Attribute)* {
      return pairs.map(p => p[1]);
    }

Attribute
  = name:AttrName "=" value:AttrValue {
      return [name, value];
    }

AttrName
  = first:[a-zA-Z_] rest:[a-zA-Z0-9_-]* { return first + rest.join(""); }

AttrValue
  = StringLiteral
  / Placeholder
  / "{" __ json:JsonValue __ "}" { return json; }

StringLiteral
  = '"' chars:DoubleStringChar* '"' { return chars.join(""); }
  / "'" chars:SingleStringChar* "'" { return chars.join(""); }

DoubleStringChar
  = !'"' !"\\" c:. { return c; }
  / "\\" c:. { return c; }

SingleStringChar
  = !"'" !"\\" c:. { return c; }
  / "\\" c:. { return c; }

// ─── JSON sub-grammar ─────────────────────────────────────────────────────
JsonValue
  = JsonObject
  / JsonArray
  / JsonString
  / JsonNumber
  / JsonBoolean
  / JsonNull

JsonObject
  = "{" __ pairs:JsonPairList? __ "}" {
      return Object.fromEntries(pairs || []);
    }

JsonPairList
  = head:JsonPair tail:(__ "," __ JsonPair)* {
      return [head, ...tail.map(t => t[3])];
    }

JsonPair
  = key:JsonString __ ":" __ value:JsonValue {
      return [key, value];
    }

JsonArray
  = "[" __ items:JsonItemList? __ "]" {
      return items || [];
    }

JsonItemList
  = head:JsonValue tail:(__ "," __ JsonValue)* {
      return [head, ...tail.map(t => t[3])];
    }

JsonString
  = '"' chars:DoubleStringChar* '"' { return chars.join(""); }

JsonNumber
  = "-"? [0-9]+ ("." [0-9]+)? ([eE] [+-]? [0-9]+)? {
      return parseFloat(text());
    }

JsonBoolean
  = "true"  { return true; }
  / "false" { return false; }

JsonNull
  = "null" { return null; }

__ "ws"
  = [ \t\n\r]*

// ─── Comment ──────────────────────────────────────────────────────────────
Comment
  = "<!--" text:CommentBody "-->" {
      return { type: "Comment", text, location: loc(location()) };
    }

CommentBody
  = chars:(!"-->" .)* { return chars.map(c => c[1]).join(""); }

// ─── Placeholder ──────────────────────────────────────────────────────────
Placeholder
  = "{{" kind:PlaceholderKind "." path:PathSegments "}}" {
      return {
        type: "Placeholder",
        kind,
        path: path.join("."),
        location: loc(location()),
      };
    }

PlaceholderKind
  = "i18n" / "token" / "scene"

PathSegments
  = head:Identifier tail:("." Identifier)* {
      return [head, ...tail.map(t => t[1])];
    }

Identifier
  = chars:[a-zA-Z0-9_-]+ { return chars.join(""); }

// ─── MarkdownText ─────────────────────────────────────────────────────────
// 컴포넌트 태그 외 영역. parser 가 가공하지 않고 raw text 보존.
// boundary: Comment 시작/끝, Placeholder 시작, ComponentTag 열기/닫기.
// 단 lowercase HTML (e.g. <div>) 는 markdown 의 일부로 취급.
MarkdownText
  = chars:MarkdownChar+ {
      return {
        type: "MarkdownText",
        text: chars.join(""),
        location: loc(location()),
      };
    }

MarkdownChar
  = !"<!--" !"-->" !"{{" !ClosingComponentTag !OpeningComponentTag c:. { return c; }

OpeningComponentTag
  = "<" [A-Z]

ClosingComponentTag
  = "</" [A-Z]
`;
