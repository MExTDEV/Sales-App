export const appointmentStatuses = ["planned", "in_progress", "completed", "cancelled"] as const;
export type CanonicalAppointmentStatus = (typeof appointmentStatuses)[number];

export const appointmentStatusLabels: Record<CanonicalAppointmentStatus, string> = {
  planned: "Gepland",
  in_progress: "Bezig",
  completed: "Afgewerkt",
  cancelled: "Geannuleerd"
};

export const workOrderStatuses = ["planned", "on_the_way", "in_progress", "completed", "cancelled"] as const;
export type WorkOrderStatus = (typeof workOrderStatuses)[number];

export const workOrderStatusLabels: Record<WorkOrderStatus, string> = {
  planned: "Gepland",
  on_the_way: "Onderweg",
  in_progress: "In uitvoering",
  completed: "Afgewerkt",
  cancelled: "Geannuleerd"
};

export const assetStatuses = ["active", "inactive", "maintenance_due", "out_of_service", "replaced"] as const;
export type AssetStatus = (typeof assetStatuses)[number];

export const assetStatusLabels: Record<AssetStatus, string> = {
  active: "Actief",
  inactive: "Niet actief",
  maintenance_due: "Onderhoud nodig",
  out_of_service: "Buiten gebruik",
  replaced: "Vervangen"
};

export const contractStatuses = ["active", "expiring_soon", "expired", "cancelled", "draft"] as const;
export type ContractStatus = (typeof contractStatuses)[number];

export const contractStatusLabels: Record<ContractStatus, string> = {
  active: "Actief",
  expiring_soon: "Verloopt binnenkort",
  expired: "Verlopen",
  cancelled: "Opgezegd",
  draft: "Concept"
};

export const maintenanceStatuses = ["planned", "due_soon", "overdue", "completed", "cancelled"] as const;
export type MaintenanceStatus = (typeof maintenanceStatuses)[number];

export const maintenanceStatusLabels: Record<MaintenanceStatus, string> = {
  planned: "Gepland",
  due_soon: "Binnenkort vervallen",
  overdue: "Vervallen",
  completed: "Uitgevoerd",
  cancelled: "Geannuleerd"
};

export const appointmentStatusTone = {
  planned: "blue",
  completed: "green",
  no_time: "amber",
  rescheduled: "orange",
  cancelled: "red",
  customer_absent: "slate"
} as const;

export type SharedStatusTone = (typeof appointmentStatusTone)[keyof typeof appointmentStatusTone];
