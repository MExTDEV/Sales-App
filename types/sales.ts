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
  | "pst"
  | "pstDashboard"
  | "pstSegments"
  | "pstRoutes"
  | "pstProspection"
  | "pstMaps"
  | "pstApprovals"
  | "pstRepresentatives"
  | "pstPlanning"
  | "pstQuality"
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
  hasPstAccess: boolean;
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
  hasPstAccess: boolean;
  establishmentNumber: string;
  permissions: Record<string, boolean>;
  leads: Record<string, boolean>;
  photo?: DesignAssetPreview;
};

export type PstWorkflowStep =
  | "sql_documents_prepared"
  | "mailcom_done"
  | "multiroute_done"
  | "regiograph_done"
  | "navision_prepared"
  | "exported_to_pst_server"
  | "waiting_for_approval"
  | "approved";

export type PstProjectStatus =
  | "concept"
  | PstWorkflowStep
  | "rejected"
  | "archived";

export type PstProject = {
  id: string;
  sectorNumber: string;
  country: CountryCode;
  status: PstProjectStatus;
  assignedToUserId: string;
  assignedToName: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  notes: string;
  sqlDocuments: {
    reportName: string;
    storageLocation: string;
    generatedAt?: string;
    generatedBy?: string;
    status: "pending" | "generated" | "failed";
    attachmentName?: string;
  };
  mailcom: {
    importFile?: string;
    importedAt?: string;
    recordCount: number;
    errorCount: number;
    status: "pending" | "registered" | "processed" | "error";
    notes: string;
  };
  multiroute: {
    excelFile?: string;
    uploadStatus: "pending" | "uploaded" | "calculated" | "warning";
    addressCount: number;
    routeCount: number;
    warningCount: number;
    processedBy?: string;
    processedAt?: string;
  };
  regiograph: {
    fileLocation: string;
    checked: boolean;
    checkedBy?: string;
    checkedAt?: string;
    notes: string;
  };
  navision: {
    navisionTaskNumber?: string;
    navisionStatus: "pending" | "prepared" | "exported";
    exportReady: boolean;
    exportedAt?: string;
    exportedBy?: string;
    activateForTablet: boolean;
    area: string;
    notes: string;
  };
  pstServer: {
    lastExportedAt?: string;
    exportStatus: "pending" | "exported" | "error";
    recordCount: number;
    errorCount: number;
    targetEnvironment: string;
    logDetails: string;
  };
};

export type PstHostess = {
  id: string;
  sequenceNumber: string;
  name: string;
  inService: boolean;
  visibleOnPstServer: boolean;
  exportViaWebsite: boolean;
  lastExportedAt?: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
};

export type PstApprovalStatus = "pending" | "approved" | "rejected" | "cancelled";

export type PstApproval = {
  id: string;
  projectId: string;
  approvalType: string;
  requestedByUserId: string;
  requestedByName: string;
  assignedToUserId: string;
  assignedToName: string;
  status: PstApprovalStatus;
  requestedAt: string;
  decidedAt?: string;
  decisionByUserId?: string;
  comment: string;
};

export type PstAuditLog = {
  id: string;
  entityType: "project" | "hostess" | "approval";
  entityId: string;
  action: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  userId: string;
  userName: string;
  createdAt: string;
  comment: string;
};

export type PstSegmentStatus = "concept" | "ingepland" | "lopend" | "voorbereiding" | "afgewerkt";

export type PstProspectStatus = "visited" | "not_visited" | "planned";

export type PstRouteStatus = "concept" | "ingepland" | "lopend" | "afgewerkt";

export type PstSegment = {
  id: string;
  number: string;
  description: string;
  sectorCode: string;
  sectorName: string;
  region: string;
  representativeId: string;
  representativeName: string;
  plannedDate: string;
  status: PstSegmentStatus;
  notes: string;
  boundaryGeoJson?: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
  createdAt: string;
  updatedAt: string;
};

export type PstProspect = {
  id: string;
  segmentId: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: CountryCode;
  status: PstProspectStatus;
  lastVisitedAt?: string;
  assignedRepresentativeId: string;
  latitude: number;
  longitude: number;
};

export type PstRoute = {
  id: string;
  number: string;
  name: string;
  segmentId?: string;
  representativeId: string;
  representativeName: string;
  date: string;
  status: PstRouteStatus;
  totalDistanceKm?: number;
  estimatedTravelTimeMin?: number;
  startAddress?: string;
  endAddress?: string;
  startLocation?: {
    label: string;
    latitude: number;
    longitude: number;
  };
  endLocation?: {
    label: string;
    latitude: number;
    longitude: number;
  };
  calculatedAt?: string;
};

export type PstRouteStop = {
  id: string;
  routeId: string;
  prospectId: string;
  sequence: number;
  calculatedDistanceFromPreviousKm?: number;
  calculatedTravelTimeFromPreviousMin?: number;
  visited?: boolean;
  latitude?: number;
  longitude?: number;
};

export type PstVisit = {
  id: string;
  prospectId: string;
  prospectName: string;
  representativeName: string;
  status: PstProspectStatus;
  visitedAt: string;
};

export type PstRepresentative = {
  id: string;
  name: string;
  region: string;
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
