# 스키마 레퍼런스

도메인 언어 → 테이블/컬럼 매핑.
테이블명·컬럼명은 PostgreSQL 그대로 (대소문자 구분, 큰따옴표 필요).

---

## 미니인턴 개최 — `"Projects"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 미니인턴 제목 |
| `description` | text | 상세 설명 |
| `status` | enum | `requested`(승인대기) / `active`(활성) / `finished`(종료) |
| `type` | enum | `normal`(일반) / `recruitment`(채용연계) / `partner`(파트너형) |
| `"companyId"` | int | FK → `"Companies".id` |
| `"applyDate"` | datetime | 지원 마감일 |
| `"entryDate"` | datetime | 입과일 |
| `"draftDate"` | datetime | 중간 마감일 |
| `"finalDate"` | datetime | 최종 마감일 |
| `"resultDate"` | datetime | 결과 발표일 |
| `categories` | string | 카테고리 |
| `positions` | varchar[] | 포지션 목록 |
| `cost` | int | 비용 |
| `"prizeType"` | enum | `ONE` / `MULTIPLE` / `NONE` |
| `"workType"` | enum | `EXTERNAL` / `INTERNAL` / `NONE` |
| `"viewCount"` | int | 조회수 |
| `"isOnline"` | boolean | 온라인 여부 |
| `"isDeleted"` | boolean | 삭제 여부 |
| `"isHidden"` | boolean | 숨김 여부 |
| `"recruitmentDivide"` | enum | `newcomer`(신입) / `career`(경력) / `unrequiredCareer`(경력무관) |
| `"createdAt"` | datetime | 개최 등록일 |
| `"updatedAt"` | datetime | 수정일 |

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
| `phone` | string | 연락처 |
| `gender` | string | 성별 |
| `birthday` | datetime | 생년월일 |
| `"schoolName"` | string | 학교명 |
| `major` | string | 전공 |
| `platform` | string | 유입 플랫폼 |
| `status` | enum | `applied`(신청) / `accepted`(합격) / `refused`(불합격) / `absence`(불참) |
| `result` | enum | `excellent`(우수) / `complete`(수료) / `incomplete`(미수료) / ``(미결정) |
| `"partnerStatus"` | enum | `APPLY` / `FIRST_SELECTED` / `FIRST_NOT_SELECTED` / `SECOND_SELECTED` / `SECOND_NOT_SELECTED` / `ABSENT` / `NONE` |
| `"applyForCompany"` | boolean | 기업 지원 여부 |
| `"isPrizeGranted"` | boolean | 상금 지급 여부 |
| `"isAssignmentSubmitted"` | boolean | 최종 과제 제출 여부 |
| `"projectId"` | int | FK → `"Projects".id` |
| `"userId"` | int | FK → `"Users".id` |
| `"resumeId"` | int | FK → `"Resumes".id` |
| `"createdAt"` | datetime | 신청일 |
| `"deletedAt"` | datetime | 신청취소일 (NULL이면 유효) |

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
| `email` | string | 이메일 (unique) |
| `"loginMethod"` | enum | `email` / `facebook` / `google` / `naver` / `kakao` |
| `"isAdsAgreed"` | boolean | 광고 수신 동의 |
| `"isIdentityVerified"` | boolean | 본인인증 여부 |
| `"isHeadhuntingAgreed"` | boolean | 헤드헌팅 동의 |
| `"jobSeekStatus"` | string | 구직 상태 |
| `"lastRequestAt"` | datetime | 마지막 활동일 |
| `"createdAt"` | datetime | 가입일 |

유저 상세 프로필은 `"Profiles"` 테이블 참조 (1:1 관계).

---

## 유저 프로필 — `"Profiles"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 이름 |
| `email` | string | 이메일 |
| `phone` | string | 연락처 |
| `gender` | string | 성별 |
| `birthday` | datetime | 생년월일 |
| `"schoolName"` | string | 학교명 |
| `"schoolLocation"` | string | 학교 소재지 |
| `major` | string | 전공 |
| `introduction` | string | 자기소개 (최대 1000자) |
| `address` | text | 주소 |
| `"resumeActivated"` | boolean | 이력서 활성화 여부 |
| `"userId"` | int | FK → `"Users".id` (unique, 1:1) |
| `"createdAt"` | datetime | 생성일 |

---

## 기업 — `"Companies"` + `"CompanyInfos"`

### `"Companies"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 기업명 |
| `website` | string | 웹사이트 |
| `description` | text | 설명 |
| `"isDeleted"` | boolean | 삭제 여부 |
| `"recruitmentCompanyId"` | int | FK → `"RecruitmentCompanies".id` |
| `"createdAt"` | datetime | 등록일 |

### `"CompanyInfos"` — 기업 상세 정보

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 기업명 |
| `"representService"` | string | 대표 서비스 |
| `category` | string | 업종 카테고리 |
| `"serviceType"` | string | 서비스 유형 |
| `homepage` | string | 홈페이지 |
| `"recruitmentType"` | enum | `notEmploy` / `regularRecruit` / `periodRecruit` |
| `"isApproved"` | boolean | 승인 여부 |
| `"recruitmentCompanyId"` | int | FK → `"RecruitmentCompanies".id` |
| `"createdAt"` | datetime | 등록일 |

**기업 이름 조회**: Projects 기준이면 `"Companies".name`, 채용관 기준이면 `"CompanyInfos".name` 또는 `"RecruitmentCompanies".name` 사용.

---

## M클래스 — `"Events"` + `"EventParticipations"`

### `"Events"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `title` | string | M클래스 제목 |
| `description` | text | 설명 |
| `category` | string | 카테고리 |
| `type` | enum | `aday`(하루) / `days`(다일) |
| `status` | enum | `requested` / `pending` / `active` / `ended` / `TEMP` |
| `price` | int | 가격 (0이면 무료) |
| `location` | text | 장소 |
| `"startDate"` | datetime | 시작일 |
| `"endDate"` | datetime | 종료일 |
| `"applyDate"` | datetime | 신청 마감일 |
| `"recruitMethod"` | enum | `INTERNAL` / `EXTERNAL` / `TEMP` |
| `"selectionMethod"` | enum | `RECRUIT` / `FIRST_COME` / `TEMP` / `AUTO` |
| `"viewCount"` | int | 조회수 |
| `"hostId"` | int | FK → `"Hosts".id` |
| `"categoryId"` | int | FK → `"EventCategories".id` |
| `"deletedAt"` | datetime | 삭제일 |
| `"createdAt"` | datetime | 등록일 |

**유효한 이벤트 = deletedAt IS NULL**

### `"EventParticipations"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 신청자 이름 |
| `email` | string | 신청자 이메일 |
| `"eventId"` | int | FK → `"Events".id` |
| `"userId"` | int | FK → `"Users".id` |
| `"payId"` | int | FK → `"Pays".id` (유료 이벤트) |
| `"createdAt"` | datetime | 신청일 |

---

## 스킬업 — `"Courses"` + `"CourseParticipants"` + `"LectureProgresses"`

### `"Courses"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 강의 제목 |
| `description` | text | 설명 |
| `price` | decimal | 가격 (0이면 무료) |
| `range` | enum | `all`(전체공개) / `specific`(특정대상) / `private`(비공개) |
| `period` | datetime | 수강 기간 |
| `"hasCertificate"` | boolean | 수료증 발급 여부 |
| `"isSelected"` | boolean | 추천 여부 |
| `"tutorId"` | int | FK → `"Tutors".id` |
| `"createdAt"` | datetime | 등록일 |

### `"CourseParticipants"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `"courseId"` | int | FK → `"Courses".id` |
| `"userId"` | int | FK → `"Users".id` |
| `"createdAt"` | datetime | 수강 신청일 |

### `"LectureProgresses"` — 수강 로그

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `"lectureId"` | int | FK → `"Lectures".id` |
| `"userId"` | int | FK → `"Users".id` |
| `"createdAt"` | datetime | 수강 시각 |

---

## 해피폴리오 — `"Happyfolios"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `title` | string | 제목 |
| `summary` | text | 요약 |
| `categories` | string | 카테고리 |
| `tags` | string | 태그 |
| `jobs` | string | 직업 정보 (기본: common) |
| `price` | decimal | 가격 |
| `status` | enum | `requested` / `approved` / `needFixed` / `fixed` / `rejected` / `paused` |
| `"salesCount"` | int | 판매수 |
| `"likeCount"` | int | 좋아요수 |
| `"viewCount"` | int | 조회수 |
| `"isPick"` | boolean | 에디터 픽 |
| `"hostId"` | int | FK → `"Hosts".id` |
| `"happyfolioCategoryId"` | int | FK → `"HappyfolioCategories".id` |
| `"createdAt"` | datetime | 등록일 |
| `"approvedAt"` | datetime | 승인일 |

**공개된 해피폴리오 = status = 'approved'**

---

## 이력서 — `"Resumes"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `title` | string | 이력서 제목 |
| `score` | int | 이력서 점수 |
| `"isDeleted"` | boolean | 삭제 여부 |
| `"isTemp"` | boolean | 임시저장 여부 |
| `"userId"` | int | FK → `"Users".id` |
| `"createdAt"` | datetime | 생성일 |
| `"updatedAt"` | datetime | 수정일 |

이력서 내용은 JSON 컬럼들: `"jobValueForm"`, `"personalForm"`, `"careerForm"`, `"projectForm"`, `"licenseForm"`, `"introduceForm"` 등.

**유효한 이력서 = isDeleted IS NOT TRUE AND isTemp IS NOT TRUE**

---

## 채용관 기업 — `"RecruitmentCompanies"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 기업명 (unique) |
| `"registrationNumber"` | string | 사업자등록번호 |
| `"industrialField"` | string | 산업 분야 |
| `"memberCount"` | string | 직원 수 |
| `description` | text | 설명 |
| `"deletedAt"` | datetime | 삭제일 |
| `"createdAt"` | datetime | 등록일 |

**유효한 채용기업 = deletedAt IS NULL**

---

## 채용관 공고 — `"RecruitmentNotices"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 공고 제목 |
| `status` | enum | `temp` / `pending` / `active` / `finished` |
| `"employmentType"` | enum | `정규직` / `계약직` / `인턴` |
| `"recruitmentDivide"` | enum | `newcomer`(신입) / `career`(경력) / `unrequiredCareer`(경력무관) |
| `"applicationPeriod"` | enum | `term`(기간제) / `always`(상시) |
| `"sizeOfEmployment"` | string | 채용 인원 |
| `wage` | string | 급여 |
| `"startDate"` | datetime | 공고 시작일 |
| `"endDate"` | datetime | 공고 종료일 |
| `"isApproved"` | boolean | 승인 여부 |
| `"recruitmentCompanyId"` | int | FK → `"RecruitmentCompanies".id` |
| `"projectId"` | int | FK → `"Projects".id` (연계 미니인턴) |
| `"sectorId"` | int | FK → `"Sectors".id` |
| `"deletedAt"` | datetime | 삭제일 |
| `"createdAt"` | datetime | 등록일 |

**유효한 공고 = deletedAt IS NULL**

**모집중 공고 = status = 'active' AND deletedAt IS NULL**

---

## 맞춤형 채용제안 — `"Proposals"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `description` | text | 내용 |
| `step` | enum | `draft`(초안) / `final`(최종) |
| `"participationId"` | int | FK → `"Participations".id` |
| `"createdAt"` | datetime | 신청일 |

---

## 챌린지 프로젝트 — `"ChallengeProjects"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `name` | string | 챌린지명 |
| `description` | text | 설명 |
| `status` | enum | `requested` / `active` / `finished` |
| `"targetLikeCount"` | int | 목표 좋아요 수 |
| `"companyId"` | int | FK → `"Companies".id` |
| `"userId"` | int | FK → `"Users".id` |
| `"createdAt"` | datetime | 등록일 |

참여자는 `"ChallengeProjectUsers"` 테이블 (`"challengeProjectId"`, `"userId"`).

---

## 결제 — `"Pays"`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `"productName"` | string | 상품명 |
| `method` | string | 결제 수단 |
| `price` | decimal | 금액 |
| `status` | enum | `ready` / `paid` / `cancelled` / `failed` |
| `type` | enum | `happy_portfolio` / `event` / `happyfolio` / `skillup` / `scoutProposal` / `project` |
| `"userId"` | int | FK → `"Users".id` |
| `"purchasedAt"` | datetime | 결제일 |
| `"createdAt"` | datetime | 생성일 |

**성공 결제 = status = 'paid'**

---

## 호스트/강사 — `"Hosts"` / `"Tutors"`

### `"Hosts"` — M클래스·해피폴리오 호스트

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `"userId"` | int | FK → `"Users".id` |

### `"Tutors"` — 스킬업 강사

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | int | PK |
| `"userId"` | int | FK → `"Users".id` |

---

## 주요 관계 요약

```
Users 1:1 Profiles
Users 1:N Resumes
Users 1:N Participations
Users 1:N EventParticipations
Users 1:N CourseParticipants
Users 1:N Pays

Projects N:1 Companies
Projects 1:N Participations
Projects 1:N RecruitmentNotices

Events 1:N EventParticipations
Events N:1 Hosts

Courses 1:N CourseParticipants
Courses N:1 Tutors
Courses 1:N Chapters → 1:N Lectures → 1:N LectureProgresses

Happyfolios N:1 Hosts

Companies N:1 RecruitmentCompanies
CompanyInfos N:1 RecruitmentCompanies
RecruitmentCompanies 1:N RecruitmentNotices
```

---

## 소프트 삭제 주의

많은 테이블이 `"isDeleted"` 또는 `"deletedAt"` 패턴을 사용:

| 테이블 | 필터 조건 |
|--------|-----------|
| `"Projects"` | `"isDeleted" IS NOT TRUE` |
| `"Participations"` | `"deletedAt" IS NULL` |
| `"Events"` | `"deletedAt" IS NULL` |
| `"RecruitmentNotices"` | `"deletedAt" IS NULL` |
| `"RecruitmentCompanies"` | `"deletedAt" IS NULL` |
| `"Resumes"` | `"isDeleted" IS NOT TRUE` |
| `"Companies"` | `"isDeleted" IS NOT TRUE` |
