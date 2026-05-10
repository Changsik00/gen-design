import { describe, it, expect } from "vitest";
import { emitHooks } from "../behavior-emitter";
import type { BehaviorSpec } from "../section-parser";

describe("emitHooks", () => {
  it("emits useState for a single state", () => {
    const spec: BehaviorSpec = {
      states: [{ name: "count", type: "number", defaultValue: "0" }],
      handlers: [],
      rawUnknown: [],
    };
    expect(emitHooks(spec)).toBe("const [count, setCount] = useState<number>(0);");
  });

  it("emits handler stub", () => {
    const spec: BehaviorSpec = {
      states: [],
      handlers: ["handleSubmit"],
      rawUnknown: [],
    };
    expect(emitHooks(spec)).toBe("const handleSubmit = () => { /* TODO */ };");
  });

  it("emits multiple states and handlers in order", () => {
    const spec: BehaviorSpec = {
      states: [
        { name: "open", type: "boolean", defaultValue: "false" },
        { name: "count", type: "number", defaultValue: "0" },
      ],
      handlers: ["onToggle", "onClose"],
      rawUnknown: [],
    };
    const result = emitHooks(spec);
    expect(result).toContain("const [open, setOpen] = useState<boolean>(false);");
    expect(result).toContain("const [count, setCount] = useState<number>(0);");
    expect(result).toContain("const onToggle = () => { /* TODO */ };");
    expect(result).toContain("const onClose = () => { /* TODO */ };");
  });

  it("emits TODO comment for rawUnknown lines", () => {
    const spec: BehaviorSpec = {
      states: [],
      handlers: [],
      rawUnknown: ["fetchData on mount"],
    };
    expect(emitHooks(spec)).toBe("// TODO: fetchData on mount");
  });

  it("returns empty string for empty BehaviorSpec", () => {
    const spec: BehaviorSpec = { states: [], handlers: [], rawUnknown: [] };
    expect(emitHooks(spec)).toBe("");
  });

  it("handles string and boolean default values", () => {
    const spec: BehaviorSpec = {
      states: [
        { name: "label", type: "string", defaultValue: '"click me"' },
        { name: "active", type: "boolean", defaultValue: "true" },
      ],
      handlers: [],
      rawUnknown: [],
    };
    const result = emitHooks(spec);
    expect(result).toContain('const [label, setLabel] = useState<string>("click me");');
    expect(result).toContain("const [active, setActive] = useState<boolean>(true);");
  });
});
