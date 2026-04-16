---
description: "오픈놀 Claude 플러그인 최초 설정 — DB URL 입력 및 사용법 안내"
---

# 오픈놀 플러그인 온보딩

## 시작 전 권한 안내

스킬 실행 시 **설정 파일 읽기/쓰기를 위한 권한 요청**이 팝업으로 표시됩니다.
사용자에게 먼저 안내할 것:

> ⚠️ **잠깐!** 설정을 저장하기 위해 몇 가지 권한 요청 팝업이 뜹니다.
> 모두 **허용(Allow)** 해주세요. 거부하면 설정이 저장되지 않습니다.

## 실행 순서

### 1. DB 연결 상태 확인

```bash
python3 -c "
import json, os
path = os.path.expanduser('~/.claude/settings.json')
with open(path) as f: s = json.load(f)
url = s.get('env', {}).get('OPENKNOWL_DB_URL', '')
print('SET' if url else 'NOT_SET')
"
```

- 결과가 `SET`이면 → 3번으로 건너뜀
- 결과가 `NOT_SET`이면 → 2번 진행

### 2. DB URL 입력 받기

사용자에게 아래 안내를 출력:

> **관리자에게 받은 DB URL을 여기에 붙여넣어 주세요.**

사용자가 URL을 입력하면 settings.json에 저장:

```bash
python3 -c "
import json, os, sys
path = os.path.expanduser('~/.claude/settings.json')
with open(path) as f: s = json.load(f)
s.setdefault('env', {})['OPENKNOWL_DB_URL'] = sys.argv[1]
with open(path, 'w') as f: json.dump(s, f, indent=2, ensure_ascii=False)
" -- "USER_PROVIDED_URL"
```

저장 후 제대로 기록됐는지 확인:

```bash
python3 -c "
import json, os
path = os.path.expanduser('~/.claude/settings.json')
with open(path) as f: s = json.load(f)
print('OK' if s.get('env', {}).get('OPENKNOWL_DB_URL') else 'FAIL')
"
```

결과가 `OK`면 사용자에게 안내:

> ✅ **설정 완료!**
>
> 바로 아래 기능을 사용할 수 있습니다.

결과가 `FAIL`이면:

> ❌ 저장에 실패했습니다. 권한 요청을 거부하셨을 수 있습니다.
> 다시 시도하시거나, 관리자에게 문의해 주세요.

### 3. 사용법 안내

설정 완료 후 (또는 이미 설정된 경우) 아래 내용을 출력:

---

> ## 오픈놀 데이터 조회 사용법
>
> **기본 사용법:** `/openknowl-data:search-data` 를 먼저 입력한 후 질문을 이어서 쓰면 됩니다.
>
> ---
>
> **운영 문의 처리**
> ```
> /openknowl-data:search-data hyeonsu@else.so 계정이 어제 M클래스 3138에 신청 시도한 로그 있어?
> ```
> ```
> /openknowl-data:search-data 위 신청이 실패한 사유랑 정확한 시도 시각 알려줘
> ```
>
> **현황 파악**
> ```
> /openknowl-data:search-data 현재 모집중인 미니인턴 몇 개야?
> ```
> ```
> /openknowl-data:search-data 이번 달 신규 가입자 수 알려줘
> ```
>
> **통계/분석**
> ```
> /openknowl-data:search-data M클래스 참여자 수 지난 3개월치 보여줘
> ```
> ```
> /openknowl-data:search-data 수료율이 가장 높은 미니인턴 TOP 5는?
> ```
>
> 조회 가능한 데이터: 미니인턴, M클래스, 스킬업, 유저, 기업
