import { SHELL_HEADER_HEIGHT_CLASS } from "@/components/layout/shellConstants";
import type { AppView, MockUser, TranslationFn } from "@/types/sales";

const titleKeys: Record<AppView, string> = {
  dashboard: "nav.dashboard",
  myInfo: "nav.myInfo",
  myPreparation: "nav.myPreparation",
  agenda: "nav.agenda",
  myTeam: "nav.myTeam",
  appointment: "nav.appointment",
  inventory: "nav.inventory",
  reports: "nav.reports",
  service: "nav.service",
  serviceInterventions: "nav.interventions",
  servicePlanning: "nav.servicePlanning",
  serviceWorkOrders: "nav.workOrders",
  serviceMaintenance: "nav.maintenance",
  serviceContracts: "nav.contracts",
  serviceAssets: "nav.assets",
  cashSheet: "nav.cashSheet",
  sync: "nav.sync",
  technicalDesign: "nav.design",
  technicalTables: "nav.tables",
  userManagement: "nav.userManagement"
};

export function Topbar({ t, user, view, onLogout }: { t: TranslationFn; user: MockUser; view: AppView; onLogout: () => void }) {
  return (
    <header className={`sticky top-0 z-20 flex ${SHELL_HEADER_HEIGHT_CLASS} items-center border-b border-[#003B83] bg-[#003B83] px-4 text-white shadow-[0_12px_30px_rgba(0,59,131,0.24)] md:px-6`}>
      <div className="flex w-full items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-black tracking-tight">{t(titleKeys[view])}</h1>
        </div>
        <div className="flex items-center gap-3 text-xs text-blue-100">
          <span>{user.country}</span>
          <span className="hidden sm:inline">{user.timezone}</span>
          <span>{user.preferredLanguage.toUpperCase()}</span>
          <button className="min-h-9 rounded-lg border border-white/20 bg-white/5 px-3 font-semibold text-white transition hover:bg-white/10" onClick={onLogout}>
            {t("auth.logout")}
          </button>
        </div>
      </div>
    </header>
  );
}
