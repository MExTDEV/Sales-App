"use client";

import { Badge, StatusBadge } from "@/components/shared/ui";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { TeamAppointment, TeamRepresentative } from "@/data/teamMock";
import { CalendarDays, CheckCircle2, Clock, ExternalLink, ReceiptText, ShoppingCart, UsersRound, type LucideIcon } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import type { ManagedUser, MockUser, TranslationFn } from "@/types/sales";

export function MyTeamView({
  managedUsers,
  representatives,
  t,
  user
}: {
  managedUsers: ManagedUser[];
  representatives: TeamRepresentative[];
  t: TranslationFn;
  user: MockUser;
}) {
  const scopedRepresentatives = useMemo(() => scopeRepresentatives(representatives, user), [representatives, user]);
  const teams = Array.from(new Set(scopedRepresentatives.map((item) => item.team))).sort();
  const countries = Array.from(new Set(scopedRepresentatives.map((item) => item.country))).sort();
  const [date, setDate] = useState("2026-05-30");
  const [teamFilter, setTeamFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | undefined>();
  const [summaryAppointment, setSummaryAppointment] = useState<TeamAppointment>();

  const visibleRepresentatives = scopedRepresentatives
    .filter((item) => teamFilter === "all" || item.team === teamFilter)
    .filter((item) => countryFilter === "all" || item.country === countryFilter)
    .sort((a, b) => a.name.localeCompare(b.name, "nl", { sensitivity: "base" }));

  const summary = summarize(visibleRepresentatives);
  const showCountryFilter = countries.length > 1;

  return (
    <section className="grid gap-3">
      <div className="rounded-lg border border-blue-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-blue-50 px-4 py-3">
          <div className="grid size-11 place-items-center rounded-lg bg-blue-100 text-[#003B83]">
            <UsersRound aria-hidden="true" size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-black uppercase tracking-wide text-[#003B83]">{t("team.title")}</p>
            <h2 className="truncate text-xl font-black text-slate-950">{t("nav.myTeam")}</h2>
            <p className="truncate text-xs font-semibold text-slate-500">{t("team.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className={`grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${showCountryFilter ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        <label className="grid gap-1">
          <span className="text-xs font-bold text-slate-600">{t("team.filter.date")}</span>
          <input className="min-h-9 rounded-md border border-slate-300 bg-white px-3 text-sm" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold text-slate-600">{t("team.filter.team")}</span>
          <select className="min-h-9 rounded-md border border-slate-300 bg-white px-3 text-sm" value={teamFilter} onChange={(event) => setTeamFilter(event.target.value)}>
            <option value="all">{t("team.filter.allTeams")}</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </label>
        {showCountryFilter && (
          <label className="grid gap-1">
            <span className="text-xs font-bold text-slate-600">{t("team.filter.country")}</span>
            <select className="min-h-9 rounded-md border border-slate-300 bg-white px-3 text-sm" value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}>
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

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="mb-3 text-center text-sm font-semibold text-[#003B83]">Klik op de regel om details te zien</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[64rem] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="border-b border-slate-200 py-3 pl-3 pr-3"></th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("team.column.representative")}</th>
                <th className="border-b border-slate-200 py-3 pr-4 text-center">{t("team.column.appointments")}</th>
                <th className="border-b border-slate-200 py-3 pr-4 text-center">{t("team.column.customers")}</th>
                <th className="border-b border-slate-200 py-3 pr-4 text-center">{t("team.column.prospects")}</th>
                <th className="border-b border-slate-200 py-3 pr-4 text-center">{t("team.column.completed")}</th>
                <th className="border-b border-slate-200 py-3 pr-4 text-center">{t("team.column.todo")}</th>
                <th className="border-b border-slate-200 py-3 pr-4 text-center">{t("team.column.orderTurnover")}</th>
                <th className="border-b border-slate-200 py-3 text-center">{t("team.column.invoiceTurnover")}</th>
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
                      <td className="border-b border-slate-100 py-2 pl-3 pr-3"><TeamPhoto representative={representative} users={managedUsers} /></td>
                      <td className="border-b border-slate-100 py-3 pr-4 font-black text-slate-950">{representative.name}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-center">{rowSummary.appointments}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-center">{rowSummary.customers}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-center">{rowSummary.prospects}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-center">{rowSummary.completed}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-center">{rowSummary.todo}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-center font-semibold">{formatCurrency(rowSummary.orderTurnover)}</td>
                      <td className="border-b border-slate-100 py-3 text-center font-semibold">{formatCurrency(rowSummary.invoiceTurnover)}</td>
                    </tr>
                    {expanded && (
                      <tr key={`${representative.id}-details`}>
                        <td className="border-b border-slate-100 bg-slate-50 p-4" colSpan={9}>
                          <AppointmentDetailTable appointments={representative.appointments} t={t} onOpenSummary={setSummaryAppointment} />
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
      {summaryAppointment && <AppointmentSummaryModal appointment={summaryAppointment} t={t} onClose={() => setSummaryAppointment(undefined)} />}
    </section>
  );
}

function AppointmentDetailTable({
  appointments,
  t,
  onOpenSummary
}: {
  appointments: TeamAppointment[];
  t: TranslationFn;
  onOpenSummary: (appointment: TeamAppointment) => void;
}) {
  return (
    <table className="w-full min-w-[54rem] border-separate border-spacing-0 text-left text-xs">
      <thead>
        <tr className="text-slate-500">
          <th className="border-b border-slate-200 py-2 pr-3">{t("team.detail.time")}</th>
          <th className="border-b border-slate-200 py-2 pr-3">Nummer</th>
          <th className="border-b border-slate-200 py-2 pr-3">{t("team.detail.name")}</th>
          <th className="border-b border-slate-200 py-2 pr-3 text-center">{t("team.detail.type")}</th>
          <th className="border-b border-slate-200 py-2 pr-3 text-center">{t("team.detail.status")}</th>
          <th className="border-b border-slate-200 py-2 pr-3 text-center">{t("team.detail.orderTurnover")}</th>
          <th className="border-b border-slate-200 py-2 pr-3 text-center">{t("team.detail.invoiceTurnover")}</th>
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
              <td className="border-b border-slate-200 py-2 pr-3 text-center">
                <Badge tone={appointment.customer ? "blue" : "amber"}>{appointment.customer ? t("appointment.customer") : t("appointment.prospect")}</Badge>
              </td>
              <td className="border-b border-slate-200 py-2 pr-3 text-center">
                <StatusBadge status={appointment.status} label={t(`team.status.${appointment.status}`)} />
              </td>
              <td className="border-b border-slate-200 py-2 pr-3 text-center">{formatCurrency(appointment.orderTurnover)}</td>
              <td className="border-b border-slate-200 py-2 pr-3 text-center">{formatCurrency(appointment.invoiceTurnover)}</td>
              <td className="border-b border-slate-200 py-2">
                <button
                  className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#003B83] px-3 text-xs font-bold text-white transition hover:bg-[#002b60]"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenSummary(appointment);
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

function TeamPhoto({ representative, users }: { representative: TeamRepresentative; users: ManagedUser[] }) {
  const user = users.find((item) => normalizeName(`${item.firstName} ${item.lastName}`) === normalizeName(representative.name) && item.country === representative.country);

  return <UserAvatar className="size-8" name={representative.name} photo={user?.photo} />;
}

function AppointmentSummaryModal({ appointment, onClose, t }: { appointment: TeamAppointment; onClose: () => void; t: TranslationFn }) {
  const relation = appointment.customer ?? appointment.prospect;
  const documents = createSalesDocuments(appointment);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#003B83]">Afspraaksamenvatting</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{relation?.name}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{appointment.time} · {relation?.number} · {appointment.customer ? t("appointment.customer") : t("appointment.prospect")}</p>
          </div>
          <button className="rounded-lg bg-[#003B83] px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]" onClick={onClose} type="button">Sluiten</button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <SummaryField label="Status" value={t(`team.status.${appointment.status}`)} />
          <SummaryField label="Adres" value={`${appointment.address.line1}, ${appointment.address.postalCode} ${appointment.address.city}`} />
          <SummaryField label="Omzet order" value={formatCurrency(appointment.orderTurnover)} />
          <SummaryField label="Omzet factuur" value={formatCurrency(appointment.invoiceTurnover)} />
          <SummaryField label="Contact" value={appointment.contacts[0]?.name ?? "-"} />
          <SummaryField label="Opmerkingen" value={appointment.notes ?? "-"} />
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-black uppercase text-slate-600">Verkoopdocumenten</h4>
          <table className="mt-2 w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="border-b border-slate-200 py-2 pr-3">Type</th>
                <th className="border-b border-slate-200 py-2 pr-3">Document</th>
                <th className="border-b border-slate-200 py-2 pr-3">Bedrag</th>
                <th className="border-b border-slate-200 py-2">Betaalwijze</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={`${document.type}-${document.number}`}>
                  <td className="border-b border-slate-100 py-2 pr-3 font-bold">{document.type}</td>
                  <td className="border-b border-slate-100 py-2 pr-3">{document.number}</td>
                  <td className="border-b border-slate-100 py-2 pr-3 font-semibold">{formatCurrency(document.amount)}</td>
                  <td className="border-b border-slate-100 py-2">{document.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function createSalesDocuments(appointment: TeamAppointment) {
  const base = appointment.id.replace("team-apt-", "");
  const orderAmount = appointment.orderTurnover;
  const invoiceAmount = appointment.invoiceTurnover;

  return [
    { amount: orderAmount, number: `ORD-${base}`, paymentMethod: "Overschrijving", type: "Order" },
    { amount: orderAmount > 0 ? Math.round(orderAmount * 0.6) : 0, number: `DLV-${base}`, paymentMethod: "Bancontact", type: "Order reeds geleverd" },
    { amount: invoiceAmount, number: `INV-${base}`, paymentMethod: "Contact", type: "Factuur" },
    { amount: invoiceAmount > 0 ? Math.round(invoiceAmount * 0.1) : 0, number: `CRN-${base}`, paymentMethod: "Machtiging", type: "Creditnota" }
  ];
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
    todo: appointments.filter((appointment) => appointment.status !== "completed").length,
    orderTurnover: appointments.reduce((total, appointment) => total + appointment.orderTurnover, 0),
    invoiceTurnover: appointments.reduce((total, appointment) => total + appointment.invoiceTurnover, 0)
  };
}

function normalizeName(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function formatCurrency(value: number) {
  return `€ ${value.toLocaleString("nl-BE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
