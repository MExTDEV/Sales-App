# M.Ex.T. Sales App - Architecture Review

Datum review: 2026-05-31

Scope: volledige projectdocumentatie, huidige bronstructuur, mock state, navigatie, i18n, service/sales modules, offline-first voorbereiding, ERP-readiness en technische schuld.

Deze review wijzigt geen applicatiecode. Het doel is richting geven voor de volgende ontwikkelfase voordat backend, database, ERP-integratie en offline sync worden gebouwd.

## 1. Executive summary

De M.Ex.T. Sales App is momenteel een sterk mock-first prototype. De applicatie is waardevol voor procesvalidatie, UX-validatie en domeinverkenning. De salesflow, afspraakfiche, serviceplanning, werkbonnen, assets, contracten, onderhoud, voorraad, rapportering, kasblad en gebruikersbeheer zijn voldoende uitgewerkt om met gebruikers te testen.

De architectuur is nog niet klaar voor productie. De grootste kloof zit niet in de UI, maar in de overgang van lokale component-state naar een centraal domeinmodel met backend, offline database, sync queue, audit logging, permissions en ERP-adapters.

Belangrijkste conclusie: start niet meteen met backend-implementatie per scherm. Doe eerst een architectuur-cleanup waarin domeintypes, mock data, service module structuur, permissions en sync boundaries worden gecentraliseerd.

## 2. Current module inventory

| Module | Status | Belangrijkste files | Architecturale beoordeling |
| --- | --- | --- | --- |
| App shell | Functioneel mock | `components/layout/*`, `components/sales/SalesApp.tsx` | Goede basis met vaste sidebar, topbar, bottombar en interne state-router. Routing zit nog volledig in `SalesApp`. |
| Dashboard | Functioneel mock | `components/dashboard/DashboardView.tsx` | Visueel volwassen. Leest cash sheet en afspraken uit gedeelde mock props. |
| Mijn informatie | Functioneel mock | `components/my-info/MyInfoView.tsx` | Read-only profiel met enkele mock acties. Goede UX, maar workflow voor mobiel nummer/cash storten is nog lokaal. |
| Mijn voorbereiding | Functioneel mock | `components/preparation/MyPreparationView.tsx` | Bruikbaar als voorbereidingslijst en koppelt naar afspraakfiche. |
| Mijn agenda | Functioneel mock | `components/agenda/*` | Prima open/closed workflow met dupliceren, geen tijd en revenue bij afgewerkte afspraken. |
| Afspraakfiche | Functioneel mock, te groot | `components/appointment/AppointmentDetailView.tsx` | Rijkste salescomponent. Bevat veel lokale subtypes en state. Moet later opgesplitst worden. |
| Sales wizard | Basis mock | `components/appointment/SalesWizard.tsx` | Mock verkoopregistratie, nog niet gekoppeld aan voorraad/ERP/sync. |
| Mijn team | Functioneel mock | `components/team/MyTeamView.tsx`, `data/teamMock.ts` | Goed voor sales leader/admin scope demo. Scope is UI/mock, niet afdwingend. |
| Gebruikersbeheer | Functioneel mock | `components/user-management/UserManagementView.tsx`, `data/userManagementMock.ts` | Lijst/create/edit/search/active state werkt mock-only. Rolmodel deels los van `Role`. |
| Technisch beheer | Functioneel mock | `components/technical/*`, `data/technicalMock.ts` | Superadmin-only menu en referentietabellen. Tabellendata is nog niet persistent. |
| Kasblad | Functioneel mock | `components/cash-sheet/*`, `data/salesMock.ts` | Cash storten en blokkade visueel aanwezig. Echte maandagregel, clearing en audit ontbreken. |
| Voorraad | Functioneel mock | `components/stock/StockView.tsx` | Stock consultatie en transferaanvraag mock. Nog niet gekoppeld aan sales/werkbon materialen. |
| Rapportering | Functioneel mock | `components/reports/ReportsView.tsx` | KPI's en charts mock. Nog geen ERP/reporting line-source. |
| Service Planning | Functioneel mock | `components/service/ServicePlanningView.tsx` | Outlook-achtige dag/week/maand planning. Data lokaal in grote servicefile. |
| Interventies | Functioneel mock | `components/service/ServicePlanningView.tsx` | Lijst/detail mock. Relatie naar werkbon is visueel, niet centraal afgedwongen. |
| Werkbonnen | Functioneel mock | `components/service/ServicePlanningView.tsx` | Sterke workflow mock. Groot risico door lokale types/state en ontbreken stock/audit/sync boundary. |
| Assets | Functioneel mock | `components/service/ServicePlanningView.tsx` | Breed opgezet, niet AED-only. Goede richting voor asset-contract-werkbon relatie. |
| Contracten | Read-only mock | `components/service/ServicePlanningView.tsx` | Goede contractlaag. Nog geen gedeeld relationship model. |
| Onderhoud | Functioneel mock | `components/service/ServicePlanningView.tsx` | Overzicht/detail/planning mock. Moet gekoppeld worden aan assetfrequenties en serviceplanning. |
| Synchronisatie | Placeholder/mock | `components/sync/SyncView.tsx` | UI bestaat, maar geen echte queue/conflict/error status. |

## 3. Current navigation review

De navigatie zit in `components/layout/navigation.ts`.

Huidige hoofdstructuur:

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

Sterk:

- De navigatie respecteert de beslissing om geen aparte klanten-, prospecten- of takenmodule te maken.
- Service Planning en Sales Agenda blijven gescheiden.
- Technisch beheer is als superadmin-only gemarkeerd.
- Sidebar iconen zijn gestandaardiseerd via `lucide-react`.

Aandachtspunten:

- `userManagement` staat zichtbaar in de hoofdmenuconfiguratie zonder expliciete `adminOnly` of permission metadata. De view zelf moet later server-side beschermd worden.
- Nested service items verwijzen naar grote exports uit een enkele servicefile.
- De app gebruikt state-based routing. Dat is prima voor mock, maar diepe links, browser back/forward, refresh-state en testbaarheid worden moeilijker.
- De footer/bottombar bevat nog een oudere `navItems` lijst met Dashboard, Agenda, Service, Kasblad en Sync. Controleer of deze nog gebruikt wordt of historisch is.

## 4. Current source architecture

Huidige structuur:

```text
app/
  layout.tsx
  page.tsx
components/
  agenda/
  appointment/
  cash-sheet/
  dashboard/
  layout/
  my-info/
  preparation/
  reports/
  sales/
  service/
  shared/
  stock/
  sync/
  team/
  technical/
  user-management/
data/
  salesMock.ts
  teamMock.ts
  technicalMock.ts
  userManagementMock.ts
lib/
  i18n.ts
locales/
  nl.json
  fr.json
  de.json
types/
  sales.ts
```

Sterk:

- Modulefolders bestaan al.
- `types/sales.ts` biedt een eerste centrale typebasis.
- `data/*Mock.ts` bestaat voor een deel van de mockdata.
- Roboto wordt globaal via `next/font/google` geladen in `app/layout.tsx`.
- `#003B83` is herkenbaar als primaire kleur.

Risico:

- `components/service/ServicePlanningView.tsx` is ongeveer 2078 regels en bevat planning, interventies, werkbonnen, assets, contracten en onderhoud plus mockdata en lokale types.
- `components/appointment/AppointmentDetailView.tsx` is ongeveer 2180 regels en bevat afspraakdetail, contactfiche, leads, offertes, verkoophistoriek, documenten, referenties, opmerkingen en vervolgafspraken.
- Veel domeintypes zitten lokaal in componentfiles en niet in `types/`.
- Veel mockdata zit direct in componentfiles in plaats van centrale mock/domain files.
- `SalesApp.tsx` is tegelijk login shell, router, state coordinator en workflow orchestrator.

## 5. Data model review

De documentatie bevat een breder datamodel dan de broncode momenteel heeft. Dat is normaal in deze fase, maar moet nu worden rechtgetrokken.

| Domein | Gedocumenteerd | In code aanwezig | Gap |
| --- | --- | --- | --- |
| User | Ja | `MockUser`, `ManagedUser` | Geen centrale auth identity, geen scopes als typed entity. |
| Role | Ja | `Role`, `TechnicalRole` | `service_operator` bestaat in technische tabel, maar niet in `Role`. |
| Permission | Ja | Kleine `Permission` union | Veel gedocumenteerde permissions ontbreken nog in type union. |
| Country | Ja | `CountryCode`, `Country` | Geen `CountryConfiguration`, VAT/payment configs in code. |
| Team | Ja | Mock team data | Geen centrale `Team` entity in types. |
| Customer/Prospect | Ja | Genest in `Appointment` | Geen centrale reusable entity; wijzigingen in contactfiche staan lokaal. |
| Address | Ja | Genest en lokale contactfiche types | Geen centrale inactive/audit metadata. |
| ContactPerson | Ja | Genest en lokale contactfiche types | Geen centrale contact entity of one-customer/prospect rule. |
| Appointment | Ja | `Appointment` | Goed voor mock; mist `startsAt`, `endsAt`, external refs, version, audit/sync metadata. |
| AppointmentHistory | Ja | Simpele `history` array | Geen typed event model of audit relatie. |
| VisitReport | Ja | Modal state in detail | Geen centrale entity. |
| DemoRegistration | Ja | Nog niet als centrale entity | Placeholder/flow nog niet databaar. |
| Lead | Nee/deels later toegevoegd | Lokale `LeadRecord` | Moet formeel in database docs worden toegevoegd. |
| Quote/Offer | Nog beperkt | Lokale quote records | Moet formeel als ERP-read-only/ERP-linked entity worden beschreven. |
| SalesDocument/SalesItem | Deels via Order/Invoice | Lokale sales history records | Product-level lines gedocumenteerd, maar UI gebruikt mock summaries. |
| CashSheet | Ja | `CashSheet`, `CashSheetLine` | Mist deposit fields, unblock log, blocked metadata in code. |
| Stock | Ja | Lokale stock types in component | Geen centrale `StockItem`, `StockMovement`, transfer request type in `types`. |
| Contract | Ja | Lokale `ServiceContract` | Mist typed relationship naar Asset/WorkOrder/Intervention in centrale types. |
| Asset | Ja | Lokale `ServiceAsset` | Goed conceptueel, maar niet centraal en geen external/version/sync metadata. |
| WorkOrder | Ja | Lokale `WorkOrder` | Workflow mock goed, maar material/signature/photo entities ontbreken centraal. |
| ServiceIntervention | Ja | Lokale `ServiceIntervention` | Nog los van WorkOrder/Asset in echte modelzin. |
| MaintenanceSchedule | Ja | Lokale `MaintenanceRecord` | Onderhoudsfrequenties bestaan technisch, maar planninglogica is mock. |
| SyncQueueItem | Ja | Niet geimplementeerd | Grootste offline gap. |
| SyncConflict | Ja | Niet geimplementeerd | Nodig voor offline-first. |
| AuditLog | Ja | Niet geimplementeerd | Nodig voor statuswijzigingen, cash, contactdata, werkbonnen. |
| IntegrationLog | Ja | Niet geimplementeerd | Nodig voor ERP adapters. |

Belangrijkste datamodeladvies:

- Maak een centrale `types/domain.ts` of split per domein: `types/sales.ts`, `types/service.ts`, `types/admin.ts`, `types/sync.ts`.
- Verplaats service mock data naar `data/serviceMock.ts`.
- Voeg formele entities toe voor `Lead`, `Reference`, `Quote`, `Document`, `WorkOrderMaterial`, `WorkOrderPhoto`, `WorkOrderSignature`, `MaintenanceRecord`, `StockTransferRequest`.
- Voeg vanaf nu standaard velden toe in mocktypes waar backend/offline later op rekent: `id`, `createdAt`, `updatedAt`, `version`, `syncStatus`, `externalSystem`, `externalId`.

## 6. Relationship review

De gedocumenteerde relatieketen is correct:

```text
Customer
  -> Contract
  -> Asset
  -> Maintenance
  -> Intervention
  -> WorkOrder
```

In de UI is deze relatie zichtbaar, maar in code nog niet centraal afdwingbaar. Voorbeeld: contracten hebben assetNumbers, assets hebben linkedContract, werkbonnen hebben een optioneel asset object, onderhoud heeft assetNumber en contractNumber. Dat toont de relatie, maar er is geen centrale bron van waarheid.

Risico's:

- Een asset kan in contract, onderhoud en werkbon verschillende namen/statussen krijgen.
- Werkbon afsluiten kan later moeilijk automatisch asset history, stock movement, audit log en sync queue bijwerken als alle data lokaal per component zit.
- Navigatie naar "Open Asset", "Open Werkbon" en "Open Interventie" is soms nog message/mock in plaats van gedeelde selected entity state.

Aanbevolen:

- Introduceer centrale IDs en relationele mockdata:
  - `customerId`
  - `contractId`
  - `assetId`
  - `maintenanceId`
  - `interventionId`
  - `workOrderId`
- Gebruik selectors/helpers om schermdata op te bouwen in plaats van duplicatie in elk scherm.

## 7. Permission review

Gedocumenteerd model:

- RBAC
- Scope Based Visibility
- Explicit Permissions

Huidige code:

- `MockUser.role` ondersteunt `representative`, `sales_leader`, `admin`, `superadmin`.
- `TechnicalRole` bevat ook `service_operator`.
- `Permission` union is beperkt tot enkele service/appointment/cash permissions.
- `technicalRoles` bevat beschermde rollen voor admin.
- Superadmin-only Technisch beheer zit in navigatie metadata.
- Service read/edit wordt deels zichtbaar gemaakt via permissions.

Gaps:

- `service_operator` is wel een technische rolwaarde, maar niet bruikbaar als echte `Role`.
- Gedocumenteerde permissions zoals `ViewOwnStock`, `ManageStock`, `ViewOwnReports`, `ViewCountryReports`, `ViewMaintenance`, `EditMaintenance`, `ViewServicePlanning`, `AssignServiceWork`, `ViewUsers`, `CreateRepresentative`, enz. ontbreken in de centrale union.
- Permission checks zijn verspreid of impliciet en niet gecentraliseerd in een `PermissionService`.
- Scope checks zijn mock-only en niet consistent als herbruikbare helper.
- UI hiding bestaat, maar er is geen server-side enforcement omdat er nog geen backend is.

Aanbevolen:

- Maak `lib/permissions.ts` met helpers:
  - `canView(user, view)`
  - `canEditService(user)`
  - `canManageUser(currentUser, targetUser)`
  - `getVisibleCountryScope(user)`
  - `getVisibleTeamScope(user)`
- Breid de `Permission` union uit tot wat in `PERMISSIONS.md` staat.
- Beslis of `Service Operator` een echte role wordt of alleen technische businessfunctie. De documentatie zei eerder "geen extra service roles", maar latere UI bevat `Service Operator`. Dat is een formele architectuurbeslissing nodig.

## 8. Offline-first review

De documentatie is duidelijk: offline-first is core, geen online-first + cache. De huidige app is echter nog pure React state/mockdata.

Goede voorbereiding:

- Sync UI bestaat als schermconcept.
- Statusbalk toont last sync en pending records.
- Veel workflows zijn al lokaal uitvoerbaar: afspraken, werkbonnen, kasblad, voorraadtransfer, contactfiche, opmerkingen.
- Statuswijzigingen en lokale acties zijn UX-matig getest.

Gaps:

- Geen local database.
- Geen sync queue.
- Geen conflictdetectie.
- Geen retry/error handling.
- Geen offline mutation log.
- Geen audit log.
- Geen entity versioning.
- Geen per-domain conflict policy in code.
- Geen onderscheid tussen local-only ID en server/ERP external ID.

Hoogste offline-risico's:

- Appointment closing, no_time, duplicate en follow-up creation moeten queueable worden.
- Werkbon afsluiten moet meerdere atomische mutaties veroorzaken: performed work, materials, photos, signatures, service controls, status, stock movements, audit.
- Cash sheet deposit reporting en Monday blocking mogen niet inconsistent worden door offline state.
- Stock movements moeten append-only of conflict-safe ontworpen worden.

Aanbevolen offline boundary:

```text
UI action
  -> domain command
  -> local transaction
  -> outbox/sync queue item
  -> optimistic UI
  -> backend sync
  -> ERP adapter job
  -> conflict/audit/integration logs
```

## 9. Sync review

De sync-documentatie is goed, maar de implementatie is nog placeholder.

Nodige sync entities:

- `SyncQueueItem`
- `SyncConflict`
- `SyncError`
- `SyncStatus`
- `AuditLog`
- `IntegrationLog`

Nodige sync screens:

- Queue overzicht.
- Conflicts overzicht.
- Error/retry overzicht.
- Domain-specific conflict review voor klanten/contacten/cash/stock/werkbonnen.

Aanbevolen prioriteit:

1. Definieer sync metadata op alle mutabele entities.
2. Maak mock `SyncQueueItem` data en laat bestaande acties queue-items produceren.
3. Bouw pas daarna IndexedDB/local database.
4. Bouw daarna backend sync endpoints.

## 10. ERP readiness review

Documentatiebeslissing: nooit rechtstreeks tegen Business Central/Odoo UI bouwen; altijd via API/adapters.

Huidige app is ERP-neutraal, wat goed is. Maar ERP-readiness vraagt extra mapping.

| Domein | ERP impact | Risico |
| --- | --- | --- |
| Appointments | Import/export status, notes, visit result | Status mapping en conflict ownership. |
| Customers/prospects | Master data updates | Field-level ownership nodig. |
| Contacts/addresses | Inactive flags, edits | Duplicate detection en validation nodig. |
| Leads | Leadtypes en follow-up | Nog geen formele backend entity. |
| Quotes/offers | ERP source of truth | UI mag read-only of adapter-driven openen. |
| Orders/invoices | Product-level reporting | Lines verplicht, niet alleen totals. |
| Cash sheet | Financially sensitive | Manual review conflict policy nodig. |
| Stock | Mutations and transfer requests | Append-only stock movements aanbevolen. |
| Work orders | Service execution | Complex: materials, signatures, photos, checks, status. |
| Assets/contracts/maintenance | Service master data | Contract/asset ownership moet ERP-policy krijgen. |

Aanbevolen:

- Maak een `docs/ERP_MAPPING.md` voor Business Central/Odoo mapping per entity.
- Definieer per veld: app-owned, ERP-owned, shared/manual-review.
- Gebruik `externalSystem`, `externalId`, `externalUpdatedAt` vanaf de mock/domain types.

## 11. UI consistency review

Sterk:

- Roboto is correct globaal geladen.
- Brandkleur `#003B83` is consistent zichtbaar.
- lucide-react is standaard iconset.
- Sidebar is collapsible, fixed en professioneel.
- Card-based UI is coherent.
- Tabellen zijn compact en tabletgericht.

Aandachtspunten:

- Sommige grote modules bevatten veel inline Tailwind. Voor design consistency kan een kleine componentlaag groeien:
  - `SectionCard`
  - `InfoGrid`
  - `DataTable`
  - `Toolbar`
  - `Modal`
  - `ActionCard`
  - `KpiCard`
- `components/shared/ui.tsx` bestaat, maar niet alle schermen gebruiken dezelfde abstrahering.
- Grote componenten maken visuele regressies waarschijnlijker omdat layout en business mock state gemengd staan.

## 12. i18n review

Huidige stand:

- `locales/nl.json`, `locales/fr.json`, `locales/de.json` bestaan.
- Alle drie hebben dezelfde keyset.
- `nl.json` bevat 896 keys.
- `translate()` valt terug op Nederlands en daarna de key.

Sterk:

- De key coverage tussen talen is consistent.
- Dutch-as-source werkt.
- Fallback naar key maakt ontbrekende vertalingen zichtbaar.

Risico's:

- De vertalingen zitten in vlakke JSON-bestanden. Dat is nu ok, maar bij groei kan beheer moeilijk worden.
- FR/DE zijn placeholders/drafts en mogen niet als productievertaling worden beschouwd.
- Mockdata bevat bewust Nederlandstalige waarden. Voor controlled labels/statussen moet later gecontroleerd worden dat ze via keys lopen.
- `html lang="nl-BE"` is statisch. Later moet dit dynamisch of login/preferred-language-aware worden.

Aanbevolen:

- Houd vlakke keys voorlopig, maar groepeer met prefixes.
- Voeg i18n key lint/check toe voor ontbrekende keys.
- Voeg locale-aware formatters toe voor datum, tijd, valuta en percentages.

## 13. Technical debt review

Top technische schuld:

1. `ServicePlanningView.tsx` bevat te veel modules, types en mockdata.
2. `AppointmentDetailView.tsx` bevat te veel tablogica, subtypes en lokale workflows.
3. `SalesApp.tsx` is router, auth mock, permission context, domain state en workflow coordinator tegelijk.
4. Domeintypes zijn onvolledig en deels lokaal.
5. Mockdata is verspreid over datafiles en componentfiles.
6. Permission model in docs is groter dan de code.
7. `service_operator` is niet opgelost als rol versus technische tabelwaarde.
8. Offline/sync metadata ontbreekt in types.
9. ERP external references ontbreken in de meeste code types.
10. Geen testlaag voor kritieke statusflows.

## 14. Risk matrix

| Risico | Kans | Impact | Prioriteit | Aanpak |
| --- | --- | --- | --- | --- |
| Service module blijft monolithisch | Hoog | Hoog | P1 | Split per submodule en verplaats mockdata. |
| Offline-first wordt te laat ontworpen | Hoog | Zeer hoog | P1 | Eerst domain commands, local DB model en sync queue ontwerpen. |
| Permissions worden alleen UI-hiding | Hoog | Hoog | P1 | Centrale PermissionService en server-side design. |
| ERP ownership per veld blijft vaag | Middel | Zeer hoog | P1 | Maak ERP mapping en conflict policies per domein. |
| Werkbon afsluiten veroorzaakt inconsistente data | Hoog | Hoog | P1 | Definieer work order close transaction en audit/sync side effects. |
| Stockmutaties raken verkoop en service inconsistent | Middel | Hoog | P1 | Introduceer append-only StockMovement model. |
| Cash sheet blocking faalt door timezone/offline | Middel | Hoog | P1 | Country timezone + backend/local validation ontwerpen. |
| Contact/customer edits conflicteren met ERP | Hoog | Hoog | P1 | Field-level edit rules voor ERP integratie. |
| FR/DE placeholders blijven productie | Middel | Middel | P2 | Translation review workflow. |
| Geen route/deeplink structuur | Middel | Middel | P2 | Later Next.js routes of typed internal router introduceren. |

## 15. Top 10 cleanup tasks

1. Split `components/service/ServicePlanningView.tsx` in aparte modules voor planning, interventies, werkbonnen, assets, contracten en onderhoud.
2. Verplaats alle service mockdata naar `data/serviceMock.ts`.
3. Maak `types/service.ts` met centrale service domain types.
4. Split `components/appointment/AppointmentDetailView.tsx` per tab/subtab.
5. Maak `types/appointment.ts` of breid centrale domain types uit met leads, contactfiche, references, quotes, documents en follow-ups.
6. Maak `lib/permissions.ts` en vervang losse permission checks door herbruikbare helpers.
7. Breid `Permission` en role model uit zodat code en `PERMISSIONS.md` overeenkomen.
8. Voeg sync metadata toe aan mock/domain entities: `version`, `syncStatus`, `externalSystem`, `externalId`, `externalUpdatedAt`.
9. Voeg een eerste mock `SyncQueueItem` productie toe bij afspraakstatus, werkbon afsluiten, cash storten en contactfiche save.
10. Maak `docs/ERP_MAPPING.md` met veldownership en adaptermapping per domein.

## 16. Recommended roadmap

### Phase 4.1 - Architecture cleanup before backend

Doel: geen nieuwe features, alleen maintainability en domain readiness.

- Split service monolith.
- Split appointment detail monolith.
- Centraliseer service/sales mockdata.
- Centraliseer domain types.
- Introduceer permission helpers.
- Houd alle bestaande UI en workflows intact.

### Phase 4.2 - Domain command layer mock

Doel: UI acties niet langer rechtstreeks state laten muteren.

- Commands zoals `closeAppointment`, `duplicateAppointment`, `reportCashDeposit`, `closeWorkOrder`, `saveContactData`.
- Elke command retourneert updated state plus audit/sync intent.

### Phase 4.3 - Offline-first foundation mock

Doel: sync queue concept werkend maken zonder echte backend.

- Mock queue.
- Mock conflicts.
- Sync status scherm uitbreiden.
- Queue-items laten ontstaan vanuit echte UI acties.

### Phase 4.4 - Backend/API design

Doel: API contracts en database schema ontwerpen voor productie.

- Prisma/PostgreSQL schema.
- Auth/session model.
- Permission enforcement.
- Audit logging.
- Sync endpoints.

### Phase 4.5 - ERP mapping/adapters

Doel: Business Central/Odoo adapter contracts voorbereiden.

- Entity mapping.
- Field ownership.
- Integration logs.
- Retry and conflict handling.

## 17. Recommended next phase

Aanbevolen volgende fase: **Phase 4.1 - Architecture Cleanup and Domain Model Stabilization**.

Waarom:

- De app heeft nu voldoende functionele mockdekking.
- Nieuwe features toevoegen verhoogt vooral technische schuld.
- Backend/offline bouwen op de huidige componentstructuur zou leiden tot veel herwerk.
- Service en appointment detail zijn de twee grootste risicopunten.
- Een cleanup kan gedrag behouden terwijl de code klaar wordt gemaakt voor echte data.

## 18. Exact next Codex prompt

```text
Continue Phase 4.1 only.

Do not add new features.
Do not change visual design or business behavior.
Do not add backend, database, ERP integration, offline sync or real persistence.

Goal:
Refactor the current mock application architecture so it is maintainable and ready for backend/offline work.

Tasks:
1. Split components/service/ServicePlanningView.tsx into smaller files:
   - components/service/planning/
   - components/service/interventions/
   - components/service/work-orders/
   - components/service/assets/
   - components/service/contracts/
   - components/service/maintenance/
2. Move service mock data into data/serviceMock.ts.
3. Move service-specific local types into types/service.ts.
4. Keep all existing Service Planning, Interventies, Werkbonnen, Assets, Contracten and Onderhoud behavior working.
5. Do not change UI layout except where required by the refactor.
6. Preserve i18n keys and current navigation.
7. Run npm run typecheck and npm run build.

After completion provide:
1. changed files
2. what was refactored
3. confirmation that behavior was preserved
4. verification results
5. recommended next cleanup phase
```

## 19. Verification notes

This review is based on:

- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/PERMISSIONS.md`
- `docs/OFFLINE_SYNC.md`
- `docs/LOCALIZATION.md`
- `docs/SCREENS.md`
- `docs/NEXT-STEPS4.md`
- `docs/ToDo.md`
- source structure under `app/`, `components/`, `data/`, `lib/`, `locales/`, `types/`

No application code was modified.
