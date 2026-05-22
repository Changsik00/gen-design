import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  { hash: "#/spec", label: "Spec Editor" },
  { hash: "#/new", label: "New Spec" },
  { hash: "#/design", label: "Design MD" },
  { hash: "#/tokens", label: "Tokens" },
  { hash: "#/export", label: "Export" },
  { hash: "#/chats", label: "Chats" },
] as const;

for (const { hash, label } of ROUTES) {
  test(`${label} a11y (${hash})`, async ({ page }) => {
    await page.goto(`/${hash}`);
    await page.locator("aside nav").first().waitFor({ state: "visible" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    const warnings = results.violations.filter(
      (v) => v.impact === "moderate" || v.impact === "minor"
    );
    if (warnings.length > 0) {
      console.warn(
        `[a11y warn] ${label}: ${warnings.map((v) => v.id).join(", ")}`
      );
    }

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    const detail = blocking
      .map(
        (v) =>
          `[${v.impact}] ${v.id}: ${v.description}\n` +
          v.nodes
            .slice(0, 3)
            .map((n) => `  selector: ${n.target}`)
            .join("\n")
      )
      .join("\n");

    expect(blocking, `a11y violations on ${hash}:\n${detail}`).toHaveLength(0);
  });
}
