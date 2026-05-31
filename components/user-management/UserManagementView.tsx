"use client";

import { Badge } from "@/components/shared/ui";
import { Camera, Pencil, Save, ShieldCheck, UserCog, UserPlus, UsersRound, UserX, X, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { CountryCode, Language, ManagedUser, MockUser, TechnicalRole, TranslationFn } from "@/types/sales";

const permissionKeys = [
  "pst",
  "service",
  "reporting",
  "contracts",
  "training",
  "firefighting",
  "fireDetection"
] as const;

const leadKeys = ["cardio", "training", "fireDetection", "firefighting"] as const;

type UserPermissionKey = (typeof permissionKeys)[number];
type LeadKey = (typeof leadKeys)[number];
type FormMode = "list" | "create" | "edit";

type ManagedUserForm = Omit<ManagedUser, "permissions" | "leads"> & {
  permissions: Record<UserPermissionKey, boolean>;
  leads: Record<LeadKey, boolean>;
};

const emptyPermissions: Record<UserPermissionKey, boolean> = {
  pst: false,
  service: false,
  reporting: false,
  contracts: false,
  training: false,
  firefighting: false,
  fireDetection: false
};

const emptyLeads: Record<LeadKey, boolean> = {
  cardio: false,
  training: false,
  fireDetection: false,
  firefighting: false
};

export function UserManagementView({
  initialUsers,
  roles,
  t,
  user
}: {
  initialUsers: ManagedUser[];
  roles: TechnicalRole[];
  t: TranslationFn;
  user: MockUser;
}) {
  const canManageUsers = user.role === "admin" || user.role === "superadmin";
  const availableRoles = user.role === "admin" ? roles.filter((role) => !role.protectedForAdmin) : roles;
  const [users, setUsers] = useState<ManagedUser[]>(() => scopedUsers(initialUsers, user));
  const [mode, setMode] = useState<FormMode>("list");
  const [form, setForm] = useState<ManagedUserForm>(() => createEmptyForm(nextUserId(initialUsers), user, availableRoles[0]?.id ?? ""));
  const [message, setMessage] = useState("");

  if (!canManageUsers) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">{t("userManagement.accessDenied.title")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t("userManagement.accessDenied.body")}</p>
      </section>
    );
  }

  function handleCreate() {
    setForm(createEmptyForm(nextUserId(users), user, availableRoles[0]?.id ?? ""));
    setMode("create");
    setMessage("");
  }

  function handleEdit(selectedUser: ManagedUser) {
    setForm(toForm(selectedUser));
    setMode("edit");
    setMessage("");
  }

  function handleCancel() {
    setMode("list");
    setMessage("");
    setForm(createEmptyForm(nextUserId(users), user, availableRoles[0]?.id ?? ""));
  }

  function handleSave() {
    const savedUser = fromForm(form);

    setUsers((current) =>
      mode === "create"
        ? [...current, savedUser]
        : current.map((item) => (item.id === savedUser.id ? savedUser : item))
    );
    setMode("list");
    setMessage(t("userManagement.saved"));
  }

  function handleDeactivate(id: string) {
    setUsers((current) => current.map((item) => (item.id === id ? { ...item, isActive: false } : item)));
    setMessage(t("userManagement.deactivated"));
  }

  function updateForm<K extends keyof ManagedUserForm>(key: K, value: ManagedUserForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handlePhoto(file?: File) {
    if (!file) {
      return;
    }

    if (form.photo?.previewUrl) {
      URL.revokeObjectURL(form.photo.previewUrl);
    }

    updateForm("photo", {
      name: file.name,
      previewUrl: URL.createObjectURL(file)
    });
    setMessage(t("userManagement.photoUpdated"));
  }

  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t("nav.userManagement")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{t("userManagement.title")}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t("userManagement.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {mode === "list" && (
              <button className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#003B83] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]" onClick={handleCreate}>
                <UserPlus aria-hidden="true" size={18} strokeWidth={2} />
                {t("userManagement.action.create")}
              </button>
            )}
            <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
              <UserCog aria-hidden="true" size={24} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {message}
        </div>
      )}

      {mode === "list" ? (
        <UserList users={users} t={t} onDeactivate={handleDeactivate} onEdit={handleEdit} />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <FormCard icon={UserCog} title={t("userManagement.section.personal")}>
              <div className="grid gap-4 md:grid-cols-2">
                <ReadOnlyField label={t("userManagement.field.userId")} value={form.id} />
                <TextField label={t("userManagement.field.email")} type="email" value={form.email} onChange={(value) => updateForm("email", value)} />
                <TextField label={t("userManagement.field.lastName")} value={form.lastName} onChange={(value) => updateForm("lastName", value)} />
                <TextField label={t("userManagement.field.firstName")} value={form.firstName} onChange={(value) => updateForm("firstName", value)} />
                <SelectField label={t("userManagement.field.language")} value={form.language} onChange={(value) => updateForm("language", value as Language)}>
                  <option value="nl">{t("language.nl")}</option>
                  <option value="fr">{t("language.fr")}</option>
                  <option value="de">{t("language.de")}</option>
                </SelectField>
                <TextField label={t("userManagement.field.mobile")} value={form.mobile} onChange={(value) => updateForm("mobile", value)} />
                <TextField label={t("userManagement.field.establishmentNumber")} value={form.establishmentNumber} onChange={(value) => updateForm("establishmentNumber", value)} />
                <Checkbox checked={form.isActive} label={t("userManagement.field.active")} onChange={(checked) => updateForm("isActive", checked)} />
              </div>
              <div className="mt-4">
                <PhotoUpload photo={form.photo} t={t} onPhoto={handlePhoto} />
              </div>
            </FormCard>

            <FormCard icon={UsersRound} title={t("userManagement.section.team")}>
              <div className="grid gap-4">
                <SelectField label={t("userManagement.field.country")} value={form.country} onChange={(value) => updateForm("country", value as CountryCode)}>
                  <option value="BE">{t("country.be")}</option>
                  <option value="NL">{t("country.nl")}</option>
                  <option value="DE">{t("country.de")}</option>
                </SelectField>
                <TextField label={t("userManagement.field.team")} value={form.team} onChange={(value) => updateForm("team", value)} />
                <SelectField label={t("userManagement.field.role")} value={form.roleId} onChange={(value) => updateForm("roleId", value)}>
                  {availableRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {t(role.labelKey)}
                    </option>
                  ))}
                </SelectField>
                <Checkbox checked={form.isTeamSupervisor} label={t("userManagement.field.teamSupervisor")} onChange={(checked) => updateForm("isTeamSupervisor", checked)} />
                {user.role === "admin" && <Badge tone="amber">{t("userManagement.adminRoleRestriction")}</Badge>}
              </div>
            </FormCard>

            <FormCard icon={ShieldCheck} title={t("userManagement.section.permissions")}>
              <CheckboxGrid
                items={permissionKeys.map((key) => ({
                  key,
                  checked: form.permissions[key],
                  label: t(`userManagement.permission.${key}`)
                }))}
                onToggle={(key) =>
                  setForm((current) => ({
                    ...current,
                    permissions: { ...current.permissions, [key]: !current.permissions[key] }
                  }))
                }
              />
            </FormCard>

            <FormCard icon={ShieldCheck} title={t("userManagement.section.leads")}>
              <CheckboxGrid
                items={leadKeys.map((key) => ({
                  key,
                  checked: form.leads[key],
                  label: t(`userManagement.lead.${key}`)
                }))}
                onToggle={(key) =>
                  setForm((current) => ({
                    ...current,
                    leads: { ...current.leads, [key]: !current.leads[key] }
                  }))
                }
              />
            </FormCard>
          </div>

          <div className="flex flex-wrap justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold transition hover:bg-slate-50" onClick={handleCancel}>
              <X aria-hidden="true" size={18} strokeWidth={2} />
              {t("common.cancel")}
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#003B83] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#002b60]" onClick={handleSave}>
              <Save aria-hidden="true" size={18} strokeWidth={2} />
              {t("userManagement.action.save")}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function UserList({
  users,
  t,
  onDeactivate,
  onEdit
}: {
  users: ManagedUser[];
  t: TranslationFn;
  onDeactivate: (id: string) => void;
  onEdit: (user: ManagedUser) => void;
}) {
  const [nameQuery, setNameQuery] = useState("");
  const [teamQuery, setTeamQuery] = useState("");
  const [establishmentQuery, setEstablishmentQuery] = useState("");
  const visibleUsers = sortUsers(filterUsers(users, { establishmentQuery, nameQuery, teamQuery }));

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <SearchField
          label={t("userManagement.search.nameLabel")}
          placeholder={t("userManagement.search.namePlaceholder")}
          value={nameQuery}
          onChange={setNameQuery}
        />
        <SearchField
          label={t("userManagement.search.teamLabel")}
          placeholder={t("userManagement.search.teamPlaceholder")}
          value={teamQuery}
          onChange={setTeamQuery}
        />
        <SearchField
          label={t("userManagement.search.establishmentLabel")}
          placeholder={t("userManagement.search.establishmentPlaceholder")}
          value={establishmentQuery}
          onChange={setEstablishmentQuery}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="border-b border-slate-200 py-3 pr-4">{t("userManagement.table.name")}</th>
              <th className="border-b border-slate-200 py-3 pr-4">{t("userManagement.field.country")}</th>
              <th className="border-b border-slate-200 py-3 pr-4">{t("userManagement.field.team")}</th>
              <th className="border-b border-slate-200 py-3 pr-4">{t("userManagement.field.establishmentNumber")}</th>
              <th className="border-b border-slate-200 py-3 pr-4">{t("userManagement.field.active")}</th>
              <th className="border-b border-slate-200 py-3">{t("userManagement.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((item) => (
              <tr key={item.id}>
                <td className="border-b border-slate-100 py-3 pr-4">
                  <p className="font-black text-slate-950">{item.firstName} {item.lastName}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.email}</p>
                </td>
                <td className="border-b border-slate-100 py-3 pr-4">{item.country}</td>
                <td className="border-b border-slate-100 py-3 pr-4">{item.team}</td>
                <td className="border-b border-slate-100 py-3 pr-4 font-semibold">{item.establishmentNumber}</td>
                <td className="border-b border-slate-100 py-3 pr-4">
                  <Badge tone={item.isActive ? "green" : "slate"}>{item.isActive ? t("userManagement.status.active") : t("userManagement.status.inactive")}</Badge>
                </td>
                <td className="border-b border-slate-100 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold transition hover:bg-blue-50" onClick={() => onEdit(item)}>
                      <Pencil aria-hidden="true" size={16} strokeWidth={2} />
                      {t("userManagement.action.edit")}
                    </button>
                    <button
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!item.isActive}
                      onClick={() => onDeactivate(item.id)}
                    >
                      <UserX aria-hidden="true" size={16} strokeWidth={2} />
                      {t("userManagement.action.deactivate")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function SearchField({
  label,
  onChange,
  placeholder,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-[#003B83] focus:ring-2 focus:ring-blue-100"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function FormCard({
  children,
  icon: Icon,
  title
}: {
  children: React.ReactNode;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
          <Icon aria-hidden="true" size={21} strokeWidth={2} />
        </div>
        <h3 className="text-lg font-black text-slate-950">{title}</h3>
      </div>
      {children}
    </article>
  );
}

function TextField({ label, onChange, type = "text", value }: { label: string; onChange: (value: string) => void; type?: string; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input className="min-h-12 rounded-lg border border-slate-300 bg-white px-3" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input className="min-h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 font-semibold text-slate-500" readOnly value={value} />
    </label>
  );
}

function SelectField({ children, label, onChange, value }: { children: React.ReactNode; label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <select className="min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

function Checkbox({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
      <input checked={checked} className="size-4 accent-[#003B83]" type="checkbox" onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function CheckboxGrid<T extends string>({
  items,
  onToggle
}: {
  items: Array<{ key: T; checked: boolean; label: string }>;
  onToggle: (key: T) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <label key={item.key} className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
          <input checked={item.checked} className="size-4 accent-[#003B83]" type="checkbox" onChange={() => onToggle(item.key)} />
          {item.label}
        </label>
      ))}
    </div>
  );
}

function PhotoUpload({
  photo,
  t,
  onPhoto
}: {
  photo?: { name: string; previewUrl: string };
  t: TranslationFn;
  onPhoto: (file?: File) => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid size-24 place-items-center overflow-hidden rounded-xl bg-white shadow-inner">
          {photo ? (
            <img alt={t("userManagement.field.photo")} className="h-full w-full object-cover" src={photo.previewUrl} />
          ) : (
            <Camera aria-hidden="true" className="text-slate-400" size={30} strokeWidth={2} />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">{t("userManagement.field.photo")}</p>
          <p className="mt-1 text-sm text-slate-600">{photo?.name ?? t("userManagement.photoEmpty")}</p>
          <label className="mt-3 inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-[#003B83] px-4 text-sm font-bold text-white transition hover:bg-[#002b60]">
            {t("userManagement.photoUpload")}
            <input accept=".png,.jpg,.jpeg,.webp" className="sr-only" type="file" onChange={(event) => onPhoto(event.target.files?.[0])} />
          </label>
        </div>
      </div>
    </div>
  );
}

function createEmptyForm(id: string, user: MockUser, roleId: string): ManagedUserForm {
  return {
    id,
    firstName: "",
    lastName: "",
    email: "",
    language: user.preferredLanguage,
    mobile: "",
    country: user.country,
    team: "",
    roleId,
    isTeamSupervisor: false,
    isActive: true,
    establishmentNumber: "",
    permissions: { ...emptyPermissions },
    leads: { ...emptyLeads },
    photo: undefined
  };
}

function toForm(user: ManagedUser): ManagedUserForm {
  return {
    ...user,
    permissions: normalizePermissionRecord(user.permissions),
    leads: normalizeLeadRecord(user.leads)
  };
}

function fromForm(form: ManagedUserForm): ManagedUser {
  return {
    ...form,
    permissions: { ...form.permissions },
    leads: { ...form.leads }
  };
}

function normalizePermissionRecord(source: Record<string, boolean>): Record<UserPermissionKey, boolean> {
  return permissionKeys.reduce((record, key) => ({ ...record, [key]: Boolean(source[key]) }), {} as Record<UserPermissionKey, boolean>);
}

function normalizeLeadRecord(source: Record<string, boolean>): Record<LeadKey, boolean> {
  return leadKeys.reduce((record, key) => ({ ...record, [key]: Boolean(source[key]) }), {} as Record<LeadKey, boolean>);
}

function nextUserId(users: ManagedUser[]) {
  const max = users.reduce((highest, item) => {
    const number = Number(item.id.replace("USR-", ""));
    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, 0);

  return `USR-${String(max + 1).padStart(4, "0")}`;
}

function scopedUsers(users: ManagedUser[], user: MockUser) {
  if (user.role === "admin") {
    return users.filter((item) => item.country === user.country);
  }

  return users;
}

function filterUsers(
  users: ManagedUser[],
  filters: {
    establishmentQuery: string;
    nameQuery: string;
    teamQuery: string;
  }
) {
  const nameQuery = normalize(filters.nameQuery);
  const teamQuery = normalize(filters.teamQuery);
  const establishmentQuery = normalize(filters.establishmentQuery);

  return users.filter((user) => {
    const fullName = normalize(`${user.firstName} ${user.lastName}`);
    const reverseName = normalize(`${user.lastName} ${user.firstName}`);
    const firstName = normalize(user.firstName);
    const lastName = normalize(user.lastName);
    const team = normalize(user.team);
    const establishment = normalize(user.establishmentNumber);

    return (
      (!nameQuery || firstName.includes(nameQuery) || lastName.includes(nameQuery) || fullName.includes(nameQuery) || reverseName.includes(nameQuery)) &&
      (!teamQuery || team.includes(teamQuery)) &&
      (!establishmentQuery || establishment.includes(establishmentQuery))
    );
  });
}

function sortUsers(users: ManagedUser[]) {
  return [...users].sort((a, b) => {
    if (a.isActive !== b.isActive) {
      return a.isActive ? -1 : 1;
    }

    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, "nl", {
      sensitivity: "base"
    });
  });
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("nl-BE");
}
