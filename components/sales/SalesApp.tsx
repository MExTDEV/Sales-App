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
  teamRepresentatives,
  technicalAssetTypes,
  technicalContractTypes,
  technicalLeadTypes,
  technicalMaintenanceFrequencies,
  technicalRoles,
  technicalServiceControls
} from "@/mock-data";
import { translate } from "@/lib/i18n";
import type { AppView, Appointment, AppointmentStatus, CountryCode, DesignAssetKey, DesignAssetPreviews, Language, MockScenario, Role, SalesRevenueUpdate } from "@/types/sales";

export function SalesApp() {
  const [role, setRole] = useState<Role>("representative");
  const [country, setCountry] = useState<CountryCode>("BE");
  const [language, setLanguage] = useState<Language>("nl");
  const [scenario, setScenario] = useState<MockScenario>("blocked");
  const selectedCountry = countries.find((item) => item.code === country) ?? countries[0];
  const [timezone, setTimezone] = useState(selectedCountry.timezone);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<AppView>("dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentSeed);
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
  const managedProfile = mockManagedUsers.find((item) => item.roleId === user.role && item.country === user.country);
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
              onOpenAppointment={(appointmentId) => {
                setSelectedAppointmentId(appointmentId);
                setView("appointment");
              }}
            />
          )}
          {view === "agenda" && (
            <SalesAgendaView
              appointments={appointments}
              duplicateAppointment={duplicateAppointment}
              duplicateDateTime={duplicateDateTime}
              duplicateTime={duplicateTime}
              currentDate={currentDateValue()}
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
              representatives={teamRepresentatives}
              t={t}
              user={user}
              onOpenAppointment={handleOpenTeamAppointment}
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
          {view === "userManagement" && <UserManagementView initialUsers={mockManagedUsers} roles={technicalRoles} t={t} user={user} />}
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
