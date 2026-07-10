# SkillUp Domain

Tables: Courses, CourseParticipants, Chapters, Lectures, LectureProgresses, Tutors

---

## `"Courses"` — SkillUp courses

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | course title |
| `description` | text | description |
| `price` | numeric | price (0 = free) |
| `range` | enum | `all` / `specific` / `private` |
| `period` | timestamptz | course period |
| `"hasCertificate"` | boolean | issues completion certificate |
| `"isSelected"` | boolean | featured/recommended |
| `"isTemp"` | boolean | draft flag |
| `"recommendTargets"` | text[] | recommended target audience |
| `"tutorId"` | integer | FK → Tutors |
| `"coverFileId"` | integer | FK → Files |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

---

## `"CourseParticipants"` — enrollments

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `"courseId"` | integer | FK → Courses |
| `"userId"` | integer | FK → Users |
| `"isCompleted"` | boolean | completed flag |
| `status` | enum | enrollment status |
| `"lastVisitedAt"` | timestamptz | last visited |
| `"certificateFileId"` | integer | FK → Files |
| `"createdAt"` | timestamptz | enrolled at |
| `"updatedAt"` | timestamptz | updated at |

---

## `"Chapters"` — course chapters

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | chapter name |
| `order` | integer | sort order |
| `"courseId"` | integer | FK → Courses |
| `"noteFileId"` | integer | FK → Files |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

---

## `"Lectures"` — individual lectures

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `type` | enum | `video` / etc. |
| `order` | integer | sort order |
| `"chapterId"` | integer | FK → Chapters |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

---

## `"LectureProgresses"` — viewing logs

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `"lectureId"` | integer | FK → Lectures |
| `"userId"` | integer | FK → Users |
| `"createdAt"` | timestamptz | viewed at |

Hierarchy: Courses → Chapters → Lectures → LectureProgresses

---

## `"Tutors"` — SkillUp instructors

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `"userId"` | integer | FK → Users |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

Additional columns exist (profile info) but instructor details are typically joined via Users + Profiles.

---

## `"CoursePayHistories"` — course payment records

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `item` | enum | `feedback` / etc. |
| `status` | enum | `paid` / etc. |
| `"refundQuestion"` | text | refund reason |
| `"courseParticipantId"` | integer | FK → CourseParticipants |
| `"participantAssignmentId"` | integer | FK → ParticipantAssignments |
| `"payId"` | integer | FK → Pays |
| `"refundRequestDate"` | timestamptz | refund request date |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
