/**
 * validate-blueprint.mjs 단위 테스트.
 * Node 표준 test runner (`node --test`).
 */

import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validate } from "../validate-blueprint.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function makeYaml(yaml) {
  return "```yaml\n" + yaml + "\n```";
}

const NFR_BLOCK = `
auth:
  method: "email-password"
  socialProviders: []
  sessionStrategy: "jwt-refresh"
i18n:
  defaultLocale: "ko"
  supportedLocales: ["ko"]
theme:
  defaultTheme: "light"
  supportedThemes: ["light"]
performance:
  targetLighthouseScore: 90
security:
  csp: "strict-default"
compatibility:
  targetBrowsers: "last-2"
`.trim();

function buildValid() {
  return makeYaml(`
${NFR_BLOCK}
finalPages:
  - id: "auth-login"
    name: "로그인"
    category: "auth"
    variant: "modal"
    route: "/auth/login"
    layout: "centered-card"
    componentPath: "@/components/templates/LoginPage"
    requiredSections:
      - "BrandHeader"
    optionalSections:
      - "ForgotPasswordLink"
    templateMapping:
      template: "LoginPage"
      status: "implemented"
`);
}

test("정상 입력 — error 0 / warning 0", () => {
  const { errors, warnings, ok } = validate(buildValid());
  assert.equal(errors.length, 0, errors.join("\n"));
  assert.equal(warnings.length, 0, warnings.join("\n"));
  assert.equal(ok, true);
});

test("F-01: NFR 카테고리 누락 → warning (lenient)", () => {
  const yaml = makeYaml(`
auth:
  method: "email-password"
  socialProviders: []
  sessionStrategy: "jwt-refresh"
finalPages:
  - id: "auth-login"
    route: "/auth/login"
    layout: "centered-card"
    optionalSections: []
    templateMapping:
      template: "LoginPage"
      status: "implemented"
`);
  const { warnings } = validate(yaml);
  // i18n / theme / performance / security / compatibility 5 개 누락 expected
  assert.ok(warnings.some((w) => w.includes("F-01") && w.includes("i18n")));
  assert.ok(warnings.some((w) => w.includes("F-01") && w.includes("performance")));
  assert.ok(warnings.some((w) => w.includes("F-01") && w.includes("compatibility")));
});

test("F-01: NFR 누락 + strict mode → error", () => {
  const yaml = makeYaml(`
auth:
  method: "email-password"
  socialProviders: []
  sessionStrategy: "jwt-refresh"
finalPages:
  - id: "auth-login"
    route: "/auth/login"
    layout: "centered-card"
    optionalSections: []
    templateMapping:
      template: "LoginPage"
      status: "implemented"
`);
  const { errors, ok } = validate(yaml, { strict: true });
  assert.ok(errors.length > 0);
  assert.equal(ok, false);
});

test("F-03: route / layout 누락 → warning", () => {
  const yaml = makeYaml(`
${NFR_BLOCK}
finalPages:
  - id: "auth-login"
    name: "로그인"
    optionalSections: []
    templateMapping:
      template: "LoginPage"
      status: "implemented"
`);
  const { warnings } = validate(yaml);
  assert.ok(warnings.some((w) => w.includes("F-03") && w.includes("route")));
  assert.ok(warnings.some((w) => w.includes("F-03") && w.includes("layout")));
});

test("F-04: 비표준 status (✅) → error", () => {
  const yaml = makeYaml(`
${NFR_BLOCK}
finalPages:
  - id: "auth-login"
    route: "/auth/login"
    layout: "centered-card"
    optionalSections: []
    templateMapping:
      template: "LoginPage"
      status: "✅"
`);
  const { errors, ok } = validate(yaml);
  assert.ok(errors.some((e) => e.includes("F-04") && e.includes("✅")));
  assert.equal(ok, false);
});

test("F-05: optionalSections 키 omit → error", () => {
  const yaml = makeYaml(`
${NFR_BLOCK}
finalPages:
  - id: "auth-login"
    route: "/auth/login"
    layout: "centered-card"
    templateMapping:
      template: "LoginPage"
      status: "implemented"
`);
  const { errors, ok } = validate(yaml);
  assert.ok(errors.some((e) => e.includes("F-05") && e.includes("optionalSections")));
  assert.equal(ok, false);
});

test("F-05: optionalSections [] 또는 'none' 모두 통과", () => {
  const yamlEmpty = makeYaml(`
${NFR_BLOCK}
finalPages:
  - id: "auth-login"
    route: "/auth/login"
    layout: "centered-card"
    optionalSections: []
    templateMapping:
      template: "LoginPage"
      status: "implemented"
`);
  const yamlNone = makeYaml(`
${NFR_BLOCK}
finalPages:
  - id: "auth-login"
    route: "/auth/login"
    layout: "centered-card"
    optionalSections: "none"
    templateMapping:
      template: "LoginPage"
      status: "implemented"
`);
  assert.equal(validate(yamlEmpty).ok, true);
  assert.equal(validate(yamlNone).ok, true);
});

test("F-06: template 이름 유추 미준수 → warning", () => {
  const yaml = makeYaml(`
${NFR_BLOCK}
finalPages:
  - id: "auth-login"
    route: "/auth/login"
    layout: "centered-card"
    optionalSections: []
    templateMapping:
      template: "MyCustomLogin"
      status: "implemented"
`);
  const { warnings } = validate(yaml);
  // 'auth-login' → 'LoginPage' 유추 규칙. 'MyCustomLogin' 은 다름.
  assert.ok(warnings.some((w) => w.includes("F-06") && w.includes("LoginPage")));
});

test("F-06: 유추 규칙 sub-cases", () => {
  const cases = [
    { id: "auth-login", expected: "LoginPage" },
    { id: "auth-signup", expected: "SignupPage" },
    { id: "profile-mypage", expected: "MypagePage" }, // 유추 결과: 'MypagePage' (단순 규칙) — 실제 등재는 'MyPage' 예외
    { id: "dash-overview", expected: "DashboardOverviewPage" }, // 'Dashboard' 확장 + 'Overview' segment
    { id: "team-roster", expected: "TeamRosterPage" },
  ];
  for (const c of cases) {
    const yaml = makeYaml(`
${NFR_BLOCK}
finalPages:
  - id: "${c.id}"
    route: "/${c.id.replace("-", "/")}"
    layout: "default"
    optionalSections: []
    templateMapping:
      template: "${c.expected}"
      status: "not-implemented"
`);
    const { warnings } = validate(yaml);
    const hasInferenceWarn = warnings.some((w) => w.includes("F-06") && w.includes(c.id));
    assert.equal(hasInferenceWarn, false, `${c.id} 유추 결과 '${c.expected}' 가 예상과 다른 warning 발생: ${warnings.join("; ")}`);
  }
});

test("phase-5 산출물 회귀: poc/app-a/blueprint-session.md", () => {
  const fixturePath = join(__dirname, "../../poc/app-a/blueprint-session.md");
  if (!existsSync(fixturePath)) {
    console.warn("phase-5 fixture 없음 — 회귀 skip");
    return;
  }
  const content = readFileSync(fixturePath, "utf-8");
  const { errors, warnings, ok } = validate(content);

  // phase-5 산출물은 v2 protocol 의 모든 룰을 만족 못함 (NFR 4 카테고리 누락 / route/layout 누락 등)
  // 그러나 lenient 모드로 통과 (warning 만 발생)
  assert.equal(ok, true, `phase-5 산출물이 lenient 모드에서 fail — errors:\n${errors.join("\n")}`);
  assert.ok(warnings.length > 0, "phase-5 산출물은 NFR / route 등 마이그레이션 가능 누락 warning 발생 예상");
  console.log(`  phase-5 회귀: ${warnings.length} warning (예상)`);
});
