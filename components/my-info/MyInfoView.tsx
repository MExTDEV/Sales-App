"use client";

import { useState, type ReactNode } from "react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Banknote, CheckCircle2, RefreshCw, X } from "lucide-react";
import type { Appointment, CashSheet, Language, ManagedUser, MockUser, TranslationFn } from "@/types/sales";

type ChangeRequest = {
  firstName: string;
  lastName: string;
  mobile: string;
};

export function MyInfoView({
  appointments,
  cashSheet,
  isCashSheetBlocked,
  lastSync,
  managedUser,
  onLanguageChange,
  onOpenCashSheet,
  onSync,
  pendingRecords,
  t,
  user
}: {
  appointments: Appointment[];
  cashSheet: CashSheet;
  isCashSheetBlocked: boolean;
  lastSync: string;
  managedUser?: ManagedUser;
  onLanguageChange: (language: Language) => void;
  onOpenCashSheet?: () => void;
  onSync: () => void;
  pendingRecords: number;
  t: TranslationFn;
  user: MockUser;
}) {
  const profile = createProfile(managedUser, user);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [cashDepositNoticeOpen, setCashDepositNoticeOpen] = useState(false);
  const [changeRequest, setChangeRequest] = useState<ChangeRequest>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    mobile: profile.mobile
  });
  const prospectAppointments = appointments.filter((item) => Boolean(item.prospect));
  const customerAppointments = appointments.filter((item) => Boolean(item.customer));
  const prospectRevenue = prospectAppointments.reduce((total, item) => total + (item.orderRevenue ?? 0) + (item.invoiceRevenue ?? 0), 0);
  const customerRevenue = customerAppointments.reduce((total, item) => total + (item.orderRevenue ?? 0) + (item.invoiceRevenue ?? 0), 0);
  const cashLines = cashSheet.lines.length;

  function openChangeRequest() {
    setChangeRequest({
      firstName: profile.firstName,
      lastName: profile.lastName,
      mobile: profile.mobile
    });
    setRequestOpen(true);
  }

  function sendChangeRequest() {
    // Later this can call an API, mail workflow or approval queue.
    setRequestOpen(false);
    setRequestSent(true);
  }

  return (
    <div className="grid max-h-none gap-3 text-sm xl:max-h-[calc(100vh-8.5rem)] xl:grid-rows-[auto_auto_1fr] xl:overflow-hidden">
      <section className="rounded-lg border border-blue-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-blue-50 px-4 py-3">
          <UserAvatar className="size-11 text-base" name={profile.fullName} photo={managedUser?.photo} />
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-black uppercase tracking-wide text-[#003B83]">{t("myInfo.title")}</p>
            <h2 className="truncate text-xl font-black text-slate-950">{profile.fullName}</h2>
            <p className="truncate text-xs font-semibold text-slate-500">{profile.team} · {t(countryKey(profile.country))} · {t(profile.roleLabel)}</p>
          </div>
          <StatusPill label={profile.isActive ? t("userManagement.status.active") : t("userManagement.status.inactive")} tone={profile.isActive ? "green" : "slate"} />
        </div>
      </section>

      <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
        <CompactPanel title={t("myInfo.personal")}>
          <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
            <InfoLine label={t("userManagement.field.userId")} value={profile.id} />
            <InfoLine label={t("userManagement.field.email")} value={profile.email} />
            <InfoLine label={t("userManagement.field.lastName")} value={profile.lastName} />
            <InfoLine label={t("userManagement.field.firstName")} value={profile.firstName} />
            <InfoLine label={t("userManagement.field.mobile")} value={profile.mobile} />
            <label className="grid gap-1 text-xs font-bold text-slate-500">
              {t("userManagement.field.language")}
              <select
                className="min-h-8 rounded-md border border-slate-200 bg-white px-2 text-sm font-bold text-slate-950 outline-none focus:border-[#003B83] focus:ring-2 focus:ring-blue-100"
                value={profile.language}
                onChange={(event) => onLanguageChange(event.target.value as Language)}
              >
                <option value="nl">{t("language.nl")}</option>
                <option value="fr">{t("language.fr")}</option>
                <option value="de">{t("language.de")}</option>
              </select>
            </label>
          </div>
          <button className="mt-3 min-h-8 rounded-md bg-[#003B83] px-3 text-xs font-black text-white shadow-sm transition hover:bg-[#002b60]" onClick={openChangeRequest} type="button">
            Mijn gegevens aanpassen
          </button>
        </CompactPanel>

        <CompactPanel title={t("myInfo.teamInfo")}>
          <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
            <InfoLine label={t("userManagement.field.country")} value={t(countryKey(profile.country))} />
            <InfoLine label={t("userManagement.field.team")} value={profile.team} />
            <InfoLine label={t("userManagement.field.role")} value={t(profile.roleLabel)} />
            <InfoLine label={t("myInfo.teamLead")} value={profile.teamLead} />
            <InfoLine label={t("userManagement.field.establishmentNumber")} value={profile.establishmentNumber} />
            <InfoLine label={t("userManagement.field.teamSupervisor")} value={profile.isTeamSupervisor ? t("common.yes") : t("common.no")} />
          </div>
        </CompactPanel>
      </div>

      <div className="grid min-h-0 gap-3 xl:grid-cols-3">
        <CompactPanel title="Vandaag">
          <table className="w-full table-fixed border-collapse overflow-hidden rounded-lg text-xs">
            <thead>
              <tr className="bg-blue-50 text-left text-xs font-black uppercase text-[#003B83]">
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2 text-center">Afspraken</th>
                <th className="px-2 py-2 text-center">Omzet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <CompactMetricRow label="Prospecten" count={prospectAppointments.length} revenue={prospectRevenue} />
              <CompactMetricRow label="Klanten" count={customerAppointments.length} revenue={customerRevenue} />
              <CompactMetricRow strong label="Totaal" count={appointments.length} revenue={prospectRevenue + customerRevenue} />
            </tbody>
          </table>
        </CompactPanel>

        <CompactPanel title={t("myInfo.cashSheet")}>
          <div className="grid gap-2">
            <SummaryLine label={t("common.status")} value={t(`cash.status.${cashSheet.status}`)} tone={isCashSheetBlocked ? "amber" : "blue"} />
            <SummaryLine label={t("myInfo.depositDue")} value={formatEuro(cashSheet.totalAmountInclVat)} />
            <SummaryLine label={t("myInfo.cashLineCount")} value={String(cashLines)} />
            <SummaryLine label={t("myInfo.mondayBlockActive")} value={isCashSheetBlocked ? t("common.yes") : t("common.no")} tone={isCashSheetBlocked ? "amber" : "green"} />
          </div>
          <button className="mt-2 inline-flex min-h-8 items-center gap-2 rounded-md bg-[#003B83] px-3 text-xs font-black text-white shadow-sm transition hover:bg-[#002b60]" onClick={onOpenCashSheet ?? (() => setCashDepositNoticeOpen(true))} type="button">
            <Banknote aria-hidden="true" size={15} /> {t("myInfo.cashDeposit.action")}
          </button>
        </CompactPanel>

        <CompactPanel title={t("myInfo.sync")}>
          <div className="grid gap-2">
            <SummaryLine label={t("myInfo.onlineStatus")} value={t("sync.online")} tone="green" />
            <SummaryLine label={t("sync.lastSync")} value={lastSync} />
            <SummaryLine label={t("sync.pending")} value={String(pendingRecords)} tone={pendingRecords ? "amber" : "green"} />
            <SummaryLine label={t("myInfo.appVersion")} value="0.1.1" />
          </div>
          <button className="mt-2 inline-flex min-h-8 items-center gap-2 rounded-md bg-[#003B83] px-3 text-xs font-black text-white shadow-sm transition hover:bg-[#002b60]" onClick={onSync} type="button">
            <RefreshCw aria-hidden="true" size={15} /> {t("sync.syncNow")}
          </button>
        </CompactPanel>
      </div>

      {requestOpen && (
        <Modal title="Mijn gegevens aanpassen" onClose={() => setRequestOpen(false)}>
          <div className="grid gap-3">
            <RequestField label="Naam" value={changeRequest.lastName} onChange={(value) => setChangeRequest((current) => ({ ...current, lastName: value }))} />
            <RequestField label="Voornaam" value={changeRequest.firstName} onChange={(value) => setChangeRequest((current) => ({ ...current, firstName: value }))} />
            <RequestField label="Mobiel nr" value={changeRequest.mobile} onChange={(value) => setChangeRequest((current) => ({ ...current, mobile: value }))} />
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-bold" onClick={() => setRequestOpen(false)} type="button">Annuleren</button>
            <button className="min-h-10 rounded-md bg-[#003B83] px-4 text-sm font-bold text-white" onClick={sendChangeRequest} type="button">Aanvraag verzenden</button>
          </div>
        </Modal>
      )}

      {requestSent && (
        <Modal title="Aanvraag verzonden" onClose={() => setRequestSent(false)}>
          <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800">
            <CheckCircle2 aria-hidden="true" className="shrink-0" size={20} />
            <p>Je aanvraag is geregistreerd. De technische koppeling naar mail/API/approval-flow kan hier later op aansluiten.</p>
          </div>
          <button className="mt-5 min-h-10 rounded-md bg-[#003B83] px-4 text-sm font-bold text-white" onClick={() => setRequestSent(false)} type="button">{t("common.ok")}</button>
        </Modal>
      )}

      {cashDepositNoticeOpen && (
        <Modal title={t("myInfo.cashDeposit.mockMessage")} onClose={() => setCashDepositNoticeOpen(false)}>
          <button className="mt-2 min-h-10 rounded-md bg-[#003B83] px-4 text-sm font-bold text-white" onClick={() => setCashDepositNoticeOpen(false)} type="button">{t("common.ok")}</button>
        </Modal>
      )}
    </div>
  );
}

function CompactPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">{title}</h3>
      {children}
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.68rem] font-black uppercase text-slate-500">{label}</p>
      <p className="truncate text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function CompactMetricRow({ count, label, revenue, strong = false }: { count: number; label: string; revenue: number; strong?: boolean }) {
  return (
    <tr className={strong ? "bg-slate-50 font-black" : ""}>
      <td className="px-3 py-2 font-bold text-slate-700">{label}</td>
      <td className="px-3 py-2 text-center font-semibold text-slate-950">{count}</td>
      <td className="px-3 py-2 text-center font-black text-slate-950">{formatEuro(revenue)}</td>
    </tr>
  );
}

function SummaryLine({ label, tone = "slate", value }: { label: string; tone?: "amber" | "blue" | "green" | "slate"; value: string }) {
  const tones = {
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    blue: "bg-blue-50 text-[#003B83] border-blue-200",
    green: "bg-green-50 text-green-800 border-green-200",
    slate: "bg-slate-50 text-slate-800 border-slate-200"
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-2 py-1.5">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span className={`rounded-full border px-2 py-0.5 text-xs font-black ${tones[tone]}`}>{value}</span>
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "green" | "slate" }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${tone === "green" ? "bg-green-50 text-green-800" : "bg-slate-100 text-slate-600"}`}>{label}</span>;
}

function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black text-slate-950">{title}</h3>
          <button className="grid size-8 place-items-center rounded-md border border-slate-200" onClick={onClose} type="button"><X aria-hidden="true" size={16} /></button>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}

function RequestField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-slate-700">
      {label}
      <input className="min-h-10 rounded-md border border-slate-300 px-3 text-sm font-semibold outline-none focus:border-[#003B83] focus:ring-2 focus:ring-blue-100" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function createProfile(managedUser: ManagedUser | undefined, user: MockUser) {
  const [firstName, ...lastNameParts] = user.name.split(" ");
  const lastName = lastNameParts.join(" ") || user.name;

  return {
    id: managedUser?.id ?? user.id.toUpperCase(),
    firstName: managedUser?.firstName ?? firstName,
    lastName: managedUser?.lastName ?? lastName,
    fullName: managedUser ? `${managedUser.firstName} ${managedUser.lastName}` : user.name,
    initials: managedUser ? `${managedUser.firstName.charAt(0)}${managedUser.lastName.charAt(0)}` : user.name.charAt(0),
    email: managedUser?.email ?? `${user.name.toLowerCase().replaceAll(" ", ".")}@mext.be`,
    language: user.preferredLanguage,
    mobile: managedUser?.mobile ?? "+32 475 12 34 56",
    country: managedUser?.country ?? user.country,
    team: managedUser?.team ?? user.teamId ?? "Team North",
    roleLabel: roleLabelKeyFor(user.role),
    isTeamSupervisor: managedUser?.isTeamSupervisor ?? user.role === "sales_leader",
    isActive: managedUser?.isActive ?? user.isActive,
    establishmentNumber: managedUser?.establishmentNumber ?? user.establishmentNumber,
    teamLead: user.role === "representative" ? "Tom Verbruggen" : "M.Ex.T. Superadmin"
  };
}

function roleLabelKeyFor(role: MockUser["role"]) {
  const keys: Record<MockUser["role"], string> = {
    representative: "technical.roles.representative",
    sales_leader: "technical.roles.salesLeader",
    admin: "technical.roles.admin",
    superadmin: "technical.roles.superadmin"
  };

  return keys[role];
}

function countryKey(country: string) {
  return `country.${country.toLowerCase()}`;
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}
