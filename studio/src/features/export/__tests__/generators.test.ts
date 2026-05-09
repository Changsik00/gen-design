import { describe, it, expect } from "vitest";
import {
  generateDesignMdTemplate,
  generateRequirementsMdTemplate,
  generateAgentMd,
  generateTokensJson,
} from "../generators";
import { DEFAULT_CONFIG } from "../types";
import type { ExportConfig } from "../types";

const CONFIG: ExportConfig = {
  appName: "TestApp",
  appType: "saas",
  techStack: "React + TypeScript + Tailwind CSS",
  packageManager: "pnpm",
};

describe("generateDesignMdTemplate", () => {
  it("헤더에 appName 포함", () => {
    const md = generateDesignMdTemplate(CONFIG);
    expect(md).toContain("TestApp");
  });

  it("9개 섹션 헤딩 모두 포함", () => {
    const md = generateDesignMdTemplate(CONFIG);
    for (let i = 1; i <= 9; i++) {
      expect(md).toContain(`## ${i}.`);
    }
  });

  it("DEFAULT_CONFIG 로도 정상 출력", () => {
    const md = generateDesignMdTemplate(DEFAULT_CONFIG);
    expect(md).toContain("MyApp");
  });
});

describe("generateRequirementsMdTemplate", () => {
  it("appName 포함", () => {
    const md = generateRequirementsMdTemplate(CONFIG);
    expect(md).toContain("TestApp");
  });

  it("appType 포함", () => {
    const md = generateRequirementsMdTemplate(CONFIG);
    expect(md).toContain("saas");
  });

  it("techStack 포함", () => {
    const md = generateRequirementsMdTemplate(CONFIG);
    expect(md).toContain("React + TypeScript + Tailwind CSS");
  });

  it("NFR 섹션 포함", () => {
    const md = generateRequirementsMdTemplate(CONFIG);
    expect(md).toContain("NFR");
  });
});

describe("generateAgentMd", () => {
  it("appName 포함", () => {
    const md = generateAgentMd(CONFIG);
    expect(md).toContain("TestApp");
  });

  it("techStack 포함", () => {
    const md = generateAgentMd(CONFIG);
    expect(md).toContain("React + TypeScript + Tailwind CSS");
  });

  it("packageManager 포함", () => {
    const md = generateAgentMd(CONFIG);
    expect(md).toContain("pnpm");
  });

  it("아키텍처 3-Layer 규칙 포함", () => {
    const md = generateAgentMd(CONFIG);
    expect(md).toContain("Layer");
  });
});

describe("generateTokensJson", () => {
  it("유효한 JSON 문자열 반환", () => {
    const json = generateTokensJson();
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("semantic.color 키 포함", () => {
    const parsed = JSON.parse(generateTokensJson());
    expect(parsed).toHaveProperty("semantic");
    expect(parsed.semantic).toHaveProperty("color");
  });

  it("primitive 키 포함", () => {
    const parsed = JSON.parse(generateTokensJson());
    expect(parsed).toHaveProperty("primitive");
  });
});
