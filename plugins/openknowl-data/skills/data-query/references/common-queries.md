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
FROM "Companies";
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
SELECT c.title AS 강의명, COUNT(cp.id) AS 수강자수
FROM "Courses" c
LEFT JOIN "CourseParticipants" cp ON cp."courseId" = c.id
GROUP BY c.id, c.title
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
SELECT id, title, status, "createdAt"
FROM "RecruitmentNotices"
WHERE "deletedAt" IS NULL
  AND status = 'active'
ORDER BY "createdAt" DESC;
```
