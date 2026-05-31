# Phase 4.2 Rollback Point

Datum: 2026-05-31

Git branch creation was attempted in the current environment during the previous cleanup work, but `git` is not available as a shell command here. Therefore this document is the rollback point for Phase 4.2.

## Refactor start state

Phase 4.2 starts after Phase 4.1 completed successfully.

Known verification state before Phase 4.2:

- `npm run typecheck`: passed
- `npm run build`: passed

## Intended touched files

Expected files/directories for Phase 4.2:

- `components/sales/SalesApp.tsx`
- `components/service/ServicePlanningView.tsx`
- `components/service/planning/`
- `components/service/interventions/`
- `components/service/work-orders/`
- `components/service/assets/`
- `components/service/contracts/`
- `components/service/maintenance/`
- `components/service/shared/`
- `components/appointment/AppointmentDetailView.tsx`
- `components/appointment/detail/`
- `components/appointment/tabs/`
- `components/appointment/sales-wizard/`
- `components/appointment/shared/`
- `mock-data/service.ts`
- `mock-data/appointmentDetail.ts`
- `mock-data/index.ts`
- `docs/PHASE_4_2_REFACTOR.md`

## How to revert manually

If Phase 4.2 needs to be reverted manually:

1. Restore the files listed above from the state before Phase 4.2.
2. Remove newly created Phase 4.2 component folders if they are only facade/extraction files.
3. Remove `mock-data/service.ts` and `mock-data/appointmentDetail.ts` if they were introduced only for Phase 4.2.
4. Restore imports in `components/sales/SalesApp.tsx` to their pre-refactor source files.
5. Run `npm run typecheck`.
6. Run `npm run build`.

## Rollback principle

This phase must preserve behavior. If typecheck or build cannot be fixed safely, revert the Phase 4.2 touched files and return to the Phase 4.1 state.
