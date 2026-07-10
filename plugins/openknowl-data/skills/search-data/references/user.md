# User Domain

Tables: Users, Profiles, Resumes

---

## `"Users"` — user accounts

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `email` | varchar(255) | email (unique) |
| `password` | varchar(255) | hashed password |
| `"externalId"` | varchar(512) | OAuth external ID |
| `"loginMethod"` | enum | `email` / `facebook` / `google` / `naver` / `kakao` |
| `"isAdsAgreed"` | boolean | marketing consent |
| `"isIdentityVerified"` | boolean | identity verified |
| `"isHeadhuntingAgreed"` | boolean | headhunting consent |
| `"jobSeekStatus"` | varchar(50) | job seeking status |
| `"currentJobSeekStatus"` | varchar(255) | current job seeking status |
| `"currentJobSeekStatusUpdatedAt"` | timestamptz | status updated at |
| `"isSentDormancyMail"` | boolean | dormancy mail sent |
| `"privacyInfoValidPeriod"` | integer | privacy retention period |
| `"lastRequestAt"` | timestamptz | last activity |
| `"createdAt"` | timestamptz | sign-up date |
| `"updatedAt"` | timestamptz | updated at |

---

## `"Profiles"` — user profiles (1:1 with Users)

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | real name |
| `email` | varchar(255) | email |
| `phone` | varchar(255) | phone |
| `gender` | varchar(255) | gender |
| `birthday` | timestamptz | date of birth |
| `"schoolName"` | varchar(255) | school name |
| `"schoolLocation"` | varchar(255) | school location |
| `major` | varchar(255) | major |
| `introduction` | varchar(1000) | self-introduction |
| `address` | text | address |
| `"militaryStatus"` | varchar(255) | military status |
| `"profileImage"` | varchar(255) | profile image path |
| `"resumeActivated"` | boolean | resume activated |
| `"otAttended"` | boolean | attended orientation |
| `"userId"` | integer | FK → Users (unique, 1:1) |
| `"resumeId"` | integer | FK → Resumes |
| `"lastSelectedResumeId"` | integer | FK → Resumes |
| `"admissionDate"` | timestamptz | school admission date |
| `"graduationDate"` | timestamptz | school graduation date |
| `"characterCompetency1Id"` | integer | FK → Competencies |
| `"characterCompetency2Id"` | integer | FK → Competencies |
| `"performanceCompetency1Id"` | integer | FK → Competencies |
| `"performanceCompetency2Id"` | integer | FK → Competencies |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

---

## `"Resumes"` — user resumes

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `title` | varchar(255) | resume title |
| `score` | integer | resume score |
| `"isDeleted"` | boolean | soft-delete flag |
| `"isTemp"` | boolean | draft flag |
| `"isCopied"` | boolean | copied from another |
| `likes` | boolean | liked flag |
| `"urlSlug"` | varchar(255) | URL slug |
| `"filePath"` | varchar(255) | exported file path |
| `"userId"` | integer | FK → Users |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

### JSONB form columns (resume content sections)

| Column | Type | Description |
|--------|------|-------------|
| `"jobValueForm"` | jsonb | job values |
| `"personalForm"` | jsonb | personal info |
| `"schoolForm"` | jsonb[] | education |
| `"careerForm"` | jsonb[] | career history |
| `"projectForm"` | jsonb[] | project experience |
| `"externalActivityForm"` | jsonb[] | external activities |
| `"educationTrainingForm"` | jsonb[] | training history |
| `"languageAbilityForm"` | jsonb[] | language skills |
| `"OAskillForm"` | jsonb[] | OA skills |
| `"licenseForm"` | jsonb[] | certifications |
| `"awardForm"` | jsonb[] | awards |
| `"introduceForm"` | jsonb[] | self-introduction |
| `"portfolioForm"` | jsonb[] | portfolio links |
| `"basicIntroForm"` | jsonb[] | basic intro |
| `"skillForm"` | jsonb[] | skill tags |
| `"urlForm"` | jsonb[] | URL links |
| `"experienceForm"` | jsonb[] | experiences |
| `"itemSetting"` | jsonb[] | section visibility settings |
| `"itemSettingV2"` | jsonb[] | section settings v2 |

### Filters

```sql
-- valid resumes
WHERE "isDeleted" IS NOT TRUE AND "isTemp" IS NOT TRUE
```
