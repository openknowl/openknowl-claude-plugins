# Happyfolio Domain

Tables: Happyfolios, HappyfolioSnacks, HappyfolioCategories, Hosts

---

## `"Happyfolios"` — portfolio products

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `title` | varchar(255) | title |
| `summary` | text | summary |
| `"productionStory"` | text | production story |
| `categories` | varchar(255) | category string |
| `tags` | varchar(255) | tag string |
| `jobs` | varchar(255) | job category (default: `common`) |
| `price` | numeric | price |
| `status` | enum | `requested` / `approved` / `needFixed` / `fixed` / `rejected` / `paused` |
| `"fixMessage"` | text | fix request message |
| `"salesCount"` | integer | sales count |
| `"likeCount"` | integer | like count |
| `"viewCount"` | integer | view count |
| `"responseRate"` | numeric | response rate |
| `"evaluationRate"` | numeric | evaluation rate |
| `"isPick"` | boolean | editor's pick |
| `"isTemp"` | boolean | draft flag |
| `"coverImage"` | varchar(255) | cover image path |
| `"pdfFilePath"` | varchar(255) | PDF file path |
| `"pdfFileSize"` | numeric | PDF file size |
| `"pdfFileTotalPageCount"` | integer | PDF total pages |
| `"previewImagePage"` | integer[] | preview page numbers |
| `"pdfImages"` | jsonb[] | PDF image data |
| `license` | varchar(255) | license type |
| `contents` | jsonb | content data |
| `"hostShortBio"` | varchar(40) | host short bio |
| `"hostHistories"` | varchar(40)[] | host history tags |
| `"hostShortBioAndProductionStory"` | text | combined bio & story |
| `"recommendationTargets"` | varchar(40)[] | recommendation targets |
| `"recommendTarget"` | json | recommend target detail |
| `"lineSummary"` | varchar(255)[] | line summary points |
| `boon` | json[] | benefits |
| `composition` | varchar(255)[] | composition items |
| `"expectedChange"` | varchar(255)[] | expected changes |
| `differency` | varchar(255)[] | differentiators |
| `"topicList"` | json[] | topic list |
| `"coverTemplateInfo"` | jsonb | cover template settings |
| `"themeId"` | integer | FK → HappyfolioThemes |
| `"hostId"` | integer | FK → Hosts |
| `"happyfolioCategoryId"` | integer | FK → HappyfolioCategories |
| `"requestedAt"` | timestamptz | submitted for review |
| `"approvedAt"` | timestamptz | approved at |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

### Filters

```sql
-- published happyfolios
WHERE status = 'approved'

-- with sales stats
WHERE status = 'approved' ORDER BY "salesCount" DESC
```

---

## `"HappyfolioSnacks"` — short-form content

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `title` | varchar(255) | title |
| `content` | text | content body |
| `thumbnail` | varchar(255) | thumbnail path |
| `jobs` | varchar(255) | job category |
| `status` | enum | review status |
| `"viewCount"` | integer | view count |
| `"recommendTarget"` | jsonb | target audience |
| `"lineSummary"` | text[] | summary lines |
| `"fixMessage"` | varchar(255) | fix request |
| `"userId"` | integer | FK → Users |
| `"happyfolioCategoryId"` | integer | FK → HappyfolioCategories |
| `"approvedAt"` | timestamptz | approved at |
| `"requestedAt"` | timestamptz | requested at |
| `"firstApprovedAt"` | timestamptz | first approval |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
| `"deletedAt"` | timestamptz | deleted at |

---

## `"HappyfolioCategories"` — categories

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | category name |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
| `"deletedAt"` | timestamptz | deleted at |

---

## `"Hosts"` — M-Class & Happyfolio hosts

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `name` | varchar(255) | host name |
| `email` | varchar(255) | email |
| `phone` | varchar(255) | phone |
| `"profileImage"` | varchar(255) | profile image path |
| `"shortBio"` | text | short bio |
| `"accountInfo"` | jsonb | bank account info |
| `"accountFilePath"` | varchar(255) | account file |
| `"idCardFileId"` | integer | FK → Files |
| `"userId"` | integer | FK → Users |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |
| `"deletedAt"` | timestamptz | deleted at |

### Related tables (join only when needed)

- `"HappyfolioLikes"` — (`"happyfolioId"`, `"userId"`) like records
- `"HappyfolioDownloadHistories"` — (`"happyfolioId"`, `"userId"`, `count`) download records
- `"HappyfolioPayHistories"` — (`"happyfolioId"`, `"userId"`, `"payId"`, `status`, `"feeRate"`) purchase records
