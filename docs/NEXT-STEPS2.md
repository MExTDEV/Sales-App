# M.Ex.T. Sales App - NEXT-STEPS2

Last updated: 2026-05-30

This document captures the current development state so work can continue without re-explaining the project.

## 1. Current Project Status

The project is a mock-only Next.js / TypeScript rebuild of the M.Ex.T. Sales App. The visual foundation is now mature enough for continued functional mock development. The app has a working shell, mock login, role/country/language scenarios, several business screens, and a polished tablet-friendly enterprise UI.

Current maturity:

- Frontend shell: implemented.
- Visual system: implemented and refined.
- Main navigation: implemented with collapsible sidebar.
- Mock state workflows: partially implemented.
- Real backend/database/authentication/ERP/offline sync: not implemented.

Completed phases:

- Phase 1: initial app shell, mock login, dashboard, agenda, appointment detail, service panel, cash sheet blocking, RBAC mock, i18n skeleton.
- Phase 1.1: component refactor and structure cleanup.
- Phase 1.2 - 1.7: visual refinement, Roboto, lucide-react icons, #003B83 brand color, collapsible sidebar, fixed shell behavior.
- Phase 1.8 - 1.10: superadmin technical management, design settings, technical tables, user management list/create/edit mock flow.
- Phase 2.1: Mijn Team mock overview.
- Phase 2.2: Sales Agenda workflow and row refinements.
- Phase 2.3: Mijn Informatie read-only screen and refinements.

Completed screens:

- Dashboard.
- Mijn informatie.
- Mijn team.
- Mijn agenda.
- Appointment detail.
- Service information.
- Kasblad.
- Synchronisatie.
- Gebruikersbeheer.
- Technisch beheer > Design.
- Technisch beheer > Tabellen.

Current visual design state:

- Modern enterprise SaaS style.
- Blue/white M.Ex.T.-style corporate look using `#003B83`.
- Roboto typography loaded through `next/font/google`.
- lucide-react icons for navigation, dashboard, actions, and screen sections.
- Card-based layout with rounded corners, subtle shadows, and tablet-friendly spacing.
- Fixed left sidebar, scrollable content panel, topbar, and bottom sync/status bar.

Current navigation structure:

- Dashboard.
- Mijn informatie.
- Mijn team.
- Mijn agenda.
- Service, with nested service-related placeholders.
- Voorraad, with nested Artikelvoorraad placeholder.
- Rapportering placeholder.
- Synchronisatie.
- Gebruikersbeheer.
- Technisch beheer, visible only for SuperAdmin, with Design and Tabellen.

## 2. Completed Screens

### Dashboard

Status: implemented.

The dashboard shows a welcome header, KPI stats, Mijn werkdag tiles, quick actions, cash sheet tile, agenda tile, sync tile, and navigation into key flows. It uses lucide-react icons and the current card/tile design system.

### Mijn informatie

Status: implemented, mock-only.

The screen is read-only except for mock action modals. It shows profile header, persoonsgegevens, teaminformatie, Mijn werkdag vandaag, Mijn omzet vandaag, Kasblad, and Synchronisatie. It includes action cards for Ander mobiel nummer melden, Cash Storten, and Synchroniseren.

Current mock-only actions:

- Ander mobiel nummer melden opens a modal, accepts a new number, and shows confirmation.
- Cash Storten opens a placeholder modal.
- Synchroniseren triggers shared mock sync state.

### Mijn team

Status: implemented, mock-only.

Sales leaders/admin/superadmin can see a team overview with representative-level daily metrics and expandable appointment details. Visibility is based on mock role/scope logic. Appointment open action can navigate into the appointment detail flow.

### Sales agenda / Mijn agenda

Status: implemented, mock-only and actively refined.

The agenda is split into:

- Nog uit te voeren afspraken.
- Afgewerkte afspraken.

Rows show time, customer/prospect badge, customer/prospect number, account name, address, contact person, phone number, status badge, and action buttons. Open rows show Openen, Geen tijd, and Dupliceren. Closed rows remain openable and show revenue split.

### Appointment Detail

Status: partially implemented.

Appointment detail shows customer/prospect information, address, contact persons, service panel, appointment status, notes, visit result placeholder, and appointment history placeholder. Further work is needed for a real mock visit result workflow, history timeline, validation, and status-specific forms.

### Gebruikersbeheer

Status: implemented, mock-only.

User management has list/search/default sorting, create/edit forms, inactive flow, photo preview, country/team/role fields, permissions, leads, and role dropdown sourced from technical roles. Admin/superadmin restrictions are represented in mock UI logic.

### Technisch beheer

Status: implemented for SuperAdmin-only access.

The sidebar item is visible only for SuperAdmin. It contains Design and Tabellen subpages.

### Design

Status: implemented, mock-only.

SuperAdmin can select logo, favicon, and login background. Selected previews are stored in local React state and reused in the sidebar branding. No file persistence exists.

### Tabellen

Status: implemented, mock-only.

Currently includes Rollen table:

- Vertegenwoordiger.
- Verkoopsleider.
- Service Operator.
- Admin.
- SuperAdmin.

### Synchronisatie

Status: partially implemented.

Sync screen and bottom bar show mock sync status. Shared sync action currently sets pending records to `0` and updates the last sync timestamp. No offline sync engine exists.

### Kasblad

Status: partially implemented, mock-only.

Cash sheet shows lines, total amount, deposit action in the Kasblad screen, and Monday blocking concept. Mijn Informatie also shows cash sheet summary and a Cash Storten placeholder action. Real cash deposit workflow is not implemented.

## 3. Current Design Decisions

- Font: Roboto is loaded globally through `next/font/google`.
- Brand color: `#003B83` is the primary brand color for topbar, sidebar header, active states, primary buttons, action cards, and important accents.
- Icons: lucide-react is the standard icon set.
- Sidebar: collapsible left sidebar, expanded width around 16rem, collapsed width around 4.75rem.
- Sidebar branding:
  - Expanded: uploaded logo if available, fallback `M`.
  - Collapsed: uploaded favicon if available, fallback `M`.
  - Collapsed logo/fallback acts as expand trigger.
- Sidebar behavior: fixed on desktop; content scrolls independently.
- Layout: application shell with fixed sidebar, sticky topbar in content area, and fixed bottom status bar.
- UI pattern: card-based enterprise/SaaS design.
- Responsiveness: tablet-first spacing, touch-friendly buttons, readable tables/cards.
- i18n: visible UI text should use translation keys in Dutch source with French/German placeholders or drafts.

## 4. Current User Model

The current user data exists in two forms:

- `MockUser` for login/session scenario.
- `ManagedUser` for user management forms/lists.

### MockUser fields

- `id`
- `name`
- `role`
- `country`
- `establishmentNumber`
- `isActive`
- `timezone`
- `preferredLanguage`
- `teamId`
- `permissions`

### ManagedUser fields

Persoonszaken:

- `id`
- `firstName`
- `lastName`
- `email`
- `language`
- `mobile`
- `photo`
- `isActive`
- `establishmentNumber`

Team:

- `country`
- `team`
- `roleId`
- `isTeamSupervisor`

Permissions:

- `pst`
- `service`
- `reporting`
- `contracts`
- `training`
- `firefighting`
- `fireDetection`

Lead categories:

- `cardio`
- `training`
- `fireDetection`
- `firefighting`

Current role model:

- `representative`
- `sales_leader`
- `admin`
- `superadmin`

Technical table also contains a mock `service_operator` role for user management options, but no separate service role is active in the main RBAC model yet.

## 5. Current Roles

### Vertegenwoordiger

Visibility:

- Own dashboard.
- Own Mijn informatie.
- Own agenda.
- Appointment detail for own/mock selected appointments.
- Service information is visible read-only unless explicit edit permission exists.
- Cash sheet and sync screens.

Scope:

- One country.
- Own appointments and own data.

### Verkoopsleider

Visibility:

- Own info plus Mijn team overview.
- Team representatives in assigned mock team.
- Agenda/service/cash/sync mock screens.

Scope:

- One country.
- Self plus assigned team.

### Service Operator

Visibility:

- Exists in Technical Management > Tabellen > Rollen and user management role dropdown.
- Not yet implemented as a real app role in `Role`.

Scope:

- Not defined in live mock RBAC yet.

### Admin

Visibility:

- User management.
- Representatives and sales leaders within assigned country scope.
- Service edit permissions in admin scenario.

Scope:

- Assigned country/countries.
- Cannot create Admin or SuperAdmin users in intended rules.

### SuperAdmin

Visibility:

- All mock screens.
- Technisch beheer.
- Design settings.
- Technical tables.
- User management unrestricted.

Scope:

- All countries, teams, and users.

## 6. Current Business Rules

### Sales Agenda

Open vs Afgewerkt:

- Open list: planned and rescheduled appointments.
- Closed list: completed, no_time, customer_absent, cancelled.
- Closed appointments remain openable.

Openen:

- Opens the existing Appointment Detail view for the selected appointment.

Geen tijd:

- Sets status to `no_time`.
- Moves appointment from open list to Afgewerkte afspraken.
- Remains visible for reporting/audit in mock state.

Dupliceren:

- Opens a modal asking for a new time.
- Default new time is current time.
- Creates a new planned appointment in Nog uit te voeren afspraken.
- Original appointment becomes `completed` and moves to Afgewerkte afspraken.
- New appointment gets revenue reset to zero.

Closed revenue:

- Afgewerkte afspraken show compact revenue split:
  - Omzet op factuur.
  - Omzet op order.
- Open appointments do not show revenue block.

Date rule:

- Representative agenda currently shows today only as read-only text.
- No date picker for representatives.

### Kasblad

Cash deposit concept:

- Cash sheet represents cash collected by a representative.
- The app shows total amount to deposit and cash lines.
- Main Kasblad screen contains mock deposit action.
- Mijn Informatie contains `Cash Storten` placeholder action only.

Monday blocking concept:

- Representative can be blocked when cash sheet is open and previous unresolved/uncleared cash lines exist.
- Blocking screen prevents normal dashboard/agenda access until mock deposit/admin unblock/scenario unblock.
- Current mock checks cash sheet status and unresolved lines.

### Mijn Informatie

Mobile number change request:

- `Ander mobiel nummer melden` opens a mock modal.
- User can enter a new mobile number.
- `Melden` shows confirmation: `De aanpassing werd doorgestuurd.`
- No real storage, notification, admin/HR routing, or audit logging.

Synchronization action:

- `Synchroniseren` shares the same mock sync handler as the footer.
- It sets pending records to `0` and updates last sync timestamp.

Cash deposit placeholder:

- `Cash Storten` opens a modal: `Functie Cash-storting wordt later gebouwd.`
- No real deposit workflow exists yet.

## 7. Current Technical Management Structure

Technisch beheer:

- Visible only for SuperAdmin.
- Contains Design and Tabellen subnavigation.

Design:

- Logo upload/preview.
- Favicon upload/preview.
- Login background upload/preview.
- All uploads are local React state only.
- Logo/favicons are reused in sidebar branding.

Tabellen:

- Rollen table.
- Current role values:
  - Vertegenwoordiger.
  - Verkoopsleider.
  - Service Operator.
  - Admin.
  - SuperAdmin.

## 8. ToDo Summary

Current ToDo source: `/docs/ToDo.md`.

### High Priority

- Kasblad: functie bouwen voor Cash-storting.

Reason: cash handling is business critical and has blocking implications.

### Medium Priority

- Mijn Informatie: `Ander mobiel nummer melden` is currently mock-only. Later implement the real workflow to send the request to the responsible admin/HR/backoffice process, including storage, notification and audit logging.

Reason: it affects user master data and requires routing, persistence, notifications, and audit logging.

### Low Priority

- No explicit low-priority ToDo items currently exist.

## 9. Recommended Development Order

1. Sales Agenda refinement.
2. Appointment Detail.
3. Kasblad.
4. Service.
5. Voorraad.
6. Rapportering.
7. Offline architecture.
8. ERP integration.

Explanation:

- Sales Agenda should stay first because it is the representative's primary daily workspace and drives appointment status, duplication, customer/prospect access, and visit flow.
- Appointment Detail should follow because it is where customer/prospect data, contacts, service info, visit result, and history meet.
- Kasblad should be next because cash handling is business critical and affects workday blocking.
- Service should follow because representatives need service information during visits, and edit/read-only permission rules must be clarified.
- Voorraad should follow once visit/demo and cash flows are stable.
- Rapportering should be built after the key transactional mock flows exist, so reporting can be based on realistic data.
- Offline architecture should be designed before real backend/ERP implementation because offline-first is a core requirement, not an add-on.
- ERP integration should come after domain flows, sync rules, audit logging, and conflict policies are clear.

## 10. Known Limitations

Mock-only or missing functionality:

- Authentication is mock login only.
- No real backend.
- No real database.
- No real API layer.
- No real ERP integration.
- No Business Central integration.
- No Odoo integration.
- No offline sync engine.
- No local database.
- No sync queue or conflict engine.
- No real notifications.
- No real file upload persistence.
- No real logo/favicon/background storage.
- No real cash deposit workflow.
- No real mobile number workflow.
- No audit log persistence.
- No real role/permission enforcement beyond frontend mock logic.
- No server-side country scope enforcement.
- No persistent user management.
- No persistent appointments.
- No persistent cash sheet status.
- No reporting backend.
- French and German translation files are placeholders/drafts.
- Browser visual verification has been unreliable because browser automation has failed with a Windows sandbox startup error in previous attempts.

## 11. Architecture Snapshot

Frontend:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- lucide-react.
- Roboto via `next/font/google`.

State architecture:

- Central app-level mock state in `components/sales/SalesApp.tsx`.
- Internal state-based navigation via `AppView`.
- No real Next.js route structure beyond the root page.
- Mock appointment state held in React state.
- Mock design assets held in React state.
- Mock sync state held in React state.
- Mock user management state is local within user management component.

i18n:

- `lib/i18n.ts` loads dictionaries from:
  - `locales/nl.json`
  - `locales/fr.json`
  - `locales/de.json`
- Dutch is the source language.
- French and German currently contain placeholder/draft translations.

Component structure:

- `components/layout`: App shell, sidebar, topbar, bottom bar, login, navigation constants.
- `components/dashboard`: Dashboard.
- `components/my-info`: Mijn Informatie.
- `components/agenda`: Mijn agenda / sales agenda list and view.
- `components/appointment`: Appointment detail and actions.
- `components/team`: Mijn team.
- `components/cash-sheet`: Cash sheet and blocking screen.
- `components/service`: Service and service planning placeholders.
- `components/sync`: Sync status screen.
- `components/user-management`: Gebruikersbeheer.
- `components/technical`: Design settings and technical tables.
- `components/shared`: shared UI helpers and older icons.

Data structure:

- `data/salesMock.ts`: countries, scenarios, mock user creation, appointments, cash sheet.
- `data/teamMock.ts`: team representatives and appointment summaries.
- `data/userManagementMock.ts`: managed users.
- `data/technicalMock.ts`: technical roles.
- `types/sales.ts`: core app types.

## 12. Recommended First Prompt For Next Session

Use this exact prompt to resume:

```text
# Continue M.Ex.T. Sales App Development - Phase 2.4 Appointment Detail

Read all current project documentation first, especially:

* docs/NEXT-STEPS2.md
* docs/ToDo.md
* docs/NEXT_STEPS.md

Do not implement backend, database, real authentication, ERP integration, offline sync, or real persistence.

Continue with Phase 2.4 only.

Focus on Appointment Detail because Sales Agenda and Mijn Informatie are now in a good mock state.

Implement/refine:

1. Appointment Detail visual polish to match Dashboard, Mijn agenda, and Mijn informatie.
2. Clear sections for:
   * customer/prospect info
   * address
   * contact persons
   * service information
   * appointment status
   * visit result
   * appointment history
3. Add a mock visit result form/state:
   * result type
   * notes
   * commercial interest
   * next step
   * optional order interest
4. Save visit result to mock React state only.
5. Append visit result/status changes to appointment history.
6. Keep all visible text behind i18n keys.
7. Keep current component structure and visual design:
   * Roboto
   * #003B83
   * lucide-react
   * card-based layout
   * tablet-friendly UI

Do not add:

* backend
* database
* real auth
* ERP
* offline sync
* real notifications
* real persistence

Run:

* npm run typecheck
* npm run build

After completion provide:

1. changed files
2. Appointment Detail improvements
3. mock visit result behavior
4. history behavior
5. mock-only limitations
6. verification results
```
