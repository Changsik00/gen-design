import { test, expect } from "@playwright/test";

test.describe("Chat Viewer 시나리오", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/chats");
    // sidebar nav가 렌더됐는지 먼저 확인
    await expect(page.locator("aside nav").first()).toBeVisible();
  });

  test("시나리오 A: 파일 목록 렌더링", async ({ page }) => {
    // Chat Viewer 영역이 렌더됨
    const chatArea = page.locator("main, [role=main], .flex-1").first();
    await expect(chatArea).toBeVisible();

    // 파일 목록에 버튼이 1개 이상 있어야 함 (fixtures/chats/scenes/ 6개)
    const fileButtons = page.locator("button[type=button]").filter({ hasNotText: /Narrative|Structure|History/ });
    await expect(fileButtons.first()).toBeVisible({ timeout: 5000 });
    const count = await fileButtons.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("시나리오 B: 파일 선택 → 컨텐츠 표시", async ({ page }) => {
    // 파일 목록에서 첫 번째 파일 클릭
    const fileButtons = page.locator("button[type=button]").filter({ hasNotText: /Narrative|Structure|History/ });
    await fileButtons.first().click();

    // 탭 버튼이 나타남
    await expect(page.getByRole("button", { name: "Narrative" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Structure" })).toBeVisible();
    await expect(page.getByRole("button", { name: "History" })).toBeVisible();
  });

  test("시나리오 C: 탭 전환", async ({ page }) => {
    // 파일 선택
    const fileButtons = page.locator("button[type=button]").filter({ hasNotText: /Narrative|Structure|History/ });
    await fileButtons.first().click();

    // 기본 탭 = Narrative
    await expect(page.getByRole("button", { name: "Narrative" })).toBeVisible();

    // Structure 탭 클릭
    await page.getByRole("button", { name: "Structure" }).click();

    // History 탭 클릭
    await page.getByRole("button", { name: "History" }).click();

    // History 탭이 여전히 존재 (탭 전환 후 크래시 없음)
    await expect(page.getByRole("button", { name: "History" })).toBeVisible();
  });
});
