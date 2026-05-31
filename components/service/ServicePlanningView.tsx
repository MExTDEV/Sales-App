"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Building2, CalendarClock, CalendarPlus, Camera, CalendarDays, ChevronLeft, ChevronRight, CircleAlert, CircleCheckBig, CircleDot, ClipboardList, ClipboardPen, Eye, FileText, History, MessageSquareText, Package, PackageSearch, PenTool, Pencil, Plus, ShieldCheck, Trash2, Wrench, X } from "lucide-react";
import { Badge } from "@/components/shared/ui";
import { serviceLocalStockItems } from "@/mock-data/service";
import type { MockUser, TechnicalAssetType, TechnicalContractType, TechnicalMaintenanceFrequency, TechnicalServiceControl, TranslationFn } from "@/types/sales";

type PlanningViewMode = "day" | "week" | "month";
type InterventionStatus = "planned" | "in_progress" | "completed" | "cancelled";
type WorkOrderStatus = "planned" | "on_the_way" | "in_progress" | "completed" | "cancelled";
type ServiceAssetStatus = "active" | "inactive" | "maintenance_due" | "out_of_service" | "replaced";
type ServiceContractStatus = "active" | "expiring_soon" | "expired" | "cancelled" | "draft";
type MaintenanceStatus = "planned" | "due_soon" | "overdue" | "completed" | "cancelled";

type ServiceIntervention = {
  id: string;
  number: string;
  date: string;
  time: string;
  customerName: string;
  city: string;
  address: string;
  contactPerson: string;
  phone: string;
  type: string;
  technician: string;
  status: InterventionStatus;
  workOrderNo: string;
  description: string;
  internalRemarks: string;
};

type WorkPerformed = {
  id: string;
  description: string;
  hours: string;
  note: string;
};

type UsedMaterial = {
  id: string;
  itemNo: string;
  description: string;
  quantity: string;
  materialType: "contract" | "new";
  commercialHandling: "contract" | "invoice" | "order";
};

type WorkOrder = {
  id: string;
  number: string;
  interventionNumber: string;
  date: string;
  time: string;
  customerName: string;
  city: string;
  address: string;
  contactPerson: string;
  phone: string;
  technician: string;
  type: string;
  status: WorkOrderStatus;
  description: string;
  internalRemarks: string;
  asset?: {
    number: string;
    type: "CARDIO" | "BRAND";
    description: string;
    serialNumber: string;
    location: string;
  };
  workPerformed: WorkPerformed[];
  materials: UsedMaterial[];
  photos: string[];
  operatorRemarks: string;
  customerRemark: string;
  serviceControlResults: Record<string, boolean>;
  customerSignature: boolean;
  operatorSignature: boolean;
};

type ServiceAsset = {
  id: string;
  assetNumber: string;
  assetType: TechnicalAssetType["id"];
  description: string;
  itemNo: string;
  customer: string;
  address: string;
  location: string;
  serialNumber: string;
  status: ServiceAssetStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  maintenanceFrequency: string;
  serviceControlType: TechnicalAssetType["id"];
  lastIntervention: string;
  linkedContract: string;
  contactPerson: string;
  history: Array<{ date: string; type: string; text: string }>;
};

type ServiceContract = {
  id: string;
  number: string;
  customer: string;
  contractTypeCode: string;
  startDate: string;
  endDate: string;
  status: ServiceContractStatus;
  owner: string;
  assetNumbers: string[];
  coverage: {
    maintenance: boolean;
    interventions: boolean;
    workHours: boolean;
    travel: boolean;
    parts: boolean;
  };
  financial: {
    annualAmount: number;
    invoiceFrequency: string;
    lastInvoiceDate: string;
  };
  notes: string[];
};

type MaintenanceRecord = {
  id: string;
  number: string;
  customer: string;
  assetNumber: string;
  assetDescription: string;
  assetType: TechnicalAssetType["id"];
  contractNumber: string;
  nextMaintenance: string;
  lastMaintenance: string;
  frequencyCode: string;
  status: MaintenanceStatus;
  plannedDate: string;
  plannedTechnician: string;
  priority: string;
  history: Array<{ date: string; interventionNumber: string; workOrderNumber: string; technician: string; status: string }>;
};

const serviceAssets: ServiceAsset[] = [
  {
    id: "asset-1",
    assetNumber: "AED-001",
    assetType: "CARDIO",
    description: "AED Philips HeartStart HS1",
    itemNo: "AED-HS1",
    customer: "Apotheek Van Dijck",
    address: "Mechelsesteenweg 184, 2018 Antwerpen",
    location: "Receptie",
    serialNumber: "SN123456",
    status: "active",
    lastMaintenance: "2025-11-12",
    nextMaintenance: "2026-11-12",
    maintenanceFrequency: "Jaarlijks",
    serviceControlType: "CARDIO",
    lastIntervention: "INT-260184",
    linkedContract: "CON-2025-084",
    contactPerson: "Els Van Dijck",
    history: [
      { date: "2026-05-30", type: "Werkbon", text: "WO-260441 - Jaarlijks AED onderhoud" },
      { date: "2025-11-12", type: "Onderhoud", text: "Preventieve controle uitgevoerd" },
      { date: "2024-09-03", type: "Opmerking", text: "AED verplaatst naar receptie" }
    ]
  },
  {
    id: "asset-2",
    assetNumber: "BRAND-014",
    assetType: "BLUSMIDDELEN",
    description: "Brandblusser schuim 6L",
    itemNo: "BLUS-SCHUIM-6L",
    customer: "Gemeente Bornem",
    address: "Hingenesteenweg 13, 2880 Bornem",
    location: "Preventiedienst",
    serialNumber: "BX-882914",
    status: "maintenance_due",
    lastMaintenance: "2025-04-21",
    nextMaintenance: "2026-05-30",
    maintenanceFrequency: "Jaarlijks",
    serviceControlType: "BRAND",
    lastIntervention: "INT-260185",
    linkedContract: "CON-2024-211",
    contactPerson: "Nathalie Vos",
    history: [
      { date: "2026-05-30", type: "Interventie", text: "INT-260185 - Installatie signalisatie" },
      { date: "2025-04-21", type: "Onderhoud", text: "Drukmeter en zegel gecontroleerd" }
    ]
  },
  {
    id: "asset-3",
    assetNumber: "EHBO-220",
    assetType: "EHBO",
    description: "EHBO-koffer horeca medium",
    itemNo: "EHBO-10",
    customer: "Bakkerij De Smet",
    address: "Marktstraat 14, 2000 Antwerpen",
    location: "Keuken",
    serialNumber: "KIT-2026-220",
    status: "active",
    lastMaintenance: "2026-02-10",
    nextMaintenance: "2026-08-10",
    maintenanceFrequency: "Halfjaarlijks",
    serviceControlType: "EHBO",
    lastIntervention: "INT-260190",
    linkedContract: "CON-2026-018",
    contactPerson: "Bakkerij De Smet",
    history: [
      { date: "2026-02-10", type: "Onderhoud", text: "Inhoud aangevuld" },
      { date: "2025-08-10", type: "Vervanging", text: "Pleistersets vervangen" }
    ]
  },
  {
    id: "asset-4",
    assetNumber: "BRANDC-009",
    assetType: "BRAND",
    description: "Brandcentrale Advanced MX",
    itemNo: "BRANDC-MX",
    customer: "Logistics Plus",
    address: "Industrieweg 8, 9000 Gent",
    location: "Technisch lokaal",
    serialNumber: "FC-77821",
    status: "out_of_service",
    lastMaintenance: "2026-05-31",
    nextMaintenance: "2026-06-14",
    maintenanceFrequency: "Kwartaal",
    serviceControlType: "BRAND",
    lastIntervention: "INT-260186",
    linkedContract: "CON-2025-302",
    contactPerson: "Ruben Claes",
    history: [
      { date: "2026-05-31", type: "Werkbon", text: "WO-260443 - Defecte noodverlichting nagezien" },
      { date: "2026-05-31", type: "Opmerking", text: "Tijdelijk buiten gebruik wegens storing" }
    ]
  },
  {
    id: "asset-5",
    assetNumber: "GEN-501",
    assetType: "ALGEMEEN",
    description: "Veiligheidskast chemie",
    itemNo: "SAFE-CAB-90",
    customer: "Care Point Leuven",
    address: "Bondgenotenlaan 91, 3000 Leuven",
    location: "Labruimte",
    serialNumber: "SC-59021",
    status: "replaced",
    lastMaintenance: "2025-12-18",
    nextMaintenance: "2026-12-18",
    maintenanceFrequency: "Jaarlijks",
    serviceControlType: "ALGEMEEN",
    lastIntervention: "INT-260187",
    linkedContract: "CON-2024-098",
    contactPerson: "Sarah Maes",
    history: [
      { date: "2026-01-04", type: "Vervanging", text: "Asset vervangen door nieuw model" }
    ]
  }
];

const serviceContracts: ServiceContract[] = [
  {
    id: "contract-1",
    number: "CON-2025-084",
    customer: "Apotheek Van Dijck",
    contractTypeCode: "FULLSERVICE",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    status: "active",
    owner: "Sofie Peeters",
    assetNumbers: ["AED-001"],
    coverage: { maintenance: true, interventions: true, workHours: true, travel: true, parts: true },
    financial: { annualAmount: 1290, invoiceFrequency: "Jaarlijks", lastInvoiceDate: "2026-01-05" },
    notes: ["AED onderhoud en interventies inbegrepen.", "Vervangstukken inbegrepen volgens contractvoorwaarden."]
  },
  {
    id: "contract-2",
    number: "CON-2024-211",
    customer: "Gemeente Bornem",
    contractTypeCode: "ONDERHOUD",
    startDate: "2024-06-01",
    endDate: "2026-06-30",
    status: "expiring_soon",
    owner: "Tom Janssens",
    assetNumbers: ["BRAND-014"],
    coverage: { maintenance: true, interventions: false, workHours: false, travel: true, parts: false },
    financial: { annualAmount: 820, invoiceFrequency: "Halfjaarlijks", lastInvoiceDate: "2026-01-10" },
    notes: ["Onderhoudsbezoeken inbegrepen.", "Interventies apart te factureren."]
  },
  {
    id: "contract-3",
    number: "CON-2026-018",
    customer: "Bakkerij De Smet",
    contractTypeCode: "INSPECTIE",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "active",
    owner: "Jochen Andries",
    assetNumbers: ["EHBO-220"],
    coverage: { maintenance: true, interventions: false, workHours: false, travel: false, parts: false },
    financial: { annualAmount: 390, invoiceFrequency: "Jaarlijks", lastInvoiceDate: "2026-01-15" },
    notes: ["Halfjaarlijkse inspectie EHBO-koffer."]
  },
  {
    id: "contract-4",
    number: "CON-2025-302",
    customer: "Logistics Plus",
    contractTypeCode: "SERVICE",
    startDate: "2025-04-01",
    endDate: "2026-03-31",
    status: "expired",
    owner: "Lotte Jacobs",
    assetNumbers: ["BRANDC-009"],
    coverage: { maintenance: false, interventions: true, workHours: true, travel: true, parts: false },
    financial: { annualAmount: 2150, invoiceFrequency: "Per kwartaal", lastInvoiceDate: "2026-01-02" },
    notes: ["Contract verlopen, vernieuwing nog te bevestigen."]
  },
  {
    id: "contract-5",
    number: "CON-2026-099",
    customer: "Care Point Leuven",
    contractTypeCode: "ALGEMEEN",
    startDate: "2026-07-01",
    endDate: "2027-06-30",
    status: "draft",
    owner: "Niels Martens",
    assetNumbers: ["GEN-501"],
    coverage: { maintenance: true, interventions: true, workHours: false, travel: true, parts: false },
    financial: { annualAmount: 0, invoiceFrequency: "Nog te bepalen", lastInvoiceDate: "-" },
    notes: ["Conceptcontract voor nieuwe assetdekking."]
  }
];

const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: "maint-1",
    number: "OND-260001",
    customer: "Apotheek Van Dijck",
    assetNumber: "AED-001",
    assetDescription: "AED Philips HeartStart HS1",
    assetType: "CARDIO",
    contractNumber: "CON-2025-084",
    nextMaintenance: "2026-06-18",
    lastMaintenance: "2025-11-12",
    frequencyCode: "JAARLIJKS",
    status: "due_soon",
    plannedDate: "2026-06-18",
    plannedTechnician: "Bram Peeters",
    priority: "Belangrijk",
    history: [{ date: "2026-05-30", interventionNumber: "INT-260184", workOrderNumber: "WO-260441", technician: "Bram Peeters", status: "Gepland" }]
  },
  {
    id: "maint-2",
    number: "OND-260002",
    customer: "Gemeente Bornem",
    assetNumber: "BRAND-014",
    assetDescription: "Brandblusser schuim 6L",
    assetType: "BLUSMIDDELEN",
    contractNumber: "CON-2024-211",
    nextMaintenance: "2026-05-30",
    lastMaintenance: "2025-04-21",
    frequencyCode: "JAARLIJKS",
    status: "overdue",
    plannedDate: "2026-05-30",
    plannedTechnician: "Lotte Jacobs",
    priority: "Dringend",
    history: [{ date: "2026-05-30", interventionNumber: "INT-260185", workOrderNumber: "WO-260442", technician: "Lotte Jacobs", status: "Bezig" }]
  },
  {
    id: "maint-3",
    number: "OND-260003",
    customer: "Bakkerij De Smet",
    assetNumber: "EHBO-220",
    assetDescription: "EHBO-koffer horeca medium",
    assetType: "EHBO",
    contractNumber: "CON-2026-018",
    nextMaintenance: "2026-08-10",
    lastMaintenance: "2026-02-10",
    frequencyCode: "HALFJAAR",
    status: "planned",
    plannedDate: "2026-08-10",
    plannedTechnician: "Niels Martens",
    priority: "Normaal",
    history: [{ date: "2026-02-10", interventionNumber: "INT-260190", workOrderNumber: "WO-260480", technician: "Niels Martens", status: "Uitgevoerd" }]
  },
  {
    id: "maint-4",
    number: "OND-260004",
    customer: "Logistics Plus",
    assetNumber: "BRANDC-009",
    assetDescription: "Brandcentrale Advanced MX",
    assetType: "BRAND",
    contractNumber: "CON-2025-302",
    nextMaintenance: "2026-05-31",
    lastMaintenance: "2026-05-31",
    frequencyCode: "KWARTAAL",
    status: "completed",
    plannedDate: "2026-05-31",
    plannedTechnician: "Bram Peeters",
    priority: "Belangrijk",
    history: [{ date: "2026-05-31", interventionNumber: "INT-260186", workOrderNumber: "WO-260443", technician: "Bram Peeters", status: "Uitgevoerd" }]
  }
];

const interventions: ServiceIntervention[] = [
  {
    id: "int-1",
    number: "INT-260184",
    date: "2026-05-30",
    time: "08:30",
    customerName: "Apotheek Van Dijck",
    city: "Antwerpen",
    address: "Mechelsesteenweg 184, 2018 Antwerpen",
    contactPerson: "Els Van Dijck",
    phone: "+32 475 12 34 56",
    type: "AED onderhoud",
    technician: "Bram Peeters",
    status: "planned",
    workOrderNo: "WO-260441",
    description: "Jaarlijks AED onderhoud en controle batterij.",
    internalRemarks: "Klant vraagt korte toelichting aan balie."
  },
  {
    id: "int-2",
    number: "INT-260185",
    date: "2026-05-30",
    time: "10:00",
    customerName: "Gemeente Bornem",
    city: "Bornem",
    address: "Hingenesteenweg 13, 2880 Bornem",
    contactPerson: "Nathalie Vos",
    phone: "+32 496 77 21 08",
    type: "Installatie",
    technician: "Lotte Jacobs",
    status: "in_progress",
    workOrderNo: "WO-260442",
    description: "Installatie signalisatie en controle EHBO-punten.",
    internalRemarks: "Toegang via preventiedienst."
  },
  {
    id: "int-3",
    number: "INT-260186",
    date: "2026-05-31",
    time: "13:30",
    customerName: "Logistics Plus",
    city: "Gent",
    address: "Industrieweg 8, 9000 Gent",
    contactPerson: "Ruben Claes",
    phone: "+32 477 33 81 20",
    type: "Herstelling",
    technician: "Bram Peeters",
    status: "completed",
    workOrderNo: "WO-260443",
    description: "Nazicht defecte noodverlichting in magazijn.",
    internalRemarks: "Onderdelen ter plaatse gebruikt."
  },
  {
    id: "int-4",
    number: "INT-260187",
    date: "2026-06-02",
    time: "09:15",
    customerName: "Care Point Leuven",
    city: "Leuven",
    address: "Bondgenotenlaan 91, 3000 Leuven",
    contactPerson: "Sarah Maes",
    phone: "+32 485 99 10 16",
    type: "Controle",
    technician: "Niels Martens",
    status: "cancelled",
    workOrderNo: "WO-260444",
    description: "Controle brandblussers en AED zichtbaarheid.",
    internalRemarks: "Klant heeft afspraak verplaatst."
  }
];

const initialWorkOrders: WorkOrder[] = [
  {
    id: "wo-1",
    number: "WO-260441",
    interventionNumber: "INT-260184",
    date: "2026-05-30",
    time: "08:30",
    customerName: "Apotheek Van Dijck",
    city: "Antwerpen",
    address: "Mechelsesteenweg 184, 2018 Antwerpen",
    contactPerson: "Els Van Dijck",
    phone: "+32 475 12 34 56",
    technician: "Bram Peeters",
    type: "AED onderhoud",
    status: "planned",
    description: "Jaarlijks AED onderhoud en controle batterij.",
    internalRemarks: "Klant vraagt korte toelichting aan balie.",
    asset: {
      number: "AED-001",
      type: "CARDIO",
      description: "AED Philips HeartStart HS1",
      serialNumber: "SN123456",
      location: "Receptie"
    },
    workPerformed: [{ id: "wp-1", description: "Visuele controle AED", hours: "0.5", note: "Geen schade vastgesteld" }],
    materials: [{ id: "mat-1", itemNo: "AED-PAD", description: "AED elektroden volwassenen", quantity: "1", materialType: "contract", commercialHandling: "contract" }],
    photos: ["Foto AED kast"],
    operatorRemarks: "",
    customerRemark: "",
    serviceControlResults: { SERVCONTR001: true, SERVCONTR002: false },
    customerSignature: false,
    operatorSignature: false
  },
  {
    id: "wo-2",
    number: "WO-260442",
    interventionNumber: "INT-260185",
    date: "2026-05-30",
    time: "10:00",
    customerName: "Gemeente Bornem",
    city: "Bornem",
    address: "Hingenesteenweg 13, 2880 Bornem",
    contactPerson: "Nathalie Vos",
    phone: "+32 496 77 21 08",
    technician: "Lotte Jacobs",
    type: "Installatie",
    status: "in_progress",
    description: "Installatie signalisatie en controle EHBO-punten.",
    internalRemarks: "Toegang via preventiedienst.",
    asset: {
      number: "BRAND-014",
      type: "BRAND",
      description: "Brandblusser schuim 6L",
      serialNumber: "BX-882914",
      location: "Preventiedienst"
    },
    workPerformed: [],
    materials: [],
    photos: [],
    operatorRemarks: "",
    customerRemark: "",
    serviceControlResults: {},
    customerSignature: false,
    operatorSignature: false
  },
  {
    id: "wo-3",
    number: "WO-260443",
    interventionNumber: "INT-260186",
    date: "2026-05-31",
    time: "13:30",
    customerName: "Logistics Plus",
    city: "Gent",
    address: "Industrieweg 8, 9000 Gent",
    contactPerson: "Ruben Claes",
    phone: "+32 477 33 81 20",
    technician: "Bram Peeters",
    type: "Herstelling",
    status: "completed",
    description: "Nazicht defecte noodverlichting in magazijn.",
    internalRemarks: "Onderdelen ter plaatse gebruikt.",
    workPerformed: [{ id: "wp-2", description: "Noodverlichting hersteld", hours: "1.25", note: "Test OK" }],
    materials: [{ id: "mat-2", itemNo: "SAFETY-SIGN", description: "Veiligheidspictogram nooduitgang", quantity: "2", materialType: "new", commercialHandling: "invoice" }],
    photos: ["Voor herstelling", "Na herstelling"],
    operatorRemarks: "Controle uitgevoerd volgens procedure.",
    customerRemark: "Correct uitgevoerd.",
    serviceControlResults: {},
    customerSignature: true,
    operatorSignature: true
  }
];

const viewModes: Array<{ id: PlanningViewMode; key: string }> = [
  { id: "day", key: "servicePlanning.view.day" },
  { id: "week", key: "servicePlanning.view.week" },
  { id: "month", key: "servicePlanning.view.month" }
];

export function ServicePlanningView({ t, user }: { t: TranslationFn; user: MockUser }) {
  const [viewMode, setViewMode] = useState<PlanningViewMode>("week");
  const [dateFilter, setDateFilter] = useState("2026-05-30");
  const [selected, setSelected] = useState<ServiceIntervention | undefined>();
  const filtered = useCalendarInterventions(dateFilter, viewMode);
  const canEdit = user.permissions.includes("EditService");

  function movePeriod(direction: -1 | 1) {
    const date = parseLocalDate(dateFilter);
    if (viewMode === "day") {
      setDateFilter(toDateValue(addDays(date, direction)));
      return;
    }
    if (viewMode === "week") {
      setDateFilter(toDateValue(addDays(date, direction * 7)));
      return;
    }
    setDateFilter(toDateValue(new Date(date.getFullYear(), date.getMonth() + direction, date.getDate())));
  }

  return (
    <ServiceFrame title={t("nav.servicePlanning")} subtitle={t("servicePlanning.subtitle")} icon={<CalendarDays size={24} strokeWidth={2} />}>
      <ServicePermissionNotice canEdit={canEdit} t={t} />
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap gap-2">
          {viewModes.map((mode) => (
            <button key={mode.id} className={`min-h-10 rounded-xl px-4 text-sm font-black transition ${viewMode === mode.id ? "bg-[#003B83] text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-blue-50"}`} onClick={() => setViewMode(mode.id)}>
              {t(mode.key)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-blue-50 hover:text-[#003B83]" onClick={() => movePeriod(-1)} title={t("servicePlanning.previous")}>
            <ChevronLeft aria-hidden="true" size={18} strokeWidth={2} />
          </button>
          <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-blue-50 hover:text-[#003B83]" onClick={() => movePeriod(1)} title={t("servicePlanning.next")}>
            <ChevronRight aria-hidden="true" size={18} strokeWidth={2} />
          </button>
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#003B83] bg-white px-4 text-sm font-black text-[#003B83] transition hover:bg-blue-50"
            onClick={() => {
              setDateFilter("2026-05-30");
              setViewMode("day");
            }}
          >
            <CalendarDays aria-hidden="true" size={16} strokeWidth={2} />
            {t("servicePlanning.today")}
          </button>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">{t("servicePlanning.calendar")}</h3>
          <p className="text-sm font-black text-[#003B83]">{planningRangeLabel(dateFilter, viewMode)}</p>
        </div>
        <OutlookCalendar date={dateFilter} interventions={filtered} t={t} viewMode={viewMode} onOpen={setSelected} />
      </section>
      {canEdit && <PlaceholderEditButton t={t} />}
      {selected && <InterventionDetail intervention={selected} onClose={() => setSelected(undefined)} t={t} canEdit={canEdit} />}
    </ServiceFrame>
  );
}

function OutlookCalendar({
  date,
  interventions,
  onOpen,
  t,
  viewMode
}: {
  date: string;
  interventions: ServiceIntervention[];
  onOpen: (intervention: ServiceIntervention) => void;
  t: TranslationFn;
  viewMode: PlanningViewMode;
}) {
  if (viewMode === "month") {
    const days = monthDates(date);

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-7 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50">
          {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
            <div key={day} className="px-2 py-3 text-center text-xs font-black uppercase tracking-[0.12em] text-slate-500">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-200">
          {days.map((day) => {
            const dayItems = interventions.filter((item) => item.date === day);
            const outsideMonth = day.slice(0, 7) !== date.slice(0, 7);
            return (
              <div key={day} className="min-h-28 bg-white p-2">
                <p className={`text-xs font-black ${outsideMonth ? "text-slate-300" : day === date ? "text-[#003B83]" : "text-slate-500"}`}>{formatDayNumber(day)}</p>
                <div className="mt-2 grid gap-1">
                  {dayItems.map((item) => (
                    <CalendarPill key={item.id} compact intervention={item} t={t} onOpen={onOpen} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const dates = viewMode === "day" ? [date] : weekDates(date);
  const slots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className={`grid bg-slate-50 ${viewMode === "day" ? "grid-cols-[5rem_1fr]" : "grid-cols-[4rem_repeat(7,minmax(0,1fr))]"}`}>
        <div className="border-r border-slate-200 px-2 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-400">{t("service.time")}</div>
        {dates.map((day) => (
          <div key={day} className="border-r border-slate-200 px-2 py-3 last:border-r-0">
            <p className="text-center text-xs font-black uppercase tracking-[0.12em] text-slate-500">{weekdayLabel(day)}</p>
            <p className={`mt-1 text-center text-sm font-black ${day === date ? "text-[#003B83]" : "text-slate-950"}`}>{formatDate(day)}</p>
          </div>
        ))}
      </div>
      <div className="divide-y divide-slate-200">
        {slots.map((slot) => (
          <div key={slot} className={`grid min-h-24 ${viewMode === "day" ? "grid-cols-[5rem_1fr]" : "grid-cols-[4rem_repeat(7,minmax(0,1fr))]"}`}>
            <div className="border-r border-slate-200 bg-slate-50 px-2 py-3 text-xs font-black text-slate-500">{slot}</div>
            {dates.map((day) => {
              const daySlotItems = interventions.filter((item) => item.date === day && item.time.startsWith(slot.slice(0, 2)));
              return (
                <div key={`${day}-${slot}`} className="border-r border-slate-100 bg-white p-2 last:border-r-0">
                  <div className="grid gap-2">
                    {daySlotItems.map((item) => (
                      <CalendarPill key={item.id} intervention={item} t={t} onOpen={onOpen} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarPill({ compact, intervention, onOpen, t }: { compact?: boolean; intervention: ServiceIntervention; onOpen: (intervention: ServiceIntervention) => void; t: TranslationFn }) {
  return (
    <button
      className={`w-full rounded-lg border-l-4 bg-blue-50 text-left shadow-sm transition hover:bg-blue-100 ${statusBorder(intervention.status)} ${compact ? "p-1.5" : "p-2.5"}`}
      onClick={() => onOpen(intervention)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`${compact ? "text-[0.68rem]" : "text-xs"} font-black text-[#003B83]`}>{intervention.time}</p>
        {!compact && <ServiceStatusBadge status={intervention.status} t={t} />}
      </div>
      <p className={`${compact ? "mt-0.5 text-[0.7rem]" : "mt-1 text-sm"} line-clamp-2 font-black text-slate-950`}>{intervention.customerName}</p>
      {!compact && <p className="mt-1 text-xs font-semibold text-slate-600">{intervention.city} - {intervention.type}</p>}
      {!compact && <p className="mt-1 text-xs font-bold text-slate-500">{intervention.technician}</p>}
    </button>
  );
}

export function ServiceInterventionsView({ t, user }: { t: TranslationFn; user: MockUser }) {
  const [dateFilter, setDateFilter] = useState("2026-05-30");
  const [technicianFilter, setTechnicianFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<ServiceIntervention | undefined>();
  const filtered = useFilteredInterventions({ dateFilter, statusFilter, technicianFilter, typeFilter, viewMode: "month" });
  const canEdit = user.permissions.includes("EditService");

  return (
    <ServiceFrame title={t("nav.interventions")} subtitle={t("serviceInterventions.subtitle")} icon={<Wrench size={24} strokeWidth={2} />}>
      <ServicePermissionNotice canEdit={canEdit} t={t} />
      <ServiceFilters
        dateFilter={dateFilter}
        statusFilter={statusFilter}
        technicianFilter={technicianFilter}
        typeFilter={typeFilter}
        t={t}
        onDateChange={setDateFilter}
        onStatusChange={setStatusFilter}
        onTechnicianChange={setTechnicianFilter}
        onTypeChange={setTypeFilter}
      />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["field.date", "service.time", "field.customer", "service.place", "service.interventionType", "service.technician", "common.status", "fiche.table.actions"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(item.date)}</td>
                  <td className="break-words px-3 py-3 font-black text-slate-950">{item.time}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.customerName}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.city}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.type}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.technician}</td>
                  <td className="break-words px-3 py-3"><ServiceStatusBadge status={item.status} t={t} /></td>
                  <td className="px-3 py-3">
                    <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-blue-50 hover:text-[#003B83]" onClick={() => setSelected(item)}>
                      <Eye aria-hidden="true" size={14} strokeWidth={2} />
                      {t("agenda.action.open")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {canEdit && <PlaceholderEditButton t={t} />}
      {selected && <InterventionDetail intervention={selected} onClose={() => setSelected(undefined)} t={t} canEdit={canEdit} />}
    </ServiceFrame>
  );
}

export function ServiceWorkOrdersView({ serviceControls, t, user }: { serviceControls: TechnicalServiceControl[]; t: TranslationFn; user: MockUser }) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [selected, setSelected] = useState<WorkOrder | undefined>();
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [technicianFilter, setTechnicianFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("");
  const canEdit = user.role !== "representative" || user.permissions.includes("EditService");
  const technicians = Array.from(new Set(workOrders.map((item) => item.technician)));
  const filtered = workOrders.filter((item) =>
    (!dateFilter || item.date === dateFilter) &&
    (statusFilter === "all" || item.status === statusFilter) &&
    (technicianFilter === "all" || item.technician === technicianFilter) &&
    item.customerName.toLowerCase().includes(customerFilter.toLowerCase())
  );

  function updateWorkOrder(updated: WorkOrder) {
    setWorkOrders((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSelected(updated);
  }

  return (
    <ServiceFrame title={t("nav.workOrders")} subtitle={t("workOrders.subtitle")} icon={<ClipboardList size={24} strokeWidth={2} />}>
      <ServicePermissionNotice canEdit={canEdit} t={t} />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelectOrInput label={t("field.date")} type="date" value={dateFilter} onChange={setDateFilter} />
          <FilterSelect label={t("common.status")} value={statusFilter} onChange={setStatusFilter} options={[["all", t("common.all")], ["planned", t("workOrders.status.planned")], ["on_the_way", t("workOrders.status.on_the_way")], ["in_progress", t("workOrders.status.in_progress")], ["completed", t("workOrders.status.completed")], ["cancelled", t("workOrders.status.cancelled")]]} />
          <FilterSelect label={t("service.technician")} value={technicianFilter} onChange={setTechnicianFilter} options={[["all", t("common.all")], ...technicians.map((tech) => [tech, tech] as [string, string])]} />
          <FilterSelectOrInput label={t("field.customer")} type="text" value={customerFilter} onChange={setCustomerFilter} />
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["service.workOrderNo", "field.date", "field.customer", "service.place", "fiche.table.type", "service.technician", "common.status", "fiche.table.actions"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-black text-slate-950">{item.number}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(item.date)}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.customerName}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.city}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.type}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.technician}</td>
                  <td className="break-words px-3 py-3"><WorkOrderStatusBadge status={item.status} t={t} /></td>
                  <td className="px-3 py-3">
                    <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-blue-50 hover:text-[#003B83]" onClick={() => setSelected(item)}>
                      <Eye aria-hidden="true" size={14} strokeWidth={2} />
                      {t("agenda.action.open")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {selected && <WorkOrderDetail canEdit={canEdit} onClose={() => setSelected(undefined)} onUpdate={updateWorkOrder} serviceControls={serviceControls} t={t} workOrder={selected} />}
    </ServiceFrame>
  );
}

export function ServiceAssetsView({ assetTypes, t, user }: { assetTypes: TechnicalAssetType[]; t: TranslationFn; user: MockUser }) {
  const [assetNumberFilter, setAssetNumberFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [dueFilter, setDueFilter] = useState("all");
  const [selected, setSelected] = useState<ServiceAsset | undefined>();
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const canEdit = user.permissions.includes("EditService");
  const filtered = serviceAssets.filter((asset) =>
    asset.assetNumber.toLowerCase().includes(assetNumberFilter.toLowerCase()) &&
    asset.description.toLowerCase().includes(descriptionFilter.toLowerCase()) &&
    asset.customer.toLowerCase().includes(customerFilter.toLowerCase()) &&
    (typeFilter === "all" || asset.assetType === typeFilter) &&
    (statusFilter === "all" || asset.status === statusFilter) &&
    (dueFilter === "all" || isAssetMaintenanceDue(asset))
  );

  return (
    <ServiceFrame title={t("nav.assets")} subtitle={t("assets.subtitle")} icon={<PackageSearch size={24} strokeWidth={2} />}>
      <ServicePermissionNotice canEdit={canEdit} t={t} />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <FilterSelectOrInput label={t("assets.search.assetNumber")} type="text" value={assetNumberFilter} onChange={setAssetNumberFilter} />
          <FilterSelectOrInput label={t("assets.search.description")} type="text" value={descriptionFilter} onChange={setDescriptionFilter} />
          <FilterSelectOrInput label={t("assets.search.customer")} type="text" value={customerFilter} onChange={setCustomerFilter} />
          <FilterSelect label={t("workOrders.assetType")} value={typeFilter} onChange={setTypeFilter} options={[["all", t("common.all")], ...assetTypes.map((item) => [item.id, t(item.labelKey)] as [string, string])]} />
          <FilterSelect label={t("common.status")} value={statusFilter} onChange={setStatusFilter} options={[["all", t("common.all")], ["active", t("assets.status.active")], ["inactive", t("assets.status.inactive")], ["maintenance_due", t("assets.status.maintenance_due")], ["out_of_service", t("assets.status.out_of_service")], ["replaced", t("assets.status.replaced")]]} />
          <FilterSelect label={t("assets.maintenanceDue")} value={dueFilter} onChange={setDueFilter} options={[["all", t("common.all")], ["due", t("lead.yes")]]} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["assets.assetNumber", "workOrders.assetType", "workOrders.assetDescription", "fiche.sales.itemNo", "field.customer", "workOrders.assetLocation", "workOrders.serialNumber", "common.status", "assets.lastMaintenance", "assets.nextMaintenance", "fiche.table.actions"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((asset) => (
                <tr key={asset.id} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-black text-slate-950">{asset.assetNumber}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{asset.assetType}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{asset.description}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{asset.itemNo}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{asset.customer}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{asset.location}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{asset.serialNumber}</td>
                  <td className="break-words px-3 py-3"><AssetStatusBadge status={asset.status} t={t} /></td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(asset.lastMaintenance)}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(asset.nextMaintenance)}</td>
                  <td className="px-3 py-3">
                    <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-blue-50 hover:text-[#003B83]" onClick={() => setSelected(asset)}>
                      <Eye aria-hidden="true" size={14} strokeWidth={2} />
                      {t("agenda.action.open")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {selected && <AssetDetail asset={selected} assetTypes={assetTypes} onClose={() => setSelected(undefined)} t={t} />}
    </ServiceFrame>
  );
}

export function ServiceMaintenanceView({ assetTypes, frequencies, t, user }: { assetTypes: TechnicalAssetType[]; frequencies: TechnicalMaintenanceFrequency[]; t: TranslationFn; user: MockUser }) {
  const [contractFilter, setContractFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [planTarget, setPlanTarget] = useState<MaintenanceRecord | undefined>();
  const [planDraft, setPlanDraft] = useState({ date: "2026-06-01", note: "", technician: "Bram Peeters", time: "09:00" });
  const [records, setRecords] = useState<MaintenanceRecord[]>(maintenanceRecords);
  const [selected, setSelected] = useState<MaintenanceRecord | undefined>();
  const [statusFilter, setStatusFilter] = useState("all");
  const [success, setSuccess] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const canEdit = user.permissions.includes("EditService");
  const filtered = records.filter((record) =>
    record.customer.toLowerCase().includes(customerFilter.toLowerCase()) &&
    record.contractNumber.toLowerCase().includes(contractFilter.toLowerCase()) &&
    (typeFilter === "all" || record.assetType === typeFilter) &&
    (statusFilter === "all" || record.status === statusFilter) &&
    (!dateFromFilter || record.nextMaintenance >= dateFromFilter) &&
    (!dateToFilter || record.nextMaintenance <= dateToFilter)
  );

  function savePlan() {
    if (!planTarget) return;
    const updated = {
      ...planTarget,
      history: [{ date: planDraft.date, interventionNumber: `INT-MOCK-${Date.now().toString().slice(-4)}`, workOrderNumber: `WO-MOCK-${Date.now().toString().slice(-4)}`, technician: planDraft.technician, status: "Gepland" }, ...planTarget.history],
      plannedDate: planDraft.date,
      plannedTechnician: planDraft.technician,
      status: "planned" as MaintenanceStatus
    };
    setRecords((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSelected((current) => current?.id === updated.id ? updated : current);
    setPlanTarget(undefined);
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 2600);
  }

  return (
    <ServiceFrame title={t("nav.maintenance")} subtitle={t("maintenance.subtitle")} icon={<Wrench size={24} strokeWidth={2} />}>
      <ServicePermissionNotice canEdit={canEdit} t={t} />
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ContractKpi icon={<Wrench size={20} strokeWidth={2} />} label={t("maintenance.kpi.planned")} value={String(records.filter((record) => record.status === "planned").length)} />
        <ContractKpi icon={<CalendarClock size={20} strokeWidth={2} />} label={t("maintenance.kpi.dueSoon")} value={String(records.filter((record) => record.status === "due_soon").length)} />
        <ContractKpi icon={<CircleAlert size={20} strokeWidth={2} />} label={t("maintenance.kpi.overdue")} value={String(records.filter((record) => record.status === "overdue").length)} />
        <ContractKpi icon={<CircleCheckBig size={20} strokeWidth={2} />} label={t("maintenance.kpi.completedMonth")} value={String(records.filter((record) => record.status === "completed" && record.lastMaintenance.startsWith("2026-05")).length)} />
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <FilterSelectOrInput label={t("field.customer")} type="text" value={customerFilter} onChange={setCustomerFilter} />
          <FilterSelect label={t("workOrders.assetType")} value={typeFilter} onChange={setTypeFilter} options={[["all", t("common.all")], ...assetTypes.map((item) => [item.id, t(item.labelKey)] as [string, string])]} />
          <FilterSelect label={t("common.status")} value={statusFilter} onChange={setStatusFilter} options={[["all", t("common.all")], ["planned", t("maintenance.status.planned")], ["due_soon", t("maintenance.status.due_soon")], ["overdue", t("maintenance.status.overdue")], ["completed", t("maintenance.status.completed")], ["cancelled", t("maintenance.status.cancelled")]]} />
          <FilterSelectOrInput label={t("maintenance.dateFrom")} type="date" value={dateFromFilter} onChange={setDateFromFilter} />
          <FilterSelectOrInput label={t("maintenance.dateTo")} type="date" value={dateToFilter} onChange={setDateToFilter} />
          <FilterSelectOrInput label={t("contracts.number")} type="text" value={contractFilter} onChange={setContractFilter} />
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <colgroup>
              <col className="w-[13%]" />
              <col className="w-[16%]" />
              <col className="w-[19%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
              <col className="w-[10%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead className="bg-slate-50">
              <tr>
                {["maintenance.number", "field.customer", "workOrders.asset", "assets.nextMaintenance", "assets.lastMaintenance", "common.status", "fiche.table.actions"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-black text-slate-950">{record.number}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{record.customer}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{record.assetDescription}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(record.nextMaintenance)}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(record.lastMaintenance)}</td>
                  <td className="break-words px-3 py-3"><MaintenanceStatusBadge status={record.status} t={t} /></td>
                  <td className="px-3 py-3">
                    <div className="flex flex-nowrap items-center gap-2">
                      <button className="inline-flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[0.68rem] font-black text-slate-700 hover:bg-blue-50 hover:text-[#003B83]" onClick={() => setSelected(record)}><Eye size={13} strokeWidth={2} />{t("agenda.action.open")}</button>
                      <button className="inline-flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 text-[0.68rem] font-black text-[#003B83]" onClick={() => setPlanTarget(record)}><CalendarPlus size={13} strokeWidth={2} />{t("maintenance.planIntervention")}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {selected && <MaintenanceDetail maintenance={selected} onClose={() => setSelected(undefined)} t={t} />}
      {planTarget && <MaintenancePlanModal draft={planDraft} maintenance={planTarget} onCancel={() => setPlanTarget(undefined)} onChange={setPlanDraft} onSave={savePlan} t={t} />}
      {success && <div className="fixed bottom-24 right-6 z-[70] rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">{t("maintenance.planSuccess")}</div>}
      <div className="hidden">{frequencies.length}</div>
    </ServiceFrame>
  );
}

export function ServiceContractsView({ contractTypes, t, user }: { contractTypes: TechnicalContractType[]; t: TranslationFn; user: MockUser }) {
  const [customerFilter, setCustomerFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [numberFilter, setNumberFilter] = useState("");
  const [selected, setSelected] = useState<ServiceContract | undefined>();
  const [startDateFilter, setStartDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const canEdit = user.permissions.includes("EditContracts");
  const filtered = serviceContracts.filter((contract) =>
    contract.number.toLowerCase().includes(numberFilter.toLowerCase()) &&
    contract.customer.toLowerCase().includes(customerFilter.toLowerCase()) &&
    (typeFilter === "all" || contract.contractTypeCode === typeFilter) &&
    (statusFilter === "all" || contract.status === statusFilter) &&
    (!startDateFilter || contract.startDate >= startDateFilter) &&
    (!endDateFilter || contract.endDate <= endDateFilter)
  );
  const activeCount = serviceContracts.filter((contract) => contract.status === "active").length;
  const expiringCount = serviceContracts.filter((contract) => contract.status === "expiring_soon").length;
  const expiredCount = serviceContracts.filter((contract) => contract.status === "expired").length;
  const contractedAssets = new Set(serviceContracts.flatMap((contract) => contract.assetNumbers)).size;

  return (
    <ServiceFrame title={t("nav.contracts")} subtitle={t("contracts.subtitle")} icon={<FileText size={24} strokeWidth={2} />}>
      <ServicePermissionNotice canEdit={canEdit} t={t} />
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ContractKpi icon={<BadgeCheck size={20} strokeWidth={2} />} label={t("contracts.kpi.active")} value={String(activeCount)} />
        <ContractKpi icon={<CalendarClock size={20} strokeWidth={2} />} label={t("contracts.kpi.expiring")} value={String(expiringCount)} />
        <ContractKpi icon={<CircleAlert size={20} strokeWidth={2} />} label={t("contracts.kpi.expired")} value={String(expiredCount)} />
        <ContractKpi icon={<Package size={20} strokeWidth={2} />} label={t("contracts.kpi.assets")} value={String(contractedAssets)} />
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <FilterSelectOrInput label={t("contracts.number")} type="text" value={numberFilter} onChange={setNumberFilter} />
          <FilterSelectOrInput label={t("field.customer")} type="text" value={customerFilter} onChange={setCustomerFilter} />
          <FilterSelect label={t("contracts.type")} value={typeFilter} onChange={setTypeFilter} options={[["all", t("common.all")], ...contractTypes.map((item) => [item.code, item.description] as [string, string])]} />
          <FilterSelect label={t("common.status")} value={statusFilter} onChange={setStatusFilter} options={[["all", t("common.all")], ["active", t("contracts.status.active")], ["expiring_soon", t("contracts.status.expiring_soon")], ["expired", t("contracts.status.expired")], ["cancelled", t("contracts.status.cancelled")], ["draft", t("contracts.status.draft")]]} />
          <FilterSelectOrInput label={t("contracts.startDate")} type="date" value={startDateFilter} onChange={setStartDateFilter} />
          <FilterSelectOrInput label={t("contracts.endDate")} type="date" value={endDateFilter} onChange={setEndDateFilter} />
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["contracts.number", "field.customer", "contracts.type", "contracts.startDate", "contracts.endDate", "common.status", "contracts.linkedAssetCount", "fiche.table.actions"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((contract) => (
                <tr key={contract.id} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-black text-slate-950">{contract.number}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{contract.customer}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{contract.contractTypeCode}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(contract.startDate)}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(contract.endDate)}</td>
                  <td className="break-words px-3 py-3"><ContractStatusBadge status={contract.status} t={t} /></td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{contract.assetNumbers.length}</td>
                  <td className="px-3 py-3">
                    <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-blue-50 hover:text-[#003B83]" onClick={() => setSelected(contract)}>
                      <Eye aria-hidden="true" size={14} strokeWidth={2} />
                      {t("agenda.action.open")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {selected && <ContractDetail contract={selected} contractTypes={contractTypes} onClose={() => setSelected(undefined)} t={t} />}
    </ServiceFrame>
  );
}

export function ServicePlaceholderView({ title, t }: { title: string; t: TranslationFn }) {
  return (
    <ServiceFrame title={title} subtitle={t("service.placeholder.body")} icon={<ClipboardList size={24} strokeWidth={2} />}>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold leading-6 text-slate-600 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        {t("service.placeholder.body")}
      </section>
    </ServiceFrame>
  );
}

function ServiceFrame({ children, icon, subtitle, title }: { children: React.ReactNode; icon: React.ReactNode; subtitle: string; title: string }) {
  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#003B83]">{title}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-500">{subtitle}</p>
          </div>
          <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#003B83]">{icon}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function ServiceFilters({
  dateFilter,
  onDateChange,
  onStatusChange,
  onTechnicianChange,
  onTypeChange,
  statusFilter,
  t,
  technicianFilter,
  typeFilter
}: {
  dateFilter: string;
  onDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTechnicianChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  statusFilter: string;
  t: TranslationFn;
  technicianFilter: string;
  typeFilter: string;
}) {
  const technicians = Array.from(new Set(interventions.map((item) => item.technician)));
  const types = Array.from(new Set(interventions.map((item) => item.type)));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <FilterSelectOrInput label={t("field.date")} type="date" value={dateFilter} onChange={onDateChange} />
        <FilterSelect label={t("service.technician")} value={technicianFilter} onChange={onTechnicianChange} options={[["all", t("common.all")], ...technicians.map((item) => [item, item] as [string, string])]} />
        <FilterSelect label={t("common.status")} value={statusFilter} onChange={onStatusChange} options={[["all", t("common.all")], ["planned", t("service.status.planned")], ["in_progress", t("service.status.in_progress")], ["completed", t("service.status.completed")], ["cancelled", t("service.status.cancelled")]]} />
        <FilterSelect label={t("service.interventionType")} value={typeFilter} onChange={onTypeChange} options={[["all", t("common.all")], ...types.map((item) => [item, item] as [string, string])]} />
      </div>
    </section>
  );
}

function FilterSelectOrInput({ label, onChange, type, value }: { label: string; onChange: (value: string) => void; type: string; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83]" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function FilterSelect({ label, onChange, options, value }: { label: string; onChange: (value: string) => void; options: Array<[string, string]>; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <select className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83]" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
    </label>
  );
}

function useCalendarInterventions(dateFilter: string, viewMode: PlanningViewMode) {
  return useMemo(
    () =>
      interventions.filter((item) => {
        if (viewMode === "day") return item.date === dateFilter;
        if (viewMode === "week") {
          const days = weekDates(dateFilter);
          return days.includes(item.date);
        }
        return item.date.startsWith(dateFilter.slice(0, 7));
      }),
    [dateFilter, viewMode]
  );
}

function useFilteredInterventions({ dateFilter, statusFilter, technicianFilter, typeFilter, viewMode }: { dateFilter: string; statusFilter: string; technicianFilter: string; typeFilter: string; viewMode: PlanningViewMode }) {
  return useMemo(
    () =>
      interventions.filter((item) => {
        const inDateScope = viewMode === "day" ? item.date === dateFilter : viewMode === "week" ? item.date >= "2026-05-30" && item.date <= "2026-06-05" : item.date.startsWith(dateFilter.slice(0, 7));
        return inDateScope && (technicianFilter === "all" || item.technician === technicianFilter) && (statusFilter === "all" || item.status === statusFilter) && (typeFilter === "all" || item.type === typeFilter);
      }),
    [dateFilter, statusFilter, technicianFilter, typeFilter, viewMode]
  );
}

function weekDates(date: string) {
  const selected = parseLocalDate(date);
  const day = selected.getDay() || 7;
  const monday = addDays(selected, 1 - day);
  return Array.from({ length: 7 }, (_, index) => toDateValue(addDays(monday, index)));
}

function monthDates(date: string) {
  const selected = parseLocalDate(date);
  const first = new Date(selected.getFullYear(), selected.getMonth(), 1);
  const firstDay = first.getDay() || 7;
  const gridStart = addDays(first, 1 - firstDay);
  return Array.from({ length: 35 }, (_, index) => toDateValue(addDays(gridStart, index)));
}

function planningRangeLabel(date: string, viewMode: PlanningViewMode) {
  if (viewMode === "day") return formatDate(date);
  if (viewMode === "week") {
    const days = weekDates(date);
    return `${formatDate(days[0])} - ${formatDate(days[6])}`;
  }

  return new Intl.DateTimeFormat("nl-BE", { month: "long", year: "numeric" }).format(parseLocalDate(date));
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateValue(date: Date) {
  return date.toLocaleDateString("en-CA");
}

function weekdayLabel(date: string) {
  return new Intl.DateTimeFormat("nl-BE", { weekday: "short" }).format(parseLocalDate(date));
}

function formatDayNumber(date: string) {
  return new Intl.DateTimeFormat("nl-BE", { day: "2-digit" }).format(parseLocalDate(date));
}

function statusBorder(status: InterventionStatus) {
  if (status === "completed") return "border-l-emerald-500";
  if (status === "in_progress") return "border-l-amber-500";
  if (status === "cancelled") return "border-l-red-500";
  return "border-l-[#003B83]";
}

function InterventionDetail({ canEdit, intervention, onClose, t }: { canEdit: boolean; intervention: ServiceIntervention; onClose: () => void; t: TranslationFn }) {
  const [messageOpen, setMessageOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-slate-950">{intervention.number}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">{intervention.customerName}</p>
          </div>
          <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" onClick={onClose}>
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <DetailField label={t("service.interventionNumber")} value={intervention.number} />
          <DetailField label={t("field.customer")} value={intervention.customerName} />
          <DetailField label={t("appointment.address")} value={intervention.address} />
          <DetailField label={t("lead.contact")} value={intervention.contactPerson} />
          <DetailField label={t("lead.phone")} value={intervention.phone} />
          <DetailField label={t("field.date")} value={`${formatDate(intervention.date)} ${intervention.time}`} />
          <DetailField label={t("service.technician")} value={intervention.technician} />
          <DetailField label={t("service.interventionType")} value={intervention.type} />
          <DetailField label={t("common.status")} value={t(`service.status.${intervention.status}`)} />
          <DetailField label={t("service.workOrderNo")} value={intervention.workOrderNo} />
          <DetailField label={t("service.description")} value={intervention.description} />
          <DetailField label={t("service.internalRemarks")} value={intervention.internalRemarks} />
        </div>
        <section className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.16em] text-slate-600">{t("nav.workOrders")}</h4>
              <p className="mt-2 text-lg font-black text-slate-950">{intervention.workOrderNo}</p>
            </div>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white hover:bg-[#002b60]" onClick={() => setMessageOpen(true)}>
              <ClipboardList aria-hidden="true" size={16} strokeWidth={2} />
              {t("service.openWorkOrder")}
            </button>
          </div>
        </section>
        {canEdit && <PlaceholderEditButton t={t} />}
        {messageOpen && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-black text-[#003B83]">
            {t("service.workOrderOpenMock")}
          </div>
        )}
      </section>
    </div>
  );
}

function AssetDetail({ asset, assetTypes, onClose, t }: { asset: ServiceAsset; assetTypes: TechnicalAssetType[]; onClose: () => void; t: TranslationFn; }) {
  const [messageOpen, setMessageOpen] = useState(false);
  const linkedWorkOrders = initialWorkOrders.filter((item) => item.asset?.number === asset.assetNumber);
  const linkedInterventions = interventions.filter((item) => item.number === asset.lastIntervention || linkedWorkOrders.some((workOrder) => workOrder.interventionNumber === item.number));
  const assetTypeLabel = assetTypes.find((item) => item.id === asset.assetType)?.labelKey;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#003B83]">{t("nav.assets")}</p>
            <h3 className="mt-1 text-2xl font-black text-slate-950">{asset.assetNumber}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">{asset.description}</p>
          </div>
          <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" onClick={onClose}>
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 xl:grid-cols-3">
            <WorkOrderSection icon={<PackageSearch size={20} strokeWidth={2} />} title={t("assets.detail.general")}>
              <div className="grid gap-2">
                <DetailField label={t("assets.assetNumber")} value={asset.assetNumber} />
                <DetailField label={t("workOrders.assetType")} value={assetTypeLabel ? t(assetTypeLabel) : asset.assetType} />
                <DetailField label={t("workOrders.assetDescription")} value={asset.description} />
                <DetailField label={t("fiche.sales.itemNo")} value={asset.itemNo} />
                <DetailField label={t("workOrders.serialNumber")} value={asset.serialNumber} />
                <DetailField label={t("common.status")} value={t(`assets.status.${asset.status}`)} />
              </div>
            </WorkOrderSection>
            <WorkOrderSection icon={<Building2 size={20} strokeWidth={2} />} title={t("assets.detail.customerLocation")}>
              <div className="grid gap-2">
                <DetailField label={t("field.customer")} value={asset.customer} />
                <DetailField label={t("appointment.address")} value={asset.address} />
                <DetailField label={t("assets.locationDescription")} value={asset.location} />
                <DetailField label={t("lead.contact")} value={asset.contactPerson} />
              </div>
            </WorkOrderSection>
            <WorkOrderSection icon={<Wrench size={20} strokeWidth={2} />} title={t("assets.detail.service")}>
              <div className="grid gap-2">
                <DetailField label={t("assets.lastMaintenance")} value={formatDate(asset.lastMaintenance)} />
                <DetailField label={t("assets.nextMaintenance")} value={formatDate(asset.nextMaintenance)} />
                <DetailField label={t("assets.maintenanceFrequency")} value={asset.maintenanceFrequency} />
                <DetailField label={t("assets.serviceControlType")} value={asset.serviceControlType} />
                <DetailField label={t("assets.lastIntervention")} value={asset.lastIntervention} />
                <DetailField label={t("assets.linkedContract")} value={asset.linkedContract} />
              </div>
            </WorkOrderSection>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <WorkOrderSection icon={<ClipboardList size={20} strokeWidth={2} />} title={t("nav.workOrders")}>
              <SimpleRows
                rows={linkedWorkOrders.map((item) => [item.number, formatDate(item.date), item.type, t(`workOrders.status.${item.status}`), item.technician])}
                headers={[t("service.workOrderNo"), t("field.date"), t("fiche.table.type"), t("common.status"), t("service.technician")]}
                actionLabel={t("agenda.action.open")}
                onEdit={linkedWorkOrders.length > 0 ? () => setMessageOpen(true) : undefined}
                t={t}
              />
            </WorkOrderSection>
            <WorkOrderSection icon={<CalendarDays size={20} strokeWidth={2} />} title={t("nav.interventions")}>
              <SimpleRows
                rows={linkedInterventions.map((item) => [item.number, formatDate(item.date), item.type, t(`service.status.${item.status}`), item.technician])}
                headers={[t("service.interventionNumber"), t("field.date"), t("fiche.table.type"), t("common.status"), t("service.technician")]}
                t={t}
              />
            </WorkOrderSection>
          </div>

          <WorkOrderSection icon={<History size={20} strokeWidth={2} />} title={t("assets.detail.history")}>
            <div className="grid gap-2">
              {asset.history.map((item) => (
                <div key={`${item.date}-${item.text}`} className="grid gap-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                  <p className="font-black text-slate-950">{formatDate(item.date)} - {item.type}</p>
                  <p className="font-semibold text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </WorkOrderSection>
          {messageOpen && <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-black text-[#003B83]">{t("assets.openWorkOrderMock")}</div>}
        </div>
      </section>
    </div>
  );
}

function ContractDetail({ contract, contractTypes, onClose, t }: { contract: ServiceContract; contractTypes: TechnicalContractType[]; onClose: () => void; t: TranslationFn }) {
  const [message, setMessage] = useState("");
  const linkedAssets = serviceAssets.filter((asset) => contract.assetNumbers.includes(asset.assetNumber));
  const linkedWorkOrders = initialWorkOrders.filter((workOrder) => workOrder.asset && contract.assetNumbers.includes(workOrder.asset.number));
  const linkedInterventions = interventions.filter((intervention) => linkedWorkOrders.some((workOrder) => workOrder.interventionNumber === intervention.number));
  const contractType = contractTypes.find((item) => item.code === contract.contractTypeCode);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#003B83]">{t("nav.contracts")}</p>
            <h3 className="mt-1 text-2xl font-black text-slate-950">{contract.number}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">{contract.customer}</p>
          </div>
          <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" onClick={onClose}>
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 xl:grid-cols-3">
            <WorkOrderSection icon={<FileText size={20} strokeWidth={2} />} title={t("contracts.detail.general")}>
              <div className="grid gap-2">
                <DetailField label={t("contracts.number")} value={contract.number} />
                <DetailField label={t("field.customer")} value={contract.customer} />
                <DetailField label={t("contracts.type")} value={contractType?.description ?? contract.contractTypeCode} />
                <DetailField label={t("common.status")} value={t(`contracts.status.${contract.status}`)} />
                <DetailField label={t("contracts.startDate")} value={formatDate(contract.startDate)} />
                <DetailField label={t("contracts.endDate")} value={formatDate(contract.endDate)} />
                <DetailField label={t("contracts.owner")} value={contract.owner} />
              </div>
            </WorkOrderSection>
            <WorkOrderSection icon={<ShieldCheck size={20} strokeWidth={2} />} title={t("contracts.coverage")}>
              <div className="grid gap-2">
                <BooleanLine label={t("contracts.coverage.maintenance")} value={contract.coverage.maintenance} t={t} />
                <BooleanLine label={t("contracts.coverage.interventions")} value={contract.coverage.interventions} t={t} />
                <BooleanLine label={t("contracts.coverage.workHours")} value={contract.coverage.workHours} t={t} />
                <BooleanLine label={t("contracts.coverage.travel")} value={contract.coverage.travel} t={t} />
                <BooleanLine label={t("contracts.coverage.parts")} value={contract.coverage.parts} t={t} />
              </div>
            </WorkOrderSection>
            <WorkOrderSection icon={<CalendarClock size={20} strokeWidth={2} />} title={t("contracts.financial")}>
              <div className="grid gap-2">
                <DetailField label={t("contracts.annualAmount")} value={formatEuro(contract.financial.annualAmount)} />
                <DetailField label={t("contracts.invoiceFrequency")} value={contract.financial.invoiceFrequency} />
                <DetailField label={t("contracts.lastInvoiceDate")} value={contract.financial.lastInvoiceDate === "-" ? "-" : formatDate(contract.financial.lastInvoiceDate)} />
              </div>
            </WorkOrderSection>
          </div>

          <WorkOrderSection icon={<Package size={20} strokeWidth={2} />} title={t("contracts.linkedAssets")}>
            <SimpleRows
              actionLabel={t("contracts.openAsset")}
              headers={[t("assets.assetNumber"), t("workOrders.assetType"), t("workOrders.assetDescription"), t("common.status"), t("assets.lastMaintenance")]}
              rows={linkedAssets.map((asset) => [asset.assetNumber, asset.assetType, asset.description, t(`assets.status.${asset.status}`), formatDate(asset.lastMaintenance)])}
              onEdit={linkedAssets.length > 0 ? () => setMessage(t("contracts.openAssetMock")) : undefined}
              t={t}
            />
          </WorkOrderSection>

          <div className="grid gap-4 xl:grid-cols-2">
            <WorkOrderSection icon={<ClipboardList size={20} strokeWidth={2} />} title={t("contracts.workOrderHistory")}>
              <SimpleRows
                actionLabel={t("contracts.openWorkOrder")}
                headers={[t("service.workOrderNo"), t("field.date"), t("fiche.table.type"), t("common.status"), t("service.technician")]}
                rows={linkedWorkOrders.map((item) => [item.number, formatDate(item.date), item.type, t(`workOrders.status.${item.status}`), item.technician])}
                onEdit={linkedWorkOrders.length > 0 ? () => setMessage(t("assets.openWorkOrderMock")) : undefined}
                t={t}
              />
            </WorkOrderSection>
            <WorkOrderSection icon={<Wrench size={20} strokeWidth={2} />} title={t("contracts.interventionHistory")}>
              <SimpleRows
                actionLabel={t("contracts.openIntervention")}
                headers={[t("service.interventionNumber"), t("field.date"), t("fiche.table.type"), t("common.status"), t("service.technician")]}
                rows={linkedInterventions.map((item) => [item.number, formatDate(item.date), item.type, t(`service.status.${item.status}`), item.technician])}
                onEdit={linkedInterventions.length > 0 ? () => setMessage(t("contracts.openInterventionMock")) : undefined}
                t={t}
              />
            </WorkOrderSection>
          </div>

          <WorkOrderSection icon={<MessageSquareText size={20} strokeWidth={2} />} title={t("contracts.notes")}>
            <div className="grid gap-2">
              {contract.notes.map((note) => <p key={note} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700">{note}</p>)}
            </div>
          </WorkOrderSection>
          {message && <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-black text-[#003B83]">{message}</div>}
        </div>
      </section>
    </div>
  );
}

function MaintenanceDetail({ maintenance, onClose, t }: { maintenance: MaintenanceRecord; onClose: () => void; t: TranslationFn }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#003B83]">{t("nav.maintenance")}</p><h3 className="mt-1 text-2xl font-black text-slate-950">{maintenance.number}</h3><p className="mt-1 text-sm font-bold text-slate-500">{maintenance.customer} - {maintenance.assetDescription}</p></div>
          <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" onClick={onClose}><X aria-hidden="true" size={18} strokeWidth={2} /></button>
        </div>
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 xl:grid-cols-2">
            <WorkOrderSection icon={<Package size={20} strokeWidth={2} />} title={t("maintenance.detail.general")}>
              <div className="grid gap-2 md:grid-cols-2">
                <DetailField label={t("maintenance.number")} value={maintenance.number} />
                <DetailField label={t("field.customer")} value={maintenance.customer} />
                <DetailField label={t("workOrders.asset")} value={maintenance.assetDescription} />
                <DetailField label={t("workOrders.assetType")} value={maintenance.assetType} />
                <DetailField label={t("contracts.number")} value={maintenance.contractNumber} />
                <DetailField label={t("maintenance.frequency")} value={maintenance.frequencyCode} />
                <DetailField label={t("assets.lastMaintenance")} value={formatDate(maintenance.lastMaintenance)} />
                <DetailField label={t("assets.nextMaintenance")} value={formatDate(maintenance.nextMaintenance)} />
                <DetailField label={t("common.status")} value={t(`maintenance.status.${maintenance.status}`)} />
              </div>
            </WorkOrderSection>
            <WorkOrderSection icon={<CalendarPlus size={20} strokeWidth={2} />} title={t("maintenance.planning")}>
              <div className="grid gap-2">
                <DetailField label={t("maintenance.plannedDate")} value={formatDate(maintenance.plannedDate)} />
                <DetailField label={t("maintenance.plannedTechnician")} value={maintenance.plannedTechnician} />
                <DetailField label={t("maintenance.priority")} value={maintenance.priority} />
              </div>
            </WorkOrderSection>
          </div>
          <WorkOrderSection icon={<History size={20} strokeWidth={2} />} title={t("maintenance.history")}>
            <SimpleRows rows={maintenance.history.map((item) => [formatDate(item.date), item.interventionNumber, item.workOrderNumber, item.technician, item.status])} headers={[t("field.date"), t("service.interventionNumber"), t("service.workOrderNo"), t("service.technician"), t("common.status")]} t={t} />
          </WorkOrderSection>
        </div>
      </section>
    </div>
  );
}

function MaintenancePlanModal({ draft, maintenance, onCancel, onChange, onSave, t }: { draft: { date: string; note: string; technician: string; time: string }; maintenance: MaintenanceRecord; onCancel: () => void; onChange: (draft: { date: string; note: string; technician: string; time: string }) => void; onSave: () => void; t: TranslationFn }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/40 p-4">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-slate-950">{t("maintenance.planIntervention")}</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">{maintenance.number} - {maintenance.customer}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <WorkInput label={t("field.date")} value={draft.date} onChange={(date) => onChange({ ...draft, date })} />
          <WorkInput label={t("service.time")} value={draft.time} onChange={(time) => onChange({ ...draft, time })} />
          <WorkInput label={t("service.technician")} value={draft.technician} onChange={(technician) => onChange({ ...draft, technician })} />
          <WorkInput label={t("appointment.notes")} value={draft.note} onChange={(note) => onChange({ ...draft, note })} />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-black" onClick={onCancel}>{t("common.cancel")}</button>
          <button className="min-h-11 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white" onClick={onSave}>{t("maintenance.planIntervention")}</button>
        </div>
      </section>
    </div>
  );
}

function WorkOrderDetail({ canEdit, onClose, onUpdate, serviceControls, t, workOrder }: { canEdit: boolean; onClose: () => void; onUpdate: (workOrder: WorkOrder) => void; serviceControls: TechnicalServiceControl[]; t: TranslationFn; workOrder: WorkOrder }) {
  const [draft, setDraft] = useState(workOrder);
  const [workDraft, setWorkDraft] = useState<WorkPerformed>({ id: "", description: "", hours: "1", note: "" });
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const availableStock = serviceLocalStockItems.filter((item) => item.stock > 0);
  const firstStockItem = availableStock[0];
  const [materialDraft, setMaterialDraft] = useState<UsedMaterial>({
    id: "",
    itemNo: firstStockItem?.itemNo ?? "",
    description: firstStockItem?.description ?? "",
    quantity: "1",
    materialType: firstStockItem?.materialType ?? "new",
    commercialHandling: firstStockItem?.materialType === "contract" ? "contract" : "invoice"
  });
  const [confirmClose, setConfirmClose] = useState(false);
  const [success, setSuccess] = useState(false);
  const filteredServiceControls = draft.asset ? serviceControls.filter((control) => control.type === draft.asset?.type) : [];

  function commit(next: WorkOrder) {
    setDraft(next);
    onUpdate(next);
  }

  function addWork() {
    if (!canEdit || !workDraft.description.trim()) return;
    if (editingWorkIndex !== null) {
      commit({
        ...draft,
        workPerformed: draft.workPerformed.map((item, index) => (index === editingWorkIndex ? { ...workDraft, id: item.id } : item)),
      });
      setEditingWorkIndex(null);
    } else {
      commit({ ...draft, workPerformed: [...draft.workPerformed, { ...workDraft, id: `wp-${Date.now()}` }] });
    }
    setWorkDraft({ id: "", description: "", hours: "1", note: "" });
  }

  function addMaterial() {
    if (!canEdit) return;
    commit({ ...draft, materials: [...draft.materials, { ...materialDraft, id: `mat-${Date.now()}` }] });
    setMaterialDraft({
      id: "",
      itemNo: firstStockItem?.itemNo ?? "",
      description: firstStockItem?.description ?? "",
      quantity: "1",
      materialType: firstStockItem?.materialType ?? "new",
      commercialHandling: firstStockItem?.materialType === "contract" ? "contract" : "invoice"
    });
  }

  function selectMaterial(itemNo: string) {
    const stockItem = availableStock.find((item) => item.itemNo === itemNo);
    setMaterialDraft((current) => ({
      ...current,
      itemNo,
      description: stockItem?.description ?? current.description,
      materialType: stockItem?.materialType ?? current.materialType,
      commercialHandling: stockItem?.materialType === "contract" ? "contract" : current.commercialHandling === "contract" ? "invoice" : current.commercialHandling
    }));
  }

  function selectMaterialType(materialType: UsedMaterial["materialType"]) {
    setMaterialDraft((current) => ({
      ...current,
      materialType,
      commercialHandling: materialType === "contract" ? "contract" : current.commercialHandling === "contract" ? "invoice" : current.commercialHandling
    }));
  }

  function closeWorkOrder() {
    const closed = { ...draft, status: "completed" as WorkOrderStatus };
    commit(closed);
    setConfirmClose(false);
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 2600);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-slate-950">{draft.number}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">{draft.customerName}</p>
          </div>
          <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" onClick={onClose}>
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2.5">
                <ReportHeaderField label={t("field.customer")} value={draft.customerName} />
                <ReportHeaderField label={t("lead.contact")} value={draft.contactPerson} />
                <ReportHeaderField label={t("lead.phone")} value={draft.phone} />
                <ReportHeaderField label={t("appointment.address")} value={draft.address} />
              </div>
              <div className="grid gap-2.5">
                <ReportHeaderField label={t("service.workOrderNo")} value={draft.number} />
                <ReportHeaderField label={t("service.interventionNumber")} value={draft.interventionNumber} />
                <ReportHeaderField label={t("field.date")} value={`${formatDate(draft.date)} ${draft.time}`} />
                <ReportHeaderField label={t("service.technician")} value={draft.technician} />
                <ReportHeaderField label={t("common.status")} value={t(`workOrders.status.${draft.status}`)} />
              </div>
            </div>
            {draft.asset && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-white px-3 py-2.5">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#003B83]/10 text-[#003B83]">
                  <Package aria-hidden="true" size={16} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{t("workOrders.asset")}</p>
                  <p className="mt-0.5 break-words text-sm font-black text-slate-950">{draft.asset.description}</p>
                  <p className="mt-0.5 break-words text-xs font-bold text-slate-600">{t("workOrders.serialNumber")}: {draft.asset.serialNumber}</p>
                  <p className="break-words text-xs font-bold text-slate-600">{t("workOrders.assetLocation")}: {draft.asset.location}</p>
                </div>
              </div>
            )}
          </section>

          <WorkOrderSection compact icon={<Wrench size={20} strokeWidth={2} />} title={t("workOrders.description")}>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold leading-6 text-slate-700">{draft.description}</p>
          </WorkOrderSection>

          <WorkOrderSection icon={<Wrench size={20} strokeWidth={2} />} title={t("workOrders.performed")}>
            {canEdit && (
              <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_10rem]">
                  <div className="min-w-0">
                    <WorkInput label={t("workOrders.workDescription")} value={workDraft.description} onChange={(description) => setWorkDraft((current) => ({ ...current, description }))} />
                  </div>
                  <WorkInput label={t("workOrders.hours")} value={workDraft.hours} onChange={(hours) => setWorkDraft((current) => ({ ...current, hours }))} />
                  <div className="min-w-0 lg:col-span-2">
                    <WorkInput label={t("appointment.notes")} value={workDraft.note} onChange={(note) => setWorkDraft((current) => ({ ...current, note }))} />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="min-h-11 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white" onClick={addWork}>{editingWorkIndex === null ? t("fiche.action.add") : t("common.save")}</button>
                </div>
              </div>
            )}
            <SimpleRows
              rows={draft.workPerformed.map((item) => [item.description, item.hours, item.note || "-"])}
              headers={[t("workOrders.workDescription"), t("workOrders.hours"), t("appointment.notes")]}
              onEdit={canEdit ? (index) => {
                setEditingWorkIndex(index);
                setWorkDraft(draft.workPerformed[index]);
              } : undefined}
              onDelete={canEdit ? (index) => {
                commit({ ...draft, workPerformed: draft.workPerformed.filter((_, i) => i !== index) });
                if (editingWorkIndex === index) {
                  setEditingWorkIndex(null);
                  setWorkDraft({ id: "", description: "", hours: "1", note: "" });
                }
              } : undefined}
              t={t}
            />
          </WorkOrderSection>

          <WorkOrderSection icon={<ShieldCheck size={20} strokeWidth={2} />} title={t("workOrders.serviceControls")}>
            {filteredServiceControls.length > 0 ? (
              <div className="grid gap-2">
                {filteredServiceControls.map((control) => (
                  <label key={control.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="flex min-w-0 flex-1 items-start gap-3">
                      <input
                        checked={Boolean(draft.serviceControlResults[control.id])}
                        className="mt-1 size-4 accent-[#003B83]"
                        disabled={!canEdit}
                        type="checkbox"
                        onChange={(event) => commit({ ...draft, serviceControlResults: { ...draft.serviceControlResults, [control.id]: event.target.checked } })}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-slate-950">{control.point}</span>
                        <span className="block text-sm font-semibold text-slate-600">{control.description}</span>
                      </span>
                    </span>
                    <Badge tone={control.required ? "amber" : "slate"}>
                      <span className="inline-flex items-center gap-1.5">
                        {control.required && <CircleAlert aria-hidden="true" size={13} strokeWidth={2} />}
                        {control.required ? t("workOrders.required") : t("workOrders.optional")}
                      </span>
                    </Badge>
                  </label>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-500">{t("workOrders.noServiceControls")}</p>
            )}
          </WorkOrderSection>

          <WorkOrderSection icon={<Package size={20} strokeWidth={2} />} title={t("workOrders.materials")}>
            {canEdit && (
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("workOrders.localStockOnly")}</p>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)_8rem]">
                  <WorkSelect label={t("fiche.sales.itemNo")} value={materialDraft.itemNo} onChange={selectMaterial} options={availableStock.map((item) => [item.itemNo, `${item.itemNo} - ${item.stock} ${t("stock.inStockShort")}`])} />
                  <WorkInput label={t("fiche.sales.description")} value={materialDraft.description} onChange={(description) => setMaterialDraft((current) => ({ ...current, description }))} />
                  <WorkInput label={t("fiche.sales.quantity")} value={materialDraft.quantity} onChange={(quantity) => setMaterialDraft((current) => ({ ...current, quantity }))} />
                  <WorkSelect
                    label={t("workOrders.materialType")}
                    value={materialDraft.materialType}
                    onChange={(value) => selectMaterialType(value as UsedMaterial["materialType"])}
                    options={[["contract", t("workOrders.materialType.contract")], ["new", t("workOrders.materialType.new")]]}
                  />
                  <WorkSelect
                    label={t("workOrders.commercialHandling")}
                    value={materialDraft.commercialHandling}
                    onChange={(value) => setMaterialDraft((current) => ({ ...current, commercialHandling: value as UsedMaterial["commercialHandling"] }))}
                    options={
                      materialDraft.materialType === "contract"
                        ? [["contract", t("workOrders.commercialHandling.contract")]]
                        : [["invoice", t("workOrders.commercialHandling.invoice")], ["order", t("workOrders.commercialHandling.order")]]
                    }
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="min-h-11 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white" onClick={addMaterial}>{t("workOrders.material.add")}</button>
                </div>
              </div>
            )}
            <SimpleRows
              rows={draft.materials.map((item) => [
                item.itemNo,
                item.description,
                item.quantity,
                t(`workOrders.materialType.${item.materialType}`),
                t(`workOrders.commercialHandling.${item.commercialHandling}`)
              ])}
              headers={[t("fiche.sales.itemNo"), t("fiche.sales.description"), t("fiche.sales.quantity"), t("workOrders.materialType"), t("workOrders.commercialHandling")]}
              onDelete={canEdit ? (index) => commit({ ...draft, materials: draft.materials.filter((_, i) => i !== index) }) : undefined}
              t={t}
            />
          </WorkOrderSection>

          <WorkOrderSection icon={<Camera size={20} strokeWidth={2} />} title={t("workOrders.photos")}>
            {canEdit && <button className="mb-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white" onClick={() => commit({ ...draft, photos: [...draft.photos, `${t("workOrders.photo")} ${draft.photos.length + 1}`] })}><Plus size={16} strokeWidth={2} />{t("workOrders.photo.add")}</button>}
            <div className="grid gap-2">
              {draft.photos.map((photo) => <div key={photo} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700"><span>{photo}</span><button className="text-[#003B83]">{t("workOrders.photo.view")}</button></div>)}
            </div>
          </WorkOrderSection>

          <WorkOrderSection icon={<ClipboardPen size={20} strokeWidth={2} />} title={t("workOrders.operatorRemarks")}>
            <textarea className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83]" readOnly={!canEdit} value={draft.operatorRemarks} onChange={(event) => commit({ ...draft, operatorRemarks: event.target.value })} />
          </WorkOrderSection>

          <WorkOrderSection icon={<MessageSquareText size={20} strokeWidth={2} />} title={t("workOrders.customerRemark")}>
            <textarea className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83]" readOnly={!canEdit} value={draft.customerRemark} onChange={(event) => commit({ ...draft, customerRemark: event.target.value })} />
          </WorkOrderSection>

          <WorkOrderSection icon={<PenTool size={20} strokeWidth={2} />} title={t("workOrders.signatures")}>
            <div className="grid gap-4 md:grid-cols-2">
              <SignatureCard
                canEdit={canEdit}
                isSigned={draft.operatorSignature}
                t={t}
                title={t("workOrders.signature.operator")}
                onAdd={() => commit({ ...draft, operatorSignature: true })}
                onRemove={() => commit({ ...draft, operatorSignature: false })}
              />
              <SignatureCard
                canEdit={canEdit}
                isSigned={draft.customerSignature}
                t={t}
                title={t("workOrders.signature.customer")}
                onAdd={() => commit({ ...draft, customerSignature: true })}
                onRemove={() => commit({ ...draft, customerSignature: false })}
              />
            </div>
          </WorkOrderSection>

          <div className="flex justify-end">
            <button disabled={!canEdit || draft.status === "completed"} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#003B83] px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300" onClick={() => setConfirmClose(true)}>
              <CircleCheckBig size={18} strokeWidth={2} />
              {t("workOrders.close")}
            </button>
          </div>
        </div>

        {confirmClose && (
          <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/40 p-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
              <h4 className="text-lg font-black text-slate-950">{t("workOrders.close")}</h4>
              <div className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                <p>{t("workOrders.performed")}: {draft.workPerformed.length}</p>
                <p>{t("workOrders.materials")}: {draft.materials.length}</p>
                <p>{t("workOrders.signature.customer")}: {draft.customerSignature ? t("lead.yes") : t("lead.no")}</p>
                <p>{t("workOrders.signature.operator")}: {draft.operatorSignature ? t("lead.yes") : t("lead.no")}</p>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-black" onClick={() => setConfirmClose(false)}>{t("common.cancel")}</button>
                <button className="min-h-11 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white" onClick={closeWorkOrder}>{t("workOrders.close")}</button>
              </div>
            </section>
          </div>
        )}
        {success && <div className="fixed bottom-24 right-6 z-[70] rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">{t("workOrders.closedSuccess")}</div>}
      </section>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ReportHeaderField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-0.5 break-words text-sm font-black leading-5 text-slate-950">{value}</p>
    </div>
  );
}

function BooleanLine({ label, t, value }: { label: string; t: TranslationFn; value: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <Badge tone={value ? "green" : "slate"}>{value ? t("lead.yes") : t("lead.no")}</Badge>
    </div>
  );
}

function ContractKpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        <span className="grid size-11 place-items-center rounded-xl bg-[#003B83]/10 text-[#003B83]">{icon}</span>
      </div>
    </article>
  );
}

function WorkOrderSection({ children, compact, icon, title }: { children: React.ReactNode; compact?: boolean; icon: React.ReactNode; title: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)] ${compact ? "p-3" : "p-4"}`}>
      <div className={`flex items-center gap-3 ${compact ? "mb-3" : "mb-4"}`}>
        <span className={`grid place-items-center rounded-xl bg-[#003B83]/10 text-[#003B83] ${compact ? "size-9" : "size-10"}`}>{icon}</span>
        <h4 className="text-sm font-black uppercase tracking-[0.16em] text-slate-600">{title}</h4>
      </div>
      {children}
    </section>
  );
}

function SignatureCard({ canEdit, isSigned, onAdd, onRemove, t, title }: { canEdit: boolean; isSigned: boolean; onAdd: () => void; onRemove: () => void; t: TranslationFn; title: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h5 className="text-sm font-black text-slate-950">{title}</h5>
      <div className="mt-3 grid min-h-32 place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-white text-sm font-black text-slate-400">
        {isSigned ? t("workOrders.signature.present") : t("workOrders.signature.placeholder")}
      </div>
      {canEdit && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="min-h-10 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white" onClick={onAdd}>{t("workOrders.signature.add")}</button>
          <button className="min-h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700" onClick={onRemove}>{t("workOrders.signature.remove")}</button>
        </div>
      )}
    </article>
  );
}

function WorkInput({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input className="min-h-11 w-full min-w-0 rounded-xl border-2 border-slate-200 bg-white px-3 text-sm font-bold text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#003B83] focus:bg-white focus:ring-4 focus:ring-blue-100" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function WorkSelect({ label, onChange, options, value }: { label: string; onChange: (value: string) => void; options: Array<[string, string]>; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <select className="min-h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#003B83]" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
    </label>
  );
}

function SimpleRows({ actionLabel, headers, onDelete, onEdit, rows, t }: { actionLabel?: string; headers: string[]; onDelete?: (index: number) => void; onEdit?: (index: number) => void; rows: string[][]; t: TranslationFn }) {
  const hasActions = Boolean(onDelete || onEdit);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{header}</th>)}
            {hasActions && <th className="px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("fiche.table.actions")}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, index) => (
            <tr key={`${row.join("-")}-${index}`}>
              {row.map((cell) => <td key={cell} className="break-words px-3 py-3 font-semibold text-slate-700">{cell}</td>)}
              {hasActions && (
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    {onEdit && <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-black text-[#003B83]" onClick={() => onEdit(index)}><Pencil size={14} strokeWidth={2} />{actionLabel ?? t("userManagement.action.edit")}</button>}
                    {onDelete && <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-black text-red-700" onClick={() => onDelete(index)}><Trash2 size={14} strokeWidth={2} />{t("lead.action.delete")}</button>}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkOrderStatusBadge({ status, t }: { status: WorkOrderStatus; t: TranslationFn }) {
  const tone = status === "completed" ? "green" : status === "in_progress" || status === "on_the_way" ? "amber" : status === "cancelled" ? "red" : "blue";
  return <Badge tone={tone}>{t(`workOrders.status.${status}`)}</Badge>;
}

function AssetStatusBadge({ status, t }: { status: ServiceAssetStatus; t: TranslationFn }) {
  const tone = status === "active" ? "green" : status === "maintenance_due" ? "amber" : status === "out_of_service" ? "red" : status === "replaced" ? "slate" : "blue";
  return <Badge tone={tone}>{t(`assets.status.${status}`)}</Badge>;
}

function ContractStatusBadge({ status, t }: { status: ServiceContractStatus; t: TranslationFn }) {
  const tone = status === "active" ? "green" : status === "expiring_soon" ? "amber" : status === "expired" || status === "cancelled" ? "red" : status === "draft" ? "slate" : "blue";
  return <Badge tone={tone}>{t(`contracts.status.${status}`)}</Badge>;
}

function MaintenanceStatusBadge({ status, t }: { status: MaintenanceStatus; t: TranslationFn }) {
  const tone = status === "completed" ? "green" : status === "due_soon" ? "amber" : status === "overdue" ? "red" : status === "cancelled" ? "slate" : "blue";
  return <Badge tone={tone}>{t(`maintenance.status.${status}`)}</Badge>;
}

function ServiceStatusBadge({ status, t }: { status: InterventionStatus; t: TranslationFn }) {
  const tone = status === "completed" ? "green" : status === "in_progress" ? "amber" : status === "cancelled" ? "red" : "blue";
  return (
    <Badge tone={tone}>
      <span className="inline-flex items-center gap-1.5">
        <CircleDot aria-hidden="true" size={13} strokeWidth={2} />
        {t(`service.status.${status}`)}
      </span>
    </Badge>
  );
}

function ServicePermissionNotice({ canEdit, t }: { canEdit: boolean; t: TranslationFn }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-600">
      {canEdit ? t("service.editable") : t("service.readOnly")}
    </div>
  );
}

function PlaceholderEditButton({ t }: { t: TranslationFn }) {
  return (
    <button className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#003B83] bg-white px-4 text-sm font-black text-[#003B83] hover:bg-blue-50">
      <Wrench aria-hidden="true" size={16} strokeWidth={2} />
      {t("service.editPlaceholder")}
    </button>
  );
}

function isAssetMaintenanceDue(asset: ServiceAsset) {
  return asset.status === "maintenance_due" || asset.nextMaintenance <= "2026-05-31";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("nl-BE", { currency: "EUR", style: "currency" }).format(value);
}
