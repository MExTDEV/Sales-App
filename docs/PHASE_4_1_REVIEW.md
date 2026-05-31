# Phase 4.1 Review - Architecture Cleanup and Domain Model Stabilization

Datum: 2026-05-31

Scope: cleanup en stabilisatie zonder nieuwe businessfunctionaliteit, backend, database, ERP-integratie, authenticatie, offline synchronisatie of persistence.

## Executive Summary

Phase 4.1 heeft de eerste centrale architectuurlaag toegevoegd zonder bestaand gedrag te wijzigen. De applicatie blijft een mock-first Next.js/TypeScript prototype, maar heeft nu een expliciete domain-structuur voor toekomstige backend, local persistence, offline sync en ERP-adapters.

Uitgevoerde veilige cleanup:

- Zichtbare Phase 1/1.1 verwijzingen vervangen door Phase 4.1.
- Centrale domain folder toegevoegd.
- Centrale statusdefinities toegevoegd.
- Centrale formatting utilities toegevoegd.
- Eerste formatter/status duplicatie vervangen in veilige, kleine componenten.
- Centrale mock-data facade toegevoegd via `mock-data/index.ts`.
- Login gebruikt nu de centrale mock-data facade.
- Architectuurbevindingen vastgelegd voor Phase 4.2.

Bewust niet gedaan:

- Geen grote component-splits van `ServicePlanningView.tsx` of `AppointmentDetailView.tsx`.
- Geen nieuwe businessflows.
- Geen echte database/offline/ERP-laag.
- Geen functionele redesigns.

## Domain Model Review

Nieuwe centrale structuur:

```text
domain/
  design/
  sales/
  service/
  shared/
  stock/
  sync/
  users/
  index.ts
```

Nieuwe centrale domeinen:

- User
- Role
- Team
- Country
- Appointment
- Customer
- Prospect
- Contact
- Address
- Lead
- LeadType
- Reference
- SalesDocument
- SalesDocumentLine
- Article
- StockItem
- StockMovement
- TransferRequest
- ServicePlanningItem
- ServiceIntervention
- WorkOrder
- WorkOrderMaterial
- ServiceControl
- Asset
- AssetType
- Contract
- ContractType
- Maintenance
- MaintenanceFrequency
- SyncQueueItem
- SyncConflict
- DesignSetting

De nieuwe types bevatten waar relevant velden voor toekomstige persistence, offline sync en ERP-mapping:

- `id`
- `createdAt`
- `updatedAt`
- `version`
- `syncStatus`
- `externalSystem`
- `externalId`
- `externalUpdatedAt`

Belangrijke opmerking: de bestaande componenten gebruiken nog deels oude lokale types. De canonical domain types zijn nu beschikbaar, maar volledige migratie hoort in Phase 4.2 of 4.3 om regressierisico te beperken.

## Type Consolidation

Toegevoegd:

- `domain/shared/types.ts`
- `domain/users/types.ts`
- `domain/sales/types.ts`
- `domain/stock/types.ts`
- `domain/service/types.ts`
- `domain/sync/types.ts`
- `domain/design/types.ts`

Eerste consolidatie:

- `StatusBadge` gebruikt nu centrale appointment status tone mapping uit `domain/shared/statuses.ts`.
- `ReportsView`, `DashboardView`, `AppointmentList` en `CashSheetView` gebruiken centrale formatting utilities waar veilig.

Nog te consolideren:

- Lokale service types in `components/service/ServicePlanningView.tsx`.
- Lokale appointment detail types in `components/appointment/AppointmentDetailView.tsx`.
- Lokale stock/reporting/team helper types.
- `Role` versus technische rolwaarde `service_operator`.

## Mock Data Consolidation

Toegevoegd:

```text
mock-data/index.ts
```

Deze file is een centrale facade over bestaande mock data:

- `data/salesMock.ts`
- `data/teamMock.ts`
- `data/technicalMock.ts`
- `data/userManagementMock.ts`

Aangepast:

- `components/sales/SalesApp.tsx` gebruikt nu `@/mock-data`.
- `components/layout/LoginPanel.tsx` gebruikt nu `@/mock-data`.

Nog niet volledig gecentraliseerd:

- Service mock data staat nog in `components/service/ServicePlanningView.tsx`.
- Appointment-detail mock records staan nog in `components/appointment/AppointmentDetailView.tsx`.
- Stock mock data staat nog in `components/stock/StockView.tsx`.
- Reports mock data staat nog in `components/reports/ReportsView.tsx`.

Aanbevolen Phase 4.2 cleanup:

- Maak `mock-data/service.ts`.
- Maak `mock-data/appointmentDetail.ts`.
- Maak `mock-data/stock.ts`.
- Maak `mock-data/reports.ts`.

## Status Model Review

Toegevoegd:

```text
domain/shared/statuses.ts
```

Centrale statusdefinities:

- Appointment canonical statuses:
  - `planned`
  - `in_progress`
  - `completed`
  - `cancelled`

- WorkOrder statuses:
  - `planned`
  - `on_the_way`
  - `in_progress`
  - `completed`
  - `cancelled`

- Asset statuses:
  - `active`
  - `inactive`
  - `maintenance_due`
  - `out_of_service`
  - `replaced`

- Contract statuses:
  - `active`
  - `expiring_soon`
  - `expired`
  - `cancelled`
  - `draft`

- Maintenance statuses:
  - `planned`
  - `due_soon`
  - `overdue`
  - `completed`
  - `cancelled`

Aandachtspunt:

De sales agenda gebruikt historisch ook:

- `no_time`
- `customer_absent`
- `rescheduled`

Deze zijn business-specifieke appointment substatussen en blijven voorlopig in `types/sales.ts`. In Phase 4.2 moet beslist worden of dit aparte `AppointmentClosureReason` wordt of onderdeel blijft van `AppointmentStatus`.

## Navigation Review

Huidige hoofdmenu:

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
- Rapportering
- Synchronisatie
- Gebruikersbeheer
- Technisch beheer
  - Design
  - Tabellen

Bevindingen:

- Sales Agenda en Service Planning blijven correct gescheiden.
- Geen aparte Customers/Prospects/Tasks modules, conform PDD.
- Technisch beheer is superadmin-only in navigatie.
- Service subnavigatie is correct zichtbaar als submenu.
- `userManagement` heeft nog geen expliciete route metadata voor admin/superadmin visibility; enforcement moet later via centrale permission helpers.
- De applicatie gebruikt nog state-based routing in `SalesApp.tsx`; echte Next.js routes zijn nog niet aanwezig.

Geen routewijzigingen uitgevoerd behalve import cleanup.

## Permission Review

Rollen in businessdocumentatie:

- Vertegenwoordiger
- Verkoopsleider
- Service Operator
- Admin
- SuperAdmin

Rollen in code:

- `representative`
- `sales_leader`
- `admin`
- `superadmin`

Technische tabel bevat ook:

- `service_operator`

Risico:

`service_operator` is momenteel een technische rolwaarde, maar geen echte auth role in `Role`. Dat is functioneel ok voor mock, maar moet vóór backend/auth worden beslist.

Aanbevolen:

- Kies in Phase 4.2 of `service_operator` een echte role wordt.
- Maak `lib/permissions.ts`.
- Voeg centrale helpers toe:
  - `canViewRoute`
  - `canManageUsers`
  - `canEditService`
  - `canCloseWorkOrder`
  - `canViewScopedData`
- Breid `Permission` union uit zodat die overeenkomt met `docs/PERMISSIONS.md`.

Geen nieuwe permission logic geïmplementeerd in Phase 4.1.

## Localization Review

Gecontroleerd:

- `locales/nl.json`
- `locales/fr.json`
- `locales/de.json`

Bevindingen:

- De drie locale files hebben een consistente keyset.
- Zichtbare Phase 1/1.1 tekst is vervangen door Phase 4.1.
- Login toont nu:
  - `M.Ex.T. Sales App`
  - `Phase 4.1 - Architecture Cleanup & Stabilization`
- `sync.mockNotice` verwijst nu naar Phase 4.1.
- `not-found` route verwijst nu naar Phase 4.1.

Nog te verbeteren:

- `app/layout.tsx` heeft statisch `html lang="nl-BE"`.
- FR/DE blijven placeholder/draft.
- Controlled mock statuslabels moeten later systematisch uit i18n/status dictionaries komen.

## Technical Debt Review

Belangrijkste technische schuld:

1. `components/service/ServicePlanningView.tsx` is nog te groot en bevat meerdere service modules.
2. `components/appointment/AppointmentDetailView.tsx` is nog te groot en bevat veel tab-specifieke types/state.
3. `components/sales/SalesApp.tsx` combineert interne router, login mock, state coordinator en domain workflows.
4. Mockdata staat nog deels in componentfiles.
5. Formatting helpers waren gedupliceerd; eerste veilige consolidatie is uitgevoerd.
6. Statusdefinities stonden verspreid; centrale statusfile is toegevoegd, maar volledige migratie moet nog gebeuren.
7. Permission model in documentatie is rijker dan de code.
8. Offline/sync metadata ontbreekt nog in bestaande runtime mock types.
9. ERP external references ontbreken nog in bestaande runtime mock records.
10. Grote componenten verhogen regressierisico bij elke volgende feature.

## Risks Before Offline-First

Niet starten met echte offline-first implementatie voordat:

- Domain commands bestaan voor belangrijke acties.
- Alle mutabele entities `version` en `syncStatus` kunnen dragen.
- Sync queue item types gekoppeld zijn aan echte UI acties.
- Appointment status changes, work order close, cash deposit, contactfiche save en stock movement transactioneel beschreven zijn.
- Conflicten per domein zijn gemodelleerd.

Hoogste risico's:

- Werkbon afsluiten raakt werk, materialen, controles, foto’s, handtekeningen, status, stock en audit tegelijk.
- Cash sheet Monday blocking heeft timezone, cash status en unblock rights nodig.
- Stockmutaties moeten append-only/conflict-safe worden.
- Contact/customer/prospect edits hebben ERP field ownership nodig.

## Risks Before ERP Integration

Niet starten met ERP-integratie voordat:

- `docs/ERP_MAPPING.md` bestaat.
- Per entity duidelijk is of de app, ERP of manual review eigenaar is.
- External references overal beschikbaar zijn.
- IntegrationLog en AuditLog types/flows bestaan.
- Product-level order/invoice lines centraal gemodelleerd zijn.
- Contract/asset/maintenance/workorder mapping met ERP is vastgelegd.

Hoogste risico's:

- ERP critical financial fields mogen niet overschreven worden door app state.
- Customer/contact wijzigingen kunnen dubbel of conflicterend zijn.
- Work order materialen moeten contract/invoice/order handling correct doorgeven.
- Stock en service assets kunnen inconsistent worden als ERP mapping te laat komt.

## Recommended Phase 4.2

Aanbevolen volgende fase: **Phase 4.2 - Service and Appointment Modularization**.

Waarom:

- De centrale domainlaag bestaat nu.
- De grootste resterende technische schuld zit in twee grote componenten.
- Backend/offline/ERP bouwen vóór deze splitsing veroorzaakt veel herwerk.

Aanbevolen prompt:

```text
Continue Phase 4.2 only.

Do not add new business functionality.
Do not change visual design or business behavior.
Do not add backend, database, ERP integration, offline sync, authentication or persistence.

Goal:
Split the largest modules into maintainable files and connect them to the new canonical domain structure where safe.

Tasks:
1. Split components/service/ServicePlanningView.tsx into:
   - components/service/planning/
   - components/service/interventions/
   - components/service/work-orders/
   - components/service/assets/
   - components/service/contracts/
   - components/service/maintenance/
2. Move service mock data to mock-data/service.ts.
3. Replace local service status/type definitions with domain/service and domain/shared status types where safe.
4. Preserve all existing UI and behavior.
5. Do not redesign.
6. Run npm run typecheck and npm run build.

After completion provide:
1. changed files
2. extracted modules
3. moved mock data
4. behavior preservation notes
5. verification results
6. recommended next cleanup phase
```

## Verification

Phase 4.1 verification:

- `npm run typecheck`: passed.
- `npm run build`: passed.
