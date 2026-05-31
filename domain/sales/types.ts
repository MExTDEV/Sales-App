import type { AppointmentStatus, CountryCode } from "@/types/sales";
import type { AuditableEntity, EntityId, InactivatableEntity } from "@/domain/shared/types";

export type Customer = AuditableEntity &
  InactivatableEntity & {
    countryCode: CountryCode;
    customerNumber: string;
    email?: string;
    name: string;
    phone?: string;
    vatNumber?: string;
  };

export type Prospect = AuditableEntity &
  InactivatableEntity & {
    assignedUserId?: EntityId;
    countryCode: CountryCode;
    name: string;
    prospectNumber: string;
    status?: string;
  };

export type Contact = AuditableEntity &
  InactivatableEntity & {
    customerId?: EntityId;
    email?: string;
    firstName: string;
    isPrimary?: boolean;
    lastName: string;
    mobile?: string;
    phone?: string;
    prospectId?: EntityId;
    roleTitle?: string;
  };

export type Address = AuditableEntity &
  InactivatableEntity & {
    box?: string;
    city: string;
    countryCode: CountryCode;
    customerId?: EntityId;
    number?: string;
    postalCode: string;
    prospectId?: EntityId;
    street: string;
    type: "official" | "visit" | "invoice" | "other";
  };

export type Appointment = AuditableEntity & {
  addressId?: EntityId;
  assignedUserId: EntityId;
  closedAt?: string;
  closedByUserId?: EntityId;
  contactId?: EntityId;
  customerId?: EntityId;
  duplicatedFromAppointmentId?: EntityId;
  endsAt?: string;
  notes?: string;
  prospectId?: EntityId;
  rescheduledFromAppointmentId?: EntityId;
  startsAt: string;
  status: AppointmentStatus;
  type: "customer" | "prospect" | "follow_up" | "demo";
  visitResult?: string;
};

export type LeadType = AuditableEntity & {
  code: string;
  name: string;
};

export type Lead = AuditableEntity & {
  appointmentId: EntityId;
  contactId?: EntityId;
  email?: string;
  interest: boolean;
  leadDate: string;
  leadNumber: string;
  leadTypeId: EntityId;
  mobile?: string;
  note?: string;
  phone?: string;
};

export type Reference = AuditableEntity & {
  address?: string;
  appointmentId: EntityId;
  companyName: string;
  contactPerson?: string;
  email?: string;
  note?: string;
  phone?: string;
};

export type SalesDocument = AuditableEntity & {
  amountExclVat: number;
  amountInclVat: number;
  customerId?: EntityId;
  documentDate: string;
  documentNumber: string;
  type: "invoice" | "order" | "credit_note" | "quote";
};

export type SalesDocumentLine = AuditableEntity & {
  documentId: EntityId;
  itemCategory?: string;
  itemNo: string;
  margin?: number;
  quantity: number;
  totalExclVat: number;
  totalInclVat: number;
};
