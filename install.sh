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

# ── 2. Claude Code settings.json 업데이트 ────────────────────────
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

# ── 3. DB URL 설정 ───────────────────────────────────────────────
echo ""
echo "▶ 관리자에게 받은 DB URL을 입력하세요:"
read -r -s DB_URL_INPUT
echo ""

if [ -n "$DB_URL_INPUT" ]; then
  # 쉘 프로파일 결정
  if [ -f "$HOME/.zshrc" ]; then
    PROFILE="$HOME/.zshrc"
  else
    PROFILE="$HOME/.bash_profile"
  fi

  # 이미 있으면 교체, 없으면 추가
  if grep -q "OPENKNOWL_DB_URL" "$PROFILE" 2>/dev/null; then
    sed -i '' "s|export OPENKNOWL_DB_URL=.*|export OPENKNOWL_DB_URL='$DB_URL_INPUT'|" "$PROFILE"
  else
    echo "" >> "$PROFILE"
    echo "export OPENKNOWL_DB_URL='$DB_URL_INPUT'" >> "$PROFILE"
  fi

  export OPENKNOWL_DB_URL="$DB_URL_INPUT"
  echo "✓ DB URL 저장 완료 ($PROFILE)"
else
  echo "⚠ DB URL 입력 생략됨 — 나중에 ~/.zshrc에 직접 추가 가능:"
  echo "  export OPENKNOWL_DB_URL='postgres://...'"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  설치 완료!"
echo ""
echo "  Terminal을 재시작한 뒤 Cowork를 열면 플러그인이 활성화됩니다."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
