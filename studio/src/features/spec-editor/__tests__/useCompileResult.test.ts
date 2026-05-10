import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCompileResult } from "../useCompileResult";

describe("useCompileResult", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("정상 spec.md → reactTree 비어있지 않음", async () => {
    const { result } = renderHook(() =>
      useCompileResult('<Button variant="primary" />', 0)
    );
    await act(async () => { vi.runAllTimers(); });
    expect(result.current.reactTree.length).toBeGreaterThan(0);
  });

  it("빈 입력 → 빈 결과, 에러 없음", async () => {
    const { result } = renderHook(() => useCompileResult("", 0));
    await act(async () => { vi.runAllTimers(); });
    expect(result.current.reactTree).toHaveLength(0);
    expect(result.current.errors).toHaveLength(0);
  });

  it("파싱 에러 → errors 배열에 포함", async () => {
    const { result } = renderHook(() => useCompileResult("<Unclosed", 0));
    await act(async () => { vi.runAllTimers(); });
    expect(result.current.errors.length).toBeGreaterThan(0);
  });

  it("debounce: 300ms 이내 재입력 시 이전 결과 유지", async () => {
    const { result, rerender } = renderHook(
      ({ text }: { text: string }) => useCompileResult(text, 300),
      { initialProps: { text: '<Button variant="primary" />' } }
    );
    // debounce 전 초기 상태
    rerender({ text: "<LoginForm />" });
    // 아직 debounce 미완료 — 이전 결과 유지 (초기값 빈 배열)
    expect(result.current.reactTree).toHaveLength(0);
    // debounce 완료
    await act(async () => { vi.advanceTimersByTime(300); });
    expect(result.current.reactTree.length).toBeGreaterThan(0);
  });
});
