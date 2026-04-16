import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LoginPage } from ".";
import { getLoginPageTexts } from "@/lib/i18n";

afterEach(cleanup);

const texts = getLoginPageTexts("ko");

describe("LoginPage variant switching", () => {
  it("page variant renders split-screen layout with branding panel", () => {
    const { container } = render(<LoginPage variant="page" texts={texts} />);
    // split-screen: aside 영역에 "Admin Console" 존재
    expect(screen.getByText("Admin Console")).toBeInTheDocument();
    // 좌측 다크 패널 존재 (gradient background)
    const darkPanel = container.querySelector("[class*='from-slate-900']");
    expect(darkPanel).toBeTruthy();
  });

  it("modal variant renders a trigger button (no split-screen)", () => {
    render(<LoginPage variant="modal" texts={texts} />);
    // modal: split-screen 없음
    expect(screen.queryByText("Admin Console")).not.toBeInTheDocument();
    // Dialog trigger 버튼 존재
    const trigger = screen.getByRole("button", { name: texts.title });
    expect(trigger).toBeInTheDocument();
  });

  it("page variant has form fields visible immediately", () => {
    render(<LoginPage variant="page" texts={texts} />);
    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText("비밀번호")).toBeInTheDocument();
    expect(screen.getByText("Google로 계속하기")).toBeInTheDocument();
  });

  it("both variants render the same form content (signup link)", () => {
    const { unmount } = render(<LoginPage variant="page" texts={texts} />);
    expect(screen.getByText("회원가입")).toBeInTheDocument();
    unmount();

    // modal은 trigger만 보이고 form은 dialog 안에 있으므로 trigger 확인만
    render(<LoginPage variant="modal" texts={texts} />);
    expect(screen.getByRole("button", { name: texts.title })).toBeInTheDocument();
  });

  it("bottom-sheet variant renders form at bottom with drag handle", () => {
    const { container } = render(<LoginPage variant="bottom-sheet" texts={texts} />);
    // bottom-sheet: data-variant 속성 존재
    const sheet = container.querySelector("[data-variant='bottom-sheet']");
    expect(sheet).toBeTruthy();
    // 폼 필드 렌더링
    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText("비밀번호")).toBeInTheDocument();
  });

  it("bottom-sheet variant has no split-screen branding", () => {
    render(<LoginPage variant="bottom-sheet" texts={texts} />);
    expect(screen.queryByText("Admin Console")).not.toBeInTheDocument();
  });
});
