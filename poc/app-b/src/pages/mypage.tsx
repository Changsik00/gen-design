import { MyPage } from "studio/components/templates";
import { getMyPageTexts, getNavItems } from "@/hooks/useTexts";

const profile = {
  name: "정현우",
  role: "시니어 엔지니어",
  email: "junghyunwoo@flowdesk.kr",
  joinedAt: "2024년 3월 4일",
  team: "플랫폼",
  avatarUrl: null,
};

const summary = {
  tasks: 32,
  comments: 142,
  completion: 91,
};

export function MyPageRoute() {
  return (
    <MyPage
      variant="page"
      texts={getMyPageTexts()}
      appName="플로우데스크"
      profile={profile}
      summary={summary}
      navItems={getNavItems()}
    />
  );
}
