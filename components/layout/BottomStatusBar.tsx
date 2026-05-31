import type { MockUser, TranslationFn } from "@/types/sales";

export function BottomStatusBar({
  lastSync,
  onSync,
  pending,
  sidebarCollapsed,
  t,
  user
}: {
  lastSync: string;
  onSync: () => void;
  pending: number;
  sidebarCollapsed: boolean;
  t: TranslationFn;
  user: MockUser;
}) {
  return (
    <footer className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur ${sidebarCollapsed ? "lg:left-[4.75rem]" : "lg:left-[16rem]"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="hidden items-center gap-4 text-sm text-slate-600 md:flex">
          <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" />{t("sync.online")}</span>
          <span>{t("sync.lastSync")}: {lastSync}</span>
          <span>{t("sync.pending")}: {pending}</span>
          <span>{user.country}</span>
        </div>
        <div className="hidden gap-2 md:flex">
          <button className="min-h-10 rounded-lg bg-[#003B83] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]" onClick={onSync}>{t("sync.syncNow")}</button>
          <button className="min-h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold transition hover:bg-slate-50">{t("nav.settings")}</button>
        </div>
      </div>
    </footer>
  );
}
