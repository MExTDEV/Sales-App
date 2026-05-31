import { Metric } from "@/components/shared/ui";
import type { TranslationFn } from "@/types/sales";

export function SyncView({ t }: { t: TranslationFn }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-2xl font-bold">{t("sync.status")}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Metric label={t("sync.mode")} value={t("sync.localMock")} />
        <Metric label={t("sync.pending")} value="7" />
        <Metric label={t("sync.conflicts")} value="1" />
      </div>
      <p className="mt-4 text-slate-600">{t("sync.mockNotice")}</p>
    </section>
  );
}
