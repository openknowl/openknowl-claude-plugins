# OpenKnowl Business 워크스페이스 플러그인 공유 설계

## 목표

현재 개인용 Codex 환경에 등록된 OpenKnowl 데이터 기능을 OpenKnowl Business 워크스페이스 전체에서 팀원이 설치해 사용할 수 있게 한다. 팀원에게 비공개 GitHub 저장소 권한을 부여하지 않고, 내부 데이터 조회 기능은 기존 API Gateway/Lambda 프록시의 권한 경계를 유지한다.

## 범위

- OpenKnowl Business 워크스페이스의 전체 구성원 또는 전체 구성원 그룹에 `openknowl-data` 플러그인을 공유한다.
- 저장소의 Codex 배포 패키지(`plugins/openknowl-data/`)를 공유 가능한 플러그인으로 사용한다.
- 팀원은 각자 플러그인을 설치하고 최초 사용 시 관리자가 발급한 초대 토큰을 입력한다.
- 기존 Claude/Cowork 플러그인 경로와 비공개 소스 저장소는 유지한다.

다음 항목은 이번 작업 범위에 포함하지 않는다.

- OpenAI 공개 Plugins Directory 등록
- 새 MCP 서버 또는 별도 데이터 서비스 구축
- 개인별 토큰 발급·회수 시스템
- 플러그인 번들에 자격증명이나 공유 토큰 포함

## 권장 배포 방식

ChatGPT 데스크톱 앱에서 OpenKnowl Business 워크스페이스를 활성화한 뒤, 로컬 marketplace의 `openknowl-data`를 설치한다. 설치된 플러그인의 `Created by you` 상세 화면에서 `Share`를 선택하고 전체 워크스페이스 구성원 또는 이를 대표하는 그룹에 공유한다.

워크스페이스 공유는 플러그인을 공개 디렉터리에 게시하지 않으며, 해당 워크스페이스에 로그인한 계정만 접근할 수 있다. 관리 정책에서 플러그인 공유가 비활성화된 경우에는 워크스페이스 관리자 승인 또는 정책 변경이 선행되어야 한다.

## 구성 요소와 데이터 흐름

```text
OpenKnowl Business 구성원
  -> 공유된 openknowl-data 플러그인 설치
  -> 로컬 onboarding에서 개인 런타임 자격증명 설정
  -> 번들 CLI가 API Gateway 호출
  -> Lambda가 토큰·읽기 전용 쿼리·제한 검증
  -> 데이터베이스
```

- 소스와 빌드 원본은 현재 비공개 저장소에 남긴다.
- 배포 패키지에는 `.codex-plugin/`, `assets/`, `dist/`, `skills/`만 포함한다.
- `openknowl-credentials.json`, DB 자격증명, 초대 토큰은 저장소·번들·marketplace metadata에 포함하지 않는다.
- 클라이언트의 `SELECT` 확인은 사용성 보조 장치일 뿐 권한 경계가 아니다. 비읽기 쿼리와 잘못된 토큰은 API Gateway/Lambda에서 거부해야 한다.

## 팀원 사용 흐름

1. 사용자가 데스크톱 앱에서 Personal 대신 OpenKnowl Business 워크스페이스를 선택한다.
2. `Plugins`에서 공유된 OpenKnowl 플러그인을 열고 설치한다.
3. 새 작업을 시작한다.
4. onboarding 안내에 따라 관리자가 전달한 초대 토큰을 개인 프로젝트 설정에 입력한다. 토큰은 출력하거나 플러그인 파일에 저장하지 않는다.
5. 자연어로 내부 데이터 또는 운영 지식을 요청한다.

## 업데이트와 운영

- 플러그인·스킬·번들 CLI를 변경할 때 Codex 버전과 배포 패키지를 함께 갱신한다.
- 새 버전은 워크스페이스 공유 플러그인에 다시 반영하고, 팀원은 새 작업에서 업데이트된 번들을 사용한다.
- 배포 전 JSON manifest, Codex plugin 구조, skill frontmatter, 패키지 제외 규칙, CLI 빌드를 검증한다.
- API 프록시 운영자는 토큰 검증, 읽기 전용 강제, 쿼리 제한, rate limit, 민감 데이터 응답 제한을 별도로 점검한다.

## 성공 기준

- OpenKnowl Business 워크스페이스 전체 구성원이 공유 플러그인을 발견하고 설치할 수 있다.
- 팀원은 비공개 GitHub 저장소 권한 없이 기능을 사용할 수 있다.
- 토큰이 없는 사용자는 데이터 결과를 받을 수 없다.
- DB 자격증명과 공유 토큰이 플러그인 패키지에 포함되지 않는다.
- 기존 Claude/Cowork 경로와 현재 Codex 스킬 동작이 유지된다.

