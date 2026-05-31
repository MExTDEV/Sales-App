import { Badge } from "@/components/shared/ui";
import { FileText, ListChecks, Package, ShieldCheck, TableProperties } from "lucide-react";
import type { MockUser, TechnicalAssetType, TechnicalContractType, TechnicalLeadType, TechnicalMaintenanceFrequency, TechnicalRole, TechnicalServiceControl, TranslationFn } from "@/types/sales";

export function TechnicalTablesView({
  assetTypes,
  contractTypes,
  frequencies,
  leadTypes,
  roles,
  serviceControls,
  t,
  user
}: {
  assetTypes: TechnicalAssetType[];
  contractTypes: TechnicalContractType[];
  frequencies: TechnicalMaintenanceFrequency[];
  leadTypes: TechnicalLeadType[];
  roles: TechnicalRole[];
  serviceControls: TechnicalServiceControl[];
  t: TranslationFn;
  user: MockUser;
}) {
  if (user.role !== "superadmin") {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">{t("technical.accessDenied.title")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t("technical.accessDenied.body")}</p>
      </section>
    );
  }

  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t("nav.technical")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{t("technical.tables.title")}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("technical.tables.subtitle")}</p>
          </div>
          <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
            <TableProperties aria-hidden="true" size={24} strokeWidth={2} />
          </div>
        </div>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-950">{t("technical.tables.roles.title")}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{t("technical.tables.roles.subtitle")}</p>
          </div>
          <Badge tone="blue">{t("common.mockOnly")}</Badge>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="border-b border-slate-200 py-3 pr-4">{t("technical.tables.column.code")}</th>
                <th className="border-b border-slate-200 py-3 pr-4">{t("technical.tables.column.role")}</th>
                <th className="border-b border-slate-200 py-3">{t("common.status")}</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="border-b border-slate-100 py-3 pr-4 font-semibold text-slate-800">{role.id}</td>
                  <td className="border-b border-slate-100 py-3 pr-4">{t(role.labelKey)}</td>
                  <td className="border-b border-slate-100 py-3">
                    {role.protectedForAdmin ? t("technical.tables.roles.protected") : t("technical.tables.roles.assignable")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-950">{t("technical.tables.maintenanceFrequencies.title")}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{t("technical.tables.maintenanceFrequencies.subtitle")}</p>
          </div>
          <Badge tone="blue">{t("common.mockOnly")}</Badge>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.maintenanceFrequencies.id")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.maintenanceFrequencies.code")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.maintenanceFrequencies.description")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.maintenanceFrequencies.interval")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {frequencies.map((frequency) => (
                <tr key={frequency.id}>
                  <td className="break-words px-3 py-3 font-semibold text-slate-800">{frequency.id}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{frequency.code}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{frequency.description}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{frequency.intervalMonths}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-950">{t("technical.tables.contractTypes.title")}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{t("technical.tables.contractTypes.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="blue">{t("common.mockOnly")}</Badge>
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
              <FileText aria-hidden="true" size={20} strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.contractTypes.id")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.contractTypes.code")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.contractTypes.description")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {contractTypes.map((contractType) => (
                <tr key={contractType.id}>
                  <td className="break-words px-3 py-3 font-semibold text-slate-800">{contractType.id}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{contractType.code}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{contractType.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-950">{t("technical.tables.assetTypes.title")}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{t("technical.tables.assetTypes.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="blue">{t("common.mockOnly")}</Badge>
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
              <Package aria-hidden="true" size={20} strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.column.code")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.assetTypes.type")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {assetTypes.map((assetType) => (
                <tr key={assetType.id}>
                  <td className="break-words px-3 py-3 font-semibold text-slate-800">{assetType.id}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{t(assetType.labelKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-950">{t("technical.tables.leadTypes.title")}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{t("technical.tables.leadTypes.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="blue">{t("common.mockOnly")}</Badge>
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
              <ListChecks aria-hidden="true" size={20} strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.column.code")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.leadTypes.type")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {leadTypes.map((leadType) => (
                <tr key={leadType.id}>
                  <td className="break-words px-3 py-3 font-semibold text-slate-800">{leadType.id}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{t(leadType.labelKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-950">{t("technical.tables.serviceControls.title")}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{t("technical.tables.serviceControls.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="blue">{t("common.mockOnly")}</Badge>
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
              <ShieldCheck aria-hidden="true" size={20} strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.serviceControls.id")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.serviceControls.type")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.serviceControls.point")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.serviceControls.description")}</th>
                <th className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t("technical.tables.serviceControls.required")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {serviceControls.map((control) => (
                <tr key={control.id}>
                  <td className="break-words px-3 py-3 font-semibold text-slate-800">{control.id}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{control.type}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{control.point}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{control.description}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{control.required ? t("lead.yes") : t("lead.no")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
