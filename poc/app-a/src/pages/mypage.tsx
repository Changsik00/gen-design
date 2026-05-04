import { MyPage } from "studio/components/templates";
import { getMyPageTexts, getNavItems } from "@/hooks/useTexts";

const profile = {
  name: "Alex Park",
  role: "Senior Engineer",
  email: "alex@taskflow.com",
  joinedAt: "Jan 12, 2024",
  team: "Platform",
  avatarUrl: null,
};

const summary = {
  tasks: 24,
  comments: 117,
  completion: 86,
};

export function MyPageRoute() {
  return (
    <MyPage
      variant="page"
      texts={getMyPageTexts()}
      profile={profile}
      summary={summary}
      navItems={getNavItems()}
    />
  );
}
