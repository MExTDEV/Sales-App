# M.Ex.T. Sales App - Offline Sync v0.1

## 1. Core decision

The application is offline first.

It is not online first plus cache. Field users must be able to work without a stable connection.

## 2. Offline domains

The application must function offline for:

- appointments
- customers
- prospects
- contact persons
- demo registrations
- service data
- cash sheet
- stock

Representatives may edit customer, prospect and contact data offline if they have the required permissions. Exact field-level edit rules must be refined before ERP integration. Until then, all such changes must be queued, synced later, audit logged and checked for conflicts.

Offline edit constraints:

- no hard delete offline
- use inactive flags where needed
- every change creates sync queue work
- every important change is audit logged
- conflicts go through `SyncConflict`

## 3. Required components

- local database
- sync queue
- conflict detection
- conflict resolution
- retry mechanism
- sync error handling
- sync status screens
- audit logging for important local and synced changes

## 4. Local database

The local database stores the user's scoped working set:

- own appointments for representatives
- assigned team data for sales leaders where needed
- service data linked to visible customers/appointments
- cash sheet records
- stock records
- lookup/configuration data needed for offline work
- translation resources or current language bundle if needed

Local records must carry:

- `id`
- `version`
- `updatedAt`
- sync status metadata
- external references where applicable

## 5. Sync queue

Every offline mutation creates a `SyncQueueItem`.

Required fields:

- `entityType`
- `entityId`
- `operation`
- `payload`
- `status`
- `attemptCount`
- `lastAttemptAt`
- `nextRetryAt`
- `errorMessage`
- `createdByUserId`
- `createdAt`

Statuses:

- `pending`
- `processing`
- `synced`
- `failed`
- `conflict`

## 6. Conflict detection

Conflicts are detected by comparing:

- entity version
- `updatedAt`
- remote payload hash where useful
- local unsynced changes
- server-side validation outcome

Create `SyncConflict` when automatic resolution is not safe.

## 7. SyncConflict

Required fields:

- `syncQueueItemId`
- `entityType`
- `entityId`
- `localPayload`
- `remotePayload`
- `conflictType`
- `resolutionStatus`
- `resolvedByUserId`
- `resolvedAt`
- `resolutionPayload`

Resolution statuses:

- `open`
- `resolved_local_wins`
- `resolved_remote_wins`
- `resolved_manual_merge`
- `ignored`

## 8. Suggested conflict strategies

| Domain | Strategy |
| --- | --- |
| Appointment status | Version check; closed status changes require conflict if remote changed |
| Appointment notes and visit results | App wins unless modified in ERP after last sync; otherwise conflict/manual review |
| Critical ERP financial fields | ERP wins or manual review |
| StockMovement | Manual review unless a deterministic append-only rule exists; do not overwrite |
| CashSheet and CashSheetLine | Manual review |
| Customer/prospect data | Manual review if both sides changed; field-level merge only when policy allows it |
| Contact persons | Inactive flag wins only with audit trail |
| Service data | Read-only for representatives unless explicit permissions; edit conflicts require review |

## 9. ERP conflict ownership

Do not assume that either the app or ERP always wins.

Conflict resolution must be policy-based per domain and per field type.

Default policy:

- critical ERP financial fields: ERP wins or manual review
- appointment notes and visit results: app wins unless modified in ERP after last sync
- customer/contact changes: manual review if both sides changed
- cash sheet: manual review
- stock: manual review unless a deterministic rule exists

## 10. Retry mechanism

Failed sync items use retry with backoff.

Retry should stop or pause when:

- authentication fails
- permission is missing
- validation fails permanently
- entity was deleted or archived remotely
- conflict is detected

## 11. Sync status screens

Required screens:

- sync status
- sync queue
- sync conflicts
- sync errors

Users must clearly see:

- online/offline state
- last successful sync
- pending records
- failed records
- conflicts requiring action

## 12. ERP integration and offline

The app syncs to the backend/API first. ERP integration then happens through adapter jobs.

Do not let the frontend talk directly to Business Central or Odoo.

Flow:

```text
Local DB
  -> SyncQueueItem
  -> Backend API
  -> PostgreSQL
  -> IntegrationService
  -> BusinessCentralAdapter / OdooAdapter
```

## 13. Audit

Important offline and synced changes must be auditable:

- appointment status changes
- customer/prospect changes
- contact person inactive changes
- address inactive changes
- cash sheet deposit reported
- stock movements
- service edits
- admin/user changes

Use `AuditLog`.
