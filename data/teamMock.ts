import type { Appointment, CountryCode } from "@/types/sales";

export type TeamAppointment = Appointment & {
  invoiceTurnover: number;
  orderTurnover: number;
};

export type TeamRepresentative = {
  id: string;
  name: string;
  team: string;
  country: CountryCode;
  appointments: TeamAppointment[];
};

const serviceDefaults = {
  contracts: 1,
  aeds: 2,
  workOrders: 0,
  lastIntervention: "18/05/2026",
  maintenanceStatus: "Alles in orde"
};

export const teamRepresentatives: TeamRepresentative[] = [
  {
    id: "u-rep-01",
    name: "An De Smet",
    team: "BE North",
    country: "BE",
    appointments: [
      teamAppointment("team-apt-1001", "09:00", "planned", "customer", "C-10482", "Apotheek Van Dijck", "BE", 820, 0),
      teamAppointment("team-apt-1002", "11:30", "completed", "prospect", "P-22014", "Sportcentrum De Linde", "BE", 1240, 990),
      teamAppointment("team-apt-1003", "15:15", "no_time", "customer", "C-10811", "Care Group Antwerpen", "BE", 0, 0)
    ]
  },
  {
    id: "u-rep-02",
    name: "Jan Janssens",
    team: "BE North",
    country: "BE",
    appointments: [
      teamAppointment("team-apt-2001", "08:45", "completed", "customer", "C-11842", "Bakkerij De Smet", "BE", 430, 430),
      teamAppointment("team-apt-2002", "10:30", "planned", "prospect", "P-33018", "Carrosserie Peeters", "BE", 0, 0),
      teamAppointment("team-apt-2003", "14:00", "customer_absent", "customer", "C-11901", "Apotheek Centrum", "BE", 0, 0)
    ]
  },
  {
    id: "u-rep-03",
    name: "Pieter Vermeulen",
    team: "BE South",
    country: "BE",
    appointments: [
      teamAppointment("team-apt-3001", "09:15", "rescheduled", "prospect", "P-44012", "Medisch Huis Namen", "BE", 0, 0),
      teamAppointment("team-apt-3002", "13:00", "completed", "customer", "C-12014", "Hotel Ardennen", "BE", 960, 960)
    ]
  },
  {
    id: "u-rep-04",
    name: "Marieke Jansen",
    team: "NL West",
    country: "NL",
    appointments: [
      teamAppointment("team-apt-4001", "09:30", "planned", "customer", "C-21001", "Hotel Rijnzicht", "NL", 0, 0),
      teamAppointment("team-apt-4002", "12:00", "completed", "prospect", "P-51004", "Zorgpunt Tilburg", "NL", 1575, 1200),
      teamAppointment("team-apt-4003", "16:00", "cancelled", "customer", "C-21018", "Campus Utrecht", "NL", 0, 0)
    ]
  },
  {
    id: "u-rep-05",
    name: "Lena Kruger",
    team: "DE West",
    country: "DE",
    appointments: [
      teamAppointment("team-apt-5001", "08:30", "completed", "customer", "C-31044", "MediCampus Berlin", "DE", 2140, 1990),
      teamAppointment("team-apt-5002", "11:45", "planned", "prospect", "P-61019", "Feuerwehr Essen", "DE", 0, 0),
      teamAppointment("team-apt-5003", "15:30", "completed", "customer", "C-31052", "Klinik Essen", "DE", 890, 890)
    ]
  }
];

function teamAppointment(
  id: string,
  time: string,
  status: Appointment["status"],
  type: "customer" | "prospect",
  number: string,
  name: string,
  country: CountryCode,
  orderTurnover: number,
  invoiceTurnover: number
): TeamAppointment {
  const base = {
    id,
    time,
    type,
    status,
    assignedUserId: "",
    contacts: [
      {
        name: "Contactpersoon",
        role: "Aankoop",
        phone: "+32 400 00 00 00",
        email: "contact@example.com",
        isActive: true
      }
    ],
    address: {
      line1: "Marktstraat 14",
      postalCode: "1000",
      city: "Brussel",
      country,
      isActive: true
    },
    notes: "Mock teamafspraak voor dagoverzicht.",
    service: serviceDefaults,
    history: [{ at: "30/05/2026 08:00", text: "Teamafspraak geladen uit mock data." }],
    orderTurnover,
    invoiceTurnover
  };

  return type === "customer"
    ? {
        ...base,
        customer: {
          number,
          name,
          vat: `${country}0000.000.000`,
          segment: "B2B"
        }
      }
    : {
        ...base,
        prospect: {
          number,
          name,
          source: "Saleslijst",
          potential: "Medium"
        }
      };
}
