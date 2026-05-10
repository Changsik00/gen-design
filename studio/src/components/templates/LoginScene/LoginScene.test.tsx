import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LoginScene } from ".";
import { getLoginSceneTexts } from "@/lib/i18n";

afterEach(cleanup);

const koTexts = getLoginSceneTexts("ko");
const enTexts = getLoginSceneTexts("en");

describe("LoginScene", () => {
  it("renders Korean texts in page variant", () => {
    render(<LoginScene variant="page" texts={koTexts} />);
    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText("비밀번호")).toBeInTheDocument();
    expect(screen.getByText("Google로 계속하기")).toBeInTheDocument();
  });

  it("renders English texts", () => {
    render(<LoginScene variant="page" texts={enTexts} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("renders signup prompt with link", () => {
    render(<LoginScene variant="page" texts={koTexts} />);
    expect(screen.getByText("계정이 없으신가요?")).toBeInTheDocument();
    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });

  it("renders split-screen layout with branding panel", () => {
    render(<LoginScene variant="page" texts={koTexts} />);
    expect(screen.getByText("Admin Console")).toBeInTheDocument();
  });
});
