"use client";

import { FileImage, Image, LockKeyhole, MonitorSmartphone, Palette, Upload, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { DesignAssetKey, DesignAssetPreview, DesignAssetPreviews, MockUser, TranslationFn } from "@/types/sales";

type DesignAsset = {
  accept: string;
  descriptionKey: string;
  icon: LucideIcon;
  key: DesignAssetKey;
  recommendationKey: string;
  titleKey: string;
};

const designAssetConfigs: DesignAsset[] = [
  {
    accept: ".png,.svg,.jpg,.jpeg",
    descriptionKey: "technical.design.logo.description",
    icon: Image,
    key: "logo",
    recommendationKey: "technical.design.logo.recommendation",
    titleKey: "technical.design.logo.title"
  },
  {
    accept: ".ico,.png,.svg",
    descriptionKey: "technical.design.favicon.description",
    icon: FileImage,
    key: "favicon",
    recommendationKey: "technical.design.favicon.recommendation",
    titleKey: "technical.design.favicon.title"
  },
  {
    accept: ".png,.jpg,.jpeg,.webp",
    descriptionKey: "technical.design.loginBackground.description",
    icon: MonitorSmartphone,
    key: "loginBackground",
    recommendationKey: "technical.design.loginBackground.recommendation",
    titleKey: "technical.design.loginBackground.title"
  }
];

export function DesignSettingsView({
  designAssets,
  t,
  user,
  onDesignAssetChange
}: {
  designAssets: DesignAssetPreviews;
  t: TranslationFn;
  user: MockUser;
  onDesignAssetChange: (key: DesignAssetKey, file: File) => void;
}) {
  const [message, setMessage] = useState("");

  if (user.role !== "superadmin") {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex items-start gap-4">
          <div className="grid size-12 place-items-center rounded-xl bg-red-50 text-red-700">
            <LockKeyhole aria-hidden="true" size={24} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">{t("technical.accessDenied.title")}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t("technical.accessDenied.body")}</p>
          </div>
        </div>
      </section>
    );
  }

  function handleFileChange(key: DesignAssetKey, file?: File) {
    if (!file) {
      return;
    }

    onDesignAssetChange(key, file);
    setMessage(t("technical.design.success"));
  }

  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t("nav.technical")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{t("technical.design.title")}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("technical.design.subtitle")}</p>
          </div>
          <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
            <Palette aria-hidden="true" size={24} strokeWidth={2} />
          </div>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {message}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        {designAssetConfigs.map((asset) => (
          <DesignAssetCard
            key={asset.key}
            asset={asset}
            preview={designAssets[asset.key]}
            t={t}
            onFileChange={(file) => handleFileChange(asset.key, file)}
          />
        ))}
      </div>
    </section>
  );
}

function DesignAssetCard({
  asset,
  preview,
  t,
  onFileChange
}: {
  asset: DesignAsset;
  preview?: DesignAssetPreview;
  t: TranslationFn;
  onFileChange: (file?: File) => void;
}) {
  const Icon = asset.icon;
  const inputId = `design-upload-${asset.key}`;

  return (
    <article className="flex min-h-[24rem] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
          <Icon aria-hidden="true" size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold leading-6 text-slate-950">{t(asset.titleKey)}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{t(asset.descriptionKey)}</p>
        </div>
      </div>

      <div className="mt-4 grid min-h-40 place-items-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
        {preview ? (
          <img alt={t(asset.titleKey)} className="max-h-40 max-w-full object-contain" src={preview.previewUrl} />
        ) : (
          <div className="grid justify-items-center gap-2 text-center text-slate-500">
            <Icon aria-hidden="true" size={32} strokeWidth={2} />
            <p className="text-sm font-semibold">{t("technical.design.previewEmpty")}</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <p>{t(asset.recommendationKey)}</p>
        {preview && <p className="font-semibold text-slate-800">{preview.name}</p>}
      </div>

      <div className="mt-auto pt-5">
        <input
          accept={asset.accept}
          className="sr-only"
          id={inputId}
          type="file"
          onChange={(event) => onFileChange(event.target.files?.[0])}
        />
        <label
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-[#003B83] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]"
          htmlFor={inputId}
        >
          <Upload aria-hidden="true" size={18} strokeWidth={2} />
          {t("technical.design.upload")}
        </label>
        <p className="mt-3 text-xs font-medium text-slate-500">{t("technical.design.mockOnly")}</p>
      </div>
    </article>
  );
}
