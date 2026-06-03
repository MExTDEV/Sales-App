# PST schema notes

This repository is currently a mock-only Next.js frontend and has no executable database migration layer. Phase 1 therefore models PST in TypeScript and seed data:

- `ManagedUser.hasPstAccess` maps to database boolean `hasPstAccess`, default `false`.
- `pstProjects` models sector workflow, SQL documents, Mailcom, Multiroute, RegioGraph, Navision and PST Server export state.
- `pstHostesses` models PST Hostess maintenance. `exportViaWebsite` defaults to `false`.
- `pstApprovals` models PST approvals with `pending`, `approved`, `rejected` and `cancelled`.
- `pstAuditLogs` models the PST audit trail for project, hostess and approval actions.

Future database migration should add these entities with the field names from `types/sales.ts` and seed initial rows from `data/pstMock.ts`.
