import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

afterEach(cleanup);
import { PaperImportPanel } from "../PaperImportPanel";

const SIMPLE_TREE = JSON.stringify({
  id: "root",
  name: "Button.primary",
  component: "Frame",
  children: [],
});

describe("PaperImportPanel", () => {
  it("유효 JSON → onResult 호출", () => {
    const onResult = vi.fn();
    render(<PaperImportPanel onResult={onResult} />);
    fireEvent.change(screen.getByPlaceholderText(/id.*root/), { target: { value: SIMPLE_TREE } });
    fireEvent.click(screen.getByText("Infer spec.md"));
    expect(onResult).toHaveBeenCalledOnce();
    expect(typeof onResult.mock.calls[0][0]).toBe("string");
  });

  it("잘못된 JSON → 에러 메시지 표시, onResult 미호출", () => {
    const onResult = vi.fn();
    render(<PaperImportPanel onResult={onResult} />);
    fireEvent.change(screen.getByPlaceholderText(/id.*root/), { target: { value: "NOT JSON" } });
    fireEvent.click(screen.getByText("Infer spec.md"));
    expect(onResult).not.toHaveBeenCalled();
    expect(screen.getByText(/JSON 파싱 실패/)).toBeInTheDocument();
  });

  it("빈 트리 → onResult 호출 (에러 없음)", () => {
    const onResult = vi.fn();
    render(<PaperImportPanel onResult={onResult} />);
    const emptyTree = JSON.stringify({ id: "r", name: "Root", component: "Frame", children: [] });
    fireEvent.change(screen.getByPlaceholderText(/id.*root/), { target: { value: emptyTree } });
    fireEvent.click(screen.getByText("Infer spec.md"));
    expect(onResult).toHaveBeenCalledOnce();
  });
});
