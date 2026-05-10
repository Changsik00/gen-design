import { describe, it, expect } from "vitest";
import { extractFromFile, extractFromSource } from "../index";

describe("extractFromFile — 실 ui/button.tsx", () => {
  it("Button 의 6 variant + 8 size 정확 추출", () => {
    const result = extractFromFile("src/components/ui/button.tsx");
    expect(result).toHaveLength(1);
    const btn = result[0];
    expect(btn.name).toBe("Button");
    expect(btn.pattern).toBe("cva");
    expect(btn.ariaRole).toBe("button");

    const variantAxis = btn.axes.find((a) => a.name === "variant");
    expect(variantAxis).toBeDefined();
    expect(variantAxis?.values).toEqual(
      expect.arrayContaining([
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ]),
    );
    expect(variantAxis?.values).toHaveLength(6);

    const sizeAxis = btn.axes.find((a) => a.name === "size");
    expect(sizeAxis?.values).toContain("sm");
    expect(sizeAxis?.values).toContain("icon");
    expect(sizeAxis?.values.length).toBeGreaterThanOrEqual(7);
  });

  it("Button 의 defaultVariants = { variant: default, size: default }", () => {
    const [btn] = extractFromFile("src/components/ui/button.tsx");
    expect(btn.defaultVariants).toEqual({ variant: "default", size: "default" });
  });
});

describe("extractFromSource — 합성 케이스", () => {
  it("3-axis cva (variant + size + tone)", () => {
    const source = `
      import { cva } from "class-variance-authority";
      const x = cva("base", {
        variants: {
          variant: { primary: "p", secondary: "s" },
          size:    { sm: "s", lg: "l" },
          tone:    { muted: "m", loud: "l" }
        },
        defaultVariants: { variant: "primary", size: "sm", tone: "muted" }
      });
      export function MyButton() { return null; }
    `;
    const result = extractFromSource(source, "test/MyButton.tsx");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("MyButton");
    expect(result[0].axes).toHaveLength(3);
    const axisNames = result[0].axes.map((a) => a.name);
    expect(axisNames).toEqual(expect.arrayContaining(["variant", "size", "tone"]));
    expect(result[0].defaultVariants).toEqual({
      variant: "primary",
      size: "sm",
      tone: "muted",
    });
  });

  it("cva 호출 없는 파일 → manual 패턴으로 등재 (axes 비어있음)", () => {
    const source = `
      export function PlainComponent() { return null; }
    `;
    const result = extractFromSource(source, "test/Plain.tsx");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("PlainComponent");
    expect(result[0].pattern).toBe("manual");
    expect(result[0].axes).toEqual([]);
  });

  it("PascalCase export 가 전혀 없는 파일 → 빈 결과", () => {
    const source = `
      const helper = () => null;
      const someValue = 42;
    `;
    expect(extractFromSource(source, "test/util.tsx")).toEqual([]);
  });

  it("variants 만 있고 defaultVariants 없음", () => {
    const source = `
      const v = cva("base", {
        variants: { variant: { a: "a", b: "b" } }
      });
      export function NoDefault() { return null; }
    `;
    const [r] = extractFromSource(source, "test/NoDefault.tsx");
    expect(r.axes).toHaveLength(1);
    expect(r.defaultVariants).toEqual({});
  });

  it("export 가 없는 경우 — 파일명 PascalCase fallback", () => {
    const source = `
      const v = cva("base", { variants: { variant: { a: "a" } } });
    `;
    const [r] = extractFromSource(source, "test/some-component.tsx");
    expect(r.name).toBe("SomeComponent");
  });

  it("ARIA role 휴리스틱 — Slider → slider", () => {
    const source = `
      const v = cva("base", { variants: { size: { sm: "s" } } });
      export function Slider() { return null; }
    `;
    const [r] = extractFromSource(source, "test/Slider.tsx");
    expect(r.ariaRole).toBe("slider");
  });

  it("ARIA role 미매핑 — Tooltip → undefined", () => {
    const source = `
      const v = cva("base", { variants: { variant: { a: "a" } } });
      export function Tooltip() { return null; }
    `;
    const [r] = extractFromSource(source, "test/Tooltip.tsx");
    expect(r.ariaRole).toBeUndefined();
  });
});
