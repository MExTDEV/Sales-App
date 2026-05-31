"use client";

import { Badge, StatusBadge } from "@/components/shared/ui";
import type { TeamAppointment, TeamRepresentative } from "@/data/teamMock";
import { CalendarDays, CheckCircle2, Clock, ExternalLink, ReceiptText, ShoppingCart, UsersRound, type LucideIcon } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import type { Appointment, MockUser, TranslationFn } from "@/types/sales";

export function MyTeamView({
  representatives,
  t,
  user,
  onOpenAppointment
}: {
  representatives: TeamRepresentative[];
  t: TranslationFn;
  user: MockUser;
  onOpenAppointment: (appointment: Appointment) => void;
}) {
  const scopedRepresentatives = useMemo(() => scopeRepresentatives(representatives, user), [representatives, user]);
  const teams = Array.from(new Set(scopedRepresentatives.map((item) => item.team))).sort();
  const countries = Array.from(new Set(scopedRepresentatives.map((item) => item.country))).sort();
  const [date, setDate] = useState("2026-05-30");
  const [teamFilter, setTeamFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | undefined>();

  const visibleRepresentatives = scopedRepresentatives
    .filter((item) => teamFilter === "all" || item.team === teamFilter)
    .filter((item) => countryFilter === "all" || item.country === countryFilter)
    .sort((a, b) => a.name.localeCompare(b.name, "nl", { sensitivity: "base" }));

  const summary = summarize(visibleRepresentatives);
  const showCountryFilter = user.role === "admin" || user.role === "superadmin";

  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t("team.title")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{t("nav.myTeam")}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("team.subtitle")}</p>
          </div>
          <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
            <UsersRound aria-hidden="true" size={24} strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-700">{t("team.filter.date")}</span>
          <input className="min-h-12 rounded-lg border border-slate-300 bg-white px-3" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-700">{t("team.filter.team")}</span>
          <select className="min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={teamFilter} onChange={(event) => setTeamFilter(event.target.value)}>
            <option value="all">{t("team.filter.allTeams")}</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </label>
        {showCountryFilter && (
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">{t("team.filter.country")}</span>
            <select className="min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}>
              <option value="all">{t("team.filter.allCountries")}</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <SummaryMetric icon={CalendarDays} label={t("team.summary.appointments")} value={String(summary.appointments)} />
        <SummaryMetric icon={CheckCircle2} label={t("team.summary.completed")} value={String(summary.completed)} />
        <SummaryMetric icon={Clock} label={t("team.summary.todo")} value={String(summary.todo)} />
        <SummaryMetric icon={ShoppingCart} label={t("team.summary.orders")} value={formatCurrency(summary.orderTurnover)} />
        <SummaryMetric icon={ReceiptText} label={t("team.summary.invoices")} value={formatCurrency(summary.invoiceTurnover)} />
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[64rem] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.representative")}</th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.team")}</th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.country")}</th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.appointments")}</th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.customers")}</th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.prospects")}</th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.completed")}</th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.todo")}</th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.orderTurnover")}</th>
                <th className="border-b border-slate-200 py-3">{t("team.column.invoiceTurnover")}</th>
              </tr>
            </thead>
            <tbody>
              {visibleRepresentatives.map((representative) => {
                const rowSummary = summarize([representative]);
                const expanded = representative.id === expandedId;

                return (
                  <Fragment key={representative.id}>
                    <tr
                      className="cursor-pointer transition hover:bg-blue-50/70"
                      onClick={() => setExpandedId(expanded ? undefined : representative.id)}
                    >
                      <td className="border-b border-slate-100 py-3 pr-4 font-black text-slate-950">{representative.name}</td>
                      <td className="border-b border-slate-100 py-3 pr-4">{representative.team}</td>
                      <td className="border-b border-slate-100 py-3 pr-4">{representative.country}</td>
                      <td className="border-b border-slate-100 py-3 pr-4">{rowSummary.appointments}</td>
                      <td className="border-b border-slate-100 py-3 pr-4">{rowSummary.customers}</td>
                      <td className="border-b border-slate-100 py-3 pr-4">{rowSummary.prospects}</td>
                      <td className="border-b border-slate-100 py-3 pr-4">{rowSummary.completed}</td>
                      <td className="border-b border-slate-100 py-3 pr-4">{rowSummary.todo}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 font-semibold">{formatCurrency(rowSummary.orderTurnover)}</td>
                      <td className="border-b border-slate-100 py-3 font-semibold">{formatCurrency(rowSummary.invoiceTurnover)}</td>
                    </tr>
                    {expanded && (
                      <tr key={`${representative.id}-details`}>
                        <td className="border-b border-slate-100 bg-slate-50 p-4" colSpan={10}>
                          <AppointmentDetailTable appointments={representative.appointments} t={t} onOpenAppointment={onOpenAppointment} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function AppointmentDetailTable({
  appointments,
  t,
  onOpenAppointment
}: {
  appointments: TeamAppointment[];
  t: TranslationFn;
  onOpenAppointment: (appointment: Appointment) => void;
}) {
  return (
    <table className="w-full min-w-[54rem] border-separate border-spacing-0 text-left text-xs">
      <thead>
        <tr className="text-slate-500">
          <th className="border-b border-slate-200 py-2 pr-3">{t("team.detail.time")}</th>
          <th className="border-b border-slate-200 py-2 pr-3">{t("team.detail.number")}</th>
          <th className="border-b border-slate-200 py-2 pr-3">{t("team.detail.name")}</th>
          <th className="border-b border-slate-200 py-2 pr-3">{t("team.detail.type")}</th>
          <th className="border-b border-slate-200 py-2 pr-3">{t("team.detail.status")}</th>
          <th className="border-b border-slate-200 py-2 pr-3">{t("team.detail.orderTurnover")}</th>
          <th className="border-b border-slate-200 py-2 pr-3">{t("team.detail.invoiceTurnover")}</th>
          <th className="border-b border-slate-200 py-2">{t("team.detail.action")}</th>
        </tr>
      </thead>
      <tbody>
        {[...appointments].sort((a, b) => a.time.localeCompare(b.time)).map((appointment) => {
          const relation = appointment.customer ?? appointment.prospect;

          return (
            <tr key={appointment.id}>
              <td className="border-b border-slate-200 py-2 pr-3 font-black">{appointment.time}</td>
              <td className="border-b border-slate-200 py-2 pr-3">{relation?.number}</td>
              <td className="border-b border-slate-200 py-2 pr-3 font-semibold">{relation?.name}</td>
              <td className="border-b border-slate-200 py-2 pr-3">
                <Badge tone={appointment.customer ? "blue" : "amber"}>{appointment.customer ? t("appointment.customer") : t("appointment.prospect")}</Badge>
              </td>
              <td className="border-b border-slate-200 py-2 pr-3">
                <StatusBadge status={appointment.status} label={t(`team.status.${appointment.status}`)} />
              </td>
              <td className="border-b border-slate-200 py-2 pr-3">{formatCurrency(appointment.orderTurnover)}</td>
              <td className="border-b border-slate-200 py-2 pr-3">{formatCurrency(appointment.invoiceTurnover)}</td>
              <td className="border-b border-slate-200 py-2">
                <button
                  className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#003B83] px-3 text-xs font-bold text-white transition hover:bg-[#002b60]"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenAppointment(appointment);
                  }}
                >
                  <ExternalLink aria-hidden="true" size={15} strokeWidth={2} />
                  {t("team.action.open")}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SummaryMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
          <Icon aria-hidden="true" size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function scopeRepresentatives(representatives: TeamRepresentative[], user: MockUser) {
  if (user.role === "representative") {
    return representatives.filter((representative) => representative.id === user.id);
  }

  if (user.role === "sales_leader" || user.role === "admin") {
    return representatives.filter((representative) => representative.country === user.country);
  }

  return representatives;
}

function summarize(representatives: TeamRepresentative[]) {
  const appointments = representatives.flatMap((representative) => representative.appointments);

  return {
    appointments: appointments.length,
    customers: appointments.filter((appointment) => appointment.customer).length,
    prospects: appointments.filter((appointment) => appointment.prospect).length,
    completed: appointments.filter((appointment) => appointment.status === "completed").length,
    todo: appointments.filter((appointment) => appointment.status === "planned").length,
    orderTurnover: appointments.reduce((total, appointment) => total + appointment.orderTurnover, 0),
    invoiceTurnover: appointments.reduce((total, appointment) => total + appointment.invoiceTurnover, 0)
  };
}

function formatCurrency(value: number) {
  return `€ ${value.toLocaleString("nl-BE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
