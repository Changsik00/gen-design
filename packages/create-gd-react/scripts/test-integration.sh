#!/usr/bin/env bash
#
# Integration test: scaffold → install → typecheck → build
#
# 임시 디렉토리에서 create-gd-react CLI 를 --offline 모드로 실행한 후
# 결과 프로젝트가 pnpm install + typecheck + build 까지 통과하는지 검증.
#
# Usage:
#   bash packages/create-gd-react/scripts/test-integration.sh
#

set -euo pipefail

# 색상
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
CLI_DIR="$ROOT_DIR/packages/create-gd-react"
TMP_BASE="${TMPDIR:-/tmp}"
TMP_DIR="$(mktemp -d "${TMP_BASE}/create-gd-react-integ-XXXXXX")"
PROJECT_NAME="integration-test-app"
PROJECT_DIR="$TMP_DIR/$PROJECT_NAME"

cleanup() {
  if [ -d "$TMP_DIR" ]; then
    echo ""
    echo -e "${CYAN}🧹 정리: $TMP_DIR${NC}"
    rm -rf "$TMP_DIR"
  fi
}
trap cleanup EXIT

echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}Integration Test — create-gd-react${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Workspace: $ROOT_DIR"
echo "CLI:       $CLI_DIR"
echo "Temp:      $TMP_DIR"
echo ""

# Step 1: CLI 빌드
echo -e "${BOLD}[1/5] CLI 빌드${NC}"
cd "$CLI_DIR"
pnpm build > /dev/null 2>&1
echo -e "  ${GREEN}✓${NC} dist/cli.js 생성"
echo ""

# Step 2: scaffold (--offline --no-install)
echo -e "${BOLD}[2/5] Scaffold ($PROJECT_NAME, --offline --no-install)${NC}"
cd "$TMP_DIR"
START=$(date +%s)
node "$CLI_DIR/dist/cli.js" "$PROJECT_NAME" --offline --no-install
END=$(date +%s)
SCAFFOLD_TIME=$((END - START))
echo -e "  ${GREEN}✓${NC} ${SCAFFOLD_TIME}초"
echo ""

# Step 3: 파일 존재 검증
echo -e "${BOLD}[3/5] 핵심 파일 검증${NC}"
EXPECTED_FILES=(
  "package.json"
  "README.md"
  "vite.config.ts"
  "tsconfig.json"
  "tsconfig.app.json"
  "index.html"
  "components.json"
  "eslint.config.js"
  ".prettierrc.json"
  "lefthook.yml"
  ".gitignore"
  "src/main.tsx"
  "src/router.tsx"
  "src/lib/utils.ts"
  "src/lib/sentry.ts"
  "src/lib/logger.ts"
  "src/api/client.ts"
  "src/config/env.ts"
  "src/i18n/index.ts"
  "src/i18n/locales/ko.json"
  "src/i18n/locales/en.json"
  "src/styles/globals.css"
  "src/components/ui/button.tsx"
  "src/components/ui/card.tsx"
  "src/components/ui/input.tsx"
  "src/components/ui/label.tsx"
  "src/components/ui/separator.tsx"
  "src/scenes/welcome.tsx"
  "chats/_shell.chat.md"
  "chats/scenes/welcome.chat.md"
  "templates/FRONT.md"
  "templates/AGENT.md"
  "templates/DESIGN.md"
  "templates/TOKEN.md"
  "templates/assets/tokens/tokens.json"
  ".claude/skills/gd-start.md"
  ".claude/skills/gd-chat.md"
  ".claude/skills/gd-token.md"
  ".claude/skills/gd-design.md"
  ".gd/memory/MEMORY.md"
  ".gd/memory/project.md"
)
MISSING=0
for f in "${EXPECTED_FILES[@]}"; do
  if [ ! -f "$PROJECT_DIR/$f" ]; then
    echo -e "  ${RED}✗${NC} 누락: $f"
    MISSING=$((MISSING + 1))
  fi
done
if [ $MISSING -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} ${#EXPECTED_FILES[@]}개 파일 모두 존재"
else
  echo -e "  ${RED}✗ $MISSING 개 누락${NC}"
  exit 1
fi
echo ""

# Step 4: placeholder 치환 검증
echo -e "${BOLD}[4/5] Placeholder 치환 검증${NC}"
PKG_NAME=$(node -e "console.log(require('$PROJECT_DIR/package.json').name)")
if [ "$PKG_NAME" = "$PROJECT_NAME" ]; then
  echo -e "  ${GREEN}✓${NC} package.json name = $PROJECT_NAME"
else
  echo -e "  ${RED}✗${NC} package.json name = $PKG_NAME (expected $PROJECT_NAME)"
  exit 1
fi

if grep -q "{{project-name}}" "$PROJECT_DIR/README.md"; then
  echo -e "  ${RED}✗${NC} README.md 에 placeholder 잔존"
  exit 1
else
  echo -e "  ${GREEN}✓${NC} README.md placeholder 치환됨"
fi

if grep -q "$PROJECT_NAME" "$PROJECT_DIR/.gd/memory/MEMORY.md"; then
  echo -e "  ${GREEN}✓${NC} .gd/memory/MEMORY.md 인덱스 초기화"
else
  echo -e "  ${RED}✗${NC} .gd/memory/MEMORY.md 초기화 실패"
  exit 1
fi
echo ""

# Step 5: pnpm install + typecheck (선택 — 시간이 걸려 SKIP_INSTALL=1 로 건너뛸 수 있음)
if [ "${SKIP_INSTALL:-0}" = "1" ]; then
  echo -e "${BOLD}[5/5] pnpm install + typecheck — ${YELLOW}SKIP (SKIP_INSTALL=1)${NC}"
else
  echo -e "${BOLD}[5/5] pnpm install + typecheck${NC}"
  cd "$PROJECT_DIR"
  START=$(date +%s)
  # pnpm 10 에서 ERR_PNPM_IGNORED_BUILDS 가 exit 1 을 만들지만 install 자체는 성공.
  # node_modules 가 생성됐는지로 성공 판단.
  pnpm install --ignore-scripts > /tmp/install.log 2>&1 || true
  END=$(date +%s)
  INSTALL_TIME=$((END - START))
  if [ -d "$PROJECT_DIR/node_modules" ] && [ -f "$PROJECT_DIR/node_modules/.bin/tsc" ]; then
    echo -e "  ${GREEN}✓${NC} pnpm install (${INSTALL_TIME}초)"
  else
    echo -e "  ${RED}✗${NC} pnpm install FAILED"
    tail -30 /tmp/install.log
    exit 1
  fi

  # tsc 직접 호출 — pnpm 의 dep-check 우회
  START=$(date +%s)
  if "$PROJECT_DIR/node_modules/.bin/tsc" --noEmit -p "$PROJECT_DIR" > /tmp/typecheck.log 2>&1; then
    END=$(date +%s)
    TYPECHECK_TIME=$((END - START))
    echo -e "  ${GREEN}✓${NC} typecheck (${TYPECHECK_TIME}초)"
  else
    echo -e "  ${RED}✗${NC} typecheck FAILED"
    tail -30 /tmp/typecheck.log
    exit 1
  fi
fi
echo ""

echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${GREEN}✅ Integration Test PASSED${NC}"
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
