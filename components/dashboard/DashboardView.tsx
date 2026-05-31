import { ActionButton } from "@/components/shared/ui";
import {
  Banknote,
  Boxes,
  CalendarDays,
  ClipboardCheck,
  RefreshCw,
  Tags,
  UserRound,
  UsersRound,
  type LucideIcon
} from "lucide-react";
import { formatCurrency } from "@/domain/shared/formatting";
import type { AppView, Appointment, CashSheet, MockUser, TranslationFn } from "@/types/sales";

export function DashboardView({
  appointments,
  cashSheet,
  t,
  user,
  onViewChange
}: {
  appointments: Appointment[];
  cashSheet: CashSheet;
  t: TranslationFn;
  user: MockUser;
  onViewChange: (view: AppView) => void;
}) {
  const successful = appointments.filter((item) => item.status === "completed").length;
  const sold = 0;
  const turnover = 0;
  const cashAmountToDeposit = formatCurrency(cashSheet.totalAmountInclVat);

  const workdayTiles = [
    { icon: UserRound, tone: "brand", title: t("nav.myInfo"), body: t("dashboard.tile.myInfo"), onClick: () => onViewChange("myInfo") },
    { icon: UsersRound, tone: "indigo", title: t("nav.myTeam"), body: t("dashboard.tile.myTeam"), onClick: () => onViewChange("myTeam") },
    { icon: CalendarDays, tone: "brand", title: t("nav.agenda"), body: t("dashboard.tile.agenda"), value: String(appointments.length), onClick: () => onViewChange("agenda") },
    { icon: Boxes, tone: "amber", title: t("nav.articleStock"), body: t("dashboard.tile.stock"), onClick: () => onViewChange("inventory") },
    { icon: ClipboardCheck, tone: "emerald", title: t("nav.demoRegistration"), body: t("dashboard.tile.demo") },
    {
      icon: Banknote,
      tone: "orange",
      title: t("nav.cashSheet"),
      body: t("dashboard.tile.cashSheet"),
      value: cashAmountToDeposit,
      valueSuffix: t("dashboard.tile.cashSheet.depositDue"),
      subtleValue: true,
      onClick: () => onViewChange("cashSheet")
    },
    { icon: Tags, tone: "cyan", title: t("nav.priceList"), body: t("dashboard.tile.priceList") },
    { icon: RefreshCw, tone: "sky", title: t("nav.sync"), body: t("dashboard.tile.sync"), onClick: () => onViewChange("sync") }
  ];

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-center justify-between gap-5 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t("dashboard.welcome")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{user.name}</h2>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center text-xs uppercase text-slate-500 sm:gap-7">
            <DashboardStat label={t("dashboard.appointments")} value={String(appointments.length)} />
            <DashboardStat label={t("dashboard.completedShort")} value={String(successful)} />
            <DashboardStat label={t("dashboard.sold")} value={String(sold)} />
            <DashboardStat label={t("dashboard.turnoverShort")} value={`EUR ${turnover}`} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-slate-500">{t("dashboard.workday")}</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {workdayTiles.map((tile) => (
            <button
              key={tile.title}
              className="group grid min-h-[11.5rem] grid-rows-[2.75rem_3.75rem_2.25rem_2.75rem] rounded-xl border border-slate-200 bg-white p-5 text-left shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_22px_60px_rgba(0,59,131,0.14)] disabled:cursor-default disabled:hover:translate-y-0"
              onClick={tile.onClick}
              disabled={!tile.onClick}
            >
              <TileIcon icon={tile.icon} tone={tile.tone} />
              <span className="flex items-end text-lg font-bold leading-6 text-slate-950">{tile.title}</span>
              <span className={`flex items-center gap-1.5 ${tile.value ? "" : "invisible"}`}>
                <span className={tile.subtleValue ? "text-base font-medium leading-5 text-slate-950" : "text-[1.65rem] font-black leading-none tracking-tight text-slate-950"}>
                  {tile.value ?? "0"}
                </span>
                {tile.valueSuffix && <span className="text-[0.8rem] font-medium leading-5 text-slate-600">{tile.valueSuffix}</span>}
              </span>
              <span className="text-[0.8rem] font-medium leading-5 text-slate-600">{tile.body}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">{t("dashboard.quickActions")}</h3>
        <div className="mt-auto flex flex-wrap gap-3 pt-4">
          <ActionButton label={t("dashboard.action.openAgenda")} tone="primary" onClick={() => onViewChange("agenda")} />
          <ActionButton label={t("dashboard.action.openCashSheet")} onClick={() => onViewChange("cashSheet")} />
          <ActionButton label={t("dashboard.action.stockReport")} onClick={() => onViewChange("inventory")} />
          <ActionButton label={t("dashboard.action.sync")} onClick={() => onViewChange("sync")} />
          <ActionButton label={t("auth.logout")} onClick={() => undefined} />
        </div>
      </section>
    </div>
  );
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-16">
      <p className="text-[0.65rem] font-bold">{label}</p>
      <p className="mt-1 text-xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function TileIcon({ icon: Icon, tone }: { icon: LucideIcon; tone: string }) {
  const tones: Record<string, string> = {
    indigo: "from-indigo-100 to-blue-100 text-indigo-700",
    brand: "from-blue-100 to-sky-100 text-[#003B83]",
    amber: "from-amber-100 to-orange-100 text-amber-800",
    emerald: "from-emerald-100 to-cyan-100 text-emerald-800",
    orange: "from-orange-100 to-amber-100 text-orange-800",
    cyan: "from-cyan-100 to-blue-100 text-cyan-800",
    sky: "from-sky-100 to-blue-100 text-[#003B83]"
  };

  return (
    <span className={`relative grid size-12 place-items-center rounded-xl bg-gradient-to-br shadow-inner ${tones[tone] ?? tones.brand}`}>
      <Icon aria-hidden="true" size={24} strokeWidth={2} />
      <span className="absolute right-3 top-3 size-2 rounded-full bg-current opacity-60" />
    </span>
  );
}
