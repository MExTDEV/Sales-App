import { Badge, DataRow } from "@/components/shared/ui";
import type { CashSheet, MockUser, TranslationFn } from "@/types/sales";

export function CashBlockScreen({
  cashSheet,
  t,
  user,
  onAdminUnblock,
  onDeposit
}: {
  cashSheet: CashSheet;
  t: TranslationFn;
  user: MockUser;
  onAdminUnblock: () => void;
  onDeposit: () => void;
}) {
  const canUnblock = user.permissions.includes("UnblockCashSheetWorkday");
  const amountToDeposit = `€ ${cashSheet.totalAmountInclVat.toFixed(2)}`;

  return (
    <section className="grid min-h-[calc(100vh-11rem)] place-items-center">
      <div className="w-full max-w-3xl rounded-lg border border-amber-200 bg-white p-6 shadow-xl">
        <Badge tone="amber">{t("cash.mondayRule")} | {user.timezone}</Badge>
        <h2 className="mt-4 text-3xl font-bold text-slate-950">{t("cash.blockTitle")}</h2>
        <p className="mt-3 leading-7 text-slate-700">{t("cash.blockBody")}</p>
        <p className="mt-4 text-lg font-medium text-slate-950">
          {amountToDeposit} <span className="text-sm font-medium text-slate-600">{t("cash.depositDue")}</span>
        </p>
        <div className="mt-5 rounded-md bg-amber-50 p-4">
          {cashSheet.lines.map((line) => (
            <DataRow
              key={line.id}
              label={line.documentNo}
              value={`${line.customerName} | EUR ${line.amountInclVat.toFixed(2)} | ${t("cash.uncleared")}`}
            />
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button className="min-h-12 rounded-md bg-[#003B83] px-4 font-bold text-white transition hover:bg-[#002b60]" onClick={onDeposit}>
            {t("cash.deposit")}
          </button>
          <button
            className="min-h-12 rounded-md border border-slate-300 px-4 font-bold disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canUnblock}
            onClick={onAdminUnblock}
          >
            {t("cash.unblock")}
          </button>
        </div>
        {!canUnblock && <p className="mt-3 text-sm text-slate-600">{t("cash.unblockDenied")}</p>}
      </div>
    </section>
  );
}
