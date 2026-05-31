import type { AssetStatus, ContractStatus, MaintenanceStatus, WorkOrderStatus } from "@/domain/shared/statuses";
import type { AuditableEntity, EntityId } from "@/domain/shared/types";

export type ServicePlanningItem = AuditableEntity & {
  assignedTechnicianId?: EntityId;
  customerId: EntityId;
  endsAt: string;
  interventionId?: EntityId;
  startsAt: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  type: string;
};

export type ServiceIntervention = AuditableEntity & {
  assetId?: EntityId;
  customerId: EntityId;
  description?: string;
  endsAt: string;
  interventionNumber: string;
  startsAt: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  technicianUserId?: EntityId;
  workOrderId?: EntityId;
};

export type WorkOrder = AuditableEntity & {
  assetId?: EntityId;
  completedAt?: string;
  customerId: EntityId;
  description: string;
  interventionId?: EntityId;
  plannedAt: string;
  status: WorkOrderStatus;
  technicianUserId?: EntityId;
  workOrderNumber: string;
};

export type WorkOrderMaterial = AuditableEntity & {
  articleId: EntityId;
  commercialHandling: "contract" | "invoice" | "order";
  materialType: "contract" | "new";
  quantity: number;
  workOrderId: EntityId;
};

export type ServiceControl = AuditableEntity & {
  assetTypeId: EntityId;
  code: string;
  description: string;
  isRequired: boolean;
};

export type AssetType = AuditableEntity & {
  code: "EHBO" | "CARDIO" | "BRAND" | "BLUSMIDDELEN" | "ALGEMEEN";
  name: string;
};

export type Asset = AuditableEntity & {
  assetNumber: string;
  assetTypeId: EntityId;
  customerId: EntityId;
  description: string;
  itemNo?: string;
  locationDescription?: string;
  nextMaintenanceAt?: string;
  serialNumber?: string;
  serviceControlTypeId?: EntityId;
  status: AssetStatus;
};

export type ContractType = AuditableEntity & {
  code: string;
  description: string;
};

export type Contract = AuditableEntity & {
  contractNumber: string;
  contractTypeId: EntityId;
  customerId: EntityId;
  endDate?: string;
  startDate: string;
  status: ContractStatus;
};

export type MaintenanceFrequency = AuditableEntity & {
  code: string;
  description: string;
  intervalMonths: number;
};

export type Maintenance = AuditableEntity & {
  assetId: EntityId;
  contractId?: EntityId;
  frequencyId: EntityId;
  lastMaintenanceAt?: string;
  maintenanceNumber: string;
  nextMaintenanceAt: string;
  status: MaintenanceStatus;
};
