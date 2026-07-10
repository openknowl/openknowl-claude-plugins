# Schema Index

Read this file first, then open only the domain file(s) you need.

Column names are PostgreSQL-native — camelCase columns require `"double quotes"`.

---

## Scenario → Reference File

| Question type | File to read |
|---------------|-------------|
| Mini-intern postings / applications / completion | `miniintern.md` |
| Mini-intern recruitment proposals | `miniintern.md` |
| Challenge projects | `miniintern.md` |
| M-Class events / registrations / cancellations | `mclass.md` |
| SkillUp courses / enrollment / progress | `skillup.md` |
| Happyfolio sales / views / snacks | `happyfolio.md` |
| Users / profiles / resumes | `user.md` |
| Companies / recruitment portal / job postings | `company.md` |
| Payments / revenue / refunds | `payment.md` |
| Common aggregation patterns | `common-queries.md` |

For cross-domain queries (e.g. "completion rate by company"), read all relevant files.

---

## Key Relationships

```
Users 1:1 Profiles
Users 1:N Resumes
Users 1:N Participations        (mini-intern applications)
Users 1:N EventParticipations   (M-Class registrations)
Users 1:N CourseParticipants    (SkillUp enrollments)
Users 1:N Pays                  (payments)

Projects (mini-intern) N:1 Companies
Projects 1:N Participations
Projects 1:N RecruitmentNotices (linked job postings)

Events (M-Class) 1:N EventParticipations
Events N:1 Hosts
Events N:1 EventCategories

Courses (SkillUp) 1:N CourseParticipants
Courses N:1 Tutors
Courses 1:N Chapters 1:N Lectures 1:N LectureProgresses

Happyfolios N:1 Hosts
Happyfolios N:1 HappyfolioCategories

Companies N:1 RecruitmentCompanies
CompanyInfos N:1 RecruitmentCompanies
RecruitmentCompanies 1:N RecruitmentNotices

Hosts N:1 Users   (M-Class / Happyfolio hosts)
Tutors N:1 Users  (SkillUp instructors)
```

---

## Soft-Delete Filters

Always apply these when querying:

| Table | Filter |
|-------|--------|
| `"Projects"` | `"isDeleted" IS NOT TRUE` |
| `"Participations"` | `"deletedAt" IS NULL` |
| `"Events"` | `"deletedAt" IS NULL` |
| `"Happyfolios"` | published: `status = 'approved'` |
| `"HappyfolioSnacks"` | `"deletedAt" IS NULL` |
| `"Resumes"` | `"isDeleted" IS NOT TRUE AND "isTemp" IS NOT TRUE` |
| `"Companies"` | `"isDeleted" IS NOT TRUE` |
| `"RecruitmentCompanies"` | `"deletedAt" IS NULL` |
| `"RecruitmentNotices"` | `"deletedAt" IS NULL` |
| `"Hosts"` | `"deletedAt" IS NULL` |

---

## Common Column Conventions

- `"createdAt"` / `"updatedAt"` — present on nearly every table. `timestamp with time zone`.
- `id` — PK on every table (integer, auto-increment).
- FK columns follow the pattern `"singularTableNameId"` (e.g. `"projectId"`, `"userId"`).
