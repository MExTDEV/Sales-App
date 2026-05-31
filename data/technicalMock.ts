import type { TechnicalAssetType, TechnicalContractType, TechnicalLeadType, TechnicalMaintenanceFrequency, TechnicalRole, TechnicalServiceControl } from "@/types/sales";

export const technicalRoles: TechnicalRole[] = [
  { id: "representative", labelKey: "technical.roles.representative" },
  { id: "sales_leader", labelKey: "technical.roles.salesLeader" },
  { id: "service_operator", labelKey: "technical.roles.serviceOperator" },
  { id: "admin", labelKey: "technical.roles.admin", protectedForAdmin: true },
  { id: "superadmin", labelKey: "technical.roles.superadmin", protectedForAdmin: true }
];

export const technicalLeadTypes: TechnicalLeadType[] = [
  { id: "cardio", labelKey: "leadType.cardio" },
  { id: "training_cardio", labelKey: "leadType.trainingCardio" },
  { id: "training_first_aid", labelKey: "leadType.trainingFirstAid" },
  { id: "fire_detection", labelKey: "leadType.fireDetection" },
  { id: "firefighting", labelKey: "leadType.firefighting" }
];

export const technicalAssetTypes: TechnicalAssetType[] = [
  { id: "EHBO", labelKey: "assetType.ehbo" },
  { id: "CARDIO", labelKey: "assetType.cardio" },
  { id: "BRAND", labelKey: "assetType.brand" },
  { id: "BLUSMIDDELEN", labelKey: "assetType.extinguishing" },
  { id: "ALGEMEEN", labelKey: "assetType.general" }
];

export const technicalContractTypes: TechnicalContractType[] = [
  { id: "CONT001", code: "ONDERHOUD", description: "Onderhoudscontract" },
  { id: "CONT002", code: "SERVICE", description: "Servicecontract" },
  { id: "CONT003", code: "FULLSERVICE", description: "Full Service Contract" },
  { id: "CONT004", code: "INSPECTIE", description: "Inspectiecontract" },
  { id: "CONT005", code: "ALGEMEEN", description: "Algemeen Contract" }
];

export const technicalMaintenanceFrequencies: TechnicalMaintenanceFrequency[] = [
  { id: "FREQ001", code: "MAANDELIJKS", description: "Maandelijks", intervalMonths: 1 },
  { id: "FREQ002", code: "KWARTAAL", description: "Per kwartaal", intervalMonths: 3 },
  { id: "FREQ003", code: "HALFJAAR", description: "Halfjaarlijks", intervalMonths: 6 },
  { id: "FREQ004", code: "JAARLIJKS", description: "Jaarlijks", intervalMonths: 12 },
  { id: "FREQ005", code: "TWEEJAAR", description: "Tweejaarlijks", intervalMonths: 24 }
];

export const technicalServiceControls: TechnicalServiceControl[] = [
  { id: "SERVCONTR001", type: "CARDIO", point: "BATTERIJ", description: "Controle batterij", required: true },
  { id: "SERVCONTR002", type: "CARDIO", point: "SPEAKER", description: "Controle luidspreker", required: true },
  { id: "SERVCONTR003", type: "CARDIO", point: "SCHERM", description: "Controle scherm", required: true },
  { id: "SERVCONTR004", type: "BRAND", point: "LED", description: "Pinkend LED", required: true },
  { id: "SERVCONTR005", type: "CARDIO", point: "ELEKTRODEN", description: "Vervaldatum elektroden controleren", required: true },
  { id: "SERVCONTR006", type: "CARDIO", point: "KAST", description: "AED-kast en signalisatie controleren", required: false },
  { id: "SERVCONTR007", type: "BRAND", point: "DRUK", description: "Drukmeter controleren", required: true },
  { id: "SERVCONTR008", type: "BRAND", point: "ZEGEL", description: "Veiligheidszegel controleren", required: true },
  { id: "SERVCONTR009", type: "BRAND", point: "KEURING", description: "Keuringslabel controleren", required: false },
  { id: "SERVCONTR010", type: "EHBO", point: "INHOUD", description: "Controle inhoud EHBO-koffer", required: true },
  { id: "SERVCONTR011", type: "EHBO", point: "VERVALDATUM", description: "Vervaldatums EHBO-artikelen controleren", required: true },
  { id: "SERVCONTR012", type: "ALGEMEEN", point: "STAAT", description: "Algemene staat van asset controleren", required: false }
];
