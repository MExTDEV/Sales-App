# M.Ex.T. Sales App - Development Handover

Last updated: 2026-05-29

## 1. Current Project Status

The project is a mock-only Next.js / TypeScript / Tailwind CSS rebuild of the M.Ex.T. Sales App. The current application provides an acceptable visual foundation and a first mock-functional sales workflow.

Current implementation:

- Next.js app shell with TypeScript.
- Roboto loaded globally through `next/font/google`.
- Primary brand color: `#003B83`.
- Collapsible left sidebar with `lucide-react` icons.
- Topbar aligned to sidebar header height.
- Bottom status bar focused on sync/status/settings only.
- Dashboard with premium tile layout and lucide dashboard icons.
- Sales agenda with open and closed appointment sections.
- Appointment detail view with customer/prospect, address, contacts, service, notes, visit result placeholder, and history.
- Mock appointment status actions.
- Mock duplicate appointment flow.
- Mock cash sheet and Monday blocking flow.
- i18n key structure for Dutch, French, and German.

No real backend, database, authentication, ERP integration, or offline sync exists yet.

## 2. Completed Phases

Phase 1:

- Created the initial Next.js / TypeScript / Tailwind app shell.
- Added mock login with role, country, timezone, preferred language, and scenario selection.
- Added sidebar, topbar, bottom sync/status bar, dashboard, sales agenda, appointment detail, service info panel, cash sheet blocking screen, i18n structure, mock RBAC, mock explicit permissions, and mock country scope.

Phase 1.1:

- Cleaned up legacy project artifacts.
- Split large app component into maintainable folders/components.
- Added state-based internal views for dashboard, agenda, appointment detail, service, cash sheet, sync.
- Expanded mock scenarios and appointment statuses.

Phase 1.2 - 1.7:

- Refined dashboard and agenda visuals using the lost Lovable screenshots as reference.
- Improved shell, cards, rows, buttons, typography, dashboard tile alignment, and brand identity.
- Replaced sidebar icons with `lucide-react`.
- Replaced dashboard tile icons with `lucide-react`.
- Changed primary brand color to `#003B83`.
- Forced Roboto globally via `next/font/google`.
- Removed duplicated footer navigation.
- Aligned sidebar and topbar header height to shared `h-16`.

Phase 2:

- Implemented mock-functional sales workflow.
- Split Sales Agenda into `Nog uit te voeren afspraken` and `Afgewerkte afspraken`.
- Added appointment status changes for `completed`, `no_time`, `customer_absent`, `rescheduled`, and `cancelled`.
- Added duplicate appointment modal with new time input.
- Added mock creation of a new planned appointment after duplication.
- Closed the original appointment after duplication according to the current mock rule.
- Kept closed appointments openable.
- Hid duplicate/no_time actions for closed appointments.
- Added cash sheet detail view with line items, amount to deposit, and deposit action.

## 3. Remaining UI Improvements

Recommended UI polish still pending:

- Visually verify the running app in browser after each future UI change.
- Improve the appointment detail page layout to look more like the Lovable dashboard quality level.
- Add clearer visual hierarchy for visit result and appointment history panels.
- Add confirmation feedback/toasts for mock status changes, duplicate creation, and cash sheet deposit.
- Improve empty states for agenda sections.
- Improve mobile behavior for agenda rows and appointment actions.
- Add icon buttons where appropriate for repeated actions.
- Add a compact tablet mode for representatives using the app in the field.
- Review all long French/German placeholder text for overflow.

## 4. Planned Phase 2 Work

Phase 2 should continue as mock-only functional refinement.

Recommended next Phase 2.1 scope:

- Add a mock visit result form on appointment detail.
- Capture mock visit result fields such as result type, notes, next step, commercial interest, demo outcome, and order interest.
- Append each mock status/result change to appointment history.
- Add a visible audit/history timeline style.
- Add status change confirmation UI.
- Add reschedule flow with new time/date input.
- Add cancelled/customer_absent reason fields.
- Add better duplicate flow rules for whether the original becomes `completed`, `rescheduled`, or another closed status.
- Add mock validation messages through i18n keys.

Still out of scope for Phase 2:

- Real backend.
- Real database.
- Real authentication.
- ERP integration.
- Offline sync implementation.
- Separate Customers module.
- Separate Prospects module.
- Separate Tasks module.
- Extra service roles.

## 5. Planned Backend Architecture

The planned backend architecture remains documentation-only at this point.

Target architecture:

- API-first backend.
- Domain-oriented service layer.
- Adapter layer for ERP systems.
- No direct coupling to Business Central or Odoo UI logic.
- Audit logging for all important modifications.
- RBAC plus scope-based visibility plus explicit permissions.
- Country-aware configuration for business rules.
- Soft-delete/inactive/status-based lifecycle handling instead of hard deletes.

Planned backend responsibilities:

- User and role management.
- Appointment lifecycle management.
- Customer/prospect/contact updates.
- Cash sheet management.
- Stock and demo registration support.
- Service data read/edit depending on explicit permissions.
- Reporting data extraction including order lines and invoice lines.
- AuditLog creation for important changes.

## 6. Planned Offline Architecture

Offline-first is a core requirement, not a cache enhancement.

Target offline architecture:

- Local database on the client/device.
- Sync queue for outbound changes.
- Retry mechanism.
- Sync status and sync error screens.
- Conflict detection.
- Conflict resolution policies per domain and field type.
- SyncConflict entity.
- Audit logging for changes made offline.

Offline-capable domains:

- Appointments.
- Customers.
- Prospects.
- Contact persons.
- Demo registrations.
- Service data.
- Cash sheet.
- Stock.

Important rules:

- No hard delete offline.
- Use inactive flags where needed.
- Offline customer/prospect/contact edits are allowed only with permission.
- Exact field-level edit rules must be refined before ERP integration.

Default conflict policy:

- Critical ERP financial fields: ERP wins or manual review.
- Appointment notes and visit results: app wins unless modified in ERP after last sync.
- Customer/contact changes: manual review if both sides changed.
- Cash sheet: manual review.
- Stock: manual review unless a deterministic rule exists.

## 7. Planned ERP Integration

The Sales App is not a read-only ERP viewer. Representatives are operational users.

ERP integration principles:

- Never build directly against Business Central or Odoo UI logic.
- All ERP communication must go through API and adapter layers.
- ERP adapter choice must remain replaceable.
- All important modifications must be logged.
- Conflict handling must be policy-based, not hardcoded as app-wins or ERP-wins.

Representatives may create or modify, when permitted:

- Appointment notes.
- Visit results.
- Customer information.
- Prospect information.
- Contact persons.
- Demo registrations.
- Commercial information.

Reporting requirements:

- Product-level reporting is mandatory.
- OrderLine and InvoiceLine are required.
- Reports must support item, item category, quantity, turnover, margin if available, representative, customer, and period.

## 8. Known Limitations

Current app limitations:

- All data is mock data in React state.
- Refreshing the browser resets mock state.
- No real persistence.
- No real authentication.
- No real authorization enforcement beyond mock UI behavior.
- No backend validation.
- No database schema implemented.
- No ERP integration.
- No offline storage or sync queue.
- No real audit log persistence.
- No real localization review for French/German.
- No real timezone-aware Monday check beyond the mock scenario logic.
- No true country-specific VAT/payment/document formatting behavior.
- Browser automation has been unreliable in the current Windows sandbox, so visual verification should be done manually in the in-app browser.

## 9. Current Design Decisions

Visual and UX:

- Primary color: `#003B83`.
- Font: Roboto via Next.js font loading.
- Icons: `lucide-react`.
- Sidebar is the primary navigation.
- Footer is only for status, sync, and settings.
- Dashboard tiles use equal height and aligned internal rows.
- Sales Agenda and Service Planning remain separate.
- Customers and prospects do not have separate navigation modules in version 1.
- Tasks/follow-up actions do not have a separate module in version 1.

Technical:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Component-based folder structure.
- Mock data in local files.
- i18n via JSON dictionaries and translation helper.
- State-based internal navigation for now.

## 10. Current Role Model

Current roles:

- `representative`
- `sales_leader`
- `admin`
- `superadmin`

Role visibility:

- Representative sees only self, own appointments, and own data.
- Sales Leader sees self and assigned team.
- Admin sees representatives and sales leaders within assigned country scope.
- Superadmin sees all countries, teams, and users.

No extra service roles exist yet. Service capabilities are permission-based.

## 11. Current Permissions Model

The app uses:

- RBAC.
- Scope-based visibility.
- Explicit permissions.

Current explicit service permissions:

- `ViewService`
- `EditService`
- `ViewContracts`
- `EditContracts`
- `ViewAEDs`
- `EditAEDs`
- `ViewWorkOrders`
- `EditWorkOrders`

Other current permissions:

- `ViewOwnAppointments`
- `ViewTeamAppointments`
- `ChangeOwnAppointmentStatus`
- `UnblockCashSheetWorkday`

Representatives may always view service information. Without explicit edit permissions, service information is read-only.

## 12. Current Country Model

Current countries:

- Belgium.
- Netherlands.
- Germany.

Each user has:

- Country.
- Timezone.
- Preferred language.

Future countries must be configurable without redesign.

Planned country-specific configuration:

- VAT rules.
- VAT percentages.
- VAT exemptions.
- Payment methods.
- Payment terms.
- Invoice formatting.
- Document formatting.
- Legal requirements.

Business logic may not be hardcoded by country.

## 13. Current Cash Sheet Rules

Cash sheet is business critical.

Current rules:

- Representatives collect cash from customers.
- Cash must be deposited to M.Ex.T.
- CashSheet has status `open`, `deposit_reported`, or `cleared`.
- CashSheetLine contains date, document number, customer name, amount, paid state, and cleared state.
- The UI displays total amount as `€ x te storten`.
- `Storting uitgevoerd` marks deposit as reported in mock state.

Monday blocking rule:

- Every Monday from 00:00 local user time, based on user country/timezone.
- If the representative has an open previous-week cash sheet with unpaid or uncleared cash lines, the representative is blocked.
- The app shows a blocking screen explaining the cash sheet must be resolved before the workday starts.
- Representative cannot unblock self without registering deposit.
- Admin within same country scope, Superadmin, or a future Finance role may unblock.

Current implementation:

- Blocking is mock scenario/state based.
- No real timezone engine or persisted cash sheet state exists yet.

## 14. Current Appointment Workflow Rules

Appointment statuses:

- `planned`
- `completed`
- `no_time`
- `cancelled`
- `customer_absent`
- `rescheduled`

Rules:

- Open agenda section contains `planned`.
- Closed/finished agenda section contains all non-planned statuses.
- `Geen tijd` sets status to `no_time`.
- `no_time` moves appointment to the closed section.
- `no_time` remains visible for reporting and audit.
- `no_time` does not count as a successfully executed visit.
- Closed appointments remain openable.
- Duplicate/no_time actions are hidden for closed appointments.
- Duplicate flow creates a new planned mock appointment.
- Current mock duplicate rule closes the original as `completed`.
- Status changes add mock history entries.

Important future refinement:

- The duplicate original-closing rule needs business validation. It may need to become `rescheduled` or another closed state depending on final policy.

## 15. Recommended Next Codex Prompts

Prompt 1:

```text
Start Phase 2.1 only.

Do not add backend, database, auth, ERP, or offline sync.

Improve the mock appointment detail workflow:
- add a visit result form
- add result type
- add notes
- add next step
- add reason fields for cancelled/customer_absent/rescheduled
- append all changes to appointment history
- keep all text behind i18n keys

Run npm run typecheck and npm run build.
```

Prompt 2:

```text
Continue Phase 2.2 only.

Refine the Sales Agenda mock workflow:
- improve duplicate appointment modal
- add date input next to time input
- clarify what status the original appointment receives
- add success feedback after duplication/status change
- add empty states for open and closed appointment sections
- keep mock-only state

Run npm run typecheck and npm run build.
```

Prompt 3:

```text
Continue Phase 2.3 only.

Improve the cash sheet mock workflow:
- add clearer cash sheet status badges
- show paid/cleared state per line
- add deposit reported timestamp in mock state
- improve Monday blocking screen
- keep all UI text behind i18n keys
- no backend or persistence

Run npm run typecheck and npm run build.
```

Prompt 4:

```text
Prepare Phase 3 architecture only.

Do not write application code.

Create technical implementation notes for:
- backend API boundaries
- database schema priorities
- offline local database design
- sync queue contract
- ERP adapter interface
- audit log events
- permission enforcement

Update docs only.
```
