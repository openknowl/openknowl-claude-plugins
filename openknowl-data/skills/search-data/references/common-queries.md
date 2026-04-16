# 자주 쓰는 쿼리 패턴

텔레그램에서 반복된 요청 기준. 날짜/조건만 바꿔서 재사용.

---

## 미니인턴 개최수

```sql
-- 전체 누적
SELECT COUNT(*) AS 개최수
FROM "Projects"
WHERE "isDeleted" IS NOT TRUE;

-- 연도별
SELECT DATE_TRUNC('year', "createdAt") AS 연도, COUNT(*) AS 개최수
FROM "Projects"
WHERE "isDeleted" IS NOT TRUE
GROUP BY 1
ORDER BY 1;

-- 기간 지정
SELECT COUNT(*) AS 개최수
FROM "Projects"
WHERE "isDeleted" IS NOT TRUE
  AND "createdAt" BETWEEN '2025-01-01' AND '2025-12-31';
```

---

## 미니인턴 신청자수

```sql
-- 전체
SELECT COUNT(*) AS 신청자수
FROM "Participations"
WHERE "deletedAt" IS NULL;

-- 특정 미니인턴
SELECT p.name AS 미니인턴명, COUNT(pa.id) AS 신청자수
FROM "Projects" p
LEFT JOIN "Participations" pa ON pa."projectId" = p.id AND pa."deletedAt" IS NULL
WHERE p."isDeleted" IS NOT TRUE
GROUP BY p.id, p.name
ORDER BY 신청자수 DESC;

-- 기간별
SELECT COUNT(*) AS 신청자수
FROM "Participations"
WHERE "deletedAt" IS NULL
  AND "createdAt" BETWEEN '2025-01-01' AND '2025-12-31';
```

---

## 미니인턴 수료자수

```sql
-- 전체
SELECT COUNT(*) AS 수료자수
FROM "Participations"
WHERE "deletedAt" IS NULL
  AND result IN ('complete', 'excellent');

-- 미수료자 (제출 여부 포함)
SELECT
  COUNT(*) FILTER (WHERE result IN ('complete', 'excellent')) AS 수료,
  COUNT(*) FILTER (WHERE result = 'incomplete') AS 미수료,
  COUNT(*) FILTER (WHERE result = '') AS 미결정
FROM "Participations"
WHERE "deletedAt" IS NULL;

-- 기업별 수료 현황
SELECT c.name AS 기업명, p.name AS 미니인턴명,
  COUNT(*) FILTER (WHERE pa.result IN ('complete', 'excellent')) AS 수료,
  COUNT(*) FILTER (WHERE pa.result = 'incomplete') AS 미수료
FROM "Projects" p
JOIN "Companies" c ON c.id = p."companyId"
JOIN "Participations" pa ON pa."projectId" = p.id AND pa."deletedAt" IS NULL
WHERE p."isDeleted" IS NOT TRUE
GROUP BY c.name, p.id, p.name
ORDER BY c.name;
```

---

## 유저(회원)수

```sql
-- 전체 유저수
SELECT COUNT(*) AS 유저수
FROM "Users";

-- 월별 신규 가입
SELECT DATE_TRUNC('month', "createdAt") AS 월, COUNT(*) AS 신규가입
FROM "Users"
GROUP BY 1
ORDER BY 1 DESC
LIMIT 12;

-- 기간별
SELECT COUNT(*) AS 유저수
FROM "Users"
WHERE "createdAt" BETWEEN '2025-01-01' AND '2025-12-31';
```

---

## 기업회원수

```sql
-- 전체
SELECT COUNT(*) AS 기업수
FROM "Companies"
WHERE "isDeleted" IS NOT TRUE;

-- 기업 상세 정보 포함
SELECT c.id, c.name, ci."representService", ci.category, ci.homepage
FROM "Companies" c
LEFT JOIN "CompanyInfos" ci ON ci."recruitmentCompanyId" = c."recruitmentCompanyId"
WHERE c."isDeleted" IS NOT TRUE
ORDER BY c."createdAt" DESC
LIMIT 20;
```

---

## M클래스(이벤트) 개최 리스트

```sql
-- 전체 리스트
SELECT id, title, type, "startDate", "endDate", "applyDate", "createdAt"
FROM "Events"
ORDER BY "createdAt" DESC
LIMIT 50;

-- 기간별
SELECT id, title, "startDate", "endDate"
FROM "Events"
WHERE "createdAt" BETWEEN '2025-01-01' AND '2025-12-31'
ORDER BY "startDate";
```

## M클래스 신청자수

```sql
SELECT e.title AS M클래스명, COUNT(ep.id) AS 신청자수
FROM "Events" e
LEFT JOIN "EventParticipations" ep ON ep."eventId" = e.id
GROUP BY e.id, e.title
ORDER BY 신청자수 DESC;
```

---

## 스킬업 강의 수강 데이터

```sql
-- 강의별 수강자수
SELECT c.name AS 강의명, COUNT(cp.id) AS 수강자수
FROM "Courses" c
LEFT JOIN "CourseParticipants" cp ON cp."courseId" = c.id
GROUP BY c.id, c.name
ORDER BY 수강자수 DESC;

-- 유료 강의만
SELECT c.name AS 강의명, c.price AS 가격, COUNT(cp.id) AS 수강자수
FROM "Courses" c
LEFT JOIN "CourseParticipants" cp ON cp."courseId" = c.id
WHERE c.price > 0
GROUP BY c.id, c.name, c.price
ORDER BY 수강자수 DESC;

-- 수강 로그 (LectureProgresses)
SELECT lp."userId", lp."lectureId", lp."createdAt"
FROM "LectureProgresses" lp
WHERE lp."createdAt" BETWEEN '2025-01-01' AND '2025-12-31'
ORDER BY lp."createdAt" DESC
LIMIT 100;
```

---

## 맞춤형 채용제안 신청자

```sql
SELECT COUNT(*) AS 신청자수
FROM "Proposals"
WHERE "createdAt" BETWEEN '2025-01-01' AND '2025-12-31';
```

---

## 채용관 공고 (모집중)

```sql
SELECT rn.id, rn.name, rn.status, rn."employmentType", rn."createdAt",
       rc.name AS 기업명
FROM "RecruitmentNotices" rn
LEFT JOIN "RecruitmentCompanies" rc ON rc.id = rn."recruitmentCompanyId"
WHERE rn."deletedAt" IS NULL
  AND rn.status = 'active'
ORDER BY rn."createdAt" DESC;
```

---

## 해피폴리오 인기 TOP

```sql
-- 판매수 기준 TOP 10
SELECT id, title, "salesCount", "likeCount", "viewCount", price, status
FROM "Happyfolios"
WHERE status = 'approved'
ORDER BY "salesCount" DESC
LIMIT 10;

-- 카테고리별 통계
SELECT hc.id AS 카테고리ID, COUNT(h.id) AS 개수,
       SUM(h."salesCount") AS 총판매, SUM(h."viewCount") AS 총조회
FROM "Happyfolios" h
LEFT JOIN "HappyfolioCategories" hc ON hc.id = h."happyfolioCategoryId"
WHERE h.status = 'approved'
GROUP BY hc.id
ORDER BY 총판매 DESC;
```

---

## 가입자 소셜 로그인 분포

```sql
SELECT "loginMethod", COUNT(*) AS 유저수
FROM "Users"
GROUP BY "loginMethod"
ORDER BY 유저수 DESC;
```

---

## 미니인턴 수료율 TOP

```sql
SELECT p.name AS 미니인턴명, c.name AS 기업명,
  COUNT(*) AS 총신청,
  COUNT(*) FILTER (WHERE pa.result IN ('complete', 'excellent')) AS 수료,
  ROUND(100.0 * COUNT(*) FILTER (WHERE pa.result IN ('complete', 'excellent')) / NULLIF(COUNT(*), 0), 1) AS 수료율
FROM "Projects" p
JOIN "Companies" c ON c.id = p."companyId"
JOIN "Participations" pa ON pa."projectId" = p.id AND pa."deletedAt" IS NULL
WHERE p."isDeleted" IS NOT TRUE AND p.status = 'finished'
GROUP BY p.id, p.name, c.name
HAVING COUNT(*) >= 5
ORDER BY 수료율 DESC
LIMIT 10;
```

---

## 결제 매출 통계

```sql
-- 월별 매출
SELECT DATE_TRUNC('month', "purchasedAt") AS 월,
       type AS 상품유형,
       COUNT(*) AS 건수,
       SUM(price) AS 매출
FROM "Pays"
WHERE status = 'paid'
GROUP BY 1, 2
ORDER BY 1 DESC, 매출 DESC;

-- 상품 유형별 누적
SELECT type AS 상품유형, COUNT(*) AS 건수, SUM(price) AS 매출
FROM "Pays"
WHERE status = 'paid'
GROUP BY type
ORDER BY 매출 DESC;
```

---

## 채용관 기업 현황

```sql
SELECT COUNT(*) AS 전체기업수,
  COUNT(*) FILTER (WHERE "deletedAt" IS NULL) AS 활성기업수
FROM "RecruitmentCompanies";

-- 기업별 공고수
SELECT rc.name AS 기업명, COUNT(rn.id) AS 공고수
FROM "RecruitmentCompanies" rc
LEFT JOIN "RecruitmentNotices" rn ON rn."recruitmentCompanyId" = rc.id AND rn."deletedAt" IS NULL
WHERE rc."deletedAt" IS NULL
GROUP BY rc.id, rc.name
ORDER BY 공고수 DESC
LIMIT 20;
```
