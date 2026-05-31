"use client";

import { useState } from "react";
import { BottomStatusBar } from "@/components/layout/BottomStatusBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { AppView, DesignAssetPreviews, MockUser, TranslationFn } from "@/types/sales";

export function AppShell({
  children,
  designAssets,
  lastSync,
  pendingRecords,
  t,
  user,
  view,
  onLogout,
  onSync,
  onViewChange
}: {
  children: React.ReactNode;
  designAssets: DesignAssetPreviews;
  lastSync: string;
  pendingRecords: number;
  t: TranslationFn;
  user: MockUser;
  view: AppView;
  onLogout: () => void;
  onSync: () => void;
  onViewChange: (view: AppView) => void;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <main className="h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] text-slate-950">
      <div className={`grid h-screen transition-[grid-template-columns] duration-300 ${sidebarCollapsed ? "lg:grid-cols-[4.75rem_1fr]" : "lg:grid-cols-[16rem_1fr]"}`}>
        <Sidebar
          collapsed={sidebarCollapsed}
          designAssets={designAssets}
          t={t}
          user={user}
          view={view}
          onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
          onViewChange={onViewChange}
        />
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <Topbar t={t} user={user} view={view} onLogout={onLogout} />
          <div className="min-h-0 flex-1 overflow-y-auto p-3 pb-28 md:p-5 lg:pb-20">{children}</div>
          <BottomStatusBar
            lastSync={lastSync}
            onSync={onSync}
            pending={pendingRecords}
            sidebarCollapsed={sidebarCollapsed}
            t={t}
            user={user}
          />
        </section>
      </div>
    </main>
  );
}
