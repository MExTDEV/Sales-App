import type { Appointment, CashSheet, Country, MockScenario, MockUser, Permission, Role } from "@/types/sales";

export const countries: Country[] = [
  { code: "BE", name: "Belgium", timezone: "Europe/Brussels" },
  { code: "NL", name: "Netherlands", timezone: "Europe/Amsterdam" },
  { code: "DE", name: "Germany", timezone: "Europe/Berlin" }
];

const basePermissions: Record<Role, Permission[]> = {
  representative: ["ViewOwnAppointments", "ViewService", "ChangeOwnAppointmentStatus"],
  sales_leader: ["ViewOwnAppointments", "ViewTeamAppointments", "ViewService", "ViewContracts", "ViewAEDs", "ChangeOwnAppointmentStatus"],
  admin: [
    "ViewOwnAppointments",
    "ViewTeamAppointments",
    "ViewService",
    "EditService",
    "ViewContracts",
    "EditContracts",
    "ViewAEDs",
    "EditAEDs",
    "ViewWorkOrders",
    "EditWorkOrders",
    "UnblockCashSheetWorkday",
    "ChangeOwnAppointmentStatus"
  ],
  superadmin: [
    "ViewOwnAppointments",
    "ViewTeamAppointments",
    "ViewService",
    "EditService",
    "ViewContracts",
    "EditContracts",
    "ViewAEDs",
    "EditAEDs",
    "ViewWorkOrders",
    "EditWorkOrders",
    "UnblockCashSheetWorkday",
    "ChangeOwnAppointmentStatus"
  ]
};

export const mockScenarios: Array<{ id: MockScenario; labelKey: string }> = [
  { id: "blocked", labelKey: "scenario.blocked" },
  { id: "unblocked", labelKey: "scenario.unblocked" },
  { id: "editable_service", labelKey: "scenario.editableService" },
  { id: "leader_scope", labelKey: "scenario.leaderScope" },
  { id: "admin_scope", labelKey: "scenario.adminScope" }
];

export function createMockUser({
  countryCode,
  preferredLanguage,
  role,
  scenario,
  timezone
}: {
  countryCode: string;
  preferredLanguage: string;
  role: Role;
  scenario: MockScenario;
  timezone: string;
}): MockUser {
  const country = countries.find((item) => item.code === countryCode) ?? countries[0];
  const scopedRole: Role = scenario === "leader_scope" ? "sales_leader" : scenario === "admin_scope" ? "admin" : role;
  const scenarioPermissions: Permission[] =
    scenario === "editable_service" ? ["EditService", "EditContracts", "EditAEDs", "EditWorkOrders"] : [];

  return {
    id: scopedRole === "representative" ? "u-rep-01" : `u-${scopedRole}`,
    name:
      scopedRole === "representative"
        ? "An De Smet"
        : scopedRole === "sales_leader"
          ? "Tom Verbruggen"
          : scopedRole === "admin"
            ? "Sofie Jacobs"
            : "M.Ex.T. Superadmin",
    role: scopedRole,
    country: country.code,
    establishmentNumber: country.code === "BE" ? "BE-ROE" : country.code === "NL" ? "NL-TIL" : "DE-ESS",
    isActive: true,
    hasPstAccess: scopedRole === "superadmin" || scopedRole === "admin" || scopedRole === "sales_leader" || scenario === "editable_service",
    timezone: timezone || country.timezone,
    preferredLanguage: preferredLanguage === "fr" || preferredLanguage === "de" ? preferredLanguage : "nl",
    teamId: scopedRole === "representative" ? "team-north" : "team-leadership",
    permissions: Array.from(new Set([...basePermissions[scopedRole], ...scenarioPermissions]))
  };
}

const preparationDates = [
  "2026-06-04",
  "2026-06-05",
  "2026-06-06",
  "2026-06-07",
  "2026-06-08",
  "2026-06-09",
  "2026-06-10",
  "2026-06-11",
  "2026-06-12",
  "2026-06-13",
  "2026-06-14",
  "2026-06-15",
  "2026-06-16",
  "2026-06-17",
  "2026-06-18"
];

type PreparationTemplate = [string, Appointment["type"], string, string, string, string, string, string, number, number, number];

const preparationTemplates: PreparationTemplate[] = [
  ["08:00", "customer", "C-SA-101", "Apotheek Zuidrand", "Healthcare", "Plantin en Moretuslei 94", "2018", "Superadmin review: contract en AED-status nakijken.", 2, 3, 0],
  ["09:10", "prospect", "P-SA-202", "Facility Point Berchem", "Saleslijst", "Grotesteenweg 214", "2600", "Prospectvoorbereiding voor demo preventiemateriaal.", 0, 0, 0],
  ["10:20", "customer", "C-SA-303", "Medisch Centrum Harmonie", "Healthcare", "Mechelsesteenweg 184", "2018", "Open werkbon en onderhoudscontract controleren.", 1, 2, 1],
  ["11:30", "follow_up", "C-SA-404", "Logistics City Antwerpen", "Logistics", "Lange Leemstraat 372", "2018", "Opvolging prijsafspraak en leveringsplanning.", 1, 0, 0],
  ["13:00", "customer", "C-SA-505", "Hotel Sint-Andries", "Hospitality", "Nationalestraat 41", "2000", "Historiek orders en facturen voorbereiden.", 2, 1, 0],
  ["14:10", "demo", "P-SA-606", "Sportcentrum Zuid", "Outbound", "Vlaamsekaai 18", "2000", "Demo AED-trainer en blusdekenpakket voorbereiden.", 0, 0, 0],
  ["15:30", "prospect", "P-SA-707", "Retailgroep Kiel", "Preprospect", "Kielsevest 43", "2020", "Segmentinformatie en eerste verkoopkansen klaarzetten.", 0, 0, 0],
  ["16:45", "customer", "C-SA-808", "KMO Park Merksem", "B2B", "Bredabaan 421", "2170", "Laatste aankopen, open servicepunten en omzetstatus nakijken.", 3, 1, 0]
];

const preparationCoordinates: Record<string, { latitude: number; longitude: number }> = {
  "Plantin en Moretuslei 94": { latitude: 51.2097, longitude: 4.4282 },
  "Grotesteenweg 214": { latitude: 51.1975, longitude: 4.4202 },
  "Mechelsesteenweg 184": { latitude: 51.2033, longitude: 4.414 },
  "Lange Leemstraat 372": { latitude: 51.2049, longitude: 4.4079 },
  "Nationalestraat 41": { latitude: 51.2161, longitude: 4.3985 },
  "Vlaamsekaai 18": { latitude: 51.2093, longitude: 4.3929 },
  "Kielsevest 43": { latitude: 51.2008, longitude: 4.3849 },
  "Bredabaan 421": { latitude: 51.241, longitude: 4.436 }
};

const representativePreparationAppointments = preparationTemplates.map((template, index) =>
  preparationAppointmentFromTemplate(`prep-rep-${index + 1}`, template, { date: "2026-06-05", assignedUserId: "u-rep-01" })
);

const superadminPreparationAppointments = preparationDates.flatMap((date) =>
  preparationTemplates.map((template, index) =>
    preparationAppointmentFromTemplate(`prep-sa-${date}-${index + 1}`, template, { date, assignedUserId: "u-superadmin" })
  )
);

const preparationAppointments: Appointment[] = [
  ...representativePreparationAppointments,
  ...superadminPreparationAppointments
];

function preparationAppointmentFromTemplate(
  id: string,
  template: PreparationTemplate,
  options: {
    assignedUserId?: string;
    date?: string;
  }
) {
  const [time, type, number, name, segmentOrSource, line1, postalCode, notes, contracts, aeds, workOrders] = template;

  return preparationAppointment(id, time, type, number, name, segmentOrSource, line1, postalCode, notes, contracts, aeds, workOrders, options);
}

function preparationAppointment(
  id: string,
  time: string,
  type: Appointment["type"],
  number: string,
  name: string,
  segmentOrSource: string,
  line1: string,
  postalCode: string,
  notes: string,
  contracts: number,
  aeds: number,
  workOrders: number,
  options: {
    assignedUserId?: string;
    date?: string;
  } = {}
): Appointment {
  const coordinates = preparationCoordinates[line1];

  const base = {
    id,
    date: options.date ?? "2026-06-05",
    time,
    type,
    status: "planned" as const,
    invoiceRevenue: 0,
    orderRevenue: 0,
    assignedUserId: options.assignedUserId ?? "u-rep-01",
    contacts: [
      {
        name: "Contactpersoon",
        role: "Aankoop",
        phone: "+32 470 00 00 00",
        email: "contact@example.com",
        isActive: true
      }
    ],
    address: {
      line1,
      postalCode,
      city: "Antwerpen",
      country: "BE" as const,
      isActive: true,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    },
    notes,
    service: {
      contracts,
      aeds,
      workOrders,
      lastIntervention: contracts > 0 ? "28/05/2026" : "Geen historiek",
      maintenanceStatus: workOrders > 0 ? "Werkbon open voor opvolging" : "Geen blokkeringen"
    },
    history: [
      { at: "04/06/2026 16:10", text: "Afspraak toegevoegd aan voorbereiding volgende werkdag." },
      { at: "04/06/2026 16:20", text: "Voorbereidingsnotitie beschikbaar." }
    ]
  };

  return type === "prospect" || type === "demo"
    ? {
        ...base,
        prospect: {
          number,
          name,
          source: segmentOrSource,
          potential: type === "demo" ? "High" : "Medium"
        }
      }
    : {
        ...base,
        customer: {
          number,
          name,
          vat: "BE0000.000.000",
          segment: segmentOrSource
        }
      };
}

export const appointments: Appointment[] = [
  {
    id: "apt-1001",
    date: "2026-05-30",
    time: "09:00",
    type: "customer",
    status: "planned",
    invoiceRevenue: 0,
    orderRevenue: 0,
    label: "LA",
    assignedUserId: "u-rep-01",
    customer: {
      number: "C-10482",
      name: "Apotheek Van Dijck",
      vat: "BE0421.884.219",
      segment: "Healthcare"
    },
    contacts: [
      {
        name: "Els Van Dijck",
        role: "Zaakvoerder",
        phone: "+32 475 12 34 56",
        email: "els@vandijck.example",
        isActive: true
      }
    ],
    address: {
      line1: "Mechelsesteenweg 184",
      postalCode: "2018",
      city: "Antwerpen",
      country: "BE",
      isActive: true
    },
    notes: "AED contract en nieuwe refill-set bespreken.",
    service: {
      contracts: 2,
      aeds: 3,
      workOrders: 1,
      lastIntervention: "12/05/2026",
      maintenanceStatus: "1 AED onderhoud binnen 30 dagen"
    },
    history: [
      { at: "24/05/2026 16:22", text: "Afspraak ingepland vanuit Business Central import." },
      { at: "28/05/2026 09:15", text: "Vertegenwoordiger heeft voorbereidende notitie toegevoegd." }
    ]
  },
  {
    id: "apt-1002",
    date: "2026-05-30",
    time: "11:30",
    type: "prospect",
    status: "planned",
    invoiceRevenue: 0,
    orderRevenue: 0,
    assignedUserId: "u-rep-01",
    prospect: {
      number: "P-22014",
      name: "Sportcentrum De Linde",
      source: "Outbound",
      potential: "High"
    },
    contacts: [
      {
        name: "Koen Peeters",
        role: "Facility manager",
        phone: "+32 486 33 90 12",
        email: "koen@delinde.example",
        isActive: true
      }
    ],
    address: {
      line1: "Lindelaan 22",
      postalCode: "3500",
      city: "Hasselt",
      country: "BE",
      isActive: true
    },
    notes: "Demo materiaal meenemen. Prospect vraagt prijsvergelijking.",
    service: {
      contracts: 0,
      aeds: 0,
      workOrders: 0,
      lastIntervention: "Geen historiek",
      maintenanceStatus: "Niet van toepassing"
    },
    history: [{ at: "27/05/2026 10:40", text: "Prospect aangemaakt vanuit saleslijst." }]
  },
  {
    id: "apt-1003",
    date: "2026-05-30",
    time: "14:00",
    type: "demo",
    status: "completed",
    statusChangedAt: "2026-05-30T14:54:00.000+02:00",
    invoiceRevenue: 425,
    orderRevenue: 180,
    label: "Demo",
    assignedUserId: "u-rep-01",
    customer: {
      number: "C-10819",
      name: "Gemeente Bornem",
      vat: "BE0207.499.112",
      segment: "Public"
    },
    contacts: [
      {
        name: "Nathalie Vos",
        role: "Preventieadviseur",
        phone: "+32 496 77 21 08",
        email: "nathalie@bornem.example",
        isActive: true
      }
    ],
    address: {
      line1: "Hingenesteenweg 13",
      postalCode: "2880",
      city: "Bornem",
      country: "BE",
      isActive: true
    },
    notes: "Demo succesvol uitgevoerd. Offerte gevraagd voor drie locaties.",
    service: {
      contracts: 1,
      aeds: 5,
      workOrders: 0,
      lastIntervention: "02/04/2026",
      maintenanceStatus: "Alles in orde"
    },
    history: [
      { at: "29/05/2026 14:54", text: "Status gewijzigd naar completed." },
      { at: "29/05/2026 14:58", text: "Demo resultaat geregistreerd." }
    ]
  },
  {
    id: "apt-1004",
    date: "2026-05-30",
    time: "16:15",
    type: "follow_up",
    status: "no_time",
    statusChangedAt: "2026-05-30T16:40:00.000+02:00",
    invoiceRevenue: 0,
    orderRevenue: 0,
    assignedUserId: "u-rep-01",
    customer: {
      number: "C-10203",
      name: "Logistics Plus",
      vat: "BE0644.001.812",
      segment: "Logistics"
    },
    contacts: [
      {
        name: "Ruben Claes",
        role: "Operations",
        phone: "+32 477 33 81 20",
        email: "ruben@logisticsplus.example",
        isActive: true
      }
    ],
    address: {
      line1: "Industrieweg 8",
      postalCode: "9000",
      city: "Gent",
      country: "BE",
      isActive: true
    },
    notes: "Geen tijd wegens uitgelopen vorige afspraak.",
    service: {
      contracts: 1,
      aeds: 1,
      workOrders: 2,
      lastIntervention: "18/05/2026",
      maintenanceStatus: "Werkbon open"
    },
    history: [{ at: "29/05/2026 16:40", text: "Status gewijzigd naar no_time. Telt niet als succesvol bezoek." }]
  },
  {
    id: "apt-1005",
    date: "2026-05-30",
    time: "17:00",
    type: "customer",
    status: "customer_absent",
    statusChangedAt: "2026-05-30T17:15:00.000+02:00",
    invoiceRevenue: 0,
    orderRevenue: 95,
    assignedUserId: "u-rep-01",
    customer: {
      number: "C-11003",
      name: "Hotel Rijnzicht",
      vat: "NL8123.44.019.B01",
      segment: "Hospitality"
    },
    contacts: [
      {
        name: "Marieke Jansen",
        role: "General manager",
        phone: "+31 20 555 4001",
        email: "marieke@rijnzicht.example",
        isActive: true
      }
    ],
    address: {
      line1: "Kade 18",
      postalCode: "1011",
      city: "Amsterdam",
      country: "NL",
      isActive: true
    },
    notes: "Klant niet aanwezig. Nieuwe afspraak voorstellen.",
    service: {
      contracts: 1,
      aeds: 2,
      workOrders: 0,
      lastIntervention: "08/05/2026",
      maintenanceStatus: "Alles in orde"
    },
    history: [{ at: "29/05/2026 17:15", text: "Status gewijzigd naar customer_absent." }]
  },
  {
    id: "apt-1006",
    date: "2026-05-30",
    time: "18:00",
    type: "prospect",
    status: "rescheduled",
    statusChangedAt: "2026-05-30T18:10:00.000+02:00",
    invoiceRevenue: 0,
    orderRevenue: 0,
    assignedUserId: "u-rep-01",
    prospect: {
      number: "P-33091",
      name: "MediCampus Berlin",
      source: "Referral",
      potential: "Medium"
    },
    contacts: [
      {
        name: "Lena Kruger",
        role: "Operations lead",
        phone: "+49 30 555 2710",
        email: "lena@medicampus.example",
        isActive: true
      }
    ],
    address: {
      line1: "Friedrichstrasse 44",
      postalCode: "10117",
      city: "Berlin",
      country: "DE",
      isActive: true
    },
    notes: "Verplaatst naar volgende week wegens interne meeting.",
    service: {
      contracts: 0,
      aeds: 0,
      workOrders: 0,
      lastIntervention: "Geen historiek",
      maintenanceStatus: "Niet van toepassing"
    },
    history: [{ at: "29/05/2026 18:10", text: "Status gewijzigd naar rescheduled." }]
  },
  {
    id: "apt-1007",
    date: "2026-05-30",
    time: "18:30",
    type: "follow_up",
    status: "cancelled",
    statusChangedAt: "2026-05-30T18:35:00.000+02:00",
    invoiceRevenue: 0,
    orderRevenue: 0,
    assignedUserId: "u-rep-01",
    customer: {
      number: "C-10551",
      name: "Care Point Leuven",
      vat: "BE0554.801.778",
      segment: "Healthcare"
    },
    contacts: [
      {
        name: "Sarah Maes",
        role: "Aankoop",
        phone: "+32 485 99 10 16",
        email: "sarah@carepoint.example",
        isActive: true
      }
    ],
    address: {
      line1: "Bondgenotenlaan 91",
      postalCode: "3000",
      city: "Leuven",
      country: "BE",
      isActive: true
    },
    notes: "Geannuleerd door klant.",
    service: {
      contracts: 3,
      aeds: 4,
      workOrders: 1,
      lastIntervention: "19/05/2026",
      maintenanceStatus: "Werkbon in planning"
    },
    history: [{ at: "29/05/2026 18:35", text: "Status gewijzigd naar cancelled." }]
  },
  {
    id: "apt-1008",
    date: "2026-05-30",
    time: "13:15",
    type: "customer",
    status: "planned",
    invoiceRevenue: 0,
    orderRevenue: 0,
    assignedUserId: "u-rep-01",
    customer: {
      number: "C-11142",
      name: "Bakkerij De Smet",
      vat: "BE0733.492.101",
      segment: "Retail"
    },
    contacts: [
      {
        name: "Bakkerij De Smet",
        role: "Zaakvoerder",
        phone: "+32 472 10 90 31",
        email: "info@bakkerijdesmet.example",
        isActive: true
      }
    ],
    address: {
      line1: "Marktstraat 14",
      postalCode: "2000",
      city: "Antwerpen",
      country: "BE",
      isActive: true
    },
    notes: "Prijsafspraak en brandblusserpakket bespreken.",
    service: {
      contracts: 1,
      aeds: 0,
      workOrders: 0,
      lastIntervention: "14/05/2026",
      maintenanceStatus: "Geen open servicepunten"
    },
    history: [{ at: "30/05/2026 08:30", text: "Afspraak toegevoegd aan dagplanning." }]
  },
  {
    id: "apt-1009",
    date: "2026-05-30",
    time: "15:30",
    type: "prospect",
    status: "planned",
    invoiceRevenue: 0,
    orderRevenue: 0,
    label: "PST",
    assignedUserId: "u-rep-01",
    prospect: {
      number: "P-22108",
      name: "Carrosserie Peeters",
      source: "Preprospect",
      potential: "Medium"
    },
    contacts: [
      {
        name: "Dirk Peeters",
        role: "Eigenaar",
        phone: "+32 479 74 45 15",
        email: "dirk@peeters.example",
        isActive: true
      }
    ],
    address: {
      line1: "Industrieweg 45",
      postalCode: "2800",
      city: "Mechelen",
      country: "BE",
      isActive: true
    },
    notes: "Interesse in opleiding en detectiemateriaal.",
    service: {
      contracts: 0,
      aeds: 0,
      workOrders: 0,
      lastIntervention: "Geen historiek",
      maintenanceStatus: "Niet van toepassing"
    },
    history: [{ at: "30/05/2026 09:05", text: "Preprospect toegevoegd aan agenda." }]
  },
  ...preparationAppointments
];

export const cashSheet: CashSheet = {
  id: "cash-2026-22",
  userId: "u-rep-01",
  weekNumber: 22,
  year: 2026,
  status: "open",
  totalAmountInclVat: 742.35,
  lines: [
    {
      id: "line-1",
      date: "25/05/2026",
      documentNo: "INV-260581",
      customerName: "Apotheek Van Dijck",
      amountInclVat: 284.35,
      isPaid: true,
      isCleared: false
    },
    {
      id: "line-2",
      date: "27/05/2026",
      documentNo: "INV-260614",
      customerName: "Gemeente Bornem",
      amountInclVat: 458,
      isPaid: true,
      isCleared: false
    }
  ]
};
