import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SignupPage } from ".";
import { getSignupPageTexts } from "@/lib/i18n";

afterEach(cleanup);

const koTexts = getSignupPageTexts("ko");
const enTexts = getSignupPageTexts("en");

describe("SignupPage", () => {
  it("renders Korean texts in page variant", () => {
    render(<SignupPage variant="page" texts={koTexts} />);
    expect(screen.getByText("새 계정을 만드세요")).toBeInTheDocument();
    expect(screen.getByText("이름")).toBeInTheDocument();
    expect(screen.getByText("비밀번호 확인")).toBeInTheDocument();
    expect(screen.getByText("이용약관 및 개인정보처리방침에 동의합니다")).toBeInTheDocument();
  });

  it("renders English texts", () => {
    render(<SignupPage variant="page" texts={enTexts} />);
    expect(screen.getByText("Create a new account")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Confirm password")).toBeInTheDocument();
  });

  it("renders login prompt with link", () => {
    render(<SignupPage variant="page" texts={koTexts} />);
    expect(screen.getByText("이미 계정이 있으신가요?")).toBeInTheDocument();
    expect(screen.getByText("로그인")).toBeInTheDocument();
  });
});
