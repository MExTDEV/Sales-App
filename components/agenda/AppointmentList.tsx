import type { ReactNode } from "react";
import { CalendarClock, Copy, ExternalLink, MapPin, Phone, ReceiptText, ShoppingCart, TimerOff, UserRound } from "lucide-react";
import { formatCurrency } from "@/domain/shared/formatting";
import { StatusBadge } from "@/components/shared/ui";
import type { Appointment, AppointmentStatus, TranslationFn } from "@/types/sales";

export function AppointmentList({
  emptyMessage,
  items,
  section,
  selectedId,
  t,
  title,
  onOpenAppointment,
  onDuplicate,
  onNoTime,
  onSelect,
  onStatusChange
}: {
  emptyMessage: string;
  items: Appointment[];
  section: "open" | "closed";
  selectedId: string;
  t: TranslationFn;
  title: string;
  onOpenAppointment: () => void;
  onDuplicate: (id: string) => void;
  onNoTime: (id: string) => void;
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}) {
  return (
    <section className="grid gap-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">{title}</h3>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-700">{items.length}</span>
      </div>
      <div className="grid gap-3">
        {items.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          items.map((item) => (
            <AppointmentCard
              key={item.id}
              item={item}
              section={section}
              selectedId={selectedId}
              t={t}
              onDuplicate={onDuplicate}
              onNoTime={onNoTime}
              onOpenAppointment={onOpenAppointment}
              onSelect={onSelect}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </section>
  );
}

function AppointmentCard({
  item,
  section,
  selectedId,
  t,
  onDuplicate,
  onNoTime,
  onOpenAppointment,
  onSelect,
  onStatusChange
}: {
  item: Appointment;
  section: "open" | "closed";
  selectedId: string;
  t: TranslationFn;
  onOpenAppointment: () => void;
  onDuplicate: (id: string) => void;
  onNoTime: (id: string) => void;
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}) {
  const account = item.customer ?? item.prospect;
  const contact = item.contacts[0];
  const isOpenSection = section === "open";

  function openDetail() {
    onSelect(item.id);
    onOpenAppointment();
  }

  return (
    <article
      className={`grid gap-3.5 rounded-xl border bg-white px-3.5 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)] lg:grid-cols-[4.9rem_1fr_auto] lg:items-center ${statusAccent(item.status)} ${
        selectedId === item.id ? "border-[#003B83] ring-2 ring-blue-100" : "border-slate-200"
      }`}
    >
      <button className="rounded-lg bg-slate-50 px-2.5 py-2.5 text-left transition hover:bg-blue-50" onClick={openDetail}>
        <span className="block text-xl font-black leading-none tracking-tight text-slate-950">{item.time}</span>
        <span className="mt-2 inline-flex rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-[0.6rem] font-black uppercase text-slate-700">
          {item.status === "planned" ? t("agenda.statusOpen") : t(`status.${item.status}`)}
        </span>
      </button>

      <button className="min-w-0 text-left" onClick={openDetail}>
        <span className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide ${item.customer ? "bg-cyan-100 text-cyan-800" : "bg-amber-100 text-amber-800"}`}>
            {item.customer ? t("appointment.customer") : t("appointment.prospect")}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.65rem] font-black text-slate-700">{account?.number}</span>
          <StatusBadge status={item.status} label={t(`status.${item.status}`)} />
          {item.label && <span className="rounded-full bg-amber-300 px-2 py-1 text-[0.65rem] font-black text-amber-950">{item.label}</span>}
        </span>
        <span className="mt-2 block text-base font-black tracking-tight text-slate-950">{account?.name}</span>
        <span className="mt-2 grid gap-2 text-xs font-medium text-slate-600 md:grid-cols-[1fr_minmax(13rem,0.7fr)]">
          <span className="flex min-w-0 items-center gap-2">
            <MapPin aria-hidden="true" className="shrink-0 text-[#003B83]" size={15} strokeWidth={2} />
            <span className="truncate">
              {item.address.line1}, {item.address.postalCode} {item.address.city}
            </span>
          </span>
          <span className="grid min-w-0 gap-1">
            <span className="grid min-w-0 grid-cols-[1.125rem_1fr] items-center gap-2">
              <UserRound aria-hidden="true" className="justify-self-center text-[#003B83]" size={15} strokeWidth={2} />
              <span className="truncate">{contact?.name}</span>
            </span>
            {contact?.phone && (
              <span className="grid min-w-0 grid-cols-[1.125rem_1fr] items-center gap-2 text-[0.72rem] text-slate-500">
                <Phone aria-hidden="true" className="justify-self-center text-slate-400" size={13} strokeWidth={2} />
                <span className="truncate">{contact.phone}</span>
              </span>
            )}
          </span>
        </span>
      </button>

      <div className="grid w-full gap-2.5 sm:w-[16rem] lg:justify-self-end">
        <AgendaAction fullWidth icon={<ExternalLink aria-hidden="true" size={15} strokeWidth={2} />} label={t("agenda.action.open")} primary onClick={openDetail} />
        {isOpenSection && (
          <div className="grid grid-cols-2 gap-2.5">
            <AgendaAction icon={<TimerOff aria-hidden="true" size={15} strokeWidth={2} />} label={t("agenda.action.noTime")} onClick={() => onNoTime(item.id)} />
            <AgendaAction icon={<Copy aria-hidden="true" size={15} strokeWidth={2} />} label={t("agenda.action.duplicate")} onClick={() => onDuplicate(item.id)} />
          </div>
        )}
        {!isOpenSection && <RevenueBlock appointment={item} t={t} />}
      </div>
    </article>
  );
}

function AgendaAction({
  icon,
  label,
  fullWidth,
  primary,
  onClick
}: {
  icon: ReactNode;
  label: string;
  fullWidth?: boolean;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-bold shadow-sm transition ${fullWidth ? "w-full" : "w-full"} ${
        primary
          ? "border-[#003B83] bg-[#003B83] text-white hover:bg-[#002b60]"
          : "border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function RevenueBlock({ appointment, t }: { appointment: Appointment; t: TranslationFn }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
      <p className="mb-1.5 text-[0.62rem] font-black uppercase tracking-[0.14em] text-slate-500">{t("agenda.revenue.title")}</p>
      <div className="grid grid-cols-2 gap-2">
        <RevenueValue
          icon={<ReceiptText aria-hidden="true" size={13} strokeWidth={2} />}
          label={t("agenda.revenue.invoice")}
          value={appointment.invoiceRevenue ?? 0}
        />
        <RevenueValue
          icon={<ShoppingCart aria-hidden="true" size={13} strokeWidth={2} />}
          label={t("agenda.revenue.order")}
          value={appointment.orderRevenue ?? 0}
        />
      </div>
    </div>
  );
}

function RevenueValue({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-md bg-white px-2 py-1.5 ring-1 ring-slate-200">
      <span className="flex items-center justify-center gap-1 text-[0.62rem] font-black uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </span>
      <span className="mt-0.5 block text-center text-xs font-black text-slate-950">{formatCurrency(value)}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="grid min-h-32 place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <div>
        <CalendarClock aria-hidden="true" className="mx-auto text-[#003B83]" size={26} strokeWidth={2} />
        <p className="mt-3 text-sm font-bold text-slate-600">{message}</p>
      </div>
    </div>
  );
}

function statusAccent(status: AppointmentStatus) {
  const accents: Record<AppointmentStatus, string> = {
    planned: "border-l-4 border-l-[#003B83]",
    completed: "border-l-4 border-l-emerald-500",
    no_time: "border-l-4 border-l-amber-500",
    cancelled: "border-l-4 border-l-red-500",
    customer_absent: "border-l-4 border-l-slate-500",
    rescheduled: "border-l-4 border-l-orange-500"
  };

  return accents[status];
}
