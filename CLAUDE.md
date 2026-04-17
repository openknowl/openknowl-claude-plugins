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
    │   ├── src/env.ts                # 런타임에 openknowl-credentials.json 탐색·로드
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

## 릴리즈 규칙

**어떤 변경이든 커밋할 때마다 반드시 버전을 올릴 것.** Cowork/Claude Code가 버전 기반으로 캐시하므로 버전을 안 올리면 사용자에게 변경사항이 반영되지 않음.

버전 올릴 위치 (3곳 전부):
1. `.claude-plugin/marketplace.json` — `version` 필드 + `plugins[].description`의 vX.Y.Z
2. `openknowl-data/.claude-plugin/plugin.json` — `version` 필드 + `description`의 vX.Y.Z

코드·스킬·문서 어느 것이든 수정했다면 버전업.

## 크리덴셜 관리

- CLI는 런타임에 `openknowl-credentials.json` 파일을 탐색해서 읽음 (`env.ts` 참조)
- 소스·번들 어디에도 크리덴셜 하드코딩 없음
- 배포 흐름: 관리자가 직원에게 `openknowl-credentials.json` 전달 → 직원이 Cowork Project 로컬 폴더에 저장

## 온보딩 (install.sh)

Claude Code가 GitHub 마켓플레이스 접근에 `gh` CLI 토큰을 사용하므로, 신규 직원은 `install.sh`를 통해 `gh` 인증 + `settings.json` 자동 설정. 개인 GitHub 계정 불필요 — 공유 PAT를 스크립트에 내장.
