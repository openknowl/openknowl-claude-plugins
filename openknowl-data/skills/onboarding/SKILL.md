---
description: "오픈놀 Claude 플러그인 최초 설정 및 사용법 안내"
---

# 오픈놀 플러그인 온보딩

**대상:** 비개발자. 명령어·경로·기술 용어 노출 금지. Claude는 아래 진단을 한 번 실행한 뒤, **첫 번째로 매칭되는 분기의 문구만** 보여주세요. 여러 분기를 겹쳐 보여주거나 임의로 가공하지 마세요.

## 자동 진단 (Claude가 한 번에 실행)

```bash
CREDS_FILE=$(find . -maxdepth 4 -name "openknowl-credentials.json" 2>/dev/null | head -1)

if [ -z "$CREDS_FILE" ]; then
  echo "STATE=NO_CREDS"
else
  read_cred() {
    node -e "try{const c=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(c[process.argv[2]]||'')}catch{}" "$CREDS_FILE" "$1"
  }
  PROXY_URL=$(read_cred PROXY_URL)
  PROXY_TOKEN=$(read_cred PROXY_TOKEN)

  if [ -z "$PROXY_URL" ] || [ -z "$PROXY_TOKEN" ]; then
    echo "STATE=BAD_CREDS"
  else
    RESP=$(curl -sS -w $'\n__HTTP__%{http_code}' --max-time 10 \
      -X POST "$PROXY_URL" \
      -H "Content-Type: application/json" \
      -H "X-Api-Token: $PROXY_TOKEN" \
      -d '{"sql":"SELECT 1 AS ok"}' 2>&1)

    CODE=$(printf '%s' "$RESP" | grep -oE '__HTTP__[0-9]+$' | sed 's/__HTTP__//')
    BODY=$(printf '%s' "$RESP" | sed 's/__HTTP__[0-9]*$//')

    if [ -z "$CODE" ] || [ "$CODE" = "000" ]; then
      echo "STATE=NETWORK_BLOCKED"
    elif [ "$CODE" = "200" ] && printf '%s' "$BODY" | grep -q '"ok": 1'; then
      echo "STATE=OK"
    elif [ "$CODE" = "401" ] || [ "$CODE" = "403" ]; then
      echo "STATE=AUTH_FAIL"
    else
      echo "STATE=HTTP_$CODE"
      echo "BODY=$(printf '%s' "$BODY" | head -c 200)"
    fi
  fi
fi
```

## 분기 (위에서 아래로, 첫 매칭만 사용)

| STATE | 분기 |
|---|---|
| `NO_CREDS` | **B** |
| `BAD_CREDS` | **C-1** |
| `NETWORK_BLOCKED` | **A** |
| `AUTH_FAIL` | **C-2** |
| `HTTP_xxx` (기타) | **E** |
| `OK` | **D** |

---

## 사용자에게 보여줄 문구

### A. 네트워크 차단

> 오픈놀 데이터 서버로 연결이 안 돼요. Cowork 설정에서 도메인을 허용해 주세요.
>
> 화면 상단 메뉴 → **설정 → 기능 → 추가 허용 도메인** 에 아래 주소 추가:
>
> ```
> si84a8l8il.execute-api.ap-northeast-2.amazonaws.com
> ```
>
> 추가하고 이 대화를 다시 열면 바로 사용 가능해요.

### B. 자격 증명 파일 없음 (또는 Projects 미사용)

> **이 플러그인은 Cowork의 "Projects" 기능에서만 동작해요.**
>
> 셋업 순서:
> 1. 관리자에게 슬랙으로 **`openknowl-credentials.json`** 파일을 요청하세요.
> 2. 본인 컴퓨터에 폴더 하나 만들고 (예: `문서/오픈놀`), 받은 파일을 그 안에 넣으세요. (파일 이름 바꾸지 마세요)
> 3. Cowork 앱 왼쪽 사이드바에서 **Projects** 를 열고 → **새 프로젝트 생성** → 방금 만든 폴더를 선택하세요.
> 4. 그 프로젝트 안에서 대화를 시작하면 준비 완료.
>
> ⚠️ 일반 "새 대화"나 다른 프로젝트에서는 작동하지 않아요. 반드시 위 프로젝트 안에서 시작해 주세요.

### C-1. 파일 손상

> 파일은 있는데 내용이 비어있거나 형식이 깨져 있어요.
> 관리자에게 **최신 `openknowl-credentials.json`** 을 다시 요청해 주세요. (파일 이름은 바꾸지 마세요)

### C-2. 인증 거부

> 서버 연결은 됐는데 접근 토큰이 거부됐어요. 토큰이 만료되었거나 교체된 것 같습니다.
> 관리자에게 **최신 `openknowl-credentials.json`** 을 다시 요청해 주세요.

### D. 준비 완료

> 준비 다 됐어요. 궁금한 데이터 그냥 말로 물어보시면 돼요.
>
> 예시:
> - "현재 모집중인 미니인턴 몇 개야?"
> - "이번 달 신규 가입자 수 알려줘"
> - "M클래스 참여자 수 지난 3개월치 보여줘"
> - "수료율 가장 높은 미니인턴 TOP 5는?"
>
> 조회 가능한 데이터: 미니인턴 · M클래스 · 스킬업 · 해피폴리오 · 유저 · 기업 · 결제

### E. 서버 예외 응답

Claude는 진단 출력에서 실제 `STATE=` 및 `BODY=` 라인을 그대로 아래 코드 블록 안에 넣어 전달하세요.

> 서버가 예상치 못한 응답을 줬어요. 관리자에게 슬랙으로 아래 정보를 그대로 전달해 주세요:
>
> ```
> STATE=<여기에 진단 출력의 STATE 값>
> BODY=<여기에 진단 출력의 BODY 값>
> ```
