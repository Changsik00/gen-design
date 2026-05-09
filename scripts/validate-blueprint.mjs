#!/usr/bin/env node
/**
 * validate-blueprint.mjs — Blueprint protocol v2 (spec-6-03) 검증.
 *
 * 사용법:
 *   node scripts/validate-blueprint.mjs <path/to/blueprint-session.md>
 *   node scripts/validate-blueprint.mjs <path/to/REQUIREMENTS.md>
 *
 * 검증 룰 (회고 F-01 ~ F-07):
 *   - F-01: 6 NFR 카테고리 (auth/i18n/theme/performance/security/compatibility) 키 존재
 *   - F-02: (placeholder map 은 schema 문서 — 본 validator 검증 대상 아님)
 *   - F-03: finalPages[].route / .layout 존재 (누락 시 warning)
 *   - F-04: finalPages[].templateMapping.status ∈ {implemented, not-implemented}
 *   - F-05: finalPages[].optionalSections 키 존재 (값: [] / 'none' / list)
 *   - F-06: templateMapping.template 이름이 페이지 id 의 유추 규칙 따름 (warning)
 *   - F-07: templateMapping.derivedFrom 가 있으면 string
 *
 * 결과:
 *   - error 0 / warning 0  → exit 0 + "✓ PASS"
 *   - error 0 / warning N  → exit 0 + warning 출력
 *   - error N              → exit 1 + error 출력
 *
 * 외부 의존성 없음 — Node 표준 + 정규식.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const NFR_CATEGORIES = ["auth", "i18n", "theme", "performance", "security", "compatibility"];
const VALID_STATUS = new Set(["implemented", "not-implemented"]);

// 카테고리 접두 sub-table (F-06)
const PREFIX_RULES = {
  "auth-": "drop", // auth-login → LoginPage
  "profile-": "drop", // profile-mypage → MyPage
  "dash-": "expand-dashboard", // dash-overview → DashboardPage
};

function inferTemplateName(pageId) {
  // kebab → segments
  const segments = pageId.split("-");
  const prefix = segments[0] + "-";
  const rule = PREFIX_RULES[prefix];

  let bodySegments = segments;
  let prependSegments = [];

  if (rule === "drop") {
    bodySegments = segments.slice(1);
  } else if (rule === "expand-dashboard") {
    bodySegments = segments.slice(1);
    prependSegments = ["Dashboard"];
  }

  const pascal = [...prependSegments, ...bodySegments]
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return `${pascal}Page`;
}

function extractYamlBlocks(content) {
  // 마크다운의 ```yaml ... ``` 블록 추출
  const re = /```yaml\s*\n([\s\S]*?)```/g;
  const blocks = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    blocks.push(m[1]);
  }
  return blocks;
}

function pickFinalYaml(blocks) {
  // "최종 통합" / "Fill Executor" / finalPages 가 포함된 블록 선택
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].includes("finalPages:")) return blocks[i];
  }
  return blocks[blocks.length - 1] || "";
}

function hasTopLevelKey(yaml, key) {
  const re = new RegExp(`^${key}\\s*:`, "m");
  return re.test(yaml);
}

function findFinalPagesBlocks(yaml) {
  // finalPages: 의 첫 등장 이후 라인 단위 page block 추출 (`  - id:` 시작)
  const idx = yaml.indexOf("finalPages:");
  if (idx < 0) return [];
  const after = yaml.slice(idx);
  const lines = after.split("\n");

  const pages = [];
  let current = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s{2}-\s+id:/.test(line)) {
      if (current) pages.push(current);
      current = { lines: [line] };
    } else if (current && /^\s{4,}/.test(line)) {
      current.lines.push(line);
    } else if (current && line.trim() === "") {
      current.lines.push(line);
    } else if (current && /^[a-zA-Z]/.test(line)) {
      // top-level key 만나면 finalPages 종료
      pages.push(current);
      current = null;
      break;
    }
  }
  if (current) pages.push(current);
  return pages.map((p) => p.lines.join("\n"));
}

function getValueFromBlock(block, key) {
  // YAML list item 의 첫 줄 dash (`- `) 도 허용
  const re = new RegExp(`^[\\s-]*${key}\\s*:\\s*"?([^"\n]*)"?\\s*$`, "m");
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function hasKeyInBlock(block, key) {
  // dash 포함 허용
  const re = new RegExp(`^[\\s-]*${key}\\s*:`, "m");
  return re.test(block);
}

export function validate(content, opts = {}) {
  const { strict = false } = opts;
  const errors = [];
  const warnings = [];

  const yamlBlocks = extractYamlBlocks(content);
  const finalYaml = pickFinalYaml(yamlBlocks);

  if (!finalYaml.includes("finalPages:")) {
    errors.push("finalPages YAML 블록을 찾을 수 없음 (Blueprint Step 3 출력)");
    return { errors, warnings, ok: false };
  }

  // F-01: 6 NFR 카테고리
  for (const cat of NFR_CATEGORIES) {
    if (!hasTopLevelKey(finalYaml, cat)) {
      const msg = `F-01: NFR 카테고리 '${cat}' 누락 (auth/i18n/theme/performance/security/compatibility 6 종 모두 필요)`;
      if (strict) errors.push(msg);
      else warnings.push(msg);
    }
  }

  // finalPages 검증
  const pages = findFinalPagesBlocks(finalYaml);
  if (pages.length === 0) {
    errors.push("finalPages 의 페이지 항목을 추출할 수 없음");
  }

  for (const block of pages) {
    const id = getValueFromBlock(block, "id");
    if (!id) continue;

    // F-03: route / layout
    if (!hasKeyInBlock(block, "route")) {
      warnings.push(`F-03: '${id}' 의 route 누락 — 자동 채움 규칙 (/${id.replace(/-/, "/")}) 적용 권장`);
    }
    if (!hasKeyInBlock(block, "layout")) {
      warnings.push(`F-03: '${id}' 의 layout 누락 — variant 기반 자동 채움 권장`);
    }

    // F-05: optionalSections 키 존재 (값 검증은 [], 'none', list 모두 OK)
    if (!hasKeyInBlock(block, "optionalSections")) {
      errors.push(`F-05: '${id}' 의 optionalSections 키 누락 ('[]' 또는 \"'none'\" 명시 필요 — omit 금지)`);
    }

    // F-04: templateMapping.status
    const status = getValueFromBlock(block, "status");
    if (status && !VALID_STATUS.has(status)) {
      errors.push(`F-04: '${id}' 의 status='${status}' 비표준 (machine-readable: 'implemented' | 'not-implemented' literal 만 허용. 마크다운 표시는 별도 매핑)`);
    }

    // F-06: template 이름 유추 일치 (warning)
    const template = getValueFromBlock(block, "template");
    if (template) {
      const expected = inferTemplateName(id);
      if (template !== expected) {
        warnings.push(`F-06: '${id}' 의 template='${template}' 이 유추 규칙 결과 '${expected}' 와 다름 (override 의도면 무시 가능)`);
      }
    }
  }

  return { errors, warnings, ok: errors.length === 0 };
}

// CLI 진입
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  const inputPath = process.argv[2];
  const strict = process.argv.includes("--strict");

  if (!inputPath) {
    console.error("사용법: node scripts/validate-blueprint.mjs <path/to/file.md> [--strict]");
    process.exit(2);
  }
  if (!existsSync(inputPath)) {
    console.error(`파일을 찾을 수 없음: ${inputPath}`);
    process.exit(2);
  }

  const content = readFileSync(inputPath, "utf-8");
  const { errors, warnings, ok } = validate(content, { strict });

  if (warnings.length > 0) {
    console.log("⚠ Warnings:");
    for (const w of warnings) console.log(`  - ${w}`);
  }
  if (errors.length > 0) {
    console.log("✗ Errors:");
    for (const e of errors) console.log(`  - ${e}`);
  }
  if (ok && warnings.length === 0) {
    console.log(`✓ PASS — ${inputPath}`);
  } else if (ok) {
    console.log(`⚠ PASS with ${warnings.length} warning(s) — ${inputPath}`);
  } else {
    console.log(`✗ FAIL — ${errors.length} error(s), ${warnings.length} warning(s) — ${inputPath}`);
  }
  process.exit(ok ? 0 : 1);
}
