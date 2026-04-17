---
description: "오픈놀 내부 데이터 조회 — 미니인턴 개최/신청/수료, 유저, 기업, M클래스, 스킬업, 해피폴리오, 결제 등. 읽기 전용."
---

# 오픈놀 데이터 조회

읽기 전용 DB에서 데이터를 조회한다. CLI가 HTTPS 프록시를 통해 DB에 접속한다.

## 실행 원칙

자연어 요청을 SQL로 변환 후 CLI로 실행.

```bash
node <plugin-dir>/dist/cli.js "SELECT ..."
```

파이프라인으로 가공이 필요하면:

```bash
node <plugin-dir>/dist/cli.js "SELECT ..." | python3 -c "
import sys, json
rows = json.load(sys.stdin)
# 가공
"
```

## 스키마 참조

**먼저** `<skill-dir>/references/schema-index.md` 를 읽고, 시나리오에 맞는 도메인 파일만 추가로 읽는다.

| 요청 유형 | Read 파일 |
|----------|----------|
| 진입점 (시나리오→파일 매핑, 관계, 소프트삭제) | `schema-index.md` |
| 미니인턴 개최/신청/수료/채용제안/챌린지 | `miniintern.md` |
| M클래스 개최/신청 | `mclass.md` |
| 스킬업 강의/수강/진도 | `skillup.md` |
| 해피폴리오 판매/조회/스낵 | `happyfolio.md` |
| 유저/프로필/이력서 | `user.md` |
| 기업/채용관/공고 | `company.md` |
| 결제/매출/환불 | `payment.md` |
| 자주 쓰는 집계 패턴 | `common-queries.md` |

모든 참조 파일은 `<skill-dir>/references/` 아래에 있다.

## 출력 규칙

- 결과 10행 이하: 그대로 텍스트 출력
- 결과 10행 초과: 핵심 수치만 요약 + "전체 보려면 말씀해주세요" 안내
- 에러 시: 에러 메시지 그대로 전달 (SQL 문법 오류 등)

## 응답 톤 — 비개발자 대상

**사용자는 DB 구조를 모른다.** 절대 노출 금지:

- ❌ 컬럼명·테이블명 그대로 쓰기 (`result`, `status`, `createdAt`, `Projects`)
- ❌ 상태 문자열 그대로 쓰기 (`'accepted'`, `'complete'`, `'excellent'`, `'active'`)
- ❌ 기술 용어 (`표본`, `필터`, `조건절`, `집계`, `조인`, `레코드`, `행/row`)
- ❌ SQL·쿼리·기준식 그대로 설명

대신 도메인 용어로 번역:

| DB 값 | 사용자에게 보여줄 말 |
|------|-------------------|
| `status='accepted'` | 합격자 |
| `result IN ('complete','excellent')` | 수료자 (또는 우수 수료 포함) |
| `status='active' AND applyDate > NOW()` | 현재 모집중 |
| `isDeleted IS TRUE` | 삭제된 |
| "표본이 작다" | "참여자 수가 적어서 통계가 의미 없을 수 있어요" |

**기준 설명 방식:**
- 단순 수치는 그냥 숫자만 제시, 기준 설명 생략
- 비율·순위 등 해석이 필요한 경우에만 **한 줄로** 기준 말하기
- 기준을 바꿀 수 있으면 "기준을 바꾸려면 말씀해 주세요" 한마디만 덧붙임 (장황한 옵션 나열 X)

**예시:**
- ❌ `기준: result가 complete 또는 excellent인 인원을 status='accepted' 합격자 수로 나눈 비율. 표본이 너무 작은 개최를 걸러내려고 합격자 10명 이상인 개최만 포함했습니다.`
- ✅ `합격자 10명 이상 개최만 보고, 그중 수료한 비율로 계산했어요. 기준 바꾸려면 말씀해 주세요.`

## 주의

SELECT 이외의 쿼리는 CLI가 자동으로 거부한다.
