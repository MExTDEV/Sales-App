# Phase 4.2 Refactor - Safe Modularization With Rollback Point

Datum: 2026-05-31

Scope: veilige refactor zonder nieuwe businessfunctionaliteit, visuele wijzigingen, backend, database, ERP-integratie, offline sync, authenticatie of persistence.

## Rollback point

Rollback document created before refactoring:

- `docs/PHASE_4_2_ROLLBACK.md`

Git branch creation was not possible because `git` is not available as a shell command in this environment. The rollback document records:

- known pre-refactor verification state
- intended touched files
- manual revert instructions
- rollback principle

## Files changed

### Documentation

- `docs/PHASE_4_2_ROLLBACK.md`
- `docs/PHASE_4_2_REFACTOR.md`

### Service module facades

- `components/service/planning/ServicePlanningView.tsx`
- `components/service/interventions/ServiceInterventionsView.tsx`
- `components/service/work-orders/ServiceWorkOrdersView.tsx`
- `components/service/assets/ServiceAssetsView.tsx`
- `components/service/contracts/ServiceContractsView.tsx`
- `components/service/maintenance/ServiceMaintenanceView.tsx`
- `components/service/shared/ServicePlaceholderView.tsx`

### Appointment module facades

- `components/appointment/detail/AppointmentDetailView.tsx`
- `components/appointment/sales-wizard/SalesWizard.tsx`
- `components/appointment/tabs/visit-report/index.ts`
- `components/appointment/tabs/preparation/index.ts`
- `components/appointment/tabs/contact-card/index.ts`
- `components/appointment/tabs/offers/index.ts`
- `components/appointment/tabs/remarks/index.ts`
- `components/appointment/tabs/sales-history/index.ts`
- `components/appointment/tabs/documents/index.ts`
- `components/appointment/tabs/references/index.ts`
- `components/appointment/tabs/follow-up/index.ts`
- `components/appointment/tabs/leads/index.ts`
- `components/appointment/shared/index.ts`

### Mock data

- `mock-data/service.ts`
- `mock-data/appointmentDetail.ts`
- `mock-data/index.ts`

### Import updates

- `components/sales/SalesApp.tsx`
- `components/appointment/AppointmentDetailView.tsx`
- `components/service/ServicePlanningView.tsx`

## Modules extracted

Phase 4.2 introduces stable module boundaries using facade exports.

Service paths now exist for:

- Planning
- Interventies
- Werkbonnen
- Assets
- Contracten
- Onderhoud
- Shared service placeholder

Appointment paths now exist for:

- Detail shell
- Sales wizard
- Visit report tab
- Preparation tab
- Contact card tab
- Offers tab
- Remarks tab
- Sales history tab
- Documents tab
- References tab
- Follow-up tab
- Leads tab
- Shared appointment code

## Mock data moved

Moved safely:

- Service work-order local stock items moved to `mock-data/service.ts`.
- Appointment detail quote data moved to `mock-data/appointmentDetail.ts`.
- Appointment detail sales document data moved to `mock-data/appointmentDetail.ts`.
- Appointment detail sales item data moved to `mock-data/appointmentDetail.ts`.
- Appointment detail customer document data moved to `mock-data/appointmentDetail.ts`.
- Appointment detail initial references moved to `mock-data/appointmentDetail.ts`.

Central exports:

- `mock-data/index.ts` now re-exports service and appointment detail mock data.

Not moved yet:

- Main service assets/contracts/maintenance/interventions/work-orders arrays remain in `components/service/ServicePlanningView.tsx`.
- Most appointment tab local state and helper types remain in `components/appointment/AppointmentDetailView.tsx`.

Reason:

Those datasets are tightly coupled to local component types and stateful workflows. Moving all at once would create avoidable regression risk. The new facade structure makes the next extraction step smaller and safer.

## Behavior preservation notes

No UI behavior was intentionally changed.

Preserved by design:

- `SalesApp` still renders the same view components, now through new module facade paths.
- Service module implementations still come from the existing tested component.
- Appointment detail implementation still comes from the existing tested component.
- Sales wizard behavior remains unchanged through a facade import.
- Moved mock data values were kept identical to the previous inline data.
- No route, menu, label, permission or visual layout changes were made.

## Preservation checklist

### Sales / Appointment

- Agenda opens appointment detail: preserved by unchanged state flow in `SalesApp`.
- Terug naar agenda: preserved.
- Appointment tabs: preserved.
- Bezoekfiche: preserved.
- Voorbereiding: preserved.
- Contactfiche subtabs: preserved.
- Leads tab: preserved.
- Nieuwe verkoop wizard: preserved through facade import.
- Opmerkingen mock add: preserved.
- Vervolgafspraak mock create: preserved.
- Verkoophistoriek: preserved with moved mock data.
- Offertes: preserved with moved mock data.
- Documenten: preserved with moved mock data.
- Referenties: preserved with moved mock data.

### Service

- Service Planning day/week/month: preserved.
- Interventies overview/detail: preserved.
- Werkbonnen overview/detail: preserved.
- Uitgevoerde werken: preserved.
- Gebruikte materialen: preserved with local stock moved to mock data.
- Operator-opmerkingen: preserved.
- Servicecontroles: preserved.
- Handtekeningen: preserved.
- Werkbon afsluiten mock flow: preserved.
- Assets overview/detail: preserved.
- Contracten overview/detail: preserved.
- Onderhoud overview/detail: preserved.

## Known risks

- The largest logic still lives in `components/service/ServicePlanningView.tsx` and `components/appointment/AppointmentDetailView.tsx`.
- Facade modules improve import boundaries but do not yet reduce the underlying file size enough.
- Full extraction should be performed one submodule at a time in Phase 4.3.
- Some appointment tab placeholder files are structural markers only; real extraction remains pending.
- Service mock data migration is partial.
- No automated browser walkthrough was run in this phase.

## Recommended next cleanup phase

Recommended next phase: **Phase 4.3 - Extract Service Work Orders First**.

Why:

- Werkbonnen are the most complex service workflow.
- They touch service controls, materials, signatures, status changes and later stock/sync/audit.
- Extracting work orders first creates the cleanest boundary for offline-first preparation.

Suggested next prompt:

```text
Continue Phase 4.3 only.

Do not add new business functionality.
Do not change visual design or business behavior.
Do not add backend, database, ERP integration, offline sync, authentication or persistence.

Goal:
Extract the Werkbonnen implementation out of components/service/ServicePlanningView.tsx into components/service/work-orders while preserving behavior.

Tasks:
1. Move WorkOrder-related types to domain/service or a local work-orders types file if safer.
2. Move initialWorkOrders mock data to mock-data/service.ts.
3. Extract ServiceWorkOrdersView and WorkOrderDetail into components/service/work-orders.
4. Keep all current work order behavior unchanged:
   - overview filters
   - detail open
   - uitgevoerde werken
   - gebruikte materialen
   - servicecontroles
   - foto's
   - operator-opmerkingen
   - klantopmerkingen
   - handtekeningen
   - afsluiten mock flow
5. Run npm run typecheck and npm run build.

After completion provide changed files, extracted modules, moved mock data, preservation checklist, verification results and recommended next step.
```

## Verification

Verification status:

- `npm run typecheck`: passed.
- `npm run build`: passed.
