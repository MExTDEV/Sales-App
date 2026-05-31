"use client";

import { useMemo, useState } from "react";
import { BarChart3, CalendarDays, Euro, ReceiptText, RotateCcw, UsersRound } from "lucide-react";
import { formatCurrency, formatDate, formatShortCurrency } from "@/domain/shared/formatting";
import type { MockUser, TranslationFn } from "@/types/sales";

type ReportPeriod = "today" | "week" | "month";

type ReportRow = {
  date: string;
  invoiceCount: number;
  invoiceTurnover: number;
  creditNoteCount: number;
  creditNoteTurnover: number;
  representativeId: string;
};

const reportRows: ReportRow[] = [
  { date: "2026-05-30", invoiceCount: 5, invoiceTurnover: 1480, creditNoteCount: 1, creditNoteTurnover: 120, representativeId: "u-rep-01" },
  { date: "2026-05-29", invoiceCount: 4, invoiceTurnover: 920, creditNoteCount: 0, creditNoteTurnover: 0, representativeId: "u-rep-01" },
  { date: "2026-05-28", invoiceCount: 7, invoiceTurnover: 2140, creditNoteCount: 1, creditNoteTurnover: 260, representativeId: "u-rep-01" },
  { date: "2026-05-27", invoiceCount: 3, invoiceTurnover: 760, creditNoteCount: 0, creditNoteTurnover: 0, representativeId: "u-rep-01" },
  { date: "2026-05-26", invoiceCount: 6, invoiceTurnover: 1895, creditNoteCount: 2, creditNoteTurnover: 310, representativeId: "u-rep-01" },
  { date: "2026-05-25", invoiceCount: 2, invoiceTurnover: 480, creditNoteCount: 0, creditNoteTurnover: 0, representativeId: "u-rep-01" },
  { date: "2026-05-24", invoiceCount: 3, invoiceTurnover: 870, creditNoteCount: 1, creditNoteTurnover: 95, representativeId: "u-rep-01" },
  { date: "2026-05-23", invoiceCount: 8, invoiceTurnover: 2360, creditNoteCount: 1, creditNoteTurnover: 180, representativeId: "u-rep-02" },
  { date: "2026-05-22", invoiceCount: 5, invoiceTurnover: 1520, creditNoteCount: 0, creditNoteTurnover: 0, representativeId: "u-rep-02" }
];

const representatives = [
  { id: "u-rep-01", name: "An De Smet" },
  { id: "u-rep-02", name: "Pieter Vermeulen" }
];

export function ReportsView({ t, user }: { t: TranslationFn; user: MockUser }) {
  const [period, setPeriod] = useState<ReportPeriod>("today");
  const [representativeId, setRepresentativeId] = useState(user.id);
  const canSelectRepresentative = user.role === "sales_leader" || user.role === "admin" || user.role === "superadmin";
  const visibleRows = useMemo(() => {
    const rowsByPeriod = reportRows.filter((row) => isInPeriod(row.date, period));
    return rowsByPeriod.filter((row) => canSelectRepresentative ? representativeId === "all" || row.representativeId === representativeId : row.representativeId === user.id);
  }, [canSelectRepresentative, period, representativeId, user.id]);
  const totals = calculateTotals(visibleRows);
  const averageInvoice = totals.invoiceCount > 0 ? totals.invoiceTurnover / totals.invoiceCount : 0;

  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#003B83]">{t("reports.title")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{t("nav.reports")}</h2>
            <p className="mt-2 text-sm font-bold text-slate-500">{t("reports.subtitle")}</p>
          </div>
          <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
            <BarChart3 aria-hidden="true" size={24} strokeWidth={2} />
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-2">
            <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
              <CalendarDays aria-hidden="true" size={16} strokeWidth={2} className="text-[#003B83]" />
              {t("reports.period")}
            </span>
            <select className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83]" value={period} onChange={(event) => setPeriod(event.target.value as ReportPeriod)}>
              <option value="today">{t("reports.period.today")}</option>
              <option value="week">{t("reports.period.week")}</option>
              <option value="month">{t("reports.period.month")}</option>
            </select>
          </label>
          <ReadOnlyFilter label={t("reports.periodDisplay")} value={periodDisplay(period, t)} />
          {canSelectRepresentative ? (
            <label className="grid gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
                <UsersRound aria-hidden="true" size={16} strokeWidth={2} className="text-[#003B83]" />
                {t("reports.representative")}
              </span>
              <select className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83]" value={representativeId} onChange={(event) => setRepresentativeId(event.target.value)}>
                <option value="all">{t("reports.allRepresentatives")}</option>
                {representatives.map((rep) => <option key={rep.id} value={rep.id}>{rep.name}</option>)}
              </select>
            </label>
          ) : (
            <ReadOnlyFilter label={t("reports.representative")} value={user.name} />
          )}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ReportKpi icon={<ReceiptText size={21} strokeWidth={2} />} label={t("reports.invoices")} value={String(totals.invoiceCount)} subValue={formatEuro(totals.invoiceTurnover)} />
        <ReportKpi icon={<RotateCcw size={21} strokeWidth={2} />} label={t("reports.creditNotes")} value={String(totals.creditNoteCount)} subValue={formatEuro(totals.creditNoteTurnover)} warning />
        <ReportKpi icon={<Euro size={21} strokeWidth={2} />} label={t("reports.totalTurnover")} value={formatEuro(totals.totalTurnover)} />
        <ReportKpi icon={<ReceiptText size={21} strokeWidth={2} />} label={t("reports.averageInvoice")} value={formatEuro(averageInvoice)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <TrendChart rows={visibleRows} t={t} />
        <BreakdownChart totals={totals} t={t} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-600">{t("reports.detail")}</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["field.date", "reports.invoiceCount", "reports.invoiceTurnover", "reports.creditNoteCount", "reports.creditNoteTurnover", "reports.totalTurnover"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {visibleRows.map((row) => (
                <tr key={`${row.representativeId}-${row.date}`} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-black text-slate-950">{formatDate(row.date)}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{row.invoiceCount}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatEuro(row.invoiceTurnover)}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{row.creditNoteCount}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatEuro(row.creditNoteTurnover)}</td>
                  <td className="break-words px-3 py-3 font-black text-slate-950">{formatEuro(row.invoiceTurnover - row.creditNoteTurnover)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function ReadOnlyFilter({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ReportKpi({ icon, label, subValue, value, warning }: { icon: React.ReactNode; label: string; subValue?: string; value: string; warning?: boolean }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <span className={`grid size-11 place-items-center rounded-xl ${warning ? "bg-amber-50 text-amber-700" : "bg-[#003B83]/10 text-[#003B83]"}`}>{icon}</span>
        <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      {subValue && <p className="mt-1 text-sm font-black text-[#003B83]">{subValue}</p>}
    </article>
  );
}

function TrendChart({ rows, t }: { rows: ReportRow[]; t: TranslationFn }) {
  const chartRows = [...rows].sort((a, b) => a.date.localeCompare(b.date)).slice(-7);
  const max = Math.max(1, ...chartRows.map((row) => Math.max(row.invoiceTurnover, row.creditNoteTurnover, row.invoiceTurnover - row.creditNoteTurnover)));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">{t("reports.trendChart")}</h3>
      <div className="mt-5 grid h-72 grid-cols-[3rem_1fr] gap-3">
        <div className="flex flex-col justify-between text-right text-[0.65rem] font-bold text-slate-400">
          <span>{formatShortEuro(max)}</span>
          <span>{formatShortEuro(max / 2)}</span>
          <span>€0</span>
        </div>
        <div className="flex items-end gap-3 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/50 p-4">
          {chartRows.map((row) => {
            const total = row.invoiceTurnover - row.creditNoteTurnover;
            return (
              <div key={row.date} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
                <div className="flex h-52 items-end gap-1">
                  <Bar value={row.invoiceTurnover} max={max} className="bg-[#003B83]" />
                  <Bar value={row.creditNoteTurnover} max={max} className="bg-amber-500" />
                  <Bar value={total} max={max} className="bg-emerald-600" />
                </div>
                <span className="truncate text-[0.65rem] font-bold text-slate-500">{row.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
        <Legend color="bg-[#003B83]" label={t("reports.invoiceTurnover")} />
        <Legend color="bg-amber-500" label={t("reports.creditNoteTurnover")} />
        <Legend color="bg-emerald-600" label={t("reports.totalTurnover")} />
      </div>
    </section>
  );
}

function Bar({ className, max, value }: { className: string; max: number; value: number }) {
  const height = Math.max(4, Math.round((Math.max(0, value) / max) * 208));
  return <span className={`block w-3 rounded-t-full ${className}`} style={{ height }} />;
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`size-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function BreakdownChart({ totals, t }: { totals: ReturnType<typeof calculateTotals>; t: TranslationFn }) {
  const invoiceShare = totals.invoiceTurnover + totals.creditNoteTurnover > 0 ? (totals.invoiceTurnover / (totals.invoiceTurnover + totals.creditNoteTurnover)) * 100 : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">{t("reports.breakdownChart")}</h3>
      <div className="mt-8 grid place-items-center">
        <div
          className="grid size-48 place-items-center rounded-full shadow-inner"
          style={{ background: `conic-gradient(#003B83 0 ${invoiceShare}%, #f59e0b ${invoiceShare}% 100%)` }}
        >
          <div className="grid size-28 place-items-center rounded-full bg-white text-center shadow">
            <span>
              <span className="block text-xs font-black uppercase text-slate-500">{t("reports.totalTurnover")}</span>
              <span className="block text-lg font-black text-slate-950">{formatEuro(totals.totalTurnover)}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-7 grid gap-3">
        <BreakdownLine color="bg-[#003B83]" label={t("reports.invoices")} value={formatEuro(totals.invoiceTurnover)} />
        <BreakdownLine color="bg-amber-500" label={t("reports.creditNotes")} value={formatEuro(totals.creditNoteTurnover)} />
      </div>
    </section>
  );
}

function BreakdownLine({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
        <span className={`size-3 rounded-full ${color}`} />
        {label}
      </span>
      <span className="text-sm font-black text-slate-950">{value}</span>
    </div>
  );
}

function calculateTotals(rows: ReportRow[]) {
  const invoiceCount = rows.reduce((total, row) => total + row.invoiceCount, 0);
  const invoiceTurnover = rows.reduce((total, row) => total + row.invoiceTurnover, 0);
  const creditNoteCount = rows.reduce((total, row) => total + row.creditNoteCount, 0);
  const creditNoteTurnover = rows.reduce((total, row) => total + row.creditNoteTurnover, 0);
  return {
    invoiceCount,
    invoiceTurnover,
    creditNoteCount,
    creditNoteTurnover,
    totalTurnover: invoiceTurnover - creditNoteTurnover
  };
}

function isInPeriod(date: string, period: ReportPeriod) {
  if (period === "today") return date === "2026-05-30";
  if (period === "week") return date >= "2026-05-24" && date <= "2026-05-30";
  return date >= "2026-05-01" && date <= "2026-05-31";
}

function periodDisplay(period: ReportPeriod, t: TranslationFn) {
  if (period === "today") return "30/05/2026";
  if (period === "week") return `24/05/2026 - 30/05/2026`;
  return t("reports.periodDisplay.month");
}

const formatEuro = formatCurrency;
const formatShortEuro = formatShortCurrency;
