# Mini-Intern Domain

Tables: Projects, Participations, Proposals, ChallengeProjects, ChallengeProjectUsers

---

## `"Projects"` — mini-intern postings

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | title |
| `description` | text | detailed description |
| `status` | enum | `requested` / `active` / `finished` |
| `type` | enum | `normal` / `recruitment` / `partner` |
| `"companyId"` | integer | FK → Companies |
| `"applyDate"` | timestamptz | application deadline (default 9999-12-31) |
| `"entryDate"` | timestamptz | start date |
| `"draftDate"` | timestamptz | mid-term deadline |
| `"finalDate"` | timestamptz | final deadline |
| `"resultDate"` | timestamptz | result announcement date |
| `"resumeDeadlineDate"` | timestamptz | resume submission deadline |
| `"firstRoundDeadline"` | timestamptz | 1st round deadline |
| `"firstRoundAnnouncementDate"` | timestamptz | 1st round announcement |
| `"secondRoundDeadline"` | timestamptz | 2nd round deadline |
| `"secondRoundAnnouncementDate"` | timestamptz | 2nd round announcement |
| `"otStartDate"` | timestamptz | orientation start |
| `"otEndDate"` | timestamptz | orientation end |
| `"otLocation"` | varchar(255) | orientation location |
| `categories` | varchar(255) | category |
| `positions` | varchar(255)[] | position tags |
| `cost` | integer | cost |
| `"prizeType"` | enum | `ONE` / `MULTIPLE` / `NONE` |
| `"workType"` | enum | `EXTERNAL` / `INTERNAL` / `NONE` |
| `"recruitmentDivide"` | enum | `newcomer` / `career` / `unrequiredCareer` |
| `"careerPeriod"` | enum | career period requirement |
| `"requiredDocuments"` | enum | required documents (`NONE` etc.) |
| `"requiredQualifications"` | text | required qualifications |
| `"preferredQualifications"` | text | preferred qualifications |
| `"viewCount"` | integer | view count |
| `"isOnline"` | boolean | online flag |
| `"isHidden"` | boolean | hidden flag |
| `"isDeleted"` | boolean | soft-delete flag |
| `"finishRequested"` | boolean | finish requested |
| `"isExposedCompanyInfo"` | boolean | show company info |
| `"summaryDescription"` | text | summary |
| `"resultDescription"` | text | result description |
| `"phaseDescription"` | text | phase description |
| `"companyOverview"` | text | company overview text |
| `"projectBackground"` | text | project background |
| `"workScope"` | text | work scope |
| `"outputDirection"` | text | output direction |
| `"additionalInfo"` | text | additional info |
| `"etcNotice"` | text | misc notice |
| `"participationLink"` | text | external participation link |
| `"urlSlug"` | varchar(255) | URL slug |
| `"surveyVersion"` | varchar(255) | survey version |
| `notification` | varchar(255) | notification message |
| `"employmentType"` | json | employment type details |
| `"referenceFileIds"` | integer[] | reference file IDs |
| `"skillIds"` | integer[] | skill tag IDs |
| `"coverImageId"` | integer | FK → Files |
| `"authorId"` | integer | author user |
| `"recruitmentProjectId"` | integer | FK → RecruitmentProjects |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

### Filters

```sql
-- valid postings
WHERE "isDeleted" IS NOT TRUE

-- currently recruiting
WHERE status = 'active' AND "applyDate" > NOW() AND "isDeleted" IS NOT TRUE

-- finished
WHERE status = 'finished' AND "isDeleted" IS NOT TRUE
```

---

## `"Participations"` — applications & completion

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | applicant name |
| `email` | varchar(255) | email |
| `phone` | varchar(255) | phone |
| `gender` | varchar(255) | gender |
| `birthday` | timestamptz | date of birth |
| `"schoolName"` | varchar(255) | school name |
| `"schoolLocation"` | varchar(255) | school location |
| `major` | varchar(255) | major |
| `address` | text | address |
| `"militaryStatus"` | varchar(255) | military status |
| `idea` | text | idea / motivation |
| `platform` | varchar(255) | referral platform |
| `status` | enum | `applied` / `accepted` / `refused` / `absence` |
| `result` | enum | `excellent` / `complete` / `incomplete` / `''`(undecided) |
| `"partnerStatus"` | enum | `APPLY` / `FIRST_SELECTED` / `FIRST_NOT_SELECTED` / `SECOND_SELECTED` / `SECOND_NOT_SELECTED` / `ABSENT` / `NONE` |
| `"applyForCompany"` | boolean | applied to company |
| `"isPrizeGranted"` | boolean | prize granted |
| `"isPrizeDocumentSubmitted"` | boolean | prize documents submitted |
| `"isAssignmentSubmitted"` | boolean | final assignment submitted |
| `"officialNumber"` | integer | registration number |
| `survey` | json | survey responses |
| `resume` | jsonb | resume snapshot |
| `"competencyReportInfo"` | jsonb | competency report |
| `"projectId"` | integer | FK → Projects |
| `"userId"` | integer | FK → Users |
| `"resumeId"` | integer | FK → Resumes |
| `"certificateId"` | integer | FK → Files (certificate) |
| `"portfolioId"` | integer | FK → Portfolios |
| `"miniinternPortfolioId"` | integer | FK → Portfolios |
| `"prizeDistributionId"` | integer | FK → PrizeDistributions |
| `"characterCompetency1Id"` | integer | FK → Competencies |
| `"characterCompetency2Id"` | integer | FK → Competencies |
| `"performanceCompetency1Id"` | integer | FK → Competencies |
| `"performanceCompetency2Id"` | integer | FK → Competencies |
| `"competencyCertificateId"` | integer | FK → Files |
| `"partnerIdeaFileId"` | integer | FK → Files |
| `"admissionDate"` | timestamptz | school admission date |
| `"graduationDate"` | timestamptz | school graduation date |
| `"resumeUpdatedAt"` | timestamptz | resume updated at |
| `"portfolioUpdatedAt"` | timestamptz | portfolio updated at |
| `"createdAt"` | timestamptz | applied at |
| `"updatedAt"` | timestamptz | updated at |
| `"deletedAt"` | timestamptz | cancelled at (NULL = active) |

### Filters

```sql
-- valid applications
WHERE "deletedAt" IS NULL

-- completed (passed)
WHERE "deletedAt" IS NULL AND result IN ('complete', 'excellent')

-- excellent completers
WHERE "deletedAt" IS NULL AND result = 'excellent'

-- accepted applicants
WHERE "deletedAt" IS NULL AND status = 'accepted'
```

---

## `"Proposals"` — recruitment proposals

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `description` | text | content |
| `comment` | text | comment |
| `step` | enum | `draft` / `final` |
| `"participationId"` | integer | FK → Participations |
| `"attachmentId"` | integer | FK → Files |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

---

## `"ChallengeProjects"` — challenge projects

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(520) | challenge name |
| `description` | text | description |
| `"proposalDescription"` | text | proposal description |
| `"expectedParticipants"` | text | expected participants |
| `"userName"` | varchar(255) | author name |
| `"targetLikeCount"` | integer | target like count |
| `status` | enum | `requested` / `active` / `finished` |
| `"companyId"` | integer | FK → Companies |
| `"userId"` | integer | FK → Users |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

Participants: `"ChallengeProjectUsers"` (`"challengeProjectId"` integer, `"userId"` integer)
