export type Role = "representative" | "sales_leader" | "admin" | "superadmin";

export type Language = "nl" | "fr" | "de";

export type AppointmentStatus =
  | "planned"
  | "completed"
  | "no_time"
  | "cancelled"
  | "customer_absent"
  | "rescheduled";

export type CountryCode = "BE" | "NL" | "DE";

export type AppView =
  | "dashboard"
  | "myInfo"
  | "myPreparation"
  | "agenda"
  | "myTeam"
  | "appointment"
  | "inventory"
  | "reports"
  | "service"
  | "serviceInterventions"
  | "servicePlanning"
  | "serviceWorkOrders"
  | "serviceMaintenance"
  | "serviceContracts"
  | "serviceAssets"
  | "cashSheet"
  | "sync"
  | "technicalDesign"
  | "technicalTables"
  | "userManagement";

export type TechnicalRole = {
  id: string;
  labelKey: string;
  protectedForAdmin?: boolean;
};

export type TechnicalLeadType = {
  id: string;
  labelKey: string;
};

export type TechnicalAssetType = {
  id: "EHBO" | "CARDIO" | "BRAND" | "BLUSMIDDELEN" | "ALGEMEEN";
  labelKey: string;
};

export type TechnicalContractType = {
  id: string;
  code: string;
  description: string;
};

export type TechnicalMaintenanceFrequency = {
  id: string;
  code: string;
  description: string;
  intervalMonths: number;
};

export type TechnicalServiceControl = {
  id: string;
  type: TechnicalAssetType["id"];
  point: string;
  description: string;
  required: boolean;
};

export type MockScenario = "blocked" | "unblocked" | "editable_service" | "leader_scope" | "admin_scope";

export type DesignAssetKey = "logo" | "favicon" | "loginBackground";

export type DesignAssetPreview = {
  name: string;
  previewUrl: string;
};

export type DesignAssetPreviews = Record<DesignAssetKey, DesignAssetPreview | undefined>;

export type Permission =
  | "ViewService"
  | "EditService"
  | "ViewContracts"
  | "EditContracts"
  | "ViewAEDs"
  | "EditAEDs"
  | "ViewWorkOrders"
  | "EditWorkOrders"
  | "ViewOwnAppointments"
  | "ViewTeamAppointments"
  | "UnblockCashSheetWorkday"
  | "ChangeOwnAppointmentStatus";

export type Country = {
  code: CountryCode;
  name: string;
  timezone: string;
};

export type MockUser = {
  id: string;
  name: string;
  role: Role;
  country: CountryCode;
  establishmentNumber: string;
  isActive: boolean;
  timezone: string;
  preferredLanguage: Language;
  teamId?: string;
  permissions: Permission[];
};

export type ManagedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  language: Language;
  mobile: string;
  country: CountryCode;
  team: string;
  roleId: string;
  isTeamSupervisor: boolean;
  isActive: boolean;
  establishmentNumber: string;
  permissions: Record<string, boolean>;
  leads: Record<string, boolean>;
  photo?: DesignAssetPreview;
};

export type Appointment = {
  id: string;
  date?: string;
  time: string;
  type: "customer" | "prospect" | "follow_up" | "demo";
  status: AppointmentStatus;
  statusChangedAt?: string;
  invoiceRevenue?: number;
  orderRevenue?: number;
  label?: string;
  assignedUserId: string;
  customer?: {
    number: string;
    name: string;
    vat: string;
    segment: string;
  };
  prospect?: {
    number: string;
    name: string;
    source: string;
    potential: string;
  };
  contacts: Array<{
    name: string;
    role: string;
    phone: string;
    email: string;
    isActive: boolean;
  }>;
  address: {
    line1: string;
    postalCode: string;
    city: string;
    country: CountryCode;
    isActive: boolean;
  };
  notes: string;
  service: {
    contracts: number;
    aeds: number;
    workOrders: number;
    lastIntervention: string;
    maintenanceStatus: string;
  };
  history: Array<{
    at: string;
    text: string;
  }>;
};

export type SalesRevenueUpdate = {
  invoiceRevenue: number;
  orderRevenue: number;
};

export type CashSheetLine = {
  id: string;
  date: string;
  documentNo: string;
  customerName: string;
  amountInclVat: number;
  isPaid: boolean;
  isCleared: boolean;
};

export type CashSheet = {
  id: string;
  userId: string;
  weekNumber: number;
  year: number;
  status: "open" | "deposit_reported" | "cleared";
  totalAmountInclVat: number;
  lines: CashSheetLine[];
};

export type TranslationFn = (key: string) => string;
