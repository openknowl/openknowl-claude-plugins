---
description: "오픈놀 Claude 플러그인 최초 설정 및 사용법 안내"
---

# 오픈놀 플러그인 온보딩

## 실행 순서

### 1. 네트워크 허용 확인

Cowork 환경에서 DB 프록시에 접근할 수 있는지 확인:

```bash
curl -s -o /dev/null -w "%{http_code}" https://openknowl-db-proxy.vercel.app/api/query
```

- 결과가 `405`이면 → 정상. 2번으로 건너뜀.
- 결과가 `000` 또는 `403`이면 → 네트워크 허용 필요. 사용자에게 안내:

> ⚠️ **네트워크 설정이 필요합니다.**
>
> **Cowork 설정 → 기능 → 추가 허용 도메인**에서
> `openknowl-db-proxy.vercel.app` 을 추가해 주세요.
>
> 워크스페이스 관리자가 이미 설정했다면 이 단계는 건너뛰어도 됩니다.

추가 후 다시 위 명령을 실행하여 `405`가 나오는지 확인.

### 2. 사용법 안내

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
> 조회 가능한 데이터: 미니인턴, M클래스, 스킬업, 해피폴리오, 유저, 기업, 결제
