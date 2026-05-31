import {
  BarChart3,
  Boxes,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  Wrench,
  type LucideIcon
} from "lucide-react";
import type { AppView, Role } from "@/types/sales";

export const roleLabels: Record<Role, string> = {
  representative: "Representative",
  sales_leader: "Sales Leader",
  admin: "Admin",
  superadmin: "Superadmin"
};

export const navItems: Array<{ id: AppView; labelKey: string }> = [
  { id: "dashboard", labelKey: "nav.dashboard" },
  { id: "agenda", labelKey: "nav.agenda" },
  { id: "service", labelKey: "nav.service" },
  { id: "cashSheet", labelKey: "nav.cashSheet" },
  { id: "sync", labelKey: "nav.sync" }
];

export const sidebarItems: Array<{
  id?: AppView;
  labelKey: string;
  icon: LucideIcon;
  superadminOnly?: boolean;
  nested?: Array<{ id?: AppView; labelKey: string }>;
}> = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { id: "myInfo", labelKey: "nav.myInfo", icon: UserRound },
  { id: "myPreparation", labelKey: "nav.myPreparation", icon: ClipboardList },
  { id: "myTeam", labelKey: "nav.myTeam", icon: UsersRound },
  { id: "agenda", labelKey: "nav.agenda", icon: CalendarDays },
  {
    labelKey: "nav.service",
    icon: Wrench,
    nested: [
      { id: "servicePlanning", labelKey: "nav.servicePlanning" },
      { id: "serviceInterventions", labelKey: "nav.interventions" },
      { id: "serviceWorkOrders", labelKey: "nav.workOrders" },
      { id: "serviceMaintenance", labelKey: "nav.maintenance" },
      { id: "serviceContracts", labelKey: "nav.contracts" },
      { id: "serviceAssets", labelKey: "nav.assets" }
    ]
  },
  {
    id: "inventory",
    labelKey: "nav.inventory",
    icon: Boxes,
    nested: [{ id: "inventory", labelKey: "nav.articleStock" }]
  },
  { id: "reports", labelKey: "nav.reports", icon: BarChart3 },
  { id: "sync", labelKey: "nav.sync", icon: RefreshCw },
  { id: "userManagement", labelKey: "nav.userManagement", icon: ShieldCheck },
  {
    id: "technicalDesign",
    labelKey: "nav.technical",
    icon: Settings,
    superadminOnly: true,
    nested: [
      { id: "technicalDesign", labelKey: "nav.design" },
      { id: "technicalTables", labelKey: "nav.tables" }
    ]
  }
];
