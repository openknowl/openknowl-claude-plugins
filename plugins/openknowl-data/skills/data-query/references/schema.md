# 스키마 레퍼런스

도메인 언어 → 테이블/컬럼 매핑.
테이블명·컬럼명은 PostgreSQL 그대로 (대소문자 구분, 큰따옴표 필요).

---

## 미니인턴 개최 — `"Projects"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 미니인턴 제목 |
| `status` | enum | `requested`(승인대기) / `active`(활성) / `finished`(종료) |
| `type` | enum | `normal`(일반) / `recruitment`(채용연계) / `partner`(파트너형) |
| `"companyId"` | int | FK → `"Companies".id` |
| `"applyDate"` | datetime | 지원 마감일 |
| `"createdAt"` | datetime | 개최 등록일 |
| `"isDeleted"` | boolean | 삭제 여부 (조회 시 `WHERE "isDeleted" IS NOT TRUE`) |
| `"isHidden"` | boolean | 숨김 여부 |

**개최 = 삭제되지 않은 Projects**

```sql
WHERE "isDeleted" IS NOT TRUE
```

**모집중 = applyDate가 아직 안 지난 active**

```sql
WHERE status = 'active' AND "applyDate" > NOW() AND "isDeleted" IS NOT TRUE
```

---

## 미니인턴 신청/수료 — `"Participations"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 신청자 이름 |
| `email` | string | 신청자 이메일 |
| `status` | enum | `applied`(신청) / `accepted`(합격) / `refused`(불합격) / `absence`(불참) |
| `result` | enum | `excellent`(우수) / `complete`(수료) / `incomplete`(미수료) / `` (미결정) |
| `"projectId"` | int | FK → `"Projects".id` |
| `"userId"` | int | FK → `"Users".id` |
| `"createdAt"` | datetime | 신청일 |
| `"deletedAt"` | datetime | 신청취소일 (NULL이면 유효한 신청) |

**유효한 신청자 = deletedAt IS NULL**

```sql
WHERE "deletedAt" IS NULL
```

**수료자 = result IN ('complete', 'excellent')**

---

## 유저 — `"Users"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `email` | string | 이메일 |
| `"createdAt"` | datetime | 가입일 |
| `"isAdsAgreed"` | boolean | 광고 수신 동의 |

---

## 기업 — `"Companies"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `"createdAt"` | datetime | 등록일 |

기업 상세 정보는 `"CompanyInfos"` 테이블 참조 (name, ceoName 등).

---

## M클래스 — `"Events"` + `"EventParticipations"`

### `"Events"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `title` | string | M클래스 제목 |
| `type` | enum | 이벤트 유형 |
| `"startDate"` | datetime | 시작일 |
| `"endDate"` | datetime | 종료일 |
| `"applyDate"` | datetime | 신청 마감일 |
| `"createdAt"` | datetime | 등록일 |

### `"EventParticipations"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 신청자 이름 |
| `email` | string | 신청자 이메일 |
| `"eventId"` | int | FK → `"Events".id` |
| `"userId"` | int | FK → `"Users".id` |
| `"createdAt"` | datetime | 신청일 |

---

## 스킬업 — `"Courses"` + `"CourseParticipants"` + `"LectureProgresses"`

### `"Courses"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `title` | string | 강의 제목 |
| `"createdAt"` | datetime | 등록일 |

### `"CourseParticipants"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `"courseId"` | int | FK → `"Courses".id` |
| `"userId"` | int | FK → `"Users".id` |
| `"createdAt"` | datetime | 수강 신청일 |

### `"LectureProgresses"`

수강 로그. 강의별 진도 기록.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `"lectureId"` | int | FK → `"Lectures".id` |
| `"userId"` | int | FK → `"Users".id` |
| `"createdAt"` | datetime | 수강 시각 |

---

## 채용관 공고 — `"RecruitmentNotices"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `title` | string | 공고 제목 |
| `status` | string | 공고 상태 (모집중 등) |
| `"createdAt"` | datetime | 등록일 |
| `"deletedAt"` | datetime | 삭제일 |

**유효한 공고 = deletedAt IS NULL**

---

## 맞춤형 채용제안 — `"Proposals"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `"userId"` | int | FK → `"Users".id` |
| `"createdAt"` | datetime | 신청일 |
