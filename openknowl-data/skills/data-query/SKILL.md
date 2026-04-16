---
description: "오픈놀 내부 데이터 조회 — 미니인턴 개최/신청/수료, 유저, 기업, M클래스, 스킬업 등. 읽기 전용."
---

# 오픈놀 데이터 조회

읽기 전용 DB에서 데이터를 조회한다.

## 실행 원칙

자연어 요청을 SQL로 변환 후 CLI로 실행.

```bash
KS_CLI="node <plugin-dir>/dist/cli.js"
$KS_CLI "SELECT ..."
```

파이프라인으로 가공이 필요하면:

```bash
$KS_CLI "SELECT ..." | python3 -c "
import sys, json
rows = json.load(sys.stdin)
# 가공
"
```

## 케이스별 참조

| 요청 유형 | Read 파일 |
|----------|----------|
| 테이블·컬럼 모를 때 | `<skill-dir>/references/schema.md` |
| 자주 쓰는 집계 패턴 | `<skill-dir>/references/common-queries.md` |

## 출력 규칙

- 결과 10행 이하: 그대로 텍스트 출력
- 결과 10행 초과: 핵심 수치만 요약 + "전체 보려면 말씀해주세요" 안내
- 에러 시: 에러 메시지 그대로 전달 (SQL 문법 오류 등)

## 주의

SELECT 이외의 쿼리는 CLI가 자동으로 거부한다.
