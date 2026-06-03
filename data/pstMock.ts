import type { PstApproval, PstAuditLog, PstHostess, PstProject } from "@/types/sales";

export const pstProjects: PstProject[] = [
  {
    id: "PST-2026-001",
    sectorNumber: "BE-104",
    country: "BE",
    status: "mailcom_done",
    assignedToUserId: "USR-0002",
    assignedToName: "Tom Verbruggen",
    createdAt: "2026-05-18T08:30:00.000Z",
    updatedAt: "2026-05-28T13:45:00.000Z",
    createdByUserId: "USR-0003",
    notes: "Voorbereiding voor Belgische sector met Mailcom-import klaar.",
    sqlDocuments: {
      reportName: "PST Sector Documents",
      storageLocation: "Reporting/PST/BE-104",
      generatedAt: "2026-05-21T09:15:00.000Z",
      generatedBy: "Sofie Jacobs",
      status: "generated",
      attachmentName: "BE-104-sector-documents.pdf"
    },
    mailcom: {
      importFile: "mailcom_BE_104.csv",
      importedAt: "2026-05-24T10:20:00.000Z",
      recordCount: 842,
      errorCount: 3,
      status: "processed",
      notes: "Drie adressen manueel te controleren."
    },
    multiroute: {
      excelFile: undefined,
      uploadStatus: "pending",
      addressCount: 0,
      routeCount: 0,
      warningCount: 0
    },
    regiograph: {
      fileLocation: "Q:\\Data\\Leads\\DE-PST- PST Gebiete RegioGraph",
      checked: false,
      notes: ""
    },
    navision: {
      navisionStatus: "pending",
      exportReady: false,
      activateForTablet: false,
      area: "",
      notes: ""
    },
    pstServer: {
      exportStatus: "pending",
      recordCount: 0,
      errorCount: 0,
      targetEnvironment: "PST Server test",
      logDetails: ""
    }
  },
  {
    id: "PST-2026-002",
    sectorNumber: "DE-221",
    country: "DE",
    status: "waiting_for_approval",
    assignedToUserId: "USR-0003",
    assignedToName: "Sofie Jacobs",
    createdAt: "2026-05-12T07:45:00.000Z",
    updatedAt: "2026-05-30T15:10:00.000Z",
    createdByUserId: "USR-0003",
    notes: "Navision export voorbereid, wacht op goedkeuring.",
    sqlDocuments: {
      reportName: "PST Gebiet Dokumente",
      storageLocation: "Reporting/PST/DE-221",
      generatedAt: "2026-05-14T08:00:00.000Z",
      generatedBy: "Sofie Jacobs",
      status: "generated"
    },
    mailcom: {
      importFile: "mailcom_DE_221.csv",
      importedAt: "2026-05-16T11:35:00.000Z",
      recordCount: 1240,
      errorCount: 0,
      status: "processed",
      notes: ""
    },
    multiroute: {
      excelFile: "DE-221-routes.xlsx",
      uploadStatus: "calculated",
      addressCount: 1240,
      routeCount: 18,
      warningCount: 2,
      processedBy: "Tom Verbruggen",
      processedAt: "2026-05-23T12:05:00.000Z"
    },
    regiograph: {
      fileLocation: "Q:\\Data\\Leads\\DE-PST- PST Gebiete RegioGraph",
      checked: true,
      checkedBy: "Sofie Jacobs",
      checkedAt: "2026-05-27T09:20:00.000Z",
      notes: "Sector gevonden en grens gecontroleerd."
    },
    navision: {
      navisionTaskNumber: "AUF-88421",
      navisionStatus: "prepared",
      exportReady: true,
      activateForTablet: false,
      area: "",
      notes: "Gebied leeg gelaten volgens handleiding."
    },
    pstServer: {
      exportStatus: "pending",
      recordCount: 0,
      errorCount: 0,
      targetEnvironment: "PST Server productie",
      logDetails: ""
    }
  }
];

export const pstHostesses: PstHostess[] = [
  {
    id: "HOST-001",
    sequenceNumber: "H-1084",
    name: "Mara Klein",
    inService: true,
    visibleOnPstServer: true,
    exportViaWebsite: false,
    lastExportedAt: "2026-05-29T16:00:00.000Z",
    createdAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-05-29T16:00:00.000Z",
    notes: "Im Dienst, zichtbaar op PST Server."
  },
  {
    id: "HOST-002",
    sequenceNumber: "H-1092",
    name: "Leonie Weber",
    inService: false,
    visibleOnPstServer: false,
    exportViaWebsite: false,
    createdAt: "2026-04-10T09:00:00.000Z",
    updatedAt: "2026-05-20T10:30:00.000Z",
    notes: "Uit dienst, niet exporteren."
  }
];

export const pstApprovals: PstApproval[] = [
  {
    id: "PSTA-001",
    projectId: "PST-2026-002",
    approvalType: "PST Server export",
    requestedByUserId: "USR-0003",
    requestedByName: "Sofie Jacobs",
    assignedToUserId: "USR-superadmin",
    assignedToName: "M.Ex.T. Superadmin",
    status: "pending",
    requestedAt: "2026-05-30T15:10:00.000Z",
    comment: "Controle gevraagd voor export naar PST Server."
  }
];

export const pstAuditLogs: PstAuditLog[] = [
  {
    id: "PSTLOG-001",
    entityType: "project",
    entityId: "PST-2026-001",
    action: "mailcom.processed",
    userId: "USR-0002",
    userName: "Tom Verbruggen",
    createdAt: "2026-05-24T10:30:00.000Z",
    comment: "Mailcom-import verwerkt met 3 waarschuwingen."
  },
  {
    id: "PSTLOG-002",
    entityType: "project",
    entityId: "PST-2026-002",
    action: "navision.task_registered",
    userId: "USR-0003",
    userName: "Sofie Jacobs",
    createdAt: "2026-05-28T14:05:00.000Z",
    comment: "Navision taaknummer AUF-88421 geregistreerd."
  }
];
