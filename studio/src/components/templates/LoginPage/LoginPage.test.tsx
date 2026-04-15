import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LoginPage } from ".";
import { getLoginPageTexts } from "@/lib/i18n";

afterEach(cleanup);

const koTexts = getLoginPageTexts("ko");
const enTexts = getLoginPageTexts("en");

describe("LoginPage", () => {
  it("renders Korean texts in page variant", () => {
    render(<LoginPage variant="page" texts={koTexts} />);
    expect(screen.getByText("계정에 로그인하세요")).toBeInTheDocument();
    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText("비밀번호")).toBeInTheDocument();
    expect(screen.getByText("비밀번호를 잊으셨나요?")).toBeInTheDocument();
    expect(screen.getByText("Google로 계속하기")).toBeInTheDocument();
  });

  it("renders English texts", () => {
    render(<LoginPage variant="page" texts={enTexts} />);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("renders signup prompt with link", () => {
    render(<LoginPage variant="page" texts={koTexts} />);
    expect(screen.getByText("계정이 없으신가요?")).toBeInTheDocument();
    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });
});
