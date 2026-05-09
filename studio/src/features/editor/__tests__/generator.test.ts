import { describe, it, expect } from "vitest";
import { generateDesignMd } from "../generator";
import type { DesignDocument } from "../types";

const BASE_DOC: DesignDocument = {
  appName: "MyApp",
  atmosphereDescription: "Clean and modern",
  keyCharacteristics: ["Minimal", "Bold typography"],
  colors: [
    { name: "Primary Blue", hex: "#3B82F6", cssVar: "--primary", usage: "CTA buttons" },
    { name: "Neutral Gray", hex: "#64748B", cssVar: "--muted-foreground", usage: "Body text" },
  ],
  fontPrimary: "Inter, system-ui, sans-serif",
  fontMono: "JetBrains Mono, monospace",
  typographyHierarchy: [
    { role: "Display Hero", font: "Inter", size: "56px", weight: "300", lineHeight: "1.03", letterSpacing: "-1.4px", notes: "Landing pages" },
    { role: "Body", font: "Inter", size: "16px", weight: "400", lineHeight: "1.6", letterSpacing: "0", notes: "Default text" },
  ],
  componentStylings: "**Button Primary**\n- Background: #3B82F6\n- Radius: 8px",
  spacingBase: "4px",
  gridMaxWidth: "1280px",
  layoutPrinciples: "8-point grid system throughout",
  elevations: [
    { level: "Level 0", treatment: "No shadow", use: "Background" },
    { level: "Level 1", treatment: "0 1px 3px rgba(0,0,0,0.1)", use: "Cards" },
  ],
  dos: ["Use consistent spacing", "Maintain brand colors"],
  donts: ["Mix font families", "Use shadows excessively"],
  responsiveBehavior: "Mobile-first. Breakpoints: 640px / 768px / 1024px / 1280px",
  agentGuide: "Quick colors: Primary #3B82F6, Neutral #64748B",
};

describe("generateDesignMd", () => {
  it("헤더에 appName 포함", () => {
    const md = generateDesignMd(BASE_DOC);
    expect(md).toContain("# MyApp");
  });

  it("9개 섹션 헤딩 모두 포함", () => {
    const md = generateDesignMd(BASE_DOC);
    expect(md).toContain("## 1. Visual Theme & Atmosphere");
    expect(md).toContain("## 2. Color Palette & Roles");
    expect(md).toContain("## 3. Typography Rules");
    expect(md).toContain("## 4. Component Stylings");
    expect(md).toContain("## 5. Layout Principles");
    expect(md).toContain("## 6. Depth & Elevation");
    expect(md).toContain("## 7. Do's and Don'ts");
    expect(md).toContain("## 8. Responsive Behavior");
    expect(md).toContain("## 9. Agent Prompt Guide");
  });

  it("색상 항목이 마크다운 불릿으로 출력", () => {
    const md = generateDesignMd(BASE_DOC);
    expect(md).toContain("**Primary Blue**");
    expect(md).toContain("#3B82F6");
    expect(md).toContain("--primary");
    expect(md).toContain("CTA buttons");
  });

  it("타이포 계층 테이블 포함", () => {
    const md = generateDesignMd(BASE_DOC);
    expect(md).toContain("| Role | Font |");
    expect(md).toContain("Display Hero");
    expect(md).toContain("56px");
  });

  it("폰트 패밀리 출력", () => {
    const md = generateDesignMd(BASE_DOC);
    expect(md).toContain("Inter, system-ui, sans-serif");
    expect(md).toContain("JetBrains Mono, monospace");
  });

  it("엘리베이션 테이블 포함", () => {
    const md = generateDesignMd(BASE_DOC);
    expect(md).toContain("| Level | Treatment | Use |");
    expect(md).toContain("Level 0");
    expect(md).toContain("Level 1");
  });

  it("Do / Don't 항목 포함", () => {
    const md = generateDesignMd(BASE_DOC);
    expect(md).toContain("Use consistent spacing");
    expect(md).toContain("Mix font families");
  });

  it("Key Characteristics 불릿 포함", () => {
    const md = generateDesignMd(BASE_DOC);
    expect(md).toContain("Minimal");
    expect(md).toContain("Bold typography");
  });

  it("빈 문서도 오류 없이 9섹션 출력", () => {
    const emptyDoc: DesignDocument = {
      appName: "Untitled",
      atmosphereDescription: "",
      keyCharacteristics: [],
      colors: [],
      fontPrimary: "",
      fontMono: "",
      typographyHierarchy: [],
      componentStylings: "",
      spacingBase: "4px",
      gridMaxWidth: "1280px",
      layoutPrinciples: "",
      elevations: [],
      dos: [],
      donts: [],
      responsiveBehavior: "",
      agentGuide: "",
    };
    const md = generateDesignMd(emptyDoc);
    expect(md).toContain("## 1. Visual Theme & Atmosphere");
    expect(md).toContain("## 9. Agent Prompt Guide");
  });
});
