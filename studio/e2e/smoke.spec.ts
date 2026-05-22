import { test, expect, type Page } from "@playwright/test";

const ROUTES = [
  { hash: "#/spec",    label: "Spec Editor" },
  { hash: "#/new",     label: "New Spec" },
  { hash: "#/design",  label: "Design MD" },
  { hash: "#/tokens",  label: "Tokens" },
  { hash: "#/export",  label: "Export" },
  { hash: "#/chats",   label: "Chats" },
] as const;

async function collectErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

for (const { hash, label } of ROUTES) {
  test(`${label} 라우트 로딩 (${hash})`, async ({ page }) => {
    const errors = await collectErrors(page);

    await page.goto(`/${hash}`);

    // sidebar nav 가 렌더됐는지 (aside 안의 첫 번째 nav = 앱 네비게이션)
    const sidebarNav = page.locator("aside nav").first();
    await expect(sidebarNav).toBeVisible();

    // 현재 라우트의 nav 항목이 활성화됐는지 (sidebar nav 안에 레이블 텍스트 존재)
    await expect(sidebarNav.getByText(label)).toBeVisible();

    // JS 런타임 오류 없음
    expect(errors, `JS errors on ${hash}: ${errors.join(", ")}`).toHaveLength(0);
  });
}
