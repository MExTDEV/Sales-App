# M.Ex.T. Sales App - NEXT-STEP3

Last updated: 2026-05-30

This document captures the current project state after the latest functional mock phases. It is intended as a handover file so development can continue without re-explaining the application.

## 1. Current Project Status

The application is now a mature frontend-only mock of the M.Ex.T. Sales App. It runs on Next.js, TypeScript and Tailwind CSS, uses Roboto, `#003B83` as primary brand color, lucide-react icons, local React state, mock data and i18n JSON files.

Implemented areas:

- App shell with fixed collapsible sidebar, topbar and bottom status/sync bar.
- Mock login/scenario selection with role, country, timezone and language.
- Dashboard, Mijn informatie, Mijn team, Mijn agenda and afspraakfiche.
- Functional mock afspraakfiche tabs: Bezoekfiche, Contactfiche, Offertes, Opmerkingen, Verkoophistoriek, Documenten, Referenties, Leads and Vervolgafspraak.
- Kasblad functional mock with cash deposit reporting.
- Voorraad functional mock with stock detail and transfer request flow.
- Rapportering functional mock with period KPIs and charts.
- Service Planning, Interventies and Werkbonnen functional mocks.
- Technisch beheer with Design and Tabellen.
- Gebruikersbeheer list/create/edit mock flow.

Not implemented:

- Real backend.
- Real database.
- Real authentication.
- ERP integration.
- Offline sync.
- Real file uploads.
- Real stock mutation.
- Real signature capture.
- Persistent storage.

## 2. Recent Completed Phases

### Phase 2.4 - Contactfiche

The Contactfiche tab was made functional with mock editing for:

- Identiteit.
- Contacten.
- Adressen.
- Boekhoudkundig.
- Commercieel.

Rules:

- No hard deletes.
- Contactpersonen and addresses can be set inactive.
- Contactpersoon communication preferences are now boolean checks:
  - Callcenter (Afspraak zetten)
  - Verzendnota
  - Facturatie
  - Aanmaningen
  - Marketing

### Phase 2.5 - Opmerkingen and Vervolgafspraak

Implemented:

- Add internal remarks.
- Historical remark list, newest first.
- Plan a follow-up appointment in mock state.
- Follow-up appointment list below the form.

### Phase 2.6 - Offertes, Verkoophistoriek and Documenten

Implemented:

- Offertes table with search and mock Openen action.
- Verkoophistoriek subtabs Per document and Per artikel.
- KPI cards for sales history.
- Document list with Openen and Downloaden mock actions.

### Phase 2.7 - Referenties

Implemented:

- Add reference form.
- Validation on Naam onderneming.
- Reference list.
- Edit and delete mock flows.

### Phase 2.8 - Kasblad

Implemented:

- Kasblad overview with representative, week, status and total amount.
- Cash sheet detail lines.
- Cash Storten modal.
- Deposit reported local state.
- Monday blocking warning card.
- Dashboard Kasblad tile now uses the actual mock cash sheet amount instead of fixed `€ 0`.

### Phase 3.0 - Voorraad

Implemented:

- Voorraad module with representative stock.
- Filters by article number, description, category and status.
- Stock status badges.
- Stock detail modal.
- Transfer request modal.
- Mijn transferaanvragen overview.

### Phase 3.1 - Rapportering

Implemented:

- Reporting module for day/week/month.
- Metrics:
  - Aantal facturen
  - Omzet facturen
  - Aantal creditnota's
  - Omzet creditnota's
  - Totaal omzet
  - Gemiddelde factuurwaarde
- Turnover trend chart.
- Facturen vs creditnota's breakdown chart.
- Detail table per period/day.

### Phase 3.2 - Service Planning and Interventies

Implemented:

- Service submenu structure.
- Planning functional mock.
- Interventies functional mock.
- Intervention detail modal.
- Werkbon button in intervention detail with mock message.
- Read-only behavior for representatives.
- Placeholder edit buttons for users with `EditService`.

After feedback, Service Planning was changed from card layout to an Outlook-style calendar:

- Dag view.
- Week view.
- Maand view.
- Vandaag button.
- Previous/next navigation per day/week/month.
- Days outside the active month are visually lighter in month view.

### Phase 3.3 - Werkbonnen

Implemented:

- Werkbonnen overview with filters.
- Werkbon detail modal.
- Algemene gegevens.
- Werkomschrijving.
- Interne opmerkingen.
- Uitgevoerde werken add/delete mock flow.
- Gebruikte materialen add/delete mock flow.
- Foto's mock section.
- Klantopmerking textarea.
- Handtekening placeholder with register/delete actions.
- Werkbon afsluiten confirmation flow.

## 3. Current Navigation

Main sidebar:

- Dashboard
- Mijn informatie
- Mijn voorbereiding
- Mijn team
- Mijn agenda
- Service
  - Planning
  - Interventies
  - Werkbonnen
  - Onderhoud
  - Contracten
  - Assets
- Voorraad
  - Artikelvoorraad
- Rapportering
- Synchronisatie
- Gebruikersbeheer
- Technisch beheer, SuperAdmin only
  - Design
  - Tabellen

## 4. Current Role and Permission Model

Roles:

- representative
- sales_leader
- admin
- superadmin

Current behavior:

- Representatives see own agenda/data and service information read-only.
- Sales leaders see team-oriented mock views.
- Admins can access management views within mock scope.
- Superadmins see technical management.
- Service edit capability is represented through `EditService`.
- Service Operator exists as a technical role value in Tabellen but is not yet a real app role in the global role union.

Important next decision:

- Decide whether `Service Operator` should become a true authenticated role in `Role`, or remain a permission-driven role label.

## 5. Current Business Rules

### Appointment Workflow

- Open appointments are in `Nog uit te voeren afspraken`.
- Closed appointments are in `Afgewerkte afspraken`.
- Geen tijd moves appointment to closed as `no_time`.
- Dupliceren creates a new appointment and closes the original.
- Afspraak afsluiten opens a modal and sets appointment to completed.
- Closed appointments remain openable.

### Leads

- Leads live in the afspraakfiche.
- Leadtypes come from Technisch beheer > Tabellen.
- One lead per leadtype per appointment.
- Lead table is compact and no longer shows LeadID, Interesse, Telefoonnummer, Mobielnummer, E-mailadres or Leaddatum, but these fields remain in create/edit forms.

### Contactfiche

- Representatives can mock edit customer/prospect/contact/address data.
- No hard deletes.
- Inactive flags are used.
- Exact ERP field ownership still needs refinement.

### Kasblad

- Cash sheet shows cash lines and total amount to deposit.
- Cash Storten reports deposit locally.
- Monday blocking is still visual/mock.
- Real date/user/cash status logic is still pending.

### Voorraad

- Representative stock is visible.
- Transfer request UI is mock-only.
- Sales wizard is not yet connected to stock.
- No stock mutations occur.

### Rapportering

- Uses mock turnover data.
- Total omzet = omzet facturen - omzet creditnota's.
- Representative selector only appears for sales leader/admin/superadmin.

### Service

- Sales Agenda and Service Planning remain separate.
- Service Planning uses Outlook-style calendar.
- Interventies can be opened to read-only detail.
- Werkbonnen are functional mock only.
- Representatives are read-only.
- EditService users see edit-related UI, but real editing is not implemented.

## 6. Current Technical Snapshot

Stack:

- Next.js
- TypeScript
- Tailwind CSS
- Roboto via `next/font/google`
- lucide-react
- Local React state
- JSON i18n files in `locales/`

Main project folders:

- `components/appointment`
- `components/agenda`
- `components/cash-sheet`
- `components/dashboard`
- `components/layout`
- `components/my-info`
- `components/reports`
- `components/service`
- `components/stock`
- `components/team`
- `components/technical`
- `components/user-management`
- `data`
- `docs`
- `locales`
- `types`

Important files recently touched:

- `components/service/ServicePlanningView.tsx`
- `components/stock/StockView.tsx`
- `components/reports/ReportsView.tsx`
- `components/cash-sheet/CashSheetView.tsx`
- `components/appointment/AppointmentDetailView.tsx`
- `components/sales/SalesApp.tsx`
- `types/sales.ts`
- `docs/ToDo.md`

## 7. Known Limitations

Everything below is still mock-only:

- Authentication.
- Authorization enforcement.
- Backend APIs.
- Database schema and persistence.
- ERP integration.
- Offline sync.
- Audit logging.
- Notifications.
- File uploads.
- Document downloads.
- Signature capture.
- Stock mutations.
- Service status updates.
- Cash clearing and finance/admin unblock flow.
- Real reporting data and exports.

## 8. ToDo Summary

High priority:

- Offline sync architecture and implementation.
- ERP adapter/API layer.
- Appointment status sync and audit logging.
- Cash sheet real deposit, clearing and Monday blocking.
- Werkbonnen sync, offline execution and ERP integration.
- Stock mutation rules for sales and work orders.

Medium priority:

- Service operators and refined service permissions.
- Work order links to interventions, assets and voorraad.
- Lead follow-up, notifications and ERP sync.
- Contactfiche real storage and validation.
- Rapportering from ERP and rights-based filters.
- Document storage and downloads.

Lower priority:

- Excel/PDF export for reporting.
- Polished empty states for every module.
- More realistic mock scenarios per role/country.
- Final French and German translations.

## 9. Recommended Development Order

1. Finish Service Werkbon polish and workflow completeness.
2. Implement Onderhoud module placeholder-to-functional mock.
3. Implement Contracten and Assets read-only mock screens.
4. Connect Service Planning, Interventies and Werkbonnen more tightly in mock state.
5. Add a real mock data layer file for service/stock/reporting instead of inline component data.
6. Prepare backend architecture and API contracts.
7. Prepare offline sync local database model.
8. Start ERP adapter design.

Reasoning:

The Service workflow is now the largest area with multiple connected concepts. Finishing its mock state and data boundaries before backend/offline work will reduce rework later.

## 10. Recommended First Prompt For Next Session

```text
# Phase 3.4 - Service Onderhoud, Contracten and Assets Mock Screens

Continue Phase 3.4 only.

Read the current documentation and current Service implementation first.

Build functional mock screens for:

- Service > Onderhoud
- Service > Contracten
- Service > Assets

No backend, database, ERP integration, offline sync or real persistence yet.
Use mock data only.

Requirements:

- Keep Sales Agenda and Service Planning separated.
- Use current design system: Roboto, #003B83, lucide-react, polished cards, tablet-friendly layout.
- Representatives may view service data read-only.
- Users with EditService may see placeholder edit buttons only.
- Add filters/search where useful.
- Add detail modal for each module.
- Update i18n keys in Dutch, French and German placeholder files.
- Update /docs/ToDo.md with real backend/ERP/offline follow-ups.

Run:

- npm run typecheck
- npm run build

After completion provide changed files, implemented behavior, mock-only limitations and verification results.
```
