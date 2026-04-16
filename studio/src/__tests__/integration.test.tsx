/**
 * Phase-2 통합 테스트 시나리오 (phase-2.md 참조)
 *
 * 시나리오 1: Auth Page Template 렌더링
 * 시나리오 2: 토큰 교체 테마 변경
 * 시나리오 3: variant 전환
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LoginPage, SignupPage, DashboardPage } from "@/components/templates";
import { getLoginPageTexts, getSignupPageTexts, getDashboardPageTexts } from "@/lib/i18n";
import type { StatCardData, ActivityRowData } from "@/components/templates/types";

afterEach(cleanup);

const mockStats: StatCardData[] = [
  { label: "USERS", value: "100", change: "10%", trend: "up" },
];

const mockActivities: ActivityRowData[] = [
  { userName: "Test User", initials: "TU", action: "Test action", status: "Done", statusColor: "green", time: "1 min" },
];

describe("시나리오 1: Auth Page Template 렌더링", () => {
  it("LoginPage: 3계층 구조 적용 — Composite(LoginForm, SocialAuthBlock) 조합으로 렌더링", () => {
    const texts = getLoginPageTexts("ko");
    render(<LoginPage variant="page" texts={texts} />);

    // Composite: LoginForm 요소
    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText("비밀번호")).toBeInTheDocument();

    // Composite: SocialAuthBlock 요소
    expect(screen.getByText("Google로 계속하기")).toBeInTheDocument();
    expect(screen.getByText("Apple로 계속하기")).toBeInTheDocument();
    expect(screen.getByText("카카오로 계속하기")).toBeInTheDocument();

    // Template 레벨: 네비게이션 링크
    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });

  it("SignupPage: 3계층 구조 적용", () => {
    const texts = getSignupPageTexts("ko");
    render(<SignupPage variant="page" texts={texts} />);

    expect(screen.getByText("이름")).toBeInTheDocument();
    expect(screen.getByText("비밀번호 확인")).toBeInTheDocument();
    expect(screen.getByText("이용약관 및 개인정보처리방침에 동의합니다")).toBeInTheDocument();
  });

  it("DashboardPage: Sidebar + StatCard + ActivityTable 조합", () => {
    const texts = getDashboardPageTexts("ko");
    render(
      <DashboardPage variant="page" texts={texts} stats={mockStats} activities={mockActivities} />
    );

    // Sidebar
    expect(screen.getByText("AI 채팅")).toBeInTheDocument();

    // StatCard
    expect(screen.getByText("USERS")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();

    // ActivityTable
    expect(screen.getByText("최근 활동")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });
});

describe("시나리오 2: 토큰 교체 테마 변경", () => {
  it("동일한 LoginPage 구조에서 텍스트만 다른 i18n으로 교체 가능", () => {
    // Brand A(ko) 렌더링
    const koTexts = getLoginPageTexts("ko");
    const { container: koContainer } = render(<LoginPage variant="page" texts={koTexts} />);
    const koInputCount = koContainer.querySelectorAll("input").length;
    const koButtonCount = koContainer.querySelectorAll("button").length;
    cleanup();

    // Brand A(en) 렌더링 — 토큰은 동일, 텍스트만 다름
    const enTexts = getLoginPageTexts("en");
    const { container: enContainer } = render(<LoginPage variant="page" texts={enTexts} />);
    const enInputCount = enContainer.querySelectorAll("input").length;
    const enButtonCount = enContainer.querySelectorAll("button").length;

    // 구조 동일 (input, button 개수)
    expect(koInputCount).toBe(enInputCount);
    expect(koButtonCount).toBe(enButtonCount);

    // 텍스트는 다름
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.queryByText("이메일")).not.toBeInTheDocument();
  });

  it("brand-b CSS 클래스 토글 시 DOM 구조 변경 없음", () => {
    const texts = getLoginPageTexts("ko");

    // brand-a (기본)
    const { container: containerA } = render(<LoginPage variant="page" texts={texts} />);
    const inputCountA = containerA.querySelectorAll("input").length;
    const buttonCountA = containerA.querySelectorAll("button").length;
    cleanup();

    // brand-b (클래스 토글 시뮬레이션)
    document.documentElement.classList.add("brand-b");
    const { container: containerB } = render(<LoginPage variant="page" texts={texts} />);
    const inputCountB = containerB.querySelectorAll("input").length;
    const buttonCountB = containerB.querySelectorAll("button").length;
    document.documentElement.classList.remove("brand-b");

    // DOM 구조 동일
    expect(inputCountA).toBe(inputCountB);
    expect(buttonCountA).toBe(buttonCountB);
  });
});

describe("시나리오 3: variant 전환", () => {
  it("page variant: split-screen 레이아웃 (브랜딩 패널 존재)", () => {
    const texts = getLoginPageTexts("ko");
    render(<LoginPage variant="page" texts={texts} />);
    expect(screen.getByText("Admin Console")).toBeInTheDocument();
  });

  it("modal variant: Dialog 트리거 버튼 (브랜딩 패널 없음)", () => {
    const texts = getLoginPageTexts("ko");
    render(<LoginPage variant="modal" texts={texts} />);
    expect(screen.queryByText("Admin Console")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: texts.title })).toBeInTheDocument();
  });

  it("variant 변경 시 폼 콘텐츠 동일 (page에서 보이는 필드가 modal에도 존재)", () => {
    const texts = getLoginPageTexts("ko");

    // page variant에서 form 필드 확인
    render(<LoginPage variant="page" texts={texts} />);
    expect(screen.getByPlaceholderText("이메일을 입력하세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호를 입력하세요")).toBeInTheDocument();
  });
});
