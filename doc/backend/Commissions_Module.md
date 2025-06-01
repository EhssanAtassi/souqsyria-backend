# 📦 Commissions Module – SouqSyria Backend

This module handles all commission-related logic in the SouqSyria platform. It supports dynamic, override-based commission assignment and resolution, powering vendor payouts and platform monetization.

---

## 🧠 System Overview

Commission resolution follows this priority:

```
1. Product-level override
2. Vendor-level override
3. Category-level override
4. Global default fallback
5. Membership discount (subtracted at the end)
```

---

## 🧱 Core Features

| Feature                       | Description                                                 |
|------------------------------|-------------------------------------------------------------|
| Product Commission Override  | Admin sets commission on a specific product                 |
| Vendor Commission Override   | Admin sets commission on a vendor                           |
| Category Commission Override | Admin sets default commission for a category                |
| Global Default Commission    | Platform-wide fallback                                      |
| Membership Discount          | Commission discount based on vendor tier (e.g., Gold -3%)   |
| Audit Logs                   | All commission changes are saved with timestamp & admin ID  |
| Time-Scoping Support         | All overrides are time-aware (`valid_from`, `valid_to`)     |

---

## 📁 Folder Structure

```bash
commissions/
├── controller/
│   └── commissions.controller.ts       # REST endpoints
├── dto/
│   └── create-*.dto.ts                 # Swagger + class-validator
├── entities/
│   └── *.entity.ts                     # TypeORM entities
├── guards/                             # Reserved for module-level guards
├── interfaces/                         # Shared internal types
├── resolvers/                          # Reserved for future GraphQL support
├── service/
│   └── commissions.service.ts          # Core logic layer
├── commissions.module.ts               # NestJS module setup
```

---

## 🔐 Security

This module uses:

- `@UseGuards(FirebaseAuthGuard, PermissionsGuard)`  
  Ensures:
  - Authenticated Firebase user
  - Permission match from your dynamic ACL system

---

## 🧪 Example API Calls

### Create Category Commission
```http
POST /api/admin/commissions/category
{
  "category_id": 15,
  "percentage": 7.5,
  "note": "Electronics - adjusted"
}
```

### Get Vendor Commission
```http
GET /api/admin/commissions/vendor/101
```

---

## 🚀 Future Plans

- Versioning and history of rules
- GraphQL exposure for dashboards
- Redis caching of resolved rates
- Commission experiment system (A/B test different rates)

---

## 🧠 Designed for Scale

- 20M+ products ready (indexed queries, modular overrides)
- Fully auditable
- Composable logic (e.g. `getEffectiveCommission()` returns explainable breakdown)
