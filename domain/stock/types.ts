import type { AuditableEntity, EntityId } from "@/domain/shared/types";

export type Article = AuditableEntity & {
  articleNo: string;
  category: string;
  description: string;
  isActive: boolean;
};

export type StockItem = AuditableEntity & {
  articleId: EntityId;
  minimumQuantity: number;
  quantity: number;
  stockLocationId: EntityId;
};

export type StockMovement = AuditableEntity & {
  articleId: EntityId;
  fromLocationId?: EntityId;
  movementDate: string;
  movementType: "sale" | "service_use" | "transfer" | "correction" | "return";
  quantity: number;
  relatedAppointmentId?: EntityId;
  relatedWorkOrderId?: EntityId;
  toLocationId?: EntityId;
};

export type TransferRequest = AuditableEntity & {
  articleId: EntityId;
  desiredDate: string;
  quantity: number;
  reason: string;
  status: "requested" | "approved" | "rejected" | "executed";
  userId: EntityId;
};
