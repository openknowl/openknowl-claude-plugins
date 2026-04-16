---
description: "오픈놀 내부 데이터 조회 — 미니인턴 개최/신청/수료, 유저, 기업, M클래스, 스킬업 등. 읽기 전용."
---

# 오픈놀 데이터 조회

읽기 전용 DB에서 데이터를 조회한다.

## 최초 설정 — DB URL 없을 때

CLI 실행 전 먼저 확인:

```bash
node <plugin-dir>/dist/cli.js "SELECT 1" 2>&1
```

`OPENKNOWL_DB_URL 환경변수가 설정되지 않았습니다` 에러가 나오면:

1. 사용자에게 안내: "관리자에게 받은 DB URL을 여기에 붙여넣어 주세요."
2. 사용자가 URL을 주면 아래 python3로 settings.json에 저장:

```bash
python3 -c "
import json, os
path = os.path.expanduser('~/.claude/settings.json')
with open(path) as f: s = json.load(f)
s.setdefault('env', {})['OPENKNOWL_DB_URL'] = 'USER_PROVIDED_URL'
with open(path, 'w') as f: json.dump(s, f, indent=2, ensure_ascii=False)
print('저장 완료')
"
```

3. 사용자에게 안내: "Cowork를 완전히 종료 후 다시 열면 DB 조회를 사용할 수 있습니다."

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
