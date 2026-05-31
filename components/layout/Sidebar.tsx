"use client";

import { roleLabels, sidebarItems } from "@/components/layout/navigation";
import { SHELL_HEADER_HEIGHT_CLASS } from "@/components/layout/shellConstants";
import { ChevronDown, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import type { AppView, DesignAssetPreviews, MockUser, TranslationFn } from "@/types/sales";

export function Sidebar({
  collapsed,
  designAssets,
  t,
  user,
  view,
  onToggleCollapsed,
  onViewChange
}: {
  collapsed: boolean;
  designAssets: DesignAssetPreviews;
  t: TranslationFn;
  user: MockUser;
  view: AppView;
  onToggleCollapsed: () => void;
  onViewChange: (view: AppView) => void;
}) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  return (
    <aside className="relative z-40 hidden h-screen overflow-visible border-r border-slate-200 bg-white shadow-[8px_0_30px_rgba(15,23,42,0.05)] lg:flex lg:flex-col">
      <div className={`relative z-50 flex ${SHELL_HEADER_HEIGHT_CLASS} items-center overflow-visible bg-[#003B83] px-3 text-white ${collapsed ? "justify-center" : "gap-3"}`}>
        <SidebarBrandMark
          collapsed={collapsed}
          designAssets={designAssets}
          label={t("app.name")}
          onExpand={collapsed ? onToggleCollapsed : undefined}
        />
        <div className={collapsed ? "sr-only" : "min-w-0"}>
          <p className="truncate text-sm font-black leading-none">{t("app.shortName")}</p>
          <p className="mt-1 truncate text-xs text-blue-100">{t("app.subtitle")}</p>
        </div>
        {!collapsed && (
          <button
            aria-label="Collapse sidebar"
            className="z-[70] ml-auto grid size-8 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={onToggleCollapsed}
          >
            <ChevronLeft aria-hidden="true" className="transition" color="#ffffff" size={18} strokeWidth={2} />
          </button>
        )}
      </div>
      <nav className={`grid gap-1 ${collapsed ? "p-2" : "p-3"}`}>
        {sidebarItems.filter((item) => !item.superadminOnly || user.role === "superadmin").map((item) => {
          const active = item.id === view || item.nested?.some((nested) => nested.id === view);
          const hasChildren = Boolean(item.nested?.length);
          const expanded = hasChildren && !collapsed && (expandedSections[item.labelKey] ?? active);
          const Icon = item.icon;
          const Chevron = expanded ? ChevronDown : ChevronRight;

          return (
            <div key={item.labelKey}>
              <button
                title={collapsed ? t(item.labelKey) : undefined}
                className={`flex min-h-11 w-full items-center rounded-lg text-left text-sm font-bold transition ${
                  collapsed ? "justify-center px-0" : "gap-3 px-3"
                } ${
                  active ? "bg-blue-100 text-[#003B83] shadow-sm ring-1 ring-blue-200" : "text-slate-700 hover:bg-slate-100"
                } ${hasChildren ? "font-black" : ""} ${item.id || hasChildren ? "" : "cursor-default"}`}
                onClick={() => {
                  if (hasChildren && !collapsed) {
                    setExpandedSections((current) => ({
                      ...current,
                      [item.labelKey]: !(current[item.labelKey] ?? active)
                    }));
                  }
                  if (item.id) {
                    onViewChange(item.id);
                  }
                }}
                disabled={!item.id && !hasChildren}
              >
                <Icon
                  aria-hidden="true"
                  className="shrink-0"
                  color={active ? "#003B83" : "#475569"}
                  size={20}
                  strokeWidth={2}
                />
                <span className={collapsed ? "sr-only" : "min-w-0 flex-1 truncate"}>{t(item.labelKey)}</span>
                {!collapsed && hasChildren && (
                  <Chevron
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-200 ${expanded ? "scale-105" : ""}`}
                    color={active ? "#003B83" : "#64748b"}
                    size={16}
                    strokeWidth={2}
                  />
                )}
              </button>
              {expanded && item.nested && (
                <div className="ml-5 mt-1 grid gap-1 border-l border-slate-200 pb-1 pl-4">
                  {item.nested.map((nested) => (
                    <button
                      key={nested.labelKey}
                      className={`min-h-8 rounded-lg px-2 text-left text-xs transition ${
                        nested.id === view ? "bg-blue-50 font-bold text-[#003B83]" : "font-semibold text-slate-500"
                      } ${nested.id ? "hover:bg-slate-100" : "cursor-default"}`}
                      onClick={() => nested.id && onViewChange(nested.id)}
                      disabled={!nested.id}
                    >
                      {t(nested.labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className={`mt-auto border-t border-slate-200 text-xs ${collapsed ? "p-2" : "p-4"}`}>
        <div className={`flex ${collapsed ? "justify-center" : "items-start gap-3"}`}>
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-100 font-black text-[#003B83]">
            {user.name.charAt(0)}
          </div>
          <div className={collapsed ? "sr-only" : "min-w-0"}>
            <p className="truncate font-bold">{user.name}</p>
            <p className="mt-1 truncate text-slate-500">{user.name.toLowerCase().replaceAll(" ", ".")}@mext.be</p>
            <p className="mt-1 truncate text-slate-500">{roleLabels[user.role]}</p>
          </div>
        </div>
        <button className={`mt-3 min-h-10 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 transition hover:bg-slate-50 ${collapsed ? "w-full px-0" : "w-full"}`}>
          <span className={collapsed ? "sr-only" : ""}>{t("auth.logout")}</span>
          {collapsed && <LogOut aria-hidden="true" className="mx-auto" color="#475569" size={18} strokeWidth={2} />}
        </button>
      </div>
    </aside>
  );
}

function SidebarBrandMark({
  collapsed,
  designAssets,
  label,
  onExpand
}: {
  collapsed: boolean;
  designAssets: DesignAssetPreviews;
  label: string;
  onExpand?: () => void;
}) {
  const asset = collapsed ? designAssets.favicon : designAssets.logo;
  const content = asset ? (
    <img
      alt={label}
      className="max-h-8 max-w-8 object-contain"
      src={asset.previewUrl}
    />
  ) : (
    "M"
  );

  if (collapsed) {
    return (
      <button
        aria-label="Expand sidebar"
        className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/12 text-lg font-black shadow-inner transition hover:scale-105 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={onExpand}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/12 text-lg font-black shadow-inner">
      {content}
    </div>
  );
}
