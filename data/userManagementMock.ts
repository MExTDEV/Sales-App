import type { ManagedUser } from "@/types/sales";

const defaultPermissions = {
  pst: true,
  service: true,
  reporting: false,
  contracts: false,
  training: false,
  firefighting: false,
  fireDetection: false
};

const defaultLeads = {
  cardio: true,
  training: false,
  fireDetection: false,
  firefighting: false
};

export const mockManagedUsers: ManagedUser[] = [
  {
    id: "USR-0001",
    firstName: "An",
    lastName: "De Smet",
    email: "an.desmet@mext.be",
    language: "nl",
    mobile: "+32 475 12 34 56",
    country: "BE",
    team: "Team North",
    roleId: "representative",
    isTeamSupervisor: false,
    isActive: true,
    hasPstAccess: false,
    establishmentNumber: "BE-ROE",
    permissions: defaultPermissions,
    leads: defaultLeads
  },
  {
    id: "USR-0002",
    firstName: "Tom",
    lastName: "Verbruggen",
    email: "tom.verbruggen@mext.be",
    language: "nl",
    mobile: "+32 486 77 12 10",
    country: "BE",
    team: "Team Leadership",
    roleId: "sales_leader",
    isTeamSupervisor: true,
    isActive: true,
    hasPstAccess: true,
    establishmentNumber: "001",
    permissions: { ...defaultPermissions, reporting: true, contracts: true },
    leads: { ...defaultLeads, training: true }
  },
  {
    id: "USR-0003",
    firstName: "Sofie",
    lastName: "Jacobs",
    email: "sofie.jacobs@mext.be",
    language: "fr",
    mobile: "+32 472 98 11 04",
    country: "BE",
    team: "Admin BE",
    roleId: "admin",
    isTeamSupervisor: false,
    isActive: false,
    hasPstAccess: true,
    establishmentNumber: "002",
    permissions: { ...defaultPermissions, reporting: true, contracts: true, training: true },
    leads: { ...defaultLeads, fireDetection: true }
  },
  {
    id: "USR-0004",
    firstName: "Lars",
    lastName: "Jansen",
    email: "lars.jansen@mext.nl",
    language: "nl",
    mobile: "+31 6 12 34 56 78",
    country: "NL",
    team: "Team Tilburg",
    roleId: "service_operator",
    isTeamSupervisor: false,
    isActive: true,
    hasPstAccess: false,
    establishmentNumber: "NL-TIL",
    permissions: { ...defaultPermissions, service: true, contracts: true },
    leads: { ...defaultLeads, firefighting: true }
  }
];
