import type { CountryCode, Language, Role } from "@/types/sales";

export type EntityId = string;

export type SyncStatus = "local_only" | "pending" | "synced" | "failed" | "conflict";

export type ExternalReference = {
  externalId?: string;
  externalSystem?: "BusinessCentral" | "Odoo" | "Manual" | string;
  externalUpdatedAt?: string;
};

export type AuditableEntity = ExternalReference & {
  createdAt?: string;
  createdByUserId?: EntityId;
  id: EntityId;
  syncStatus?: SyncStatus;
  updatedAt?: string;
  updatedByUserId?: EntityId;
  version?: number;
};

export type InactivatableEntity = {
  inactiveAt?: string;
  inactiveByUserId?: EntityId;
  inactiveReason?: string;
  isActive: boolean;
};

export type CanonicalCountry = AuditableEntity & {
  code: CountryCode;
  defaultLanguage?: Language;
  name: string;
  timezone: string;
};

export type CanonicalRole = AuditableEntity & {
  code: Role | "service_operator";
  description?: string;
  isSystemRole: boolean;
  name: string;
};

export type CanonicalTeam = AuditableEntity &
  InactivatableEntity & {
    countryCode: CountryCode;
    leaderUserId?: EntityId;
    name: string;
  };
