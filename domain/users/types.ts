import type { CountryCode, Language, Permission, Role } from "@/types/sales";
import type { AuditableEntity, EntityId, InactivatableEntity } from "@/domain/shared/types";

export type User = AuditableEntity &
  InactivatableEntity & {
    countryCode: CountryCode;
    displayName: string;
    email: string;
    establishmentNumber?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    permissions: Permission[];
    preferredLanguage: Language;
    role: Role | "service_operator";
    teamId?: EntityId;
    timezone: string;
  };
