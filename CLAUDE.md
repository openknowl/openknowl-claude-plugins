# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 구조

```
openknowl-claude-plugins/
├── .claude-plugin/marketplace.json   # 마켓플레이스 루트 메타데이터
├── install.sh                        # 직원 온보딩 스크립트
└── openknowl-data/                   # 플러그인 단위
    ├── .claude-plugin/plugin.json    # 플러그인 메타데이터
    ├── cli/                          # TypeScript → 번들 빌드 소스
    │   ├── src/env.ts                # DB 접속 정보 (크리덴셜 포함 — 커밋 주의)
    │   └── src/query.ts              # CLI 진입점: SELECT만 허용
    ├── dist/cli.js                   # 번들 결과물 (node_modules 불필요)
    └── skills/data-query/            # Claude Code 스킬
        ├── SKILL.md
        └── references/
            ├── schema.md             # 테이블/컬럼 레퍼런스
            └── common-queries.md     # 자주 쓰는 쿼리 패턴
```

## CLI 빌드

```bash
cd openknowl-data/cli
npm install
npm run build          # → dist/cli.js 갱신
```

`dist/cli.js`는 pg 포함 단일 번들이라 사용처에서 npm install 불필요. **빌드 후 반드시 커밋.**

## 플러그인 구조 규칙

- 플러그인 하나 = `<plugin-name>/` 디렉토리
- `.claude-plugin/plugin.json` — 플러그인 이름·버전
- `.claude-plugin/marketplace.json`은 루트에만 존재 (플러그인 목록 선언)
- `skills/` 안의 각 스킬은 `SKILL.md` + 선택적 `references/` 구성
- `skills` 필드는 `plugin.json`에 넣지 않음 — Claude Code가 자동 탐색

## 보안 주의

- `cli/src/env.ts`에 DB URL(비밀번호 포함)이 하드코딩되어 있음
- 이 레포는 **반드시 private**으로 유지
- `dist/cli.js`도 크리덴셜을 포함하므로 외부 공개 금지

## 온보딩 (install.sh)

Claude Code가 GitHub 마켓플레이스 접근에 `gh` CLI 토큰을 사용하므로, 신규 직원은 `install.sh`를 통해 `gh` 인증 + `settings.json` 자동 설정. 개인 GitHub 계정 불필요 — 공유 PAT를 스크립트에 내장.
