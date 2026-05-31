# M.Ex.T. Sales App - Technical Architecture v0.2

## 1. Architecture decisions

- The application is offline first, not online first plus cache.
- Sales Agenda and Service Planning are separate in version 1.
- Customer and prospect data is accessed through Appointment Detail, not separate navigation modules.
- Follow-up information belongs to Appointment and AppointmentHistory, not a separate Tasks module.
- Representatives may always view service information, read-only unless explicit edit permissions exist.
- The application uses RBAC, scope based visibility and explicit permissions.
- Business Central 140 and Odoo v20 are reached only through API and adapter layers.
- Multilingual support NL/FR/DE is required from day one.
- Country-specific business rules are configurable, not hardcoded.
- ERP conflict ownership is policy-based per domain and field type; neither the app nor ERP always wins by default.

## 2. Stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js |
| Language | TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL or Supabase/PostgreSQL |
| ORM | Prisma |
| Auth | Auth.js/NextAuth or Supabase Auth |
| Local database | IndexedDB or equivalent browser-local database |
| i18n | Key-based i18n architecture |
| Integration | API layer + ERP adapter layer |

## 3. High-level architecture

```text
Next.js UI
  App shell
  Sales Agenda
  Appointment Detail
  Service
  Service Planning
  Cash Sheet
  Inventory
  Reports
  Sync
  Admin
    |
    v
Application services
  AuthService
  PermissionService
  VisibilityScopeService
  AppointmentService
  CashSheetService
  ServiceDataService
  InventoryService
  ReportingService
  SyncService
  LocalizationService
  CountryRuleService
    |
    v
API layer
  Validation
  Authorization
  Audit logging
  Sync endpoints
  Integration endpoints
    |
    v
Persistence
  Local database
  PostgreSQL
  SyncQueueItem
  SyncConflict
  AuditLog
  IntegrationLog
    |
    v
ERP adapter layer
  BusinessCentralAdapter
  OdooAdapter
```

## 4. Offline-first architecture

Offline capability is core business functionality.

Required offline domains:

- appointments
- customers
- prospects
- contact persons
- demo registrations
- service data
- cash sheet
- stock

Required mechanisms:

- local database
- sync queue
- conflict detection
- conflict resolution
- retry mechanism
- sync error handling
- sync status screens

Detailed rules are documented in `docs/OFFLINE_SYNC.md`.

## 5. Frontend modules

```text
app/
  dashboard/
  my-info/
  team/
  sales-agenda/
  service/
  service-planning/
  inventory/
  cash-sheet/
  reports/
  sync/
  admin/
  technical/
```

No version 1 routes:

- `customers/`
- `prospects/`
- `tasks/`

Customer/prospect data appears inside `sales-agenda/[appointmentId]`.

## 6. Services

### AppointmentService

- Open appointment detail.
- Change status to `completed`, `no_time`, `cancelled`, `customer_absent`, `rescheduled`.
- Duplicate appointment.
- Write AppointmentHistory.
- Prevent representative delete.

### CashSheetService

- Calculate weekly cash sheet.
- Register "Deposit Executed" / "Storting uitgevoerd".
- Set `deposit_reported`.
- Enforce Monday blocking every Monday from 00:00 local user time, based on the user's country/timezone.
- Block representatives with an open previous-week cash sheet containing unpaid or uncleared cash lines.
- Show a blocking screen before the representative can start the workday.
- Allow unblock only by same-country-scope admin, superadmin, or future finance role.
- Preserve historical records.

### PermissionService

- Enforce RBAC.
- Enforce explicit permissions.
- Enforce admin promotion/demotion limitations.

### VisibilityScopeService

- Representative sees own data only.
- Sales leader sees assigned team.
- Admin sees country scopes where granted.
- Superadmin sees all.

### ServiceDataService

- Representatives can view service data.
- Editing requires explicit permissions.
- Separate service planning from sales agenda.
- Do not add extra service roles for now; use existing roles plus explicit permissions.

### ConflictPolicyService

- Resolve ERP/app ownership by domain and field type.
- Critical ERP financial fields use ERP wins or manual review.
- Appointment notes and visit results use app wins unless modified in ERP after last sync.
- Customer/contact changes use manual review if both sides changed.
- Cash sheet uses manual review.
- Stock uses manual review unless a deterministic rule exists.

### CountryRuleService

- Resolve VAT, payment methods, payment terms, invoice formatting and document formatting by user country and customer country.
- Prevent hardcoded country logic.

## 7. API and adapter rules

Never build directly against Business Central or Odoo UI logic.

All ERP communication goes through:

```text
Application service
  -> API layer
  -> IntegrationService
  -> BusinessCentralAdapter or OdooAdapter
```

Important modifications:

- validated server-side
- authorized server-side
- written to local database if offline
- queued for sync
- logged in `AuditLog`
- logged in `IntegrationLog` for ERP communication

ERP conflict rule:

- Do not assume the app always wins.
- Do not assume ERP always wins.
- Conflict resolution must be policy-based per domain and field type.

## 8. Roles, permissions and scopes

Detailed documentation is in `PERMISSIONS.md`.

Summary:

- Representative: one country, self only.
- Sales Leader: one country, assigned team.
- Admin: assigned countries only, can manage representative/sales leader users inside scope.
- Superadmin: all countries, teams and users.

Admin may not create or manage admins/superadmins.

## 9. Delete, archive and inactive rules

- Avoid hard deletes.
- Representatives may never delete appointments.
- Appointments use statuses.
- Representatives may not delete addresses or contact persons.
- Representatives may set addresses/contact persons inactive.
- Destructive actions require confirmation, warnings and audit logging.

Inactive fields:

- `isActive`
- `inactiveReason`
- `inactiveAt`
- `inactiveByUserId`

## 10. Localization architecture

Detailed documentation is in `docs/LOCALIZATION.md`.

Rules:

- No hardcoded UI texts.
- Menus, buttons, labels, warnings, notifications, validation messages, dialogs and reports must use translation keys.
- Each user has `preferredLanguage`.
- Supported languages: Dutch, French, German.
- New languages must be addable without rewriting the app.
- Dutch is the initial source language.
- French and German translation files must exist from Phase 1, but may contain placeholders or draft translations.

## 11. Multi-country business rules

Supported countries at launch:

- Belgium
- Netherlands
- Germany

Configuration entities:

- `CountryConfiguration`
- `VATConfiguration`
- `PaymentMethodConfiguration`
- `PaymentTermConfiguration`

Applicable rules are determined by:

- user's country
- customer's country
- user's country/timezone for local business-time rules such as Monday cash sheet blocking

## 12. Phase 1 architecture scope

Phase 1 should build visual and structural foundations only:

- app shell
- mock login with role, country and language
- dashboard
- sales agenda mockdata
- appointment detail panels
- service read-only panel
- cash sheet block state
- i18n key structure
- Dutch source translation file plus French and German placeholder/draft files
- permission/scope mock model

No production backend, ERP integration or real sync implementation in Phase 1, but the UI and data shapes must not contradict offline-first, i18n or permissions decisions.

## 13. Architectural risks

- Offline-first can become expensive if postponed.
- Cash sheet blocking affects authentication and routing; design early.
- Cash sheet blocking depends on correct user country/timezone configuration.
- Product-level reporting requires line data from ERP, not only document totals.
- Country-specific fiscal logic must not leak into UI components.
- Service read-only versus edit permissions must be enforced server-side.
- Admin country scopes must be modeled before user management is implemented.
- ERP conflict ownership must be documented and implemented as policy, not hardcoded case by case.
