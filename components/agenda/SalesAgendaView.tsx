import { useState, type ReactNode } from "react";
import { CalendarDays, CheckCircle2, Clock, TimerOff, UserX } from "lucide-react";
import { AppointmentList } from "@/components/agenda/AppointmentList";
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
    <div className="grid gap-3">
      <section className="rounded-lg border border-blue-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-blue-50 px-4 py-3">
          <div className="grid size-11 place-items-center rounded-lg bg-blue-100 text-[#003B83]">
            <CalendarDays aria-hidden="true" size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-black uppercase tracking-wide text-[#003B83]">{t("nav.agenda")}</p>
            <h2 className="truncate text-xl font-black text-slate-950">{t("agenda.title")}</h2>
            <p className="truncate text-xs font-semibold text-slate-500">{t("agenda.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="grid gap-1">
              <span className="inline-flex min-h-9 items-center rounded-md border border-blue-100 bg-blue-50 px-3 text-xs font-black text-[#003B83]">
                {formatDate(currentDate)}
              </span>
            </div>
            <HeaderAction label={t("agenda.newAppointment")} onClick={() => undefined} />
            <HeaderAction label={t("agenda.preProspect")} onClick={() => undefined} />
          </div>
        </div>
        <div className="grid gap-2 px-4 py-3 sm:grid-cols-2 xl:grid-cols-5">
          <AgendaCounter icon={<CalendarDays aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.total")} value={counters.total} />
          <AgendaCounter icon={<Clock aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.open")} value={counters.open} />
          <AgendaCounter icon={<CheckCircle2 aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.closed")} value={counters.closed} />
          <AgendaCounter icon={<TimerOff aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.noTime")} value={counters.noTime} />
          <AgendaCounter icon={<UserX aria-hidden="true" size={20} strokeWidth={2} />} label={t("agenda.counter.customerAbsent")} value={counters.customerAbsent} />
        </div>
      </section>

      <div className="grid gap-3">
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-md bg-[#003B83]/10 text-[#003B83]">{icon}</span>
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-lg font-black tracking-tight text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function HeaderAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="min-h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-black text-slate-900 shadow-sm transition hover:border-blue-200 hover:bg-blue-50" onClick={onClick} type="button">
      {label}
    </button>
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
