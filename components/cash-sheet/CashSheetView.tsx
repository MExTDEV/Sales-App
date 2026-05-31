"use client";

import { useState } from "react";
import { AlertTriangle, Banknote, CalendarDays, CheckCircle2, WalletCards, X } from "lucide-react";
import { currentDateValue, formatCurrency } from "@/domain/shared/formatting";
import { Badge } from "@/components/shared/ui";
import type { CashSheet, TranslationFn } from "@/types/sales";

export function CashSheetView({
  cashSheet,
  depositReported,
  representativeName,
  t,
  onDeposit
}: {
  cashSheet: CashSheet;
  depositReported: boolean;
  representativeName: string;
  t: TranslationFn;
  onDeposit: () => void;
}) {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositDate, setDepositDate] = useState(currentDateValue());
  const [depositRemark, setDepositRemark] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const status = depositReported ? "deposit_reported" : cashSheet.status;
  const hasUnresolvedCashLines = cashSheet.status === "open" && cashSheet.lines.some((line) => line.isPaid && !line.isCleared);
  const totalToDeposit = formatCurrency(cashSheet.totalAmountInclVat);

  function reportDeposit() {
    onDeposit();
    setDepositModalOpen(false);
    setSuccessOpen(true);
    setDepositRemark("");
    window.setTimeout(() => setSuccessOpen(false), 2600);
  }

  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#003B83]">{t("cash.title")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{t("nav.cashSheet")}</h2>
            <p className="mt-2 text-sm font-bold text-slate-500">{representativeName}</p>
          </div>
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#002b60] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            disabled={status !== "open"}
            onClick={() => setDepositModalOpen(true)}
          >
            <Banknote aria-hidden="true" size={18} strokeWidth={2} />
            {t("cash.depositAction")}
          </button>
        </div>
      </div>

      {hasUnresolvedCashLines && !depositReported && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-[0_14px_40px_rgba(245,158,11,0.10)]">
          <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0" size={22} strokeWidth={2} />
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.14em]">{t("cash.mondayBlockWarningTitle")}</h3>
            <p className="mt-1 text-sm font-bold leading-6">{t("cash.mondayBlockWarningBody")}</p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CashMetric icon={<CalendarDays size={20} strokeWidth={2} />} label={t("cash.week")} value={`${cashSheet.weekNumber}/${cashSheet.year}`} />
        <CashMetric icon={<WalletCards size={20} strokeWidth={2} />} label={t("common.status")} value={t(`cash.status.${status}`)} />
        <CashMetric icon={<Banknote size={20} strokeWidth={2} />} label={t("cash.totalToDeposit")} value={`${totalToDeposit} ${t("cash.depositDue")}`} emphasized />
        <CashMetric icon={<CheckCircle2 size={20} strokeWidth={2} />} label={t("myInfo.cashLineCount")} value={String(cashSheet.lines.length)} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">{t("cash.detailLines")}</h3>
          <Badge tone={cashStatusTone(status)}>{t(`cash.status.${status}`)}</Badge>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["field.date", "field.document", "field.customer", "cash.amountInclVat", "common.status"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    {t(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {cashSheet.lines.map((line) => (
                <tr key={line.id} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{line.date}</td>
                  <td className="break-words px-3 py-3 font-black text-slate-950">{line.documentNo}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{line.customerName}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatCurrency(line.amountInclVat)}</td>
                  <td className="break-words px-3 py-3">
                    <Badge tone={line.isCleared ? "green" : "amber"}>{line.isCleared ? t("cash.lineStatus.cleared") : t("cash.lineStatus.toDeposit")}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {depositModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-xl font-black text-slate-950">{t("cash.depositModal.title")}</h3>
            <div className="mt-5 grid gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{t("cash.depositModal.amount")}</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{totalToDeposit}</p>
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700">{t("cash.depositModal.date")}</span>
                <input className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" type="date" value={depositDate} onChange={(event) => setDepositDate(event.target.value)} />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700">{t("appointment.notes")}</span>
                <textarea className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" value={depositRemark} onChange={(event) => setDepositRemark(event.target.value)} />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50" onClick={() => setDepositModalOpen(false)}>
                <X aria-hidden="true" size={16} strokeWidth={2} />
                {t("common.cancel")}
              </button>
              <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#002b60]" onClick={reportDeposit}>
                <CheckCircle2 aria-hidden="true" size={16} strokeWidth={2} />
                {t("cash.depositModal.report")}
              </button>
            </div>
          </section>
        </div>
      )}

      {successOpen && (
        <div className="fixed bottom-24 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">
          {t("cash.depositSuccess")}
        </div>
      )}
    </section>
  );
}

function CashMetric({ emphasized, icon, label, value }: { emphasized?: boolean; icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/60 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-[#003B83]/10 text-[#003B83]">{icon}</span>
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
          <p className={`${emphasized ? "text-2xl" : "text-xl"} mt-1 font-black tracking-tight text-slate-950`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function cashStatusTone(status: CashSheet["status"]) {
  if (status === "cleared") return "green";
  if (status === "deposit_reported") return "blue";
  return "amber";
}
