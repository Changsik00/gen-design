import kleur from "kleur";

export const messages = {
  header: () =>
    `\n${kleur.bold().magenta("✨ create-gd-react")} ${kleur.dim("— React + gen-design scaffold")}\n`,

  scaffolding: (name: string, offline: boolean) =>
    `${kleur.cyan("▶")} ${kleur.bold(name)} 생성 중 ${
      offline ? kleur.dim("(offline 모드)") : kleur.dim("(github fetch)")
    }`,

  fetchProgress: (preset: string) =>
    `${kleur.dim("  ↓")} GitHub 에서 ${kleur.bold(preset)} preset 다운로드 중...`,

  postProcessing: () => `${kleur.dim("  ⚙")} 후처리 (이름 / placeholder / memory 초기화)`,

  installing: () => `${kleur.dim("  📦")} 의존성 설치 중 (pnpm install)`,

  success: (name: string, targetDir: string) =>
    `\n${kleur.bold().green("✓ 완료!")}  ${kleur.bold(name)} 생성됨 — ${kleur.dim(targetDir)}\n`,

  nextSteps: (name: string, installed: boolean) =>
    [
      `${kleur.bold("다음 단계:")}`,
      `  ${kleur.cyan(`cd ${name}`)}`,
      ...(installed ? [] : [`  ${kleur.cyan("pnpm install")}`]),
      `  ${kleur.dim("# Claude Code 에서 디렉토리 열기 → 채팅에")} ${kleur.cyan("/gd-start")} ${kleur.dim("입력")}`,
      `  ${kleur.cyan("pnpm dev")}  ${kleur.dim("# Vite dev server 기동")}`,
      "",
      `${kleur.dim("README.md 에 30초 안내가 있습니다.")}`,
      "",
    ].join("\n"),

  errorInvalidName: (name: string) =>
    `${kleur.red("✗")} 디렉토리 이름 ${kleur.bold(name)} 이 유효하지 않습니다. 영문 / 숫자 / -, _ 만 사용해주세요.`,

  errorDirExists: (dir: string) =>
    `${kleur.red("✗")} ${kleur.bold(dir)} 이미 존재합니다. ${kleur.cyan("--force")} 로 덮어쓰거나 다른 이름을 사용하세요.`,

  errorNetwork: () =>
    `${kleur.red("✗")} GitHub 접근 실패. ${kleur.cyan("--offline")} 로 재시도하거나 네트워크를 확인하세요.`,

  errorPresetNotFound: (preset: string, repo: string) =>
    `${kleur.red("✗")} preset ${kleur.bold(preset)} 을 찾을 수 없습니다 (${kleur.dim(repo)}). preset 이름을 확인하거나 ${kleur.cyan("--offline")} 로 default preset 을 사용하세요.`,

  errorExtractFailed: (detail: string) =>
    `${kleur.red("✗")} tarball 추출 실패: ${detail}. 디스크 공간 또는 권한을 확인하세요.`,

  errorInstallFailed: () =>
    `${kleur.yellow("⚠")} 의존성 설치 실패. ${kleur.cyan("--no-install")} 로 건너뛰거나 수동으로 ${kleur.cyan("pnpm install")} 실행하세요.`,

  warnOfflineFallback: () =>
    `${kleur.yellow("⚠")} offline 모드 — 번들된 preset 사용`,

  warnBundledFallback: () =>
    `${kleur.yellow("⚠")} 원격 preset 접근 실패 — 번들된 preset 으로 대체합니다`,

  help: () =>
    `
${kleur.bold("사용법:")} npx create-gd-react ${kleur.cyan("<project-name>")} [options]

${kleur.bold("옵션:")}
  ${kleur.cyan("--preset <name>")}    preset 이름 (기본: default)
  ${kleur.cyan("--offline")}          네트워크 미사용, 번들된 preset 사용
  ${kleur.cyan("--force")}            기존 디렉토리 덮어쓰기
  ${kleur.cyan("--no-install")}       pnpm install 건너뛰기
  ${kleur.cyan("--help")}             이 도움말 표시
  ${kleur.cyan("--version")}          버전 출력

${kleur.bold("예시:")}
  npx create-gd-react my-app
  npx create-gd-react my-app --offline
  npx create-gd-react my-app --preset saas-dashboard
`,
} as const;
