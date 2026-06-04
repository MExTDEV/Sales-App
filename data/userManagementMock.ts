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

function avatar(name: string, background: string, accent: string, skin: string) {
  const initials = name.split(" ").map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${background}"/><circle cx="48" cy="40" r="20" fill="${skin}"/><path d="M25 84c4-17 17-27 23-27s19 10 23 27" fill="${accent}"/><path d="M28 39c3-17 16-25 30-18 10 5 14 15 10 26-5-9-15-12-25-12-6 0-11 2-15 4z" fill="#23324a"/><text x="48" y="89" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="white">${initials}</text></svg>`;

  return {
    name: `${name.toLowerCase().replaceAll(" ", "-")}-avatar.svg`,
    previewUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  };
}

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
    leads: defaultLeads,
    photo: avatar("An De Smet", "#dbeafe", "#003B83", "#f2c6a0")
  },
  {
    id: "USR-0005",
    firstName: "Jan",
    lastName: "Janssens",
    email: "jan.janssens@mext.be",
    language: "nl",
    mobile: "+32 474 15 88 21",
    country: "BE",
    team: "BE North",
    roleId: "representative",
    isTeamSupervisor: false,
    isActive: true,
    hasPstAccess: false,
    establishmentNumber: "BE-ROE",
    permissions: defaultPermissions,
    leads: defaultLeads,
    photo: avatar("Jan Janssens", "#e0f2fe", "#0054b8", "#e8b98f")
  },
  {
    id: "USR-0006",
    firstName: "Pieter",
    lastName: "Vermeulen",
    email: "pieter.vermeulen@mext.be",
    language: "nl",
    mobile: "+32 468 44 20 11",
    country: "BE",
    team: "BE South",
    roleId: "representative",
    isTeamSupervisor: false,
    isActive: true,
    hasPstAccess: false,
    establishmentNumber: "BE-NAM",
    permissions: defaultPermissions,
    leads: defaultLeads,
    photo: avatar("Pieter Vermeulen", "#ecfeff", "#0f766e", "#d8a06f")
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
    leads: { ...defaultLeads, training: true },
    photo: avatar("Tom Verbruggen", "#eef2ff", "#4338ca", "#efc8a5")
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
    leads: { ...defaultLeads, fireDetection: true },
    photo: avatar("Sofie Jacobs", "#fce7f3", "#be185d", "#f0c0a0")
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
    leads: { ...defaultLeads, firefighting: true },
    photo: avatar("Lars Jansen", "#dcfce7", "#15803d", "#deb287")
  },
  {
    id: "USR-0007",
    firstName: "Marieke",
    lastName: "Jansen",
    email: "marieke.jansen@mext.nl",
    language: "nl",
    mobile: "+31 6 28 11 44 90",
    country: "NL",
    team: "NL West",
    roleId: "representative",
    isTeamSupervisor: false,
    isActive: true,
    hasPstAccess: false,
    establishmentNumber: "NL-TIL",
    permissions: defaultPermissions,
    leads: defaultLeads,
    photo: avatar("Marieke Jansen", "#fae8ff", "#a21caf", "#edc1a2")
  },
  {
    id: "USR-0008",
    firstName: "Lena",
    lastName: "Kruger",
    email: "lena.kruger@mext.de",
    language: "de",
    mobile: "+49 172 55 18 400",
    country: "DE",
    team: "DE West",
    roleId: "representative",
    isTeamSupervisor: false,
    isActive: true,
    hasPstAccess: false,
    establishmentNumber: "DE-ESS",
    permissions: defaultPermissions,
    leads: defaultLeads,
    photo: avatar("Lena Kruger", "#fff7ed", "#c2410c", "#f1c5a5")
  }
];
