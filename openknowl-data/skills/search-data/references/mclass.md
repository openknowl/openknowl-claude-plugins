# M-Class Domain

Tables: Events, EventParticipations, EventCategories

---

## `"Events"` — M-Class events

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `title` | varchar(512) | event title |
| `description` | text | description |
| `category` | varchar(255) | category (legacy, use categoryId) |
| `"categoryId"` | integer | FK → EventCategories |
| `type` | enum | `aday` / `days` |
| `status` | enum | `requested` / `pending` / `active` / `ended` / `TEMP` |
| `price` | integer | price (0 = free) |
| `location` | text | venue |
| `"startDate"` | timestamptz | start date |
| `"endDate"` | timestamptz | end date |
| `"applyDate"` | timestamptz | registration deadline |
| `"approveDate"` | timestamptz | approval date |
| `"recruitMethod"` | enum | `INTERNAL` / `EXTERNAL` / `TEMP` |
| `"selectionMethod"` | enum | `RECRUIT` / `FIRST_COME` / `TEMP` / `AUTO` |
| `range` | enum | visibility range |
| `"numberOfRecruiters"` | varchar(255) | max participants |
| `"mockUpParticipantCount"` | integer | mock participant count |
| `"viewCount"` | integer | view count |
| `"isOnlinePayment"` | boolean | online payment enabled |
| `"isTemp"` | boolean | draft flag |
| `"isEdited"` | boolean | edited flag |
| `"isExpected"` | boolean | upcoming event flag |
| `"isPastExpected"` | boolean | past upcoming flag |
| `"buttonText"` | varchar(100) | CTA button text (default: '신청하기') |
| `"participationLink"` | text | external registration link |
| `notice` | text | notice |
| `"editRequestComment"` | text | edit request comment |
| `"hostEmail"` | varchar(255) | host email |
| `"hostPhone"` | varchar(255) | host phone |
| `questions` | json | custom questions |
| `"selectorInfo"` | jsonb | selector config |
| `"coverTemplateInfo"` | json | cover template settings |
| `"hostId"` | integer | FK → Hosts |
| `"coverImageId"` | integer | FK → Files |
| `"attachmentFileId"` | integer | FK → Files |
| `"copyEventId"` | integer | FK → Events (copied from) |
| `"urlSlug"` | varchar(255) | URL slug |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
| `"deletedAt"` | timestamptz | deleted at |

### Filters

```sql
-- valid events
WHERE "deletedAt" IS NULL

-- currently open for registration
WHERE "deletedAt" IS NULL AND status = 'active' AND "applyDate" > NOW()

-- exclude drafts
WHERE "deletedAt" IS NULL AND "isTemp" IS NOT TRUE
```

---

## `"EventParticipations"` — M-Class registrations

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | applicant name |
| `email` | varchar(255) | email |
| `phone` | varchar(255) | phone |
| `gender` | varchar(255) | gender |
| `birthday` | timestamptz | date of birth |
| `address` | text | address |
| `"militaryStatus"` | varchar(255) | military status |
| `"schoolName"` | varchar(255) | school name |
| `major` | varchar(255) | major |
| `"admissionDate"` | timestamptz | school admission date |
| `"graduationDate"` | timestamptz | school graduation date |
| `platform` | varchar(255) | referral platform |
| `status` | enum | `applied` / etc. |
| `"cancelStatus"` | enum | cancellation status |
| `"cancelReason"` | text | cancellation reason |
| `"canceledAt"` | timestamptz | cancelled at |
| `answers` | json | custom question answers |
| `"eventId"` | integer | FK → Events |
| `"userId"` | integer | FK → Users |
| `"payId"` | integer | FK → Pays (paid events) |
| `"submittedFileId"` | integer | FK → Files |
| `"createdAt"` | timestamptz | registered at |
| `"updatedAt"` | timestamptz | updated at |

---

## `"EventCategories"` — M-Class categories

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | category name |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
