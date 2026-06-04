"use client";

import { useMemo, useState } from "react";
import { AppointmentDetailView } from "@/components/appointment/detail/AppointmentDetailView";
import { SalesAgendaView } from "@/components/agenda/SalesAgendaView";
import { CashBlockScreen } from "@/components/cash-sheet/CashBlockScreen";
import { CashSheetView } from "@/components/cash-sheet/CashSheetView";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { AppShell } from "@/components/layout/AppShell";
import { LoginPanel } from "@/components/layout/LoginPanel";
import { MyInfoView } from "@/components/my-info/MyInfoView";
import { MyPreparationView } from "@/components/preparation/MyPreparationView";
import { ReportsView } from "@/components/reports/ReportsView";
import { PstView } from "@/components/pst/PstView";
import { ServiceView } from "@/components/service/ServiceView";
import { ServiceAssetsView } from "@/components/service/assets/ServiceAssetsView";
import { ServiceContractsView } from "@/components/service/contracts/ServiceContractsView";
import { ServiceInterventionsView } from "@/components/service/interventions/ServiceInterventionsView";
import { ServiceMaintenanceView } from "@/components/service/maintenance/ServiceMaintenanceView";
import { ServicePlanningView } from "@/components/service/planning/ServicePlanningView";
import { ServicePlaceholderView } from "@/components/service/shared/ServicePlaceholderView";
import { ServiceWorkOrdersView } from "@/components/service/work-orders/ServiceWorkOrdersView";
import { StockView } from "@/components/stock/StockView";
import { SyncView } from "@/components/sync/SyncView";
import { DesignSettingsView } from "@/components/technical/DesignSettingsView";
import { TechnicalTablesView } from "@/components/technical/TechnicalTablesView";
import { MyTeamView } from "@/components/team/MyTeamView";
import { UserManagementView } from "@/components/user-management/UserManagementView";
import {
  appointments as appointmentSeed,
  cashSheet,
  countries,
  createMockUser,
  mockManagedUsers,
  mockScenarios,
  pstApprovals,
  pstProspects,
  pstRepresentatives,
  pstRoutes,
  pstRouteStops,
  pstSegments,
  pstVisits,
  teamRepresentatives,
  technicalAssetTypes,
  technicalContractTypes,
  technicalLeadTypes,
  technicalMaintenanceFrequencies,
  technicalRoles,
  technicalServiceControls
} from "@/mock-data";
import { translate } from "@/lib/i18n";
import { canAccessPst } from "@/domain/pst/access";
import type { AppView, Appointment, AppointmentStatus, CountryCode, DesignAssetKey, DesignAssetPreviews, Language, MockScenario, Role, SalesRevenueUpdate } from "@/types/sales";

type PstScreen = Extract<AppView, "pstDashboard" | "pstSegments" | "pstRoutes" | "pstProspection" | "pstMaps" | "pstApprovals" | "pstRepresentatives" | "pstPlanning" | "pstQuality">;

export function SalesApp() {
  const launchDefaults = getLaunchDefaults();
  const [role, setRole] = useState<Role>(launchDefaults.role);
  const [country, setCountry] = useState<CountryCode>(launchDefaults.country);
  const [language, setLanguage] = useState<Language>(launchDefaults.language);
  const [scenario, setScenario] = useState<MockScenario>(launchDefaults.scenario);
  const selectedCountry = countries.find((item) => item.code === country) ?? countries[0];
  const [timezone, setTimezone] = useState(launchDefaults.timezone || selectedCountry.timezone);
  const [isLoggedIn, setIsLoggedIn] = useState(launchDefaults.openApp);
  const [view, setView] = useState<AppView>(launchDefaults.view);
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentSeed);
  const [managedUsers, setManagedUsers] = useState(mockManagedUsers);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(appointmentSeed[0]?.id ?? "");
  const [depositReported, setDepositReported] = useState(false);
  const [adminUnblocked, setAdminUnblocked] = useState(false);
  const [duplicateAppointmentId, setDuplicateAppointmentId] = useState<string | undefined>();
  const [duplicateDateTime, setDuplicateDateTime] = useState(currentDateTimeValue());
  const [duplicateTime, setDuplicateTime] = useState(currentTimeValue());
  const [pendingRecords, setPendingRecords] = useState(7);
  const [lastSync, setLastSync] = useState("07:26 27/05");
  const [designAssets, setDesignAssets] = useState<DesignAssetPreviews>({
    logo: undefined,
    favicon: undefined,
    loginBackground: undefined
  });

  const user = useMemo(
    () => createMockUser({ role, countryCode: country, timezone, preferredLanguage: language, scenario }),
    [country, language, role, scenario, timezone]
  );

  const t = (key: string) => translate(user.preferredLanguage, key);
  const selectedAppointment = appointments.find((item) => item.id === selectedAppointmentId) ?? appointments[0];
  const duplicateAppointment = appointments.find((item) => item.id === duplicateAppointmentId);
  const today = currentDateValue();
  const agendaAppointments = appointments
    .filter((appointment) => appointment.date === today && appointment.assignedUserId === user.id)
    .sort((left, right) => left.time.localeCompare(right.time));
  const managedProfile = managedUsers.find((item) => item.roleId === user.role && item.country === user.country);
  const unresolvedLines = cashSheet.lines.filter((line) => !line.isCleared || !line.isPaid);
  const scenarioUnblocked = scenario === "unblocked" || scenario === "admin_scope" || scenario === "leader_scope";
  const isBlocked =
    user.role === "representative" &&
    cashSheet.status === "open" &&
    unresolvedLines.length > 0 &&
    !depositReported &&
    !adminUnblocked &&
    !scenarioUnblocked;

  function handleCountryChange(value: CountryCode) {
    const nextCountry = countries.find((item) => item.code === value) ?? countries[0];
    setCountry(nextCountry.code);
    setTimezone(nextCountry.timezone);
  }

  function handleLanguageChange(value: Language) {
    setLanguage(value);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("salesapp.language", value);
    }
  }

  function handleManagedUsersChange(nextUsers: typeof mockManagedUsers) {
    setManagedUsers((current) => {
      const nextIds = new Set(nextUsers.map((item) => item.id));
      return [...current.filter((item) => !nextIds.has(item.id)), ...nextUsers].sort((a, b) => a.id.localeCompare(b.id));
    });
  }

  function handleAppointmentStatus(status: AppointmentStatus) {
    handleAppointmentStatusForId(selectedAppointment.id, status);
  }

  function handleAppointmentStatusForId(id: string, status: AppointmentStatus) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status,
              statusChangedAt: new Date().toISOString(),
              history: [
                { at: t("mock.now"), text: `${t("appointment.historyStatusChanged")} ${status}` },
                ...appointment.history
              ]
            }
          : appointment
      )
    );
  }

  function handleDuplicateRequest(id: string) {
    setDuplicateAppointmentId(id);
    setDuplicateDateTime(currentDateTimeValue());
    setDuplicateTime(currentTimeValue());
  }

  function handleDuplicateConfirm() {
    if (!duplicateAppointment) {
      return;
    }

    const newAppointment: Appointment = {
      ...duplicateAppointment,
      id: `apt-mock-${Date.now()}`,
      date: dateFromDateTime(duplicateDateTime),
      time: timeFromDateTime(duplicateDateTime) || duplicateTime || currentTimeValue(),
      status: "planned",
      statusChangedAt: undefined,
      invoiceRevenue: 0,
      orderRevenue: 0,
      history: [
        { at: t("mock.now"), text: t("agenda.duplicate.newAppointmentHistory") },
        ...duplicateAppointment.history
      ]
    };

    setAppointments((current) => [
      ...current.map((appointment) =>
        appointment.id === duplicateAppointment.id
          ? {
            ...appointment,
              status: "completed" as AppointmentStatus,
              statusChangedAt: new Date().toISOString(),
              history: [
                { at: t("mock.now"), text: t("agenda.duplicate.originalClosedHistory") },
                ...appointment.history
              ]
            }
          : appointment
      ),
      newAppointment
    ]);
    setSelectedAppointmentId(newAppointment.id);
    setDuplicateAppointmentId(undefined);
  }

  function handleDesignAssetChange(key: DesignAssetKey, file: File) {
    const previewUrl = URL.createObjectURL(file);

    setDesignAssets((current) => {
      const previous = current[key];
      if (previous?.previewUrl) {
        URL.revokeObjectURL(previous.previewUrl);
      }

      return {
        ...current,
        [key]: {
          name: file.name,
          previewUrl
        }
      };
    });
  }

  function handleOpenTeamAppointment(appointment: Appointment) {
    setAppointments((current) =>
      current.some((item) => item.id === appointment.id) ? current : [...current, appointment]
    );
    setSelectedAppointmentId(appointment.id);
    setView("appointment");
  }

  function handleMockSync() {
    setPendingRecords(0);
    setLastSync(currentSyncTimestamp());
  }

  function handleSalesSave(appointmentId: string, revenue: SalesRevenueUpdate) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              invoiceRevenue: (appointment.invoiceRevenue ?? 0) + revenue.invoiceRevenue,
              orderRevenue: (appointment.orderRevenue ?? 0) + revenue.orderRevenue,
              history: [
                { at: t("mock.now"), text: t("salesWizard.savedHistory") },
                ...appointment.history
              ]
            }
          : appointment
      )
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginPanel
        country={country}
        language={language}
        role={role}
        scenario={scenario}
        timezone={timezone}
        t={t}
        onCountryChange={handleCountryChange}
        onLanguageChange={setLanguage}
        onLogin={() => setIsLoggedIn(true)}
        onRoleChange={setRole}
        onScenarioChange={setScenario}
        onTimezoneChange={setTimezone}
      />
    );
  }

  return (
    <AppShell
      designAssets={designAssets}
      lastSync={lastSync}
      pendingRecords={pendingRecords}
      t={t}
      user={user}
      view={view}
      onLogout={() => setIsLoggedIn(false)}
      onSync={handleMockSync}
      onViewChange={setView}
    >
      {isBlocked ? (
        <CashBlockScreen
          cashSheet={cashSheet}
          t={t}
          user={user}
          onAdminUnblock={() => setAdminUnblocked(true)}
          onDeposit={() => setDepositReported(true)}
        />
      ) : (
        <>
          {view === "dashboard" && (
            <DashboardView
              appointments={appointments}
              cashSheet={cashSheet}
              t={t}
              user={user}
              onViewChange={setView}
            />
          )}
          {view === "myInfo" && (
            <MyInfoView
              appointments={appointments}
              cashSheet={cashSheet}
              isCashSheetBlocked={isBlocked}
              lastSync={lastSync}
              managedUser={managedProfile}
              onLanguageChange={handleLanguageChange}
              onOpenCashSheet={() => setView("cashSheet")}
              onSync={handleMockSync}
              pendingRecords={pendingRecords}
              t={t}
              user={user}
            />
          )}
          {view === "myPreparation" && (
            <MyPreparationView
              appointments={appointments}
              t={t}
              user={user}
              onOpenAppointment={(appointmentId) => {
                setSelectedAppointmentId(appointmentId);
                setView("appointment");
              }}
            />
          )}
          {view === "agenda" && (
            <SalesAgendaView
              appointments={agendaAppointments}
              duplicateAppointment={duplicateAppointment}
              duplicateDateTime={duplicateDateTime}
              duplicateTime={duplicateTime}
              currentDate={today}
              selectedAppointmentId={selectedAppointment.id}
              t={t}
              onCancelDuplicate={() => setDuplicateAppointmentId(undefined)}
              onConfirmDuplicate={handleDuplicateConfirm}
              onDuplicate={handleDuplicateRequest}
              onDuplicateDateTimeChange={setDuplicateDateTime}
              onDuplicateTimeChange={setDuplicateTime}
              onOpenAppointment={() => setView("appointment")}
              onSelectAppointment={setSelectedAppointmentId}
              onStatusChange={handleAppointmentStatusForId}
            />
          )}
          {view === "myTeam" && (
            <MyTeamView
              managedUsers={managedUsers}
              representatives={teamRepresentatives}
              t={t}
              user={user}
            />
          )}
          {view === "appointment" && (
            <AppointmentDetailView
              appointment={selectedAppointment}
              leadTypes={technicalLeadTypes}
              t={t}
              onBackToAgenda={() => setView("agenda")}
              onCloseAppointment={() => {
                handleAppointmentStatusForId(selectedAppointment.id, "completed");
                setView("agenda");
              }}
              onSalesSave={(revenue) => handleSalesSave(selectedAppointment.id, revenue)}
              onStatusChange={handleAppointmentStatus}
            />
          )}
          {view === "service" && <ServiceView appointment={selectedAppointment} t={t} user={user} />}
          {view === "inventory" && <StockView lastSync={lastSync} t={t} user={user} />}
          {view === "reports" && <ReportsView t={t} user={user} />}
          {isPstView(view) && (
            canAccessPst(user) ? (
              <PstView
                approvals={pstApprovals}
                prospects={pstProspects}
                representatives={pstRepresentatives}
                routeStops={pstRouteStops}
                routes={pstRoutes}
                screen={toPstScreen(view)}
                segments={pstSegments}
                t={t}
                user={user}
                visits={pstVisits}
              />
            ) : (
              <AccessDenied title={t("pst.accessDenied.title")} body={t("pst.accessDenied.body")} />
            )
          )}
          {view === "servicePlanning" && <ServicePlanningView t={t} user={user} />}
          {view === "serviceInterventions" && <ServiceInterventionsView t={t} user={user} />}
          {view === "serviceWorkOrders" && <ServiceWorkOrdersView serviceControls={technicalServiceControls} t={t} user={user} />}
          {view === "serviceMaintenance" && <ServiceMaintenanceView assetTypes={technicalAssetTypes} frequencies={technicalMaintenanceFrequencies} t={t} user={user} />}
          {view === "serviceContracts" && <ServiceContractsView contractTypes={technicalContractTypes} t={t} user={user} />}
          {view === "serviceAssets" && <ServiceAssetsView assetTypes={technicalAssetTypes} t={t} user={user} />}
          {view === "cashSheet" && (
            <CashSheetView cashSheet={cashSheet} depositReported={depositReported} representativeName={user.name} t={t} onDeposit={() => setDepositReported(true)} />
          )}
          {view === "sync" && <SyncView t={t} />}
          {view === "userManagement" && <UserManagementView initialUsers={managedUsers} roles={technicalRoles} t={t} user={user} onUsersChange={handleManagedUsersChange} />}
          {view === "technicalDesign" && (
            <DesignSettingsView
              designAssets={designAssets}
              t={t}
              user={user}
              onDesignAssetChange={handleDesignAssetChange}
            />
          )}
          {view === "technicalTables" && <TechnicalTablesView assetTypes={technicalAssetTypes} contractTypes={technicalContractTypes} frequencies={technicalMaintenanceFrequencies} leadTypes={technicalLeadTypes} roles={technicalRoles} serviceControls={technicalServiceControls} t={t} user={user} />}
        </>
      )}
    </AppShell>
  );
}

function currentTimeValue() {
  return new Date().toLocaleTimeString("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function currentDateValue() {
  return new Date().toLocaleDateString("en-CA");
}

function currentDateTimeValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
}

function dateFromDateTime(value: string) {
  return value?.slice(0, 10) || currentDateValue();
}

function timeFromDateTime(value: string) {
  return value?.slice(11, 16) || currentTimeValue();
}

function currentSyncTimestamp() {
  return new Date().toLocaleString("nl-BE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function getLaunchDefaults() {
  const fallbackCountry = countries[0];
  const defaults = {
    role: "representative" as Role,
    country: fallbackCountry.code,
    language: "nl" as Language,
    scenario: "blocked" as MockScenario,
    timezone: fallbackCountry.timezone,
    openApp: false,
    view: "dashboard" as AppView
  };

  if (typeof window === "undefined") {
    return defaults;
  }

  const params = new URLSearchParams(window.location.search);
  const country = parseCountry(params.get("country")) ?? defaults.country;
  const countryTimezone = countries.find((item) => item.code === country)?.timezone ?? defaults.timezone;
  const persistedLanguage = parseLanguage(window.localStorage.getItem("salesapp.language"));

  return {
    role: parseRole(params.get("role")) ?? defaults.role,
    country,
    language: parseLanguage(params.get("language")) ?? persistedLanguage ?? defaults.language,
    scenario: parseScenario(params.get("scenario")) ?? defaults.scenario,
    timezone: params.get("timezone") || countryTimezone,
    openApp: params.get("openApp") === "1" || params.get("openApp") === "true",
    view: parseInitialView(window.location.pathname, params.get("view"))
  };
}

function isPstView(view: AppView) {
  return view === "pst" || view.startsWith("pst");
}

function toPstScreen(view: AppView): PstScreen {
  return view === "pst" ? "pstDashboard" : (view as PstScreen);
}

function parseInitialView(pathname: string, value: string | null): AppView {
  if (pathname === "/pst") {
    return "pstDashboard";
  }

  return parseAppView(value) ?? "dashboard";
}

function parseAppView(value: string | null): AppView | undefined {
  const pstViews: AppView[] = [
    "pstDashboard",
    "pstSegments",
    "pstRoutes",
    "pstProspection",
    "pstMaps",
    "pstApprovals",
    "pstRepresentatives",
    "pstPlanning",
    "pstQuality"
  ];

  return pstViews.find((view) => view === value);
}

function AccessDenied({ body, title }: { body: string; title: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{body}</p>
    </section>
  );
}

function parseRole(value: string | null): Role | undefined {
  return value === "representative" || value === "sales_leader" || value === "admin" || value === "superadmin" ? value : undefined;
}

function parseLanguage(value: string | null): Language | undefined {
  return value === "nl" || value === "fr" || value === "de" ? value : undefined;
}

function parseCountry(value: string | null): CountryCode | undefined {
  return countries.some((item) => item.code === value) ? (value as CountryCode) : undefined;
}

function parseScenario(value: string | null): MockScenario | undefined {
  return mockScenarios.some((item) => item.id === value) ? (value as MockScenario) : undefined;
}
