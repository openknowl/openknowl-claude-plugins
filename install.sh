#!/bin/bash
# OpenKnowl Claude Code 플러그인 설치 스크립트
# 사용법: bash install.sh

set -e

REPO="openknowl/openknowl-claude-plugins"
MARKETPLACE_KEY="openknowl-plugins"
PLUGIN_KEY="openknowl-data@openknowl-plugins"
SETTINGS="$HOME/.claude/settings.json"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  OpenKnowl Claude Code 플러그인 설치"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 1. Homebrew ──────────────────────────────────────────────────
if ! command -v brew &>/dev/null; then
  echo "▶ Homebrew 설치 중..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Apple Silicon 경로 추가
  if [ -f /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
fi
echo "✓ Homebrew 준비 완료"

# ── 2. gh CLI ────────────────────────────────────────────────────
if ! command -v gh &>/dev/null; then
  echo "▶ GitHub CLI(gh) 설치 중..."
  brew install gh
fi
echo "✓ GitHub CLI 준비 완료"

# ── 3. GitHub 로그인 ─────────────────────────────────────────────
if ! gh auth status &>/dev/null; then
  echo ""
  echo "▶ GitHub 로그인이 필요합니다."
  echo "  브라우저가 열리면 로그인 후 코드를 붙여넣어 주세요."
  echo ""
  gh auth login --hostname github.com --git-protocol https --scopes repo --web
else
  echo "✓ GitHub 이미 로그인됨"
fi

# ── 4. Private repo 접근 확인 ────────────────────────────────────
echo "▶ 플러그인 레포 접근 확인 중..."
if ! gh repo view "$REPO" &>/dev/null; then
  echo ""
  echo "✗ 오류: '$REPO' 레포에 접근할 수 없습니다."
  echo "  관리자에게 GitHub 계정 초대를 요청해 주세요."
  exit 1
fi
echo "✓ 레포 접근 가능"

# ── 5. git credential 연동 (Claude Code가 HTTPS로 접근할 경우 대비) ──
gh auth setup-git 2>/dev/null || true

# ── 6. Claude Code settings.json 업데이트 ────────────────────────
echo "▶ Claude Code 설정 업데이트 중..."

# settings.json 이 없으면 빈 객체로 생성
mkdir -p "$(dirname "$SETTINGS")"
if [ ! -f "$SETTINGS" ]; then
  echo "{}" > "$SETTINGS"
fi

python3 - "$SETTINGS" "$MARKETPLACE_KEY" "$REPO" "$PLUGIN_KEY" <<'PYEOF'
import sys, json

settings_path = sys.argv[1]
marketplace_key = sys.argv[2]
repo = sys.argv[3]
plugin_key = sys.argv[4]

with open(settings_path) as f:
    settings = json.load(f)

# extraKnownMarketplaces 추가
if "extraKnownMarketplaces" not in settings:
    settings["extraKnownMarketplaces"] = {}
settings["extraKnownMarketplaces"][marketplace_key] = {
    "source": {"source": "github", "repo": repo}
}

# enabledPlugins 추가
if "enabledPlugins" not in settings:
    settings["enabledPlugins"] = {}
settings["enabledPlugins"][plugin_key] = True

with open(settings_path, "w") as f:
    json.dump(settings, f, indent=2, ensure_ascii=False)
    f.write("\n")

print("  settings.json 업데이트 완료")
PYEOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  설치 완료!"
echo ""
echo "  Claude Code를 재시작하면 플러그인이 활성화됩니다."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
