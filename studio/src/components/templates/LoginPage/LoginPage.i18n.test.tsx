import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LoginPage } from ".";
import { getLoginPageTexts } from "@/lib/i18n";

afterEach(cleanup);

const koTexts = getLoginPageTexts("ko");
const enTexts = getLoginPageTexts("en");

describe("LoginPage i18n switching", () => {
  it("ko renders Korean labels", () => {
    render(<LoginPage variant="page" texts={koTexts} />);
    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText("비밀번호")).toBeInTheDocument();
    expect(screen.getByText("계정이 없으신가요?")).toBeInTheDocument();
  });

  it("en renders English labels", () => {
    render(<LoginPage variant="page" texts={enTexts} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it("ko and en have same number of form fields", () => {
    const { container: koContainer } = render(<LoginPage variant="page" texts={koTexts} />);
    const koInputs = koContainer.querySelectorAll("input");
    cleanup();

    const { container: enContainer } = render(<LoginPage variant="page" texts={enTexts} />);
    const enInputs = enContainer.querySelectorAll("input");

    expect(koInputs.length).toBe(enInputs.length);
  });

  it("ko and en have same number of buttons", () => {
    const { container: koContainer } = render(<LoginPage variant="page" texts={koTexts} />);
    const koButtons = koContainer.querySelectorAll("button");
    cleanup();

    const { container: enContainer } = render(<LoginPage variant="page" texts={enTexts} />);
    const enButtons = enContainer.querySelectorAll("button");

    expect(koButtons.length).toBe(enButtons.length);
  });
});
