import type { DesignDocument, ColorEntry, TypographyEntry, ElevationEntry } from "./types";

function colorLine(c: ColorEntry): string {
  return `- **${c.name}** (\`${c.hex}\`): \`${c.cssVar}\`. ${c.usage}`;
}

function typographyRow(t: TypographyEntry): string {
  return `| ${t.role} | ${t.font} | ${t.size} | ${t.weight} | ${t.lineHeight} | ${t.letterSpacing} | ${t.notes} |`;
}

function elevationRow(e: ElevationEntry): string {
  return `| ${e.level} | ${e.treatment} | ${e.use} |`;
}

export function generateDesignMd(doc: DesignDocument): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${doc.appName || "Untitled"} — DESIGN.md`);
  lines.push("");

  // Section 1
  lines.push("## 1. Visual Theme & Atmosphere");
  lines.push("");
  if (doc.atmosphereDescription) {
    lines.push(doc.atmosphereDescription);
    lines.push("");
  }
  if (doc.keyCharacteristics.length > 0) {
    lines.push("**Key Characteristics**:");
    for (const c of doc.keyCharacteristics) {
      lines.push(`- ${c}`);
    }
    lines.push("");
  }
  if (!doc.atmosphereDescription && doc.keyCharacteristics.length === 0) {
    lines.push("> 브랜드 분위기를 서술하세요.");
    lines.push("");
  }

  // Section 2
  lines.push("## 2. Color Palette & Roles");
  lines.push("");
  if (doc.colors.length > 0) {
    for (const c of doc.colors) {
      lines.push(colorLine(c));
    }
  } else {
    lines.push("> 색상 항목을 추가하세요.");
  }
  lines.push("");

  // Section 3
  lines.push("## 3. Typography Rules");
  lines.push("");
  if (doc.fontPrimary) {
    lines.push(`**Font Family (Primary)**: \`${doc.fontPrimary}\``);
  }
  if (doc.fontMono) {
    lines.push(`**Font Family (Mono)**: \`${doc.fontMono}\``);
  }
  lines.push("");
  if (doc.typographyHierarchy.length > 0) {
    lines.push("**Hierarchy**:");
    lines.push("");
    lines.push("| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |");
    lines.push("|------|------|------|--------|-------------|----------------|-------|");
    for (const t of doc.typographyHierarchy) {
      lines.push(typographyRow(t));
    }
    lines.push("");
  }

  // Section 4
  lines.push("## 4. Component Stylings");
  lines.push("");
  if (doc.componentStylings) {
    lines.push(doc.componentStylings);
  } else {
    lines.push("> 컴포넌트 스타일을 기술하세요.");
  }
  lines.push("");

  // Section 5
  lines.push("## 5. Layout Principles");
  lines.push("");
  lines.push(`**Spacing Base**: \`${doc.spacingBase}\``);
  lines.push(`**Grid Max Width**: \`${doc.gridMaxWidth}\``);
  lines.push("");
  if (doc.layoutPrinciples) {
    lines.push(doc.layoutPrinciples);
    lines.push("");
  }

  // Section 6
  lines.push("## 6. Depth & Elevation");
  lines.push("");
  if (doc.elevations.length > 0) {
    lines.push("| Level | Treatment | Use |");
    lines.push("|-------|-----------|-----|");
    for (const e of doc.elevations) {
      lines.push(elevationRow(e));
    }
  } else {
    lines.push("> 엘리베이션 레벨을 추가하세요.");
  }
  lines.push("");

  // Section 7
  lines.push("## 7. Do's and Don'ts");
  lines.push("");
  lines.push("### Do");
  if (doc.dos.length > 0) {
    for (const d of doc.dos) lines.push(`- ${d}`);
  } else {
    lines.push("- (항목 추가)");
  }
  lines.push("");
  lines.push("### Don't");
  if (doc.donts.length > 0) {
    for (const d of doc.donts) lines.push(`- ${d}`);
  } else {
    lines.push("- (항목 추가)");
  }
  lines.push("");

  // Section 8
  lines.push("## 8. Responsive Behavior");
  lines.push("");
  if (doc.responsiveBehavior) {
    lines.push(doc.responsiveBehavior);
  } else {
    lines.push("> 반응형 동작을 기술하세요.");
  }
  lines.push("");

  // Section 9
  lines.push("## 9. Agent Prompt Guide");
  lines.push("");
  if (doc.agentGuide) {
    lines.push(doc.agentGuide);
  } else {
    lines.push("> AI 에이전트 참조 가이드를 작성하세요.");
  }
  lines.push("");

  return lines.join("\n");
}
