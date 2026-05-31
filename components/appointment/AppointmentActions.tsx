import { ActionButton } from "@/components/shared/ui";
import type { AppointmentStatus, TranslationFn } from "@/types/sales";

const actions: Array<{ status: AppointmentStatus; key: string; tone?: "default" | "primary" | "danger" }> = [
  { status: "completed", key: "appointment.action.completed", tone: "primary" },
  { status: "no_time", key: "appointment.action.noTime" },
  { status: "customer_absent", key: "appointment.action.customerAbsent" },
  { status: "rescheduled", key: "appointment.action.rescheduled" },
  { status: "cancelled", key: "appointment.action.cancelled", tone: "danger" }
];

export function AppointmentActions({ t, onStatusChange }: { t: TranslationFn; onStatusChange: (status: AppointmentStatus) => void }) {
  return (
    <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="font-bold">{t("appointment.actions")}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {actions.map((action) => (
          <ActionButton
            key={action.status}
            label={t(action.key)}
            tone={action.tone}
            onClick={() => onStatusChange(action.status)}
          />
        ))}
      </div>
    </div>
  );
}
