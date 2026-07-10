# Company & Recruitment Domain

Tables: Companies, CompanyInfos, RecruitmentCompanies, RecruitmentNotices, RecruitmentCards, RecruitmentAdmins

---

## `"Companies"` — mini-intern host companies

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | company name |
| `website` | varchar(255) | website |
| `description` | text | description |
| `"isDeleted"` | boolean | soft-delete flag |
| `"recruitmentCompanyId"` | integer | FK → RecruitmentCompanies |
| `"coverImageId"` | integer | FK → Files |
| `"logoImageId"` | integer | FK → Files |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

### Note on company name lookups

- Mini-intern context → use `"Companies".name`
- Recruitment portal context → use `"CompanyInfos".name` or `"RecruitmentCompanies".name`

---

## `"CompanyInfos"` — detailed company profiles

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | company name |
| `"representService"` | varchar(255) | main service |
| `category` | varchar(255) | industry category |
| `"serviceType"` | varchar(255) | service type |
| `homepage` | varchar(255) | homepage URL |
| `"recruitmentType"` | enum | `notEmploy` / `regularRecruit` / `periodRecruit` |
| `"recruitmentPage"` | varchar(255) | recruitment page URL |
| `"recruitmentEndDate"` | timestamptz | recruitment end date |
| `"employMiniinternAddress"` | varchar(255) | employment mini-intern URL |
| `"taskMiniinternAddress"` | varchar(255) | task mini-intern URL |
| `"challengeMiniinternAddress"` | varchar(255) | challenge mini-intern URL |
| `"isApproved"` | boolean | approved flag |
| `requester` | varchar(255) | requester name |
| `"urlSlug"` | varchar(255) | URL slug |
| `"logoImageMeta"` | jsonb | logo image metadata |
| `"coverImageMeta"` | jsonb | cover image metadata |
| `"infoImageMeta"` | jsonb | info image metadata |
| `"recruitmentCompanyId"` | integer | FK → RecruitmentCompanies |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

---

## `"RecruitmentCompanies"` — recruitment portal companies

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | company name (unique) |
| `"registrationNumber"` | varchar(255) | business registration number |
| `"registrationFileId"` | integer | FK → Files |
| `"websiteAddress"` | varchar(255) | website |
| `"establishmentDate"` | timestamptz | establishment date |
| `"industrialField"` | varchar(255) | industry field |
| `"memberCount"` | varchar(255) | employee count |
| `description` | text | description |
| `"urlSlug"` | varchar(255) | URL slug |
| `"isTemp"` | boolean | draft flag |
| `"headAddress"` | jsonb | HQ address (roadName, detail, map coords) |
| `"branchAddress"` | jsonb | branch address |
| `"logoImageId"` | integer | FK → Files |
| `"representativeImageId"` | integer | FK → Files |
| `"officeImageId"` | integer | FK → Files |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
| `"deletedAt"` | timestamptz | deleted at |

### Filters

```sql
-- active companies
WHERE "deletedAt" IS NULL

-- exclude drafts
WHERE "deletedAt" IS NULL AND "isTemp" IS NOT TRUE
```

---

## `"RecruitmentNotices"` — job postings

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | posting title |
| `status` | enum | `temp` / `pending` / `active` / `finished` |
| `"employmentType"` | enum | `정규직` / `계약직` / `인턴` |
| `"recruitmentDivide"` | enum | `newcomer` / `career` / `unrequiredCareer` |
| `"applicationPeriod"` | enum | `term` / `always` |
| `"careerPeriod"` | enum | career period requirement |
| `"probationPeriod"` | enum | probation period |
| `"sizeOfEmployment"` | varchar(255) | headcount |
| `wage` | varchar(255) | salary info |
| `"employmentPeriod"` | varchar(255) | employment period |
| `"startDate"` | timestamptz | posting start date |
| `"endDate"` | timestamptz | posting end date |
| `"isApproved"` | boolean | approved flag |
| `"isPastApproved"` | boolean | previously approved |
| `"needFix"` | boolean | needs fix |
| `"isSample"` | boolean | sample posting |
| `"hasCompensation"` | boolean | has compensation |
| `descriptions` | jsonb[] | structured descriptions |
| `"workAddress"` | jsonb | work location (roadName, detail, map coords) |
| `manager` | jsonb | hiring manager info |
| `order` | integer | display order |
| `"jobIds"` | integer[] | job category IDs |
| `"recruitmentCompanyId"` | integer | FK → RecruitmentCompanies |
| `"projectId"` | integer | FK → Projects (linked mini-intern) |
| `"sectorId"` | integer | FK → Sectors |
| `"recruitmentServiceId"` | integer | FK → RecruitmentServices |
| `"recruitmentTemplateId"` | integer | FK → RecruitmentTemplates |
| `"recruitmentOrganizationId"` | integer | FK → RecruitmentOrganizations |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
| `"deletedAt"` | timestamptz | deleted at |

### Filters

```sql
-- valid postings
WHERE "deletedAt" IS NULL

-- currently active
WHERE "deletedAt" IS NULL AND status = 'active'

-- active and approved
WHERE "deletedAt" IS NULL AND status = 'active' AND "isApproved" = true
```

---

## `"RecruitmentCards"` — applicant tracking cards

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | applicant name |
| `email` | varchar(255) | email |
| `phone` | varchar(255) | phone |
| `"joinedStatus"` | enum | joined status |
| `"settleAccountStatus"` | enum | settlement status |
| `order` | integer | display order |
| `"fileDocument"` | jsonb[] | attached documents |
| `history` | jsonb[] | process history |
| `survey` | jsonb[] | survey answers |
| `"recruitmentKanbanId"` | integer | FK → RecruitmentKanbans |
| `"recruitmentNoticeId"` | integer | FK → RecruitmentNotices |
| `"recruitmentCompanyId"` | integer | FK → RecruitmentCompanies |
| `"userId"` | integer | FK → Users |
| `"proposalId"` | integer | FK → Proposals |
| `"portfolioId"` | integer | FK → Portfolios |
| `"resumeId"` | integer | FK → Resumes |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
| `"deletedAt"` | timestamptz | deleted at |

---

## `"RecruitmentAdmins"` — company admin users

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `phone` | varchar(255) | phone |
| `department` | varchar(255) | department |
| `position` | varchar(255) | position/title |
| `"approvedStatus"` | enum | `review` / etc. |
| `status` | enum | admin status |
| `"isOriginMaster"` | boolean | original master admin |
| `"isBannerClosed"` | boolean | banner dismissed |
| `"userId"` | integer | FK → Users |
| `"recruitmentCompanyId"` | integer | FK → RecruitmentCompanies |
| `"lastWatchedRecruitmentNoticeId"` | integer | last viewed posting |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
| `"deletedAt"` | timestamptz | deleted at |
