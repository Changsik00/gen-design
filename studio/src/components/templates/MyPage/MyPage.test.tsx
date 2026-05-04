import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MyPage } from ".";
import type { MyPageProps, MyPageTexts } from "../types";

afterEach(cleanup);

const texts: MyPageTexts = {
  title: "My Page",
  infoEmail: "Email",
  infoJoinedAt: "Joined",
  infoTeam: "Team",
  summaryTasks: "Tasks",
  summaryComments: "Comments",
  summaryCompletion: "Completion Rate",
  avatarUpload: "Change avatar",
};

const baseProps: MyPageProps = {
  variant: "page",
  texts,
  navItems: ["Home", "Tasks", "Settings"],
  profile: {
    name: "Alex Park",
    role: "Senior Engineer",
    email: "alex@example.com",
    joinedAt: "Jan 12, 2024",
    team: "Platform",
    avatarUrl: null,
  },
  summary: { tasks: 24, comments: 117, completion: 86 },
};

describe("MyPage", () => {
  it("renders profile name and role from ProfileHeader", () => {
    render(<MyPage {...baseProps} />);
    expect(screen.getByText("Alex Park")).toBeInTheDocument();
    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
  });

  it("renders all 3 ProfileInfoCard rows with values", () => {
    render(<MyPage {...baseProps} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("alex@example.com")).toBeInTheDocument();
    expect(screen.getByText("Joined")).toBeInTheDocument();
    expect(screen.getByText("Jan 12, 2024")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByText("Platform")).toBeInTheDocument();
  });

  it("renders all 3 ActivitySummary metrics", () => {
    render(<MyPage {...baseProps} />);
    // "Tasks" 라벨은 Sidebar nav 와 ActivitySummary 양쪽에 등장 — getAllByText 로 검증
    expect(screen.getAllByText("Tasks").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("117")).toBeInTheDocument();
    expect(screen.getByText("Completion Rate")).toBeInTheDocument();
    expect(screen.getByText(/86\s*%/)).toBeInTheDocument();
  });

  it("renders AvatarUpload button", () => {
    render(<MyPage {...baseProps} />);
    expect(screen.getByRole("button", { name: "Change avatar" })).toBeInTheDocument();
  });

  it("renders sidebar nav items", () => {
    render(<MyPage {...baseProps} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    // "Tasks" 가 Sidebar 와 ActivitySummary 양쪽에 등장하므로 nav link 안에서 검증
    const navLinks = screen.getAllByRole("link");
    expect(navLinks.some((link) => link.textContent?.includes("Tasks"))).toBe(true);
  });
});
