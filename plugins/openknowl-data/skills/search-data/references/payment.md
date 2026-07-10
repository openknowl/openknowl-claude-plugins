# Payment Domain

Tables: Pays

---

## `"Pays"` — payment records

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | PK |
| `"productName"` | varchar(255) | product name |
| `pg` | varchar(255) | payment gateway |
| `"receiptId"` | varchar(255) | PG receipt ID |
| `"orderId"` | varchar(255) | order ID |
| `method` | varchar(255) | payment method |
| `price` | numeric | amount |
| `"receiptUrl"` | text | receipt URL |
| `status` | enum | `ready` / `paid` / `cancelled` / `failed` |
| `type` | enum | `happy_portfolio` / `event` / `happyfolio` / `skillup` / `scoutProposal` / `project` |
| `"requestedRefund"` | boolean | refund requested |
| `"errorMessage"` | varchar(500) | error message |
| `"rawData"` | jsonb | raw PG response |
| `"userId"` | integer | FK → Users |
| `"purchasedAt"` | timestamptz | purchased at |
| `"createdAt"` | timestamptz | created at |
| `"updatedAt"` | timestamptz | updated at |

### Filters

```sql
-- successful payments
WHERE status = 'paid'

-- revenue by type
WHERE status = 'paid' GROUP BY type

-- refund requests
WHERE "requestedRefund" = true
```

### Type mapping

| `type` value | Product |
|-------------|---------|
| `happyfolio` | Happyfolio purchase |
| `happy_portfolio` | Happyfolio (legacy) |
| `event` | M-Class registration |
| `skillup` | SkillUp course |
| `scoutProposal` | Scout proposal |
| `project` | Mini-intern related |
