# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 구조

```
openknowl-claude-plugins/
├── .claude-plugin/marketplace.json   # Claude 마켓플레이스 루트 메타데이터
├── .agents/plugins/marketplace.json  # Codex 마켓플레이스 루트 메타데이터
├── install.sh                        # 직원 온보딩 스크립트
├── plugins/openknowl-data/           # Codex 앱 배포용 클린 패키지
└── openknowl-data/                   # 플러그인 단위
    ├── .claude-plugin/plugin.json    # 플러그인 메타데이터
    ├── .codex-plugin/plugin.json     # Codex 플러그인 메타데이터
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

`dist/cli.js`는 curl로 AWS API Gateway 프록시에 POST하는 얇은 번들(~2.6kb)이라 사용처에서 npm install 불필요. **빌드 후 반드시 커밋.**

프록시는 AWS API Gateway + Lambda로 별도 관리. 이 레포에는 프록시 소스 없음.

## 플러그인 구조 규칙

- 플러그인 하나 = `<plugin-name>/` 디렉토리
- `.claude-plugin/plugin.json` — 플러그인 이름·버전
- `.codex-plugin/plugin.json` — Codex 플러그인 이름·버전·skills 경로
- `.claude-plugin/marketplace.json`은 루트에만 존재 (플러그인 목록 선언)
- `.agents/plugins/marketplace.json`은 Codex용 루트 마켓플레이스
- Codex 앱용 source는 `plugins/openknowl-data/`를 사용함
- `skills/` 안의 각 스킬은 `SKILL.md` + 선택적 `references/` 구성
- `skills` 필드는 `plugin.json`에 넣지 않음 — Claude Code가 자동 탐색
- Codex는 각 `SKILL.md` frontmatter에 `name`과 `description`이 필요함
- `plugins/openknowl-data/`에는 `.codex-plugin/`, `assets/`, `dist/`, `skills/`만 동기화하고 `.creds`, `node_modules`, 크리덴셜 파일은 절대 넣지 않음

## 릴리즈 규칙

**어떤 변경이든 커밋할 때마다 반드시 버전을 검토할 것.** Cowork/Claude Code와 Codex가 버전 기반으로 캐시하므로 버전을 안 올리면 사용자에게 변경사항이 반영되지 않음.

공통 스킬·CLI·온보딩 변경이면 Claude와 Codex 버전을 모두 올림. Claude 전용 변경이면 Claude만, Codex 전용 변경이면 Codex만 올림.

버전 올릴 위치:
1. `.claude-plugin/marketplace.json` — `version` 필드 + `plugins[].description`의 vX.Y.Z
2. `openknowl-data/.claude-plugin/plugin.json` — `version` 필드 + `description`의 vX.Y.Z
3. `openknowl-data/.codex-plugin/plugin.json` — `version` 필드 + `description`의 vX.Y.Z

코드·스킬·문서 어느 것이든 수정했다면 버전업.

## 크리덴셜 관리

- CLI는 런타임에 `openknowl-credentials.json` 파일을 탐색해서 읽고, 파일에 `PROXY_TOKEN`만 있어도 기본 프록시 URL을 사용함 (`env.ts` 참조)
- 소스·번들 어디에도 크리덴셜 하드코딩 없음
- 배포 흐름: 관리자가 직원에게 초대 토큰 전달 → 직원이 `openknowl-credentials.json`에 토큰만 저장 → Cowork/Codex 로컬 프로젝트에서 사용

## 온보딩 (install.sh)

Claude Code가 GitHub 마켓플레이스 접근에 `gh` CLI 토큰을 사용하므로, 신규 직원은 `install.sh`를 통해 `gh` 인증 + `settings.json` 자동 설정. 개인 GitHub 계정 불필요 — 공유 PAT를 스크립트에 내장.
