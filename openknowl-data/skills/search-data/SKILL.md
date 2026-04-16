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

## 주의

SELECT 이외의 쿼리는 CLI가 자동으로 거부한다.
