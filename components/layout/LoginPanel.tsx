import { countries, mockScenarios } from "@/mock-data";
import { roleLabels } from "@/components/layout/navigation";
import { SelectField } from "@/components/shared/ui";
import type { CountryCode, Language, MockScenario, Role, TranslationFn } from "@/types/sales";

export function LoginPanel({
  country,
  language,
  role,
  scenario,
  timezone,
  t,
  onCountryChange,
  onLanguageChange,
  onLogin,
  onRoleChange,
  onScenarioChange,
  onTimezoneChange
}: {
  country: CountryCode;
  language: Language;
  role: Role;
  scenario: MockScenario;
  timezone: string;
  t: TranslationFn;
  onCountryChange: (value: CountryCode) => void;
  onLanguageChange: (value: Language) => void;
  onLogin: () => void;
  onRoleChange: (value: Role) => void;
  onScenarioChange: (value: MockScenario) => void;
  onTimezoneChange: (value: string) => void;
}) {
  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-950 md:grid md:place-items-center">
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl md:grid md:grid-cols-[1fr_1.2fr]">
        <div className="bg-[#003B83] p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">{t("common.mockOnly")}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">{t("app.name")}</h1>
          <p className="mt-4 max-w-md text-blue-100">{t("auth.subtitle")}</p>
          <div className="mt-8 grid gap-3 text-sm">
            <InfoPill label={t("auth.promise.offline")} value={t("auth.promise.offlineValue")} />
            <InfoPill label={t("auth.promise.noErp")} value={t("auth.promise.noErpValue")} />
            <InfoPill label={t("auth.promise.noExtraModules")} value={t("auth.promise.noExtraModulesValue")} />
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold">{t("auth.title")}</h2>
          <div className="mt-6 grid gap-4">
            <SelectField label={t("auth.role")} value={role} onChange={(value) => onRoleChange(value as Role)}>
              {Object.keys(roleLabels).map((item) => (
                <option key={item} value={item}>
                  {roleLabels[item as Role]}
                </option>
              ))}
            </SelectField>
            <SelectField label={t("auth.country")} value={country} onChange={(value) => onCountryChange(value as CountryCode)}>
              {countries.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </SelectField>
            <SelectField label={t("auth.timezone")} value={timezone} onChange={onTimezoneChange}>
              {countries.map((item) => (
                <option key={item.timezone} value={item.timezone}>
                  {item.timezone}
                </option>
              ))}
            </SelectField>
            <SelectField label={t("auth.language")} value={language} onChange={(value) => onLanguageChange(value as Language)}>
              <option value="nl">{t("language.nl")}</option>
              <option value="fr">{t("language.fr")}</option>
              <option value="de">{t("language.de")}</option>
            </SelectField>
            <SelectField label={t("auth.scenario")} value={scenario} onChange={(value) => onScenarioChange(value as MockScenario)}>
              {mockScenarios.map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.labelKey)}
                </option>
              ))}
            </SelectField>
          </div>
          <button className="mt-6 min-h-12 w-full rounded-md bg-[#003B83] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-[#002b60]" onClick={onLogin}>
            {t("auth.enter")}
          </button>
        </div>
      </section>
    </main>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/10 p-3">
      <p className="font-bold">{label}</p>
      <p className="text-blue-100">{value}</p>
    </div>
  );
}
