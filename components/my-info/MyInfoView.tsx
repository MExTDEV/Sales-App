"use client";

import { useState, type ReactNode } from "react";
import {
  Banknote,
  CalendarDays,
  Euro,
  IdCard,
  RefreshCw,
  Smartphone,
  UserRound,
  UsersRound,
  WalletCards,
  type LucideIcon
} from "lucide-react";
import type { Appointment, CashSheet, ManagedUser, MockUser, TranslationFn } from "@/types/sales";

export function MyInfoView({
  appointments,
  cashSheet,
  isCashSheetBlocked,
  lastSync,
  managedUser,
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
  onOpenCashSheet?: () => void;
  onSync: () => void;
  pendingRecords: number;
  t: TranslationFn;
  user: MockUser;
}) {
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [cashDepositNoticeOpen, setCashDepositNoticeOpen] = useState(false);
  const [newMobileNumber, setNewMobileNumber] = useState("");
  const profile = createProfile(managedUser, user);
  const openAppointments = appointments.filter((item) => item.status === "planned" || item.status === "rescheduled");
  const closedAppointments = appointments.filter((item) => ["completed", "no_time", "customer_absent", "cancelled"].includes(item.status));
  const orderRevenue = appointments.reduce((total, item) => total + (item.orderRevenue ?? 0), 0);
  const invoiceRevenue = appointments.reduce((total, item) => total + (item.invoiceRevenue ?? 0), 0);
  const cashLines = cashSheet.lines.length;

  function handleCancelMobileChange() {
    setNewMobileNumber("");
    setMobileModalOpen(false);
  }

  function handleReportMobileChange() {
    setNewMobileNumber("");
    setMobileModalOpen(false);
    setConfirmationOpen(true);
  }

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-center gap-5 p-5">
          <div className="grid size-20 place-items-center overflow-hidden rounded-2xl bg-blue-100 text-3xl font-black text-[#003B83] shadow-inner">
            {managedUser?.photo?.previewUrl ? <img alt={profile.fullName} className="h-full w-full object-cover" src={managedUser.photo.previewUrl} /> : profile.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#003B83]">{t("myInfo.title")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{profile.fullName}</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">
              {profile.team} - {t(countryKey(profile.country))}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("userManagement.field.userId")}: {profile.id}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <InfoBadge active label={t(profile.roleLabel)} />
            <InfoBadge active label={t(countryKey(profile.country))} />
            <InfoBadge active={profile.isActive} label={profile.isActive ? t("userManagement.status.active") : t("userManagement.status.inactive")} />
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <InfoSection icon={IdCard} title={t("myInfo.personal")}>
          <ReadOnlyGrid
            items={[
              [t("userManagement.field.userId"), profile.id],
              [t("userManagement.field.lastName"), profile.lastName],
              [t("userManagement.field.firstName"), profile.firstName],
              [t("userManagement.field.email"), profile.email],
              [t("userManagement.field.language"), t(`language.${profile.language}`)],
              [t("userManagement.field.mobile"), profile.mobile],
              [t("userManagement.field.establishmentNumber"), profile.establishmentNumber]
            ]}
            action={{
              icon: <Smartphone aria-hidden="true" size={18} strokeWidth={2} />,
              label: t("myInfo.mobileChange.request"),
              onClick: () => setMobileModalOpen(true)
            }}
          />
        </InfoSection>

        <InfoSection icon={UsersRound} title={t("myInfo.teamInfo")}>
          <ReadOnlyGrid
            items={[
              [t("userManagement.field.country"), t(countryKey(profile.country))],
              [t("userManagement.field.team"), profile.team],
              [t("userManagement.field.role"), t(profile.roleLabel)],
              [t("userManagement.field.teamSupervisor"), profile.isTeamSupervisor ? t("common.yes") : t("common.no")],
              [t("myInfo.teamLead"), profile.teamLead],
              [t("myInfo.establishment"), profile.establishmentNumber]
            ]}
          />
        </InfoSection>
      </div>

      <InfoSection icon={CalendarDays} title={t("myInfo.workdayToday")}>
        <MetricGrid
          items={[
            [t("dashboard.appointments"), String(appointments.length)],
            [t("agenda.counter.open"), String(openAppointments.length)],
            [t("agenda.counter.closed"), String(closedAppointments.length)],
            [t("dashboard.noTime"), String(appointments.filter((item) => item.status === "no_time").length)],
            [t("agenda.counter.customerAbsent"), String(appointments.filter((item) => item.status === "customer_absent").length)]
          ]}
        />
      </InfoSection>

      <InfoSection icon={Euro} title={t("myInfo.revenueToday")}>
        <MetricGrid
          items={[
            [t("agenda.revenue.orderFull"), formatEuro(orderRevenue)],
            [t("agenda.revenue.invoiceFull"), formatEuro(invoiceRevenue)],
            [t("myInfo.totalRevenue"), formatEuro(orderRevenue + invoiceRevenue)]
          ]}
        />
      </InfoSection>

      <div className="grid gap-5 xl:grid-cols-2">
        <InfoSection icon={WalletCards} title={t("myInfo.cashSheet")}>
          {isCashSheetBlocked && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">
              {t("myInfo.cashBlocked")}
            </div>
          )}
          <ReadOnlyGrid
            items={[
              [t("common.status"), t(`cash.status.${cashSheet.status}`)],
              [t("myInfo.depositDue"), formatEuro(cashSheet.totalAmountInclVat)],
              [t("myInfo.cashLineCount"), String(cashLines)],
              [t("myInfo.lastDeposit"), t("myInfo.notAvailable")],
              [t("myInfo.mondayBlockActive"), isCashSheetBlocked ? t("common.yes") : t("common.no")]
            ]}
            action={{
              icon: <Banknote aria-hidden="true" size={18} strokeWidth={2} />,
              label: t("myInfo.cashDeposit.action"),
              onClick: onOpenCashSheet ?? (() => setCashDepositNoticeOpen(true))
            }}
          />
        </InfoSection>

        <InfoSection icon={RefreshCw} title={t("myInfo.sync")}>
          <ReadOnlyGrid
            items={[
              [t("myInfo.onlineStatus"), t("sync.online")],
              [t("sync.lastSync"), lastSync],
              [t("sync.pending"), String(pendingRecords)],
              [t("myInfo.syncErrors"), "0"],
              [t("myInfo.appVersion"), "0.1.1"]
            ]}
            action={{
              icon: <RefreshCw aria-hidden="true" size={18} strokeWidth={2} />,
              label: t("sync.syncNow"),
              onClick: onSync
            }}
          />
        </InfoSection>
      </div>

      {mobileModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-black text-slate-950">{t("myInfo.mobileChange.request")}</h3>
            <label className="mt-4 block text-sm font-bold text-slate-700">
              {t("myInfo.mobileChange.newNumber")}
              <input
                className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-3 text-base font-semibold outline-none transition focus:border-[#003B83] focus:ring-4 focus:ring-blue-100"
                type="tel"
                value={newMobileNumber}
                onChange={(event) => setNewMobileNumber(event.target.value)}
              />
            </label>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold transition hover:bg-slate-50" onClick={handleCancelMobileChange}>
                {t("myInfo.mobileChange.cancel")}
              </button>
              <button className="min-h-11 rounded-lg bg-[#003B83] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]" onClick={handleReportMobileChange}>
                {t("myInfo.mobileChange.report")}
              </button>
            </div>
          </section>
        </div>
      )}

      {confirmationOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-2xl">
            <h3 className="text-lg font-black text-slate-950">{t("myInfo.mobileChange.sent")}</h3>
            <button className="mt-5 min-h-11 rounded-lg bg-[#003B83] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]" onClick={() => setConfirmationOpen(false)}>
              {t("common.ok")}
            </button>
          </section>
        </div>
      )}

      {cashDepositNoticeOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto grid size-12 place-items-center rounded-xl bg-[#003B83]/10 text-[#003B83]">
              <Banknote aria-hidden="true" size={24} strokeWidth={2} />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-950">{t("myInfo.cashDeposit.mockMessage")}</h3>
            <button className="mt-5 min-h-11 rounded-lg bg-[#003B83] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]" onClick={() => setCashDepositNoticeOpen(false)}>
              {t("common.ok")}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

function InfoSection({ children, icon: Icon, title }: { children: ReactNode; icon: LucideIcon; title: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-[#003B83]/10 text-[#003B83]">
          <Icon aria-hidden="true" size={21} strokeWidth={2} />
        </span>
        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ReadOnlyGrid({
  action,
  items
}: {
  action?: {
    icon?: ReactNode;
    label: string;
    onClick: () => void;
  };
  items: Array<[string, string]>;
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <dt className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</dt>
          <dd className="mt-1 truncate text-sm font-bold text-slate-950">{value}</dd>
        </div>
      ))}
      {action && (
        <button
          className="flex min-h-[4.5rem] flex-col items-center justify-center rounded-xl border border-[#003B83] bg-[#003B83] p-3 text-center text-sm font-black text-white shadow-sm transition hover:bg-[#002b60]"
          onClick={action.onClick}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {action.icon}
            <span>{action.label}</span>
          </span>
        </button>
      )}
    </dl>
  );
}

function MetricGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/60 p-4">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
      ))}
    </div>
  );
}

function InfoBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex min-h-9 items-center justify-center rounded-full px-3 text-xs font-black uppercase tracking-wide ring-1 ${
        active ? "bg-blue-50 text-[#003B83] ring-blue-200" : "bg-slate-100 text-slate-400 ring-slate-200"
      }`}
    >
      {label}
    </span>
  );
}

function createProfile(managedUser: ManagedUser | undefined, user: MockUser) {
  const [firstName, ...lastNameParts] = user.name.split(" ");
  const lastName = lastNameParts.join(" ") || user.name;
  const roleLabelKey = roleLabelKeyFor(user.role);

  return {
    id: managedUser?.id ?? user.id.toUpperCase(),
    firstName: managedUser?.firstName ?? firstName,
    lastName: managedUser?.lastName ?? lastName,
    fullName: managedUser ? `${managedUser.firstName} ${managedUser.lastName}` : user.name,
    initials: managedUser ? `${managedUser.firstName.charAt(0)}${managedUser.lastName.charAt(0)}` : user.name.charAt(0),
    email: managedUser?.email ?? `${user.name.toLowerCase().replaceAll(" ", ".")}@mext.be`,
    language: managedUser?.language ?? user.preferredLanguage,
    mobile: managedUser?.mobile ?? "+32 475 12 34 56",
    country: managedUser?.country ?? user.country,
    team: managedUser?.team ?? user.teamId ?? "Team North",
    roleLabel: roleLabelKey,
    roleId: managedUser?.roleId ?? user.role,
    isTeamSupervisor: managedUser?.isTeamSupervisor ?? user.role === "sales_leader",
    isActive: managedUser?.isActive ?? user.isActive,
    establishmentNumber: managedUser?.establishmentNumber ?? user.establishmentNumber,
    teamLead: user.role === "representative" ? "Tom Verbruggen" : "M.Ex.T. Superadmin",
    permissions: managedUser?.permissions ?? permissionsFromUser(user),
    leads: managedUser?.leads ?? { cardio: true, training: false, fireDetection: false, firefighting: false }
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

function permissionsFromUser(user: MockUser): Record<string, boolean> {
  return {
    pst: true,
    service: user.permissions.includes("ViewService"),
    reporting: user.permissions.includes("ViewTeamAppointments"),
    contracts: user.permissions.includes("ViewContracts"),
    training: false,
    firefighting: false,
    fireDetection: false
  };
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
