import { useState, type ReactNode } from "react";
import { CalendarDays, CheckCircle2, Clock, TimerOff, UserX } from "lucide-react";
import { AppointmentList } from "@/components/agenda/AppointmentList";
import { ActionButton } from "@/components/shared/ui";
import type { Appointment, AppointmentStatus, TranslationFn } from "@/types/sales";

type SalesAgendaViewProps = {
  appointments: Appointment[];
  currentDate: string;
  duplicateAppointment?: Appointment;
  duplicateDateTime: string;
  duplicateTime: string;
  selectedAppointmentId: string;
  t: TranslationFn;
  onCancelDuplicate: () => void;
  onConfirmDuplicate: () => void;
  onDuplicate: (id: string) => void;
  onDuplicateDateTimeChange: (value: string) => void;
  onDuplicateTimeChange: (time: string) => void;
  onOpenAppointment: () => void;
  onSelectAppointment: (id: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
};

const openStatuses: AppointmentStatus[] = ["planned", "rescheduled"];
const closedStatuses: AppointmentStatus[] = ["completed", "no_time", "customer_absent", "cancelled"];

export function SalesAgendaView({
  appointments,
  currentDate,
  duplicateAppointment,
  duplicateDateTime,
  duplicateTime,
  selectedAppointmentId,
  t,
  onCancelDuplicate,
  onConfirmDuplicate,
  onDuplicate,
  onDuplicateDateTimeChange,
  onDuplicateTimeChange,
  onOpenAppointment,
  onSelectAppointment,
  onStatusChange
}: SalesAgendaViewProps) {
  const [noTimeAppointment, setNoTimeAppointment] = useState<Appointment | undefined>();
  const open = appointments
    .filter((item) => openStatuses.includes(item.status))
    .sort((left, right) => left.time.localeCompare(right.time));
  const closed = appointments
    .filter((item) => closedStatuses.includes(item.status))
    .sort((left, right) => sortClosedAppointments(left, right));
  const counters = {
    total: appointments.length,
    open: open.length,
    closed: closed.length,
    noTime: appointments.filter((item) => item.status === "no_time").length,
    customerAbsent: appointments.filter((item) => item.status === "customer_absent").length
  };

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#003B83]">{t("nav.agenda")}</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{t("agenda.title")}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{t("agenda.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{t("agenda.date")}</span>
              <span className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800">
                {formatDate(currentDate)}
              </span>
            </div>
            <ActionButton label={t("agenda.newAppointment")} onClick={() => undefined} />
            <ActionButton label={t("agenda.preProspect")} onClick={() => undefined} />
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <AgendaCounter icon={<CalendarDays aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.total")} value={counters.total} />
          <AgendaCounter icon={<Clock aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.open")} value={counters.open} />
          <AgendaCounter icon={<CheckCircle2 aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.closed")} value={counters.closed} />
          <AgendaCounter icon={<TimerOff aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.noTime")} value={counters.noTime} />
          <AgendaCounter icon={<UserX aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.customerAbsent")} value={counters.customerAbsent} />
        </div>
      </section>

      <div className="grid gap-4">
        <AppointmentList
          emptyMessage={t("agenda.empty.open")}
          items={open}
          section="open"
          selectedId={selectedAppointmentId}
          t={t}
          title={t("agenda.open")}
          onDuplicate={onDuplicate}
          onNoTime={(id) => setNoTimeAppointment(appointments.find((item) => item.id === id))}
          onOpenAppointment={onOpenAppointment}
          onSelect={onSelectAppointment}
          onStatusChange={onStatusChange}
        />
        <AppointmentList
          emptyMessage={t("agenda.empty.closed")}
          items={closed}
          section="closed"
          selectedId={selectedAppointmentId}
          t={t}
          title={t("agenda.closed")}
          onDuplicate={onDuplicate}
          onNoTime={(id) => setNoTimeAppointment(appointments.find((item) => item.id === id))}
          onOpenAppointment={onOpenAppointment}
          onSelect={onSelectAppointment}
          onStatusChange={onStatusChange}
        />
      </div>

      {duplicateAppointment && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-black text-slate-950">{t("agenda.duplicate.planTitle")}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t("agenda.duplicate.body")} {duplicateAppointment.customer?.name ?? duplicateAppointment.prospect?.name}
            </p>
            <label className="mt-4 block text-sm font-bold text-slate-700">
              {t("agenda.duplicate.newDateTime")}
              <input
                className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-3 text-base font-semibold outline-none transition focus:border-[#003B83] focus:ring-4 focus:ring-blue-100"
                type="datetime-local"
                value={duplicateDateTime}
                onChange={(event) => {
                  onDuplicateDateTimeChange(event.target.value);
                  onDuplicateTimeChange(event.target.value.slice(11, 16));
                }}
              />
            </label>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold transition hover:bg-slate-50" onClick={onCancelDuplicate}>
                {t("common.cancel")}
              </button>
              <button className="min-h-11 rounded-lg bg-[#003B83] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]" onClick={onConfirmDuplicate}>
                {t("agenda.action.duplicate")}
              </button>
            </div>
          </section>
        </div>
      )}
      {noTimeAppointment && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-black text-slate-950">{t("agenda.action.noTime")}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t("agenda.noTime.confirm")}</p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold transition hover:bg-slate-50" onClick={() => setNoTimeAppointment(undefined)}>
                {t("common.no")}
              </button>
              <button
                className="min-h-11 rounded-lg bg-[#003B83] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]"
                onClick={() => {
                  onStatusChange(noTimeAppointment.id, "no_time");
                  setNoTimeAppointment(undefined);
                }}
              >
                {t("common.yes")}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function AgendaCounter({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/60 p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-[#003B83]/10 text-[#003B83]">{icon}</span>
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.13em] text-slate-500">{label}</p>
          <p className="mt-0.5 text-xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function sortClosedAppointments(left: Appointment, right: Appointment) {
  const leftDate = left.statusChangedAt ? Date.parse(left.statusChangedAt) : Number.NaN;
  const rightDate = right.statusChangedAt ? Date.parse(right.statusChangedAt) : Number.NaN;

  if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate) && rightDate !== leftDate) {
    return rightDate - leftDate;
  }

  return right.time.localeCompare(left.time);
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);

  return date.toLocaleDateString("nl-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
