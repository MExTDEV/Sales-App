import type { AuditableEntity, EntityId } from "@/domain/shared/types";

export type SyncQueueItem = AuditableEntity & {
  attemptCount: number;
  entityId: EntityId;
  entityType: string;
  errorMessage?: string;
  lastAttemptAt?: string;
  nextRetryAt?: string;
  operation: "create" | "update" | "delete" | "set_inactive" | "status_change";
  payload: unknown;
  status: "pending" | "processing" | "synced" | "failed" | "conflict";
};

export type SyncConflict = AuditableEntity & {
  conflictType: string;
  entityId: EntityId;
  entityType: string;
  localPayload: unknown;
  remotePayload: unknown;
  resolutionPayload?: unknown;
  resolutionStatus: "open" | "resolved_local_wins" | "resolved_remote_wins" | "resolved_manual_merge" | "ignored";
  resolvedAt?: string;
  resolvedByUserId?: EntityId;
  syncQueueItemId: EntityId;
};
