---
description: "오픈놀 Claude 플러그인 최초 설정 및 사용법 안내"
---

# 오픈놀 플러그인 온보딩

**대상:** 비개발자. 명령어·경로·기술 용어를 절대 노출하지 말 것. Claude가 모든 진단을 자동으로 수행하고, 결과에 따라 아래 안내 문구 중 하나만 보여주세요.

## 자동 진단 (Claude가 한 번에 실행)

```bash
# 네트워크
NET=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 https://openknowl-db-proxy.vercel.app/api/query)

# 파일
CREDS=$(find . -maxdepth 4 -name "openknowl-credentials.json" 2>/dev/null | head -1)

# 실제 연결 (위 두 개 모두 통과 시에만)
if [ "$NET" = "405" ] && [ -n "$CREDS" ]; then
  RESULT=$(node $CLAUDE_PLUGIN_ROOT/dist/cli.js "SELECT 1 AS ok" 2>&1)
fi

echo "NET=$NET"
echo "CREDS=$CREDS"
echo "RESULT=$RESULT"
```

분기:
- `NET ≠ 405` → **A**
- `CREDS` 비어 있음 → **B**
- `RESULT`에 `"ok": 1` 없음 → **C**
- 모두 통과 → **D**

---

## 사용자에게 보여줄 문구

### A. 네트워크 차단

> 오픈놀 데이터 서버로 연결이 안 돼요. Cowork 설정에서 도메인을 허용해 주세요.
>
> 화면 상단 메뉴 → **설정 → 기능 → 추가 허용 도메인** 에 아래 주소 추가:
>
> ```
> openknowl-db-proxy.vercel.app
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

### C. 연결 실패

> 파일은 있는데 서버가 거부했어요. 파일이 오래됐거나 잘못된 버전일 가능성이 높습니다.
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
