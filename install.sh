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

node - "$SETTINGS" "$MARKETPLACE_KEY" "$REPO" "$PLUGIN_KEY" <<'JSEOF'
const [, , settingsPath, marketplaceKey, repo, pluginKey] = process.argv;
const fs = require('fs');
const s = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
(s.extraKnownMarketplaces = s.extraKnownMarketplaces || {})[marketplaceKey] = {
  source: { source: 'github', repo }
};
(s.enabledPlugins = s.enabledPlugins || {})[pluginKey] = true;
fs.writeFileSync(settingsPath, JSON.stringify(s, null, 2) + '\n');
console.log('  settings.json 업데이트 완료');
JSEOF

# ── 3. DB URL 설정 ───────────────────────────────────────────────
echo ""
echo "▶ 관리자에게 받은 DB URL을 입력하세요:"
read -r -s DB_URL_INPUT
echo ""

if [ -n "$DB_URL_INPUT" ]; then
  node - "$SETTINGS" "$DB_URL_INPUT" <<'JSEOF'
const [, , settingsPath, dbUrl] = process.argv;
const fs = require('fs');
const s = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
(s.env = s.env || {}).OPENKNOWL_DB_URL = dbUrl;
fs.writeFileSync(settingsPath, JSON.stringify(s, null, 2) + '\n');
console.log('  DB URL 저장 완료 (~/.claude/settings.json)');
JSEOF
else
  echo "⚠ DB URL 입력 생략 — 스킬 첫 사용 시 Claude가 안내합니다."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  설치 완료!"
echo ""
echo "  Terminal을 재시작한 뒤 Cowork를 열면 플러그인이 활성화됩니다."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
