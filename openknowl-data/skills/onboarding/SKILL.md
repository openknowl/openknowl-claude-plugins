---
description: "오픈놀 Claude 플러그인 최초 설정 및 사용법 안내"
---

# 오픈놀 플러그인 온보딩

## 셋업 체크리스트

### 1. 네트워크 허용 확인

```bash
curl -s -o /dev/null -w "%{http_code}" https://openknowl-db-proxy.vercel.app/api/query
```

- `405` → 정상.
- `000` / `403` → Cowork 설정 → 기능 → 추가 허용 도메인에 `openknowl-db-proxy.vercel.app` 추가.

### 2. 자격 증명 파일 확인

관리자에게 받은 `openknowl-credentials.json`이 현재 프로젝트 폴더(또는 상위 폴더)에 있어야 함:

```bash
ls openknowl-credentials.json 2>/dev/null || find . -name "openknowl-credentials.json" 2>/dev/null
```

파일이 없다면 사용자에게 안내:

> ⚠️ **`openknowl-credentials.json` 파일이 필요합니다.**
>
> 관리자에게 받은 파일을 이 프로젝트 폴더에 복사해 주세요.
> (Cowork 데스크톱 앱에서 이 프로젝트를 열면 자동 업로드됩니다.)

### 3. 사용법 안내

> ## 오픈놀 데이터 조회 사용법
>
> **기본 사용법:** `/search-data` 를 먼저 입력한 후 질문을 이어서 쓰면 됩니다.
>
> ---
>
> **운영 문의 처리**
> ```
> /search-data hyeonsu@else.so 계정이 어제 M클래스 3138에 신청 시도한 로그 있어?
> ```
> ```
> /search-data 위 신청이 실패한 사유랑 정확한 시도 시각 알려줘
> ```
>
> **현황 파악**
> ```
> /search-data 현재 모집중인 미니인턴 몇 개야?
> ```
> ```
> /search-data 이번 달 신규 가입자 수 알려줘
> ```
>
> **통계/분석**
> ```
> /search-data M클래스 참여자 수 지난 3개월치 보여줘
> ```
> ```
> /search-data 수료율이 가장 높은 미니인턴 TOP 5는?
> ```
>
> 조회 가능한 데이터: 미니인턴, M클래스, 스킬업, 해피폴리오, 유저, 기업, 결제
