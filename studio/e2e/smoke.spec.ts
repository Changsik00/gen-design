import { test, expect, type Page } from "@playwright/test";

const ROUTES = [
  { hash: "#/spec",   label: "Spec Editor" },
  { hash: "#/new",    label: "New Spec" },
  { hash: "#/design", label: "Design MD" },
  { hash: "#/tokens", label: "Tokens" },
  { hash: "#/export", label: "Export" },
  { hash: "#/chats",  label: "Chats" },
] as const;

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

for (const { hash, label } of ROUTES) {
  test(`${label} 라우트 로딩 (${hash})`, async ({ page }) => {
    const errors = collectErrors(page);

    await page.goto(`/${hash}`);

    const sidebarNav = page.locator("aside nav").first();
    await expect(sidebarNav).toBeVisible();
    await expect(sidebarNav.getByText(label)).toBeVisible();

    expect(errors, `JS errors on ${hash}: ${errors.join(", ")}`).toHaveLength(0);
  });
}
