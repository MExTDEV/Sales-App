import { ClipboardList } from "lucide-react";
import { StatusBadge } from "@/components/shared/ui";
import type { Appointment, TranslationFn } from "@/types/sales";

const priorities = ["normal", "important", "urgent"] as const;

export function MyPreparationView({
  appointments,
  t,
  onOpenAppointment
}: {
  appointments: Appointment[];
  t: TranslationFn;
  onOpenAppointment: (appointmentId: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#003B83]/10 text-[#003B83]">
          <ClipboardList aria-hidden="true" size={24} strokeWidth={2} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#003B83]">{t("nav.myPreparation")}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{t("myPreparation.title")}</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">{t("myPreparation.placeholder")}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["field.date", "fiche.field.time", "appointment.customer", "myPreparation.priority", "myPreparation.available", "common.status"].map((key) => (
                <th key={key} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  {t(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {appointments.map((appointment, index) => {
              const priority = priorities[index % priorities.length];
              const hasPreparation = index % 4 !== 1;

              return (
                <tr
                  key={appointment.id}
                  className="cursor-pointer transition hover:bg-blue-50/60"
                  onClick={() => onOpenAppointment(appointment.id)}
                >
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(appointment.date)}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{appointment.time}</td>
                  <td className="break-words px-3 py-3 font-black text-slate-950">{appointment.customer?.name ?? appointment.prospect?.name}</td>
                  <td className="break-words px-3 py-3">
                    <PriorityBadge priority={priority} t={t} />
                  </td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{hasPreparation ? t("common.yes") : t("common.no")}</td>
                  <td className="break-words px-3 py-3">
                    <StatusBadge status={appointment.status} label={t(`status.${appointment.status}`)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PriorityBadge({ priority, t }: { priority: (typeof priorities)[number]; t: TranslationFn }) {
  const styles = {
    normal: "bg-slate-100 text-slate-700 ring-slate-200",
    important: "bg-amber-50 text-amber-800 ring-amber-200",
    urgent: "bg-red-50 text-red-800 ring-red-200"
  };

  return (
    <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-[0.68rem] font-black uppercase tracking-wide ring-1 ${styles[priority]}`}>
      {t(`myPreparation.priority.${priority}`)}
    </span>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return "30/05/2026";
  }

  return new Date(`${value}T12:00:00`).toLocaleDateString("nl-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
