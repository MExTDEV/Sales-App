import { Badge, Metric } from "@/components/shared/ui";
import type { Appointment, MockUser, TranslationFn } from "@/types/sales";

export function ServiceView({ appointment, t, user }: { appointment: Appointment; t: TranslationFn; user: MockUser }) {
  const canEdit = user.permissions.includes("EditService");

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">{t("appointment.serviceInfo")}</h2>
          <p className="mt-1 text-slate-600">{appointment.customer?.name ?? appointment.prospect?.name}</p>
        </div>
        <Badge tone={canEdit ? "green" : "amber"}>{canEdit ? t("service.editable") : t("service.readOnly")}</Badge>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label={t("service.contracts")} value={String(appointment.service.contracts)} />
        <Metric label={t("service.aeds")} value={String(appointment.service.aeds)} />
        <Metric label={t("service.workOrders")} value={String(appointment.service.workOrders)} />
        <Metric label={t("service.lastIntervention")} value={appointment.service.lastIntervention} />
      </div>
      <div className="mt-4 rounded-md border border-slate-200 p-4">
        <p className="font-bold">{t("service.maintenance")}</p>
        <p className="mt-1 text-slate-600">{appointment.service.maintenanceStatus}</p>
      </div>
    </section>
  );
}
