"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BadgeEuro,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileText,
  FolderOpen,
  History,
  IdCard,
  Download,
  Eye,
  Mail,
  MapPin,
  MessageSquareText,
  Pencil,
  Phone,
  Plus,
  PlusCircle,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
  Save,
  Star,
  Smartphone,
  Target,
  Trash2,
  UserX,
  UserRound,
  UsersRound,
  X
} from "lucide-react";
import { SalesWizard } from "@/components/appointment/sales-wizard/SalesWizard";
import { Badge, StatusBadge } from "@/components/shared/ui";
import { initialReferences, mockCustomerDocuments, mockQuotes, mockSalesDocuments, mockSalesItems } from "@/mock-data/appointmentDetail";
import type { Appointment, AppointmentStatus, SalesRevenueUpdate, TechnicalLeadType, TranslationFn } from "@/types/sales";

type MainTab =
  | "visit"
  | "preparation"
  | "contact"
  | "offers"
  | "remarks"
  | "salesHistory"
  | "documents"
  | "references"
  | "leads"
  | "followUp";

type ContactSubtab = "identity" | "contacts" | "addresses" | "accounting" | "commercial";
type SalesSubtab = "documents" | "items";

type LeadRecord = {
  id: string;
  typeId: string;
  interest: boolean;
  contactName: string;
  role: string;
  phone: string;
  mobile: string;
  email: string;
  note: string;
  date: string;
};

type ContactIdentity = {
  customerStatus: string;
  number: string;
  shortName: string;
  legalName: string;
  legalForm: string;
  language: string;
  vat: string;
};

type ContactPersonRecord = {
  id: string;
  lastName: string;
  firstName: string;
  role: string;
  language: string;
  phone: string;
  mobile: string;
  email: string;
  communicationPreferences: {
    callcenter: boolean;
    deliveryNote: boolean;
    invoicing: boolean;
    reminders: boolean;
    marketing: boolean;
  };
  isActive: boolean;
  isDefault: boolean;
};

type AddressRecord = {
  id: string;
  street: string;
  number: string;
  box: string;
  postalCode: string;
  city: string;
  country: string;
  type: "official" | "visit" | "invoice";
  isActive: boolean;
};

type AccountingRecord = {
  paymentMethod: string;
  paymentTerm: string;
  iban: string;
  poRequired: boolean;
  deliveredAllowed: boolean;
  largeAccount: boolean;
};

type CommercialRecord = {
  currentSupplier: string;
  activity: string;
  firstAidKits: string;
  employees: string;
  nace: string;
  closedDays: string;
};

type RemarkRecord = {
  id: string;
  at: string;
  author: string;
  text: string;
  source?: string;
  type?: string;
};

type FollowUpRecord = {
  id: string;
  date: string;
  time: string;
  type: string;
  note: string;
  status: "planned";
};

type QuoteStatus = "draft" | "sent" | "approved" | "rejected" | "expired";

type QuoteRecord = {
  id: string;
  date: string;
  number: string;
  status: QuoteStatus;
  amountExclVat: number;
  amountInclVat: number;
};

type SalesDocumentRecord = {
  id: string;
  date: string;
  number: string;
  type: "invoice" | "order" | "credit_note";
  amountExclVat: number;
  amountInclVat: number;
};

type SalesItemRecord = {
  id: string;
  itemNo: string;
  description: string;
  quantity: number;
  totalExclVat: number;
  totalInclVat: number;
  lastSaleDate: string;
  documents: number;
};

type CustomerDocumentRecord = {
  id: string;
  fileName: string;
  type: "pdf" | "contract" | "quote" | "invoice" | "work_order" | "photo" | "other";
  addedAt: string;
  source: string;
};

type ReferenceRecord = {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  addedAt: string;
};

const communicationPreferenceOptions: Array<{
  id: keyof ContactPersonRecord["communicationPreferences"];
  labelKey: string;
}> = [
  { id: "callcenter", labelKey: "contactFiche.communication.callcenter" },
  { id: "deliveryNote", labelKey: "contactFiche.communication.deliveryNote" },
  { id: "invoicing", labelKey: "contactFiche.communication.invoicing" },
  { id: "reminders", labelKey: "contactFiche.communication.reminders" },
  { id: "marketing", labelKey: "contactFiche.communication.marketing" }
];

const mainTabs: Array<{ id: MainTab; key: string; icon: ReactNode }> = [
  { id: "visit", key: "fiche.tab.visit", icon: <ClipboardCheck size={16} strokeWidth={2} /> },
  { id: "preparation", key: "fiche.tab.preparation", icon: <ClipboardList size={16} strokeWidth={2} /> },
  { id: "contact", key: "fiche.tab.contact", icon: <UsersRound size={16} strokeWidth={2} /> },
  { id: "offers", key: "fiche.tab.offers", icon: <ReceiptText size={16} strokeWidth={2} /> },
  { id: "remarks", key: "fiche.tab.remarks", icon: <MessageSquareText size={16} strokeWidth={2} /> },
  { id: "salesHistory", key: "fiche.tab.salesHistory", icon: <History size={16} strokeWidth={2} /> },
  { id: "documents", key: "fiche.tab.documents", icon: <FolderOpen size={16} strokeWidth={2} /> },
  { id: "references", key: "fiche.tab.references", icon: <Star size={16} strokeWidth={2} /> },
  { id: "leads", key: "fiche.tab.leads", icon: <FileText size={16} strokeWidth={2} /> },
  { id: "followUp", key: "fiche.tab.followUp", icon: <CalendarClock size={16} strokeWidth={2} /> }
];

const contactSubtabs: Array<{ id: ContactSubtab; key: string }> = [
  { id: "identity", key: "fiche.contact.identity" },
  { id: "contacts", key: "fiche.contact.contacts" },
  { id: "addresses", key: "fiche.contact.addresses" },
  { id: "accounting", key: "fiche.contact.accounting" },
  { id: "commercial", key: "fiche.contact.commercial" }
];

const salesSubtabs: Array<{ id: SalesSubtab; key: string }> = [
  { id: "documents", key: "fiche.sales.byDocument" },
  { id: "items", key: "fiche.sales.byItem" }
];

export function AppointmentDetailView({
  appointment,
  leadTypes,
  t,
  onBackToAgenda,
  onCloseAppointment,
  onSalesSave,
  onStatusChange
}: {
  appointment: Appointment;
  leadTypes: TechnicalLeadType[];
  t: TranslationFn;
  onBackToAgenda: () => void;
  onCloseAppointment: () => void;
  onSalesSave: (revenue: SalesRevenueUpdate) => void;
  onStatusChange: (status: AppointmentStatus) => void;
}) {
  const [activeTab, setActiveTab] = useState<MainTab>("visit");
  const [contactSubtab, setContactSubtab] = useState<ContactSubtab>("identity");
  const [salesSubtab, setSalesSubtab] = useState<SalesSubtab>("documents");
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [salesWizardOpen, setSalesWizardOpen] = useState(false);
  const [salesSaved, setSalesSaved] = useState(false);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [leadSaved, setLeadSaved] = useState(false);
  const account = appointment.customer ?? appointment.prospect;
  const contact = appointment.contacts[0];

  useEffect(() => {
    setLeads([
      {
        id: "LED-0001",
        typeId: leadTypes[0]?.id ?? "cardio",
        interest: true,
        contactName: contact?.name ?? "",
        role: contact?.role ?? "",
        phone: t("fiche.mockPhone"),
        mobile: contact?.phone ?? "",
        email: contact?.email ?? "",
        note: t("lead.mock.initialNote"),
        date: currentDateValue()
      }
    ]);
  }, [appointment.id, contact?.email, contact?.name, contact?.phone, contact?.role, leadTypes, t]);

  return (
    <div className="grid gap-4">
      <section className="sticky top-0 z-20 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.12)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="grid gap-4 p-4 xl:grid-cols-[1fr_22rem]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={appointment.customer ? "blue" : "amber"}>{appointment.customer ? t("appointment.customer") : t("appointment.prospect")}</Badge>
              <StatusBadge status={appointment.status} label={t(`status.${appointment.status}`)} />
              <Badge tone="green">{t("fiche.status.inProgress")}</Badge>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{account?.name}</h2>
            <div className="mt-3 grid gap-2 text-sm font-bold text-slate-600 md:grid-cols-3">
              <IconLine icon={<CalendarClock size={16} strokeWidth={2} />} text={appointment.time} />
              <IconLine icon={<MapPin size={16} strokeWidth={2} />} text={`${appointment.address.line1}, ${appointment.address.postalCode} ${appointment.address.city}`} />
              <IconLine icon={<UserRound size={16} strokeWidth={2} />} text={contact?.name ?? t("fiche.notAvailable")} />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{t("fiche.contactCard")}</p>
            <p className="mt-2 text-base font-black text-slate-950">{contact?.name}</p>
            <div className="mt-2 grid gap-1.5 text-sm font-medium text-slate-600">
              <IconLine icon={<Phone size={15} strokeWidth={2} />} text={contact?.phone ?? t("fiche.notAvailable")} />
              <IconLine icon={<Phone size={15} strokeWidth={2} />} text={t("fiche.mockPhone")} />
              <IconLine icon={<Mail size={15} strokeWidth={2} />} text={contact?.email ?? t("fiche.notAvailable")} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-slate-50/80 p-3">
          <HeaderAction icon={<ArrowLeft size={16} strokeWidth={2} />} label={t("fiche.action.backToAgenda")} onClick={onBackToAgenda} />
          <HeaderAction icon={<BadgeEuro size={16} strokeWidth={2} />} label={t("fiche.action.newSale")} onClick={() => setSalesWizardOpen(true)} />
          <HeaderAction primary icon={<CheckCircle2 size={16} strokeWidth={2} />} label={t("fiche.action.closeAppointment")} onClick={() => setCloseModalOpen(true)} />
        </div>
      </section>

      <PreparationBlock t={t} />

      <nav className="sticky top-[9.5rem] z-10 -mx-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_12px_36px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex min-w-max gap-2">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-black transition ${
                activeTab === tab.id ? "bg-[#003B83] text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-[#003B83]"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {t(tab.key)}
            </button>
          ))}
        </div>
      </nav>

      {activeTab === "visit" && <VisitTab t={t} appointment={appointment} />}
      {activeTab === "preparation" && <PreparationTab t={t} />}
      {activeTab === "contact" && (
        <ContactTab
          appointment={appointment}
          activeSubtab={contactSubtab}
          t={t}
          onSubtabChange={setContactSubtab}
        />
      )}
      {activeTab === "offers" && <OffersTab t={t} />}
      {activeTab === "remarks" && <RemarksTab t={t} appointment={appointment} />}
      {activeTab === "salesHistory" && (
        <SalesHistoryTab activeSubtab={salesSubtab} t={t} onSubtabChange={setSalesSubtab} />
      )}
      {activeTab === "documents" && <DocumentsTab t={t} />}
      {activeTab === "references" && <ReferencesTab t={t} />}
      {activeTab === "leads" && (
        <LeadsTab
          appointment={appointment}
          leadTypes={leadTypes}
          leads={leads}
          t={t}
          onDelete={(leadId) => setLeads((current) => current.filter((lead) => lead.id !== leadId))}
          onSave={(lead) => {
            setLeads((current) => {
              const exists = current.some((item) => item.id === lead.id);
              return exists ? current.map((item) => (item.id === lead.id ? lead : item)) : [...current, lead];
            });
            setLeadSaved(true);
            window.setTimeout(() => setLeadSaved(false), 2400);
          }}
        />
      )}
      {activeTab === "followUp" && <FollowUpTab t={t} />}
      {salesSaved && (
        <div className="fixed bottom-24 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">
          {t("salesWizard.saved")}
        </div>
      )}
      {leadSaved && (
        <div className="fixed bottom-24 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">
          {t("lead.saved")}
        </div>
      )}
      {salesWizardOpen && (
        <SalesWizard
          t={t}
          onCancel={() => setSalesWizardOpen(false)}
          onSave={(revenue) => {
            onSalesSave(revenue);
            setSalesWizardOpen(false);
            setSalesSaved(true);
            window.setTimeout(() => setSalesSaved(false), 2400);
          }}
        />
      )}
      {closeModalOpen && (
        <CloseAppointmentModal
          t={t}
          onCancel={() => setCloseModalOpen(false)}
          onConfirm={() => {
            setCloseModalOpen(false);
            onCloseAppointment();
          }}
        />
      )}
    </div>
  );
}

function CloseAppointmentModal({ t, onCancel, onConfirm }: { t: TranslationFn; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-slate-950">{t("fiche.close.title")}</h3>
        <div className="mt-5 grid gap-5">
          <ModalSection title={t("fiche.close.visitReport")}>
            <CheckRow labels={["fiche.close.visitDone", "fiche.close.conversationDone", "fiche.close.rightContact", "fiche.close.saleDone"]} t={t} />
          </ModalSection>
          <ModalSection title={t("fiche.close.reason")}>
            <textarea className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" required />
          </ModalSection>
          <ModalSection title={t("fiche.close.freeRemark")}>
            <textarea className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" />
          </ModalSection>
          <ModalSection title={t("fiche.close.internalProcessing")}>
            <textarea className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" />
          </ModalSection>
          <ModalSection title={t("fiche.close.leadGeneration")}>
            <CheckRow labels={["fiche.close.interestAed", "fiche.close.firstAidTraining", "fiche.close.fireDetection", "fiche.close.firefighting"]} t={t} />
          </ModalSection>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50" onClick={onCancel}>
            {t("common.cancel")}
          </button>
          <button className="min-h-11 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#002b60]" onClick={onConfirm}>
            {t("fiche.action.closeAppointment")}
          </button>
        </div>
      </section>
    </div>
  );
}

function ModalSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-black uppercase tracking-[0.14em] text-slate-600">{title}</h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PreparationBlock({ t }: { t: TranslationFn }) {
  return (
    <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-[0_14px_40px_rgba(0,59,131,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">{t("fiche.preparation.title")}</h3>
            <Badge tone="amber">{t("fiche.preparation.priority")}</Badge>
          </div>
          <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-slate-700">{t("fiche.preparation.text")}</p>
          <p className="mt-2 text-xs font-bold text-slate-500">{t("fiche.preparation.lastChanged")}: 29/05/2026 16:20</p>
        </div>
        <button className="min-h-11 rounded-xl border border-[#003B83] bg-white px-4 text-sm font-black text-[#003B83] transition hover:bg-blue-50">
          {t("fiche.preparation.openFull")}
        </button>
      </div>
    </section>
  );
}

function VisitTab({ appointment, t }: { appointment: Appointment; t: TranslationFn }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <FicheCard icon={<CalendarClock size={21} strokeWidth={2} />} title={t("fiche.visit.appointmentInfo")}>
        <Field label={t("field.date")} value={appointment.date ?? "2026-05-30"} />
        <Field label={t("fiche.field.time")} value={appointment.time} />
        <Field label={t("appointment.status")} value={t(`status.${appointment.status}`)} />
        <Field label={t("fiche.field.salesType")} value={t(`appointment.type.${appointment.type}`)} />
        <CheckRow labels={["fiche.visit.demoGiven", "fiche.visit.priceDiscussed", "fiche.visit.followUpNeeded"]} t={t} />
      </FicheCard>
      <FicheCard icon={<BookOpenText size={21} strokeWidth={2} />} title={t("fiche.visit.report")}>
        <TextArea label={t("fiche.visit.conversation")} value={t("fiche.visit.conversationText")} />
        <TextArea label={t("fiche.visit.customerNeed")} value={t("fiche.visit.customerNeedText")} />
        <TextArea label={t("fiche.visit.nextStep")} value={t("fiche.visit.nextStepText")} />
      </FicheCard>
      <FicheCard icon={<ClipboardCheck size={21} strokeWidth={2} />} title={t("fiche.visit.qAnalysis")}>
        <CheckRow labels={["fiche.visit.q1", "fiche.visit.q2", "fiche.visit.q3", "fiche.visit.q4"]} t={t} />
        <TextArea label={t("fiche.visit.qRemark")} value={t("fiche.visit.qRemarkText")} />
      </FicheCard>
    </div>
  );
}

function PreparationTab({ t }: { t: TranslationFn }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_24rem]">
      <FicheCard icon={<ClipboardList size={21} strokeWidth={2} />} title={t("fiche.preparation.note")}>
        <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-700">{t("fiche.preparation.longText")}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label={t("fiche.preparation.priorityLabel")} value={t("fiche.preparation.priority")} />
          <Field label={t("fiche.preparation.lastChanged")} value="29/05/2026 16:20" />
        </div>
      </FicheCard>
      <FicheCard icon={<Star size={21} strokeWidth={2} />} title={t("fiche.preparation.hotItems")}>
        <BulletList items={["fiche.preparation.hot1", "fiche.preparation.hot2", "fiche.preparation.hot3"]} t={t} />
      </FicheCard>
      <FicheCard icon={<MessageSquareText size={21} strokeWidth={2} />} title={t("fiche.preparation.historicalRemarks")}>
        <Timeline items={["fiche.preparation.history1", "fiche.preparation.history2", "fiche.preparation.history3"]} t={t} />
      </FicheCard>
    </div>
  );
}

function ContactTab({
  activeSubtab,
  appointment,
  t,
  onSubtabChange
}: {
  activeSubtab: ContactSubtab;
  appointment: Appointment;
  t: TranslationFn;
  onSubtabChange: (subtab: ContactSubtab) => void;
}) {
  const account = appointment.customer ?? appointment.prospect;
  const [identity, setIdentity] = useState<ContactIdentity>(() => ({
    customerStatus: appointment.customer ? t("appointment.customer") : t("appointment.prospect"),
    number: account?.number ?? "",
    shortName: account?.name ?? "",
    legalName: `${account?.name ?? ""} BV`,
    legalForm: "BV",
    language: t("language.nl"),
    vat: appointment.customer?.vat ?? "BE0999.999.999"
  }));
  const [identityDraft, setIdentityDraft] = useState(identity);
  const [identityEditing, setIdentityEditing] = useState(false);
  const [contacts, setContacts] = useState<ContactPersonRecord[]>(() =>
    appointment.contacts.map((contact, index) => {
      const nameParts = contact.name.split(" ");
      return {
        id: `CP-${String(index + 1).padStart(3, "0")}`,
        lastName: nameParts.slice(1).join(" ") || contact.name,
        firstName: nameParts[0] ?? "",
        role: contact.role,
        language: t("language.nl"),
        phone: t("fiche.mockPhone"),
        mobile: contact.phone,
        email: contact.email,
        communicationPreferences: {
          callcenter: index === 0,
          deliveryNote: true,
          invoicing: true,
          reminders: index === 0,
          marketing: false
        },
        isActive: contact.isActive,
        isDefault: index === 0
      };
    })
  );
  const [editingContact, setEditingContact] = useState<ContactPersonRecord | undefined>();
  const [addresses, setAddresses] = useState<AddressRecord[]>(() => [
    {
      id: "ADR-001",
      street: appointment.address.line1.replace(/\s+\d+\w?$/, ""),
      number: appointment.address.line1.match(/\d+\w?$/)?.[0] ?? "",
      box: "",
      postalCode: appointment.address.postalCode,
      city: appointment.address.city,
      country: appointment.address.country,
      type: "official",
      isActive: appointment.address.isActive
    },
    {
      id: "ADR-002",
      street: appointment.address.line1.replace(/\s+\d+\w?$/, ""),
      number: appointment.address.line1.match(/\d+\w?$/)?.[0] ?? "",
      box: "",
      postalCode: appointment.address.postalCode,
      city: appointment.address.city,
      country: appointment.address.country,
      type: "visit",
      isActive: true
    },
    {
      id: "ADR-003",
      street: appointment.address.line1.replace(/\s+\d+\w?$/, ""),
      number: appointment.address.line1.match(/\d+\w?$/)?.[0] ?? "",
      box: "",
      postalCode: appointment.address.postalCode,
      city: appointment.address.city,
      country: appointment.address.country,
      type: "invoice",
      isActive: true
    }
  ]);
  const [editingAddress, setEditingAddress] = useState<AddressRecord | undefined>();
  const [accounting, setAccounting] = useState<AccountingRecord>({
    paymentMethod: t("fiche.accounting.bankTransfer"),
    paymentTerm: "30 dagen",
    iban: "BE12 3456 7890 1234",
    poRequired: true,
    deliveredAllowed: true,
    largeAccount: false
  });
  const [accountingDraft, setAccountingDraft] = useState(accounting);
  const [accountingEditing, setAccountingEditing] = useState(false);
  const [commercial, setCommercial] = useState<CommercialRecord>({
    currentSupplier: "SafetyPlus",
    activity: appointment.customer?.segment ?? appointment.prospect?.potential ?? "Retail",
    firstAidKits: "4",
    employees: "28",
    nace: "47.24",
    closedDays: t("fiche.commercial.closedSunday")
  });
  const [commercialDraft, setCommercialDraft] = useState(commercial);
  const [commercialEditing, setCommercialEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  function showSaved() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return (
    <div className="grid gap-4">
      <SubtabBar
        active={activeSubtab}
        items={contactSubtabs}
        t={t}
        onChange={(id) => onSubtabChange(id as ContactSubtab)}
      />
      {activeSubtab === "identity" && (
        <EditableSection
          editing={identityEditing}
          icon={<IdCard size={21} strokeWidth={2} />}
          title={t("fiche.contact.identity")}
          t={t}
          onCancel={() => {
            setIdentityDraft(identity);
            setIdentityEditing(false);
          }}
          onEdit={() => setIdentityEditing(true)}
          onSave={() => {
            setIdentity(identityDraft);
            setIdentityEditing(false);
            showSaved();
          }}
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <EditableTextField editing={identityEditing} label={t("fiche.contact.customerStatus")} value={identityDraft.customerStatus} onChange={(customerStatus) => setIdentityDraft((current) => ({ ...current, customerStatus }))} />
            <EditableTextField editing={identityEditing} label={t("fiche.contact.customerNumber")} value={identityDraft.number} onChange={(number) => setIdentityDraft((current) => ({ ...current, number }))} />
            <EditableTextField editing={identityEditing} label={t("fiche.contact.shortName")} value={identityDraft.shortName} onChange={(shortName) => setIdentityDraft((current) => ({ ...current, shortName }))} />
            <EditableTextField editing={identityEditing} label={t("fiche.contact.legalName")} value={identityDraft.legalName} onChange={(legalName) => setIdentityDraft((current) => ({ ...current, legalName }))} />
            <EditableTextField editing={identityEditing} label={t("fiche.contact.legalForm")} value={identityDraft.legalForm} onChange={(legalForm) => setIdentityDraft((current) => ({ ...current, legalForm }))} />
            <EditableTextField editing={identityEditing} label={t("userManagement.field.language")} value={identityDraft.language} onChange={(language) => setIdentityDraft((current) => ({ ...current, language }))} />
            <EditableTextField editing={identityEditing} label={t("field.vat")} value={identityDraft.vat} onChange={(vat) => setIdentityDraft((current) => ({ ...current, vat }))} />
          </div>
        </EditableSection>
      )}
      {activeSubtab === "contacts" && (
        <FicheCard icon={<UsersRound size={21} strokeWidth={2} />} title={t("fiche.contact.contacts")}>
          <div className="mb-4 flex justify-end">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#002b60]" onClick={() => setEditingContact(emptyContact(contacts.length + 1, t))}>
              <Plus size={16} strokeWidth={2} />
              {t("fiche.contact.addContact")}
            </button>
          </div>
          <div className="grid gap-3">
            {contacts.map((contact) => (
              <ContactPersonCard
                key={contact.id}
                contact={contact}
                t={t}
                onDeactivate={() => {
                  setContacts((current) => current.map((item) => (item.id === contact.id ? { ...item, isActive: false } : item)));
                  showSaved();
                }}
                onEdit={() => setEditingContact(contact)}
              />
            ))}
          </div>
        </FicheCard>
      )}
      {activeSubtab === "addresses" && (
        <FicheCard icon={<MapPin size={21} strokeWidth={2} />} title={t("fiche.contact.addresses")}>
          <div className="mb-4 flex justify-end">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#002b60]" onClick={() => setEditingAddress(emptyAddress(addresses.length + 1))}>
              <Plus size={16} strokeWidth={2} />
              {t("fiche.address.add")}
            </button>
          </div>
          <AddressGroup addresses={addresses} title={t("fiche.address.official")} t={t} type="official" onDeactivate={(id) => {
            setAddresses((current) => current.map((item) => (item.id === id ? { ...item, isActive: false } : item)));
            showSaved();
          }} onEdit={setEditingAddress} />
          <AddressGroup addresses={addresses} title={t("fiche.address.visit")} t={t} type="visit" onDeactivate={(id) => {
            setAddresses((current) => current.map((item) => (item.id === id ? { ...item, isActive: false } : item)));
            showSaved();
          }} onEdit={setEditingAddress} />
          <AddressGroup addresses={addresses} title={t("fiche.address.invoice")} t={t} type="invoice" onDeactivate={(id) => {
            setAddresses((current) => current.map((item) => (item.id === id ? { ...item, isActive: false } : item)));
            showSaved();
          }} onEdit={setEditingAddress} />
        </FicheCard>
      )}
      {activeSubtab === "accounting" && (
        <EditableSection
          editing={accountingEditing}
          icon={<ReceiptText size={21} strokeWidth={2} />}
          title={t("fiche.contact.accounting")}
          t={t}
          onCancel={() => {
            setAccountingDraft(accounting);
            setAccountingEditing(false);
          }}
          onEdit={() => setAccountingEditing(true)}
          onSave={() => {
            setAccounting(accountingDraft);
            setAccountingEditing(false);
            showSaved();
          }}
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <EditableTextField editing={accountingEditing} label={t("fiche.accounting.paymentMethod")} value={accountingDraft.paymentMethod} onChange={(paymentMethod) => setAccountingDraft((current) => ({ ...current, paymentMethod }))} />
            <EditableTextField editing={accountingEditing} label={t("fiche.accounting.paymentTerm")} value={accountingDraft.paymentTerm} onChange={(paymentTerm) => setAccountingDraft((current) => ({ ...current, paymentTerm }))} />
            <EditableTextField editing={accountingEditing} label={t("fiche.accounting.iban")} value={accountingDraft.iban} onChange={(iban) => setAccountingDraft((current) => ({ ...current, iban }))} />
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <EditableBooleanField editing={accountingEditing} label={t("fiche.accounting.poRequired")} value={accountingDraft.poRequired} onChange={(poRequired) => setAccountingDraft((current) => ({ ...current, poRequired }))} t={t} />
            <EditableBooleanField editing={accountingEditing} label={t("fiche.accounting.deliveredAllowed")} value={accountingDraft.deliveredAllowed} onChange={(deliveredAllowed) => setAccountingDraft((current) => ({ ...current, deliveredAllowed }))} t={t} />
            <EditableBooleanField editing={accountingEditing} label={t("fiche.accounting.largeAccount")} value={accountingDraft.largeAccount} onChange={(largeAccount) => setAccountingDraft((current) => ({ ...current, largeAccount }))} t={t} />
          </div>
        </EditableSection>
      )}
      {activeSubtab === "commercial" && (
        <EditableSection
          editing={commercialEditing}
          icon={<BriefcaseBusiness size={21} strokeWidth={2} />}
          title={t("fiche.contact.commercial")}
          t={t}
          onCancel={() => {
            setCommercialDraft(commercial);
            setCommercialEditing(false);
          }}
          onEdit={() => setCommercialEditing(true)}
          onSave={() => {
            setCommercial(commercialDraft);
            setCommercialEditing(false);
            showSaved();
          }}
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <EditableTextField editing={commercialEditing} label={t("fiche.commercial.currentSupplier")} value={commercialDraft.currentSupplier} onChange={(currentSupplier) => setCommercialDraft((current) => ({ ...current, currentSupplier }))} />
            <EditableTextField editing={commercialEditing} label={t("fiche.commercial.activity")} value={commercialDraft.activity} onChange={(activity) => setCommercialDraft((current) => ({ ...current, activity }))} />
            <EditableTextField editing={commercialEditing} label={t("fiche.commercial.firstAidKits")} value={commercialDraft.firstAidKits} onChange={(firstAidKits) => setCommercialDraft((current) => ({ ...current, firstAidKits }))} />
            <EditableTextField editing={commercialEditing} label={t("fiche.commercial.employees")} value={commercialDraft.employees} onChange={(employees) => setCommercialDraft((current) => ({ ...current, employees }))} />
            <EditableTextField editing={commercialEditing} label={t("fiche.commercial.nace")} value={commercialDraft.nace} onChange={(nace) => setCommercialDraft((current) => ({ ...current, nace }))} />
            <EditableTextField editing={commercialEditing} label={t("fiche.commercial.closedDays")} value={commercialDraft.closedDays} onChange={(closedDays) => setCommercialDraft((current) => ({ ...current, closedDays }))} />
          </div>
        </EditableSection>
      )}
      {editingContact && (
        <ContactPersonModal
          contact={editingContact}
          t={t}
          onCancel={() => setEditingContact(undefined)}
          onSave={(contact) => {
            setContacts((current) => {
              const exists = current.some((item) => item.id === contact.id);
              return exists ? current.map((item) => (item.id === contact.id ? contact : item)) : [...current, contact];
            });
            setEditingContact(undefined);
            showSaved();
          }}
        />
      )}
      {editingAddress && (
        <AddressModal
          address={editingAddress}
          t={t}
          onCancel={() => setEditingAddress(undefined)}
          onSave={(address) => {
            setAddresses((current) => {
              const exists = current.some((item) => item.id === address.id);
              return exists ? current.map((item) => (item.id === address.id ? address : item)) : [...current, address];
            });
            setEditingAddress(undefined);
            showSaved();
          }}
        />
      )}
      {saved && (
        <div className="fixed bottom-24 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">
          {t("contactFiche.saved")}
        </div>
      )}
    </div>
  );
}

function EditableSection({
  children,
  editing,
  icon,
  title,
  t,
  onCancel,
  onEdit,
  onSave
}: {
  children: ReactNode;
  editing: boolean;
  icon: ReactNode;
  title: string;
  t: TranslationFn;
  onCancel: () => void;
  onEdit: () => void;
  onSave: () => void;
}) {
  return (
    <FicheCard icon={icon} title={title}>
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        {editing ? (
          <>
            <ActionButton icon={<X size={16} strokeWidth={2} />} label={t("common.cancel")} tone="secondary" onClick={onCancel} />
            <ActionButton icon={<Save size={16} strokeWidth={2} />} label={t("common.save")} onClick={onSave} />
          </>
        ) : (
          <ActionButton icon={<Pencil size={16} strokeWidth={2} />} label={t("common.edit")} onClick={onEdit} />
        )}
      </div>
      {children}
    </FicheCard>
  );
}

function EditableTextField({ editing, label, value, onChange }: { editing: boolean; label: string; value: string; onChange: (value: string) => void }) {
  if (!editing) {
    return <Field label={label} value={value} />;
  }

  return (
    <label className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3">
      <span className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <input className="min-h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-950 outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function EditableBooleanField({ editing, label, value, onChange, t }: { editing: boolean; label: string; value: boolean; onChange: (value: boolean) => void; t: TranslationFn }) {
  if (!editing) {
    return <Field label={label} value={value ? t("lead.yes") : t("lead.no")} />;
  }

  return (
    <label className="flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700">
      <input checked={value} className="size-4 accent-[#003B83]" type="checkbox" onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function ContactPersonCard({ contact, onDeactivate, onEdit, t }: { contact: ContactPersonRecord; onDeactivate: () => void; onEdit: () => void; t: TranslationFn }) {
  return (
    <article className={`rounded-xl border p-4 transition ${contact.isActive ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-70"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base font-black text-slate-950">{contact.firstName} {contact.lastName}</h4>
            {contact.isDefault && <Badge tone="blue">{t("contactFiche.defaultContact")}</Badge>}
            <Badge tone={contact.isActive ? "green" : "slate"}>{contact.isActive ? t("userManagement.status.active") : t("userManagement.status.inactive")}</Badge>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-600">{contact.role}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton compact icon={<Pencil size={15} strokeWidth={2} />} label={t("userManagement.action.edit")} tone="secondary" onClick={onEdit} />
          <ActionButton compact disabled={!contact.isActive} icon={<UserX size={15} strokeWidth={2} />} label={t("contactFiche.deactivate")} tone="danger" onClick={onDeactivate} />
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Field label={t("userManagement.field.language")} value={contact.language} />
        <Field label={t("contactFiche.phone")} value={contact.phone} />
        <Field label={t("contactFiche.mobile")} value={contact.mobile} />
        <Field label={t("userManagement.field.email")} value={contact.email} />
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{t("contactFiche.communicationPreference")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {communicationPreferenceOptions.map((option) => (
            <Badge key={option.id} tone={contact.communicationPreferences[option.id] ? "blue" : "slate"}>
              {t(option.labelKey)}: {contact.communicationPreferences[option.id] ? t("lead.yes") : t("lead.no")}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}

function ContactPersonModal({ contact, onCancel, onSave, t }: { contact: ContactPersonRecord; onCancel: () => void; onSave: (contact: ContactPersonRecord) => void; t: TranslationFn }) {
  const [draft, setDraft] = useState(contact);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-slate-950">{t("contactFiche.contactForm")}</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <LeadInput label={t("userManagement.field.lastName")} value={draft.lastName} onChange={(lastName) => setDraft((current) => ({ ...current, lastName }))} />
          <LeadInput label={t("userManagement.field.firstName")} value={draft.firstName} onChange={(firstName) => setDraft((current) => ({ ...current, firstName }))} />
          <LeadInput label={t("fiche.table.function")} value={draft.role} onChange={(role) => setDraft((current) => ({ ...current, role }))} />
          <LeadInput label={t("userManagement.field.language")} value={draft.language} onChange={(language) => setDraft((current) => ({ ...current, language }))} />
          <LeadInput icon={<Phone size={16} strokeWidth={2} />} label={t("contactFiche.phone")} value={draft.phone} onChange={(phone) => setDraft((current) => ({ ...current, phone }))} />
          <LeadInput icon={<Smartphone size={16} strokeWidth={2} />} label={t("contactFiche.mobile")} value={draft.mobile} onChange={(mobile) => setDraft((current) => ({ ...current, mobile }))} />
          <LeadInput icon={<Mail size={16} strokeWidth={2} />} label={t("userManagement.field.email")} value={draft.email} onChange={(email) => setDraft((current) => ({ ...current, email }))} />
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700">
            <input checked={draft.isActive} className="size-4 accent-[#003B83]" type="checkbox" onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))} />
            {t("userManagement.field.active")}
          </label>
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:col-span-2">
            <p className="text-sm font-black text-slate-700">{t("contactFiche.communicationPreference")}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {communicationPreferenceOptions.map((option) => (
                <label key={option.id} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
                  <input
                    checked={draft.communicationPreferences[option.id]}
                    className="size-4 accent-[#003B83]"
                    type="checkbox"
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        communicationPreferences: {
                          ...current.communicationPreferences,
                          [option.id]: event.target.checked
                        }
                      }))
                    }
                  />
                  {t(option.labelKey)}
                </label>
              ))}
            </div>
          </section>
        </div>
        <ModalActions t={t} onCancel={onCancel} onSave={() => onSave(draft)} />
      </section>
    </div>
  );
}

function AddressGroup({ addresses, onDeactivate, onEdit, t, title, type }: { addresses: AddressRecord[]; onDeactivate: (id: string) => void; onEdit: (address: AddressRecord) => void; t: TranslationFn; title: string; type: AddressRecord["type"] }) {
  return (
    <section className="mt-4 first:mt-0">
      <h4 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-slate-500">{title}</h4>
      <div className="grid gap-3">
        {addresses.filter((address) => address.type === type).map((address) => (
          <article key={address.id} className={`rounded-xl border p-4 ${address.isActive ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-70"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-black text-slate-950">{address.street} {address.number}{address.box ? `/${address.box}` : ""}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{address.postalCode} {address.city} - {address.country}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={address.isActive ? "green" : "slate"}>{address.isActive ? t("userManagement.status.active") : t("userManagement.status.inactive")}</Badge>
                <ActionButton compact icon={<Pencil size={15} strokeWidth={2} />} label={t("userManagement.action.edit")} tone="secondary" onClick={() => onEdit(address)} />
                <ActionButton compact disabled={!address.isActive} icon={<UserX size={15} strokeWidth={2} />} label={t("contactFiche.deactivate")} tone="danger" onClick={() => onDeactivate(address.id)} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AddressModal({ address, onCancel, onSave, t }: { address: AddressRecord; onCancel: () => void; onSave: (address: AddressRecord) => void; t: TranslationFn }) {
  const [draft, setDraft] = useState(address);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-slate-950">{t("contactFiche.addressForm")}</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <LeadInput label={t("field.street")} value={draft.street} onChange={(street) => setDraft((current) => ({ ...current, street }))} />
          <LeadInput label={t("field.number")} value={draft.number} onChange={(number) => setDraft((current) => ({ ...current, number }))} />
          <LeadInput label={t("contactFiche.box")} value={draft.box} onChange={(box) => setDraft((current) => ({ ...current, box }))} />
          <LeadInput label={t("contactFiche.postalCode")} value={draft.postalCode} onChange={(postalCode) => setDraft((current) => ({ ...current, postalCode }))} />
          <LeadInput label={t("contactFiche.city")} value={draft.city} onChange={(city) => setDraft((current) => ({ ...current, city }))} />
          <LeadInput label={t("userManagement.field.country")} value={draft.country} onChange={(country) => setDraft((current) => ({ ...current, country }))} />
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{t("contactFiche.addressType")}</span>
            <select className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#003B83]" value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value as AddressRecord["type"] }))}>
              <option value="official">{t("fiche.address.official")}</option>
              <option value="visit">{t("fiche.address.visit")}</option>
              <option value="invoice">{t("fiche.address.invoice")}</option>
            </select>
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700">
            <input checked={draft.isActive} className="size-4 accent-[#003B83]" type="checkbox" onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))} />
            {t("userManagement.field.active")}
          </label>
        </div>
        <ModalActions t={t} onCancel={onCancel} onSave={() => onSave(draft)} />
      </section>
    </div>
  );
}

function ActionButton({ compact, disabled, icon, label, onClick, tone = "primary" }: { compact?: boolean; disabled?: boolean; icon: ReactNode; label: string; onClick: () => void; tone?: "primary" | "secondary" | "danger" }) {
  const toneClass =
    tone === "primary"
      ? "border-[#003B83] bg-[#003B83] text-white hover:bg-[#002b60]"
      : tone === "danger"
        ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
        : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-[#003B83]";

  return (
    <button className={`inline-flex items-center gap-2 rounded-xl border font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${compact ? "min-h-9 px-3 text-xs" : "min-h-11 px-4 text-sm"} ${toneClass}`} disabled={disabled} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function ModalActions({ onCancel, onSave, t }: { onCancel: () => void; onSave: () => void; t: TranslationFn }) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <ActionButton icon={<X size={16} strokeWidth={2} />} label={t("common.cancel")} tone="secondary" onClick={onCancel} />
      <ActionButton icon={<Save size={16} strokeWidth={2} />} label={t("common.save")} onClick={onSave} />
    </div>
  );
}

function emptyContact(index: number, t: TranslationFn): ContactPersonRecord {
  return {
    id: `CP-${String(index).padStart(3, "0")}`,
    lastName: "",
    firstName: "",
    role: "",
    language: t("language.nl"),
    phone: "",
    mobile: "",
    email: "",
    communicationPreferences: {
      callcenter: false,
      deliveryNote: false,
      invoicing: false,
      reminders: false,
      marketing: false
    },
    isActive: true,
    isDefault: false
  };
}

function emptyAddress(index: number): AddressRecord {
  return {
    id: `ADR-${String(index).padStart(3, "0")}`,
    street: "",
    number: "",
    box: "",
    postalCode: "",
    city: "",
    country: "BE",
    type: "visit",
    isActive: true
  };
}

function OffersTab({ t }: { t: TranslationFn }) {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const filteredQuotes = mockQuotes.filter((quote) => {
    const haystack = `${quote.number} ${t(`quote.status.${quote.status}`)}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <>
      <FicheCard icon={<FileText size={21} strokeWidth={2} />} title={t("fiche.tab.offers")}>
        <SearchField label={t("search.label")} placeholder={t("offers.searchPlaceholder")} value={search} onChange={setSearch} />
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["field.date", "fiche.offers.number", "common.status", "fiche.amount.exclVat", "fiche.amount.inclVat", "fiche.table.actions"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(quote.date)}</td>
                  <td className="break-words px-3 py-3 font-black text-slate-950">{quote.number}</td>
                  <td className="break-words px-3 py-3"><Badge tone={quoteStatusTone(quote.status)}>{t(`quote.status.${quote.status}`)}</Badge></td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatCurrency(quote.amountExclVat)}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatCurrency(quote.amountInclVat)}</td>
                  <td className="px-3 py-3">
                    <TableAction icon={<Eye size={14} strokeWidth={2} />} label={t("agenda.action.open")} onClick={() => setMessage(t("offers.openMock"))} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FicheCard>
      {message && <MockMessage message={message} onClose={() => setMessage("")} t={t} />}
    </>
  );
}

function RemarksTab({ appointment, t }: { appointment: Appointment; t: TranslationFn }) {
  const [remarkText, setRemarkText] = useState("");
  const [remarks, setRemarks] = useState<RemarkRecord[]>(() =>
    appointment.history.map((item, index) => ({
      id: `RMK-${String(index + 1).padStart(4, "0")}`,
      at: item.at,
      author: index === 0 ? "Jochen Andries" : "Backoffice",
      text: item.text,
      source: index === 0 ? t("remarks.source.app") : t("remarks.source.erp"),
      type: index === 0 ? t("remarks.type.visit") : t("remarks.type.history")
    }))
  );
  const [saved, setSaved] = useState(false);

  function addRemark() {
    const trimmed = remarkText.trim();
    if (!trimmed) {
      return;
    }

    setRemarks((current) => [
      {
        id: `RMK-${String(current.length + 1).padStart(4, "0")}`,
        at: new Date().toISOString(),
        author: "Jochen Andries",
        text: trimmed,
        source: t("remarks.source.app"),
        type: t("remarks.type.internal")
      },
      ...current
    ]);
    setRemarkText("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  const sortedRemarks = [...remarks].sort((first, second) => remarkTime(second.at) - remarkTime(first.at));

  return (
    <>
      <FicheCard icon={<MessageSquareText size={21} strokeWidth={2} />} title={t("fiche.tab.remarks")}>
        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-700">{t("fiche.remarks.newInternal")}</span>
          <textarea
            className="min-h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100"
            value={remarkText}
            onChange={(event) => setRemarkText(event.target.value)}
          />
        </label>
        <button
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#002b60] disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!remarkText.trim()}
          onClick={addRemark}
        >
          <PlusCircle size={16} strokeWidth={2} />
          {t("fiche.action.add")}
        </button>
        <div className="mt-5 grid gap-3">
          {sortedRemarks.map((remark) => (
            <article key={remark.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {remark.type && <Badge tone="blue">{remark.type}</Badge>}
                    {remark.source && <Badge tone="slate">{remark.source}</Badge>}
                  </div>
                  <p className="mt-2 text-sm font-black text-slate-950">{remark.author}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{formatRemarkDateTime(remark.at)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{remark.text}</p>
            </article>
          ))}
        </div>
      </FicheCard>
      {saved && (
        <div className="fixed bottom-24 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">
          {t("remarks.saved")}
        </div>
      )}
    </>
  );
}

function SalesHistoryTab({
  activeSubtab,
  t,
  onSubtabChange
}: {
  activeSubtab: SalesSubtab;
  t: TranslationFn;
  onSubtabChange: (subtab: SalesSubtab) => void;
}) {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const filteredDocuments = mockSalesDocuments.filter((document) =>
    `${document.number} ${t(`salesHistory.type.${document.type}`)}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredItems = mockSalesItems.filter((item) =>
    `${item.itemNo} ${item.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="grid gap-4">
        <SubtabBar active={activeSubtab} items={salesSubtabs} t={t} onChange={(id) => onSubtabChange(id as SalesSubtab)} />
        <FicheCard icon={<BarChart3 size={21} strokeWidth={2} />} title={t("fiche.tab.salesHistory")}>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label={t("fiche.sales.turnover12")} value="€ 18.420,00" />
          <KpiCard label={t("fiche.sales.turnover24")} value="€ 34.875,00" />
          <KpiCard label={t("fiche.sales.invoiceCount")} value="28" />
          <KpiCard label={t("fiche.sales.avgOrderValue")} value="€ 658,00" />
        </div>
        <SearchField
          label={t("search.label")}
          placeholder={activeSubtab === "documents" ? t("salesHistory.searchDocumentPlaceholder") : t("salesHistory.searchItemPlaceholder")}
          value={search}
          onChange={setSearch}
        />
        {activeSubtab === "documents" ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["field.date", "field.number", "fiche.table.type", "fiche.amount.exclVat", "fiche.amount.inclVat", "fiche.table.actions"].map((header) => (
                    <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-blue-50/40">
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(document.date)}</td>
                    <td className="break-words px-3 py-3 font-black text-slate-950">{document.number}</td>
                    <td className="break-words px-3 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        {salesDocumentIcon(document.type)}
                        {t(`salesHistory.type.${document.type}`)}
                      </span>
                    </td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatCurrency(document.amountExclVat)}</td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatCurrency(document.amountInclVat)}</td>
                    <td className="px-3 py-3"><TableAction icon={<Eye size={14} strokeWidth={2} />} label={t("agenda.action.open")} onClick={() => setMessage(t("salesHistory.openMock"))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["fiche.sales.itemNo", "fiche.sales.description", "fiche.sales.quantity", "salesHistory.totalExclVat", "salesHistory.totalInclVat", "salesHistory.lastSaleDate", "fiche.sales.documents"].map((header) => (
                    <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40">
                    <td className="break-words px-3 py-3 font-black text-slate-950">{item.itemNo}</td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.description}</td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.quantity}</td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatCurrency(item.totalExclVat)}</td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatCurrency(item.totalInclVat)}</td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(item.lastSaleDate)}</td>
                    <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.documents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </FicheCard>
      </div>
      {message && <MockMessage message={message} onClose={() => setMessage("")} t={t} />}
    </>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/60 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function SearchField({ label, onChange, placeholder, value }: { label: string; onChange: (value: string) => void; placeholder: string; value: string }) {
  return (
    <label className="grid max-w-xl gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TableAction({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-blue-50 hover:text-[#003B83]" onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function MockMessage({ message, onClose, t }: { message: string; onClose: () => void; t: TranslationFn }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-black text-slate-950">{t("common.mockOnly")}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{message}</p>
        <div className="mt-5 flex justify-end">
          <button className="min-h-11 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white transition hover:bg-[#002b60]" onClick={onClose}>
            {t("common.ok")}
          </button>
        </div>
      </section>
    </div>
  );
}

function ReferenceInput({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function emptyReference(index: number): ReferenceRecord {
  return {
    id: `REF-${String(index).padStart(4, "0")}`,
    company: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    addedAt: currentDateValue()
  };
}

function DocumentsTab({ t }: { t: TranslationFn }) {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const filteredDocuments = mockCustomerDocuments.filter((document) =>
    `${document.fileName} ${t(`documents.type.${document.type}`)}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <FicheCard icon={<FolderOpen size={21} strokeWidth={2} />} title={t("fiche.tab.documents")}>
        <SearchField label={t("search.label")} placeholder={t("documents.searchPlaceholder")} value={search} onChange={setSearch} />
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["fiche.documents.fileName", "fiche.table.type", "fiche.documents.addedAt", "documents.source", "fiche.table.actions"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-black text-slate-950">{document.fileName}</td>
                  <td className="break-words px-3 py-3"><Badge tone="blue">{t(`documents.type.${document.type}`)}</Badge></td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{formatDate(document.addedAt)}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{document.source}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <TableAction icon={<Eye size={14} strokeWidth={2} />} label={t("agenda.action.open")} onClick={() => setMessage(t("documents.openMock"))} />
                      <TableAction icon={<Download size={14} strokeWidth={2} />} label={t("documents.download")} onClick={() => setMessage(t("documents.downloadMock"))} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FicheCard>
      {message && <MockMessage message={message} onClose={() => setMessage("")} t={t} />}
    </>
  );
}

function ReferencesTab({ t }: { t: TranslationFn }) {
  const [references, setReferences] = useState<ReferenceRecord[]>(initialReferences);
  const [draft, setDraft] = useState<ReferenceRecord>(emptyReference(references.length + 1));
  const [deleteReference, setDeleteReference] = useState<ReferenceRecord | undefined>();
  const [saved, setSaved] = useState(false);
  const [validation, setValidation] = useState("");

  function resetForm() {
    setDraft(emptyReference(references.length + 1));
    setValidation("");
  }

  function saveReference() {
    if (!draft.company.trim()) {
      setValidation(t("references.validation.companyRequired"));
      return;
    }

    setReferences((current) => {
      const exists = current.some((reference) => reference.id === draft.id);
      return exists ? current.map((reference) => (reference.id === draft.id ? draft : reference)) : [draft, ...current];
    });
    setDraft(emptyReference(references.length + 2));
    setValidation("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return (
    <>
      <FicheCard icon={<Star size={21} strokeWidth={2} />} title={t("fiche.tab.references")}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ReferenceInput label={t("fiche.references.company")} value={draft.company} onChange={(company) => setDraft((current) => ({ ...current, company }))} />
          <ReferenceInput label={t("fiche.references.contact")} value={draft.contact} onChange={(contact) => setDraft((current) => ({ ...current, contact }))} />
          <ReferenceInput label={t("fiche.references.phone")} value={draft.phone} onChange={(phone) => setDraft((current) => ({ ...current, phone }))} />
          <ReferenceInput label={t("fiche.references.email")} value={draft.email} onChange={(email) => setDraft((current) => ({ ...current, email }))} />
          <ReferenceInput label={t("appointment.address")} value={draft.address} onChange={(address) => setDraft((current) => ({ ...current, address }))} />
          <ReferenceInput label={t("appointment.notes")} value={draft.note} onChange={(note) => setDraft((current) => ({ ...current, note }))} />
        </div>
        {validation && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{validation}</p>}
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <ActionButton icon={<X size={16} strokeWidth={2} />} label={t("common.cancel")} tone="secondary" onClick={resetForm} />
          <ActionButton icon={<PlusCircle size={16} strokeWidth={2} />} label={draft.id && references.some((reference) => reference.id === draft.id) ? t("common.save") : t("fiche.action.add")} onClick={saveReference} />
        </div>
        <div className="mt-6 grid gap-3">
          {references.map((reference) => (
            <article key={reference.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-black text-slate-950">{reference.company}</h4>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{reference.contact}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <TableAction icon={<Pencil size={14} strokeWidth={2} />} label={t("userManagement.action.edit")} onClick={() => {
                    setDraft(reference);
                    setValidation("");
                  }} />
                  <TableAction icon={<Trash2 size={14} strokeWidth={2} />} label={t("lead.action.delete")} onClick={() => setDeleteReference(reference)} />
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Field label={t("fiche.references.phone")} value={reference.phone || "-"} />
                <Field label={t("fiche.references.email")} value={reference.email || "-"} />
                <Field label={t("appointment.address")} value={reference.address || "-"} />
                <Field label={t("appointment.notes")} value={reference.note || "-"} />
                <Field label={t("references.addedAt")} value={formatDate(reference.addedAt)} />
              </div>
            </article>
          ))}
        </div>
      </FicheCard>
      {deleteReference && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-black text-slate-950">{t("references.delete.title")}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t("references.delete.body")}</p>
            <div className="mt-5 flex justify-end gap-2">
              <ActionButton icon={<X size={16} strokeWidth={2} />} label={t("common.cancel")} tone="secondary" onClick={() => setDeleteReference(undefined)} />
              <ActionButton icon={<Trash2 size={16} strokeWidth={2} />} label={t("lead.action.delete")} tone="danger" onClick={() => {
                setReferences((current) => current.filter((reference) => reference.id !== deleteReference.id));
                setDeleteReference(undefined);
              }} />
            </div>
          </section>
        </div>
      )}
      {saved && (
        <div className="fixed bottom-24 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">
          {t("references.saved")}
        </div>
      )}
    </>
  );
}

function LeadsTab({
  appointment,
  leadTypes,
  leads,
  t,
  onDelete,
  onSave
}: {
  appointment: Appointment;
  leadTypes: TechnicalLeadType[];
  leads: LeadRecord[];
  t: TranslationFn;
  onDelete: (leadId: string) => void;
  onSave: (lead: LeadRecord) => void;
}) {
  const [editingLead, setEditingLead] = useState<LeadRecord | undefined>();
  const [deleteLead, setDeleteLead] = useState<LeadRecord | undefined>();
  const contact = appointment.contacts[0];
  const availableLeadType = firstAvailableLeadType(leadTypes, leads);

  function createLead() {
    if (!availableLeadType) {
      return;
    }

    setEditingLead({
      id: nextLeadId(leads),
      typeId: availableLeadType,
      interest: true,
      contactName: contact?.name ?? "",
      role: contact?.role ?? "",
      phone: t("fiche.mockPhone"),
      mobile: contact?.phone ?? "",
      email: contact?.email ?? "",
      note: "",
      date: currentDateValue()
    });
  }

  return (
    <>
      <FicheCard icon={<Target size={21} strokeWidth={2} />} title={t("fiche.tab.leads")}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium leading-6 text-slate-600">{t("lead.helper")}</p>
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#002b60] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            disabled={!availableLeadType}
            onClick={createLead}
          >
            <PlusCircle aria-hidden="true" size={17} strokeWidth={2} />
            {t("lead.action.new")}
          </button>
        </div>
        {!availableLeadType && (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
            {t("lead.allTypesUsed")}
          </p>
        )}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["lead.type", "lead.contact", "lead.note", "fiche.table.actions"].map((key) => (
                  <th key={key} className="break-words px-2 py-3 text-[0.65rem] font-black uppercase tracking-wide text-slate-500">
                    {t(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {leads.length === 0 && (
                <tr>
                  <td className="px-3 py-5 text-center text-sm font-semibold text-slate-500" colSpan={4}>
                    {t("lead.empty")}
                  </td>
                </tr>
              )}
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="break-words px-2 py-3 font-semibold text-slate-700">{leadTypeLabel(leadTypes, lead.typeId, t)}</td>
                  <td className="break-words px-2 py-3 font-semibold text-slate-700">{lead.contactName}</td>
                  <td className="break-words px-2 py-3 font-semibold text-slate-700">{lead.note || "-"}</td>
                  <td className="px-2 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-blue-50" onClick={() => setEditingLead(lead)}>
                        <UserRound aria-hidden="true" size={14} strokeWidth={2} />
                        {t("lead.action.edit")}
                      </button>
                      <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-black text-red-700 transition hover:bg-red-100" onClick={() => setDeleteLead(lead)}>
                        <Trash2 aria-hidden="true" size={14} strokeWidth={2} />
                        {t("lead.action.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FicheCard>
      {editingLead && (
        <LeadFormModal
          lead={editingLead}
          leadTypes={leadTypes}
          leads={leads}
          t={t}
          onCancel={() => setEditingLead(undefined)}
          onSave={(lead) => {
            onSave(lead);
            setEditingLead(undefined);
          }}
        />
      )}
      {deleteLead && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-black text-slate-950">{t("lead.delete.title")}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t("lead.delete.body")}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700" onClick={() => setDeleteLead(undefined)}>
                {t("common.cancel")}
              </button>
              <button
                className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-black text-white"
                onClick={() => {
                  onDelete(deleteLead.id);
                  setDeleteLead(undefined);
                }}
              >
                {t("lead.action.delete")}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function LeadFormModal({
  lead,
  leadTypes,
  leads,
  t,
  onCancel,
  onSave
}: {
  lead: LeadRecord;
  leadTypes: TechnicalLeadType[];
  leads: LeadRecord[];
  t: TranslationFn;
  onCancel: () => void;
  onSave: (lead: LeadRecord) => void;
}) {
  const [draft, setDraft] = useState<LeadRecord>(lead);
  const usedTypeIds = new Set(leads.filter((item) => item.id !== draft.id).map((item) => item.typeId));
  const selectedTypeAlreadyUsed = usedTypeIds.has(draft.typeId);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-slate-950">{t("lead.form.title")}</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <ReadOnlyModalField label={t("lead.id")} value={draft.id} />
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{t("lead.type")}</span>
            <select
              className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#003B83]"
              value={draft.typeId}
              onChange={(event) => setDraft((current) => ({ ...current, typeId: event.target.value }))}
            >
              {leadTypes.map((leadType) => (
                <option key={leadType.id} disabled={usedTypeIds.has(leadType.id)} value={leadType.id}>
                  {t(leadType.labelKey)}
                </option>
              ))}
            </select>
            <span className={`text-xs font-semibold ${selectedTypeAlreadyUsed ? "text-amber-700" : "text-slate-500"}`}>
              {t("lead.duplicateHelper")}
            </span>
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700">
            <input checked={draft.interest} className="size-4 accent-[#003B83]" type="checkbox" onChange={(event) => setDraft((current) => ({ ...current, interest: event.target.checked }))} />
            {t("lead.interest")}
          </label>
          <ReadOnlyModalField label={t("lead.date")} value={formatDate(draft.date)} />
          <LeadInput icon={<UserRound size={16} strokeWidth={2} />} label={t("lead.contact")} value={draft.contactName} onChange={(contactName) => setDraft((current) => ({ ...current, contactName }))} />
          <LeadInput label={t("lead.role")} value={draft.role} onChange={(role) => setDraft((current) => ({ ...current, role }))} />
          <LeadInput icon={<Phone size={16} strokeWidth={2} />} label={t("lead.phone")} value={draft.phone} onChange={(phone) => setDraft((current) => ({ ...current, phone }))} />
          <LeadInput icon={<Smartphone size={16} strokeWidth={2} />} label={t("lead.mobile")} value={draft.mobile} onChange={(mobile) => setDraft((current) => ({ ...current, mobile }))} />
          <LeadInput icon={<Mail size={16} strokeWidth={2} />} label={t("lead.email")} value={draft.email} onChange={(email) => setDraft((current) => ({ ...current, email }))} />
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-black text-slate-700">{t("lead.note")}</span>
            <textarea className="min-h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700" onClick={onCancel}>
            {t("common.cancel")}
          </button>
          <button
            className="min-h-11 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            disabled={selectedTypeAlreadyUsed}
            onClick={() => onSave(draft)}
          >
            {t("salesWizard.save")}
          </button>
        </div>
      </section>
    </div>
  );
}

function LeadInput({ icon, label, value, onChange }: { icon?: ReactNode; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <span className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
        {icon && <span className="text-[#003B83]">{icon}</span>}
        <input className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" value={value} onChange={(event) => onChange(event.target.value)} />
      </span>
    </label>
  );
}

function ReadOnlyModalField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function nextLeadId(leads: LeadRecord[]) {
  const nextNumber = leads.reduce((highest, lead) => {
    const numericPart = Number.parseInt(lead.id.replace(/\D/g, ""), 10);
    return Number.isFinite(numericPart) ? Math.max(highest, numericPart) : highest;
  }, 0) + 1;

  return `LED-${String(nextNumber).padStart(4, "0")}`;
}

function firstAvailableLeadType(leadTypes: TechnicalLeadType[], leads: LeadRecord[]) {
  const usedTypeIds = new Set(leads.map((lead) => lead.typeId));
  return leadTypes.find((leadType) => !usedTypeIds.has(leadType.id))?.id;
}

function leadTypeLabel(leadTypes: TechnicalLeadType[], leadTypeId: string, t: TranslationFn) {
  const leadType = leadTypes.find((item) => item.id === leadTypeId);
  return leadType ? t(leadType.labelKey) : leadTypeId;
}

function currentDateValue() {
  return new Date().toLocaleDateString("en-CA");
}

function currentTimeValue() {
  return new Intl.DateTimeFormat("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("nl-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

function quoteStatusTone(status: QuoteStatus) {
  if (status === "approved") return "green";
  if (status === "rejected" || status === "expired") return "red";
  if (status === "sent") return "blue";
  return "slate";
}

function salesDocumentIcon(type: SalesDocumentRecord["type"]) {
  if (type === "invoice") return <ReceiptText aria-hidden="true" className="text-[#003B83]" size={15} strokeWidth={2} />;
  if (type === "order") return <ShoppingCart aria-hidden="true" className="text-[#003B83]" size={15} strokeWidth={2} />;
  return <RotateCcw aria-hidden="true" className="text-[#003B83]" size={15} strokeWidth={2} />;
}

function remarkTime(value: string) {
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed)) {
    return parsed;
  }

  const [datePart, timePart = "00:00"] = value.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute).getTime();
}

function formatRemarkDateTime(value: string) {
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed)) {
    return new Intl.DateTimeFormat("nl-BE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(parsed));
  }

  return value;
}

function FollowUpTab({ t }: { t: TranslationFn }) {
  const [draft, setDraft] = useState({
    date: currentDateValue(),
    time: currentTimeValue(),
    type: "customer",
    note: ""
  });
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [saved, setSaved] = useState(false);
  const appointmentTypes = [
    { id: "customer", label: t("followUp.type.customer") },
    { id: "prospect", label: t("followUp.type.prospect") },
    { id: "follow_up", label: t("followUp.type.followUp") },
    { id: "demo", label: t("followUp.type.demo") },
    { id: "service_discussion", label: t("followUp.type.serviceDiscussion") }
  ];

  function resetDraft() {
    setDraft({
      date: currentDateValue(),
      time: currentTimeValue(),
      type: "customer",
      note: ""
    });
  }

  function planFollowUp() {
    setFollowUps((current) => [
      {
        id: `FUP-${String(current.length + 1).padStart(4, "0")}`,
        date: draft.date,
        time: draft.time,
        type: appointmentTypes.find((type) => type.id === draft.type)?.label ?? draft.type,
        note: draft.note,
        status: "planned"
      },
      ...current
    ]);
    resetDraft();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return (
    <>
      <FicheCard icon={<CalendarPlus size={21} strokeWidth={2} />} title={t("fiche.followUp.title")}>
        <h4 className="text-base font-black text-slate-950">{t("followUp.newTitle")}</h4>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
              <CalendarDays size={16} strokeWidth={2} className="text-[#003B83]" />
              {t("field.date")}
            </span>
            <input className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" type="date" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
              <Clock size={16} strokeWidth={2} className="text-[#003B83]" />
              {t("followUp.time")}
            </span>
            <input className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" type="time" value={draft.time} onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{t("followUp.appointmentType")}</span>
            <select className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))}>
              {appointmentTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-black text-slate-700">{t("appointment.notes")}</span>
            <textarea className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <ActionButton icon={<X size={16} strokeWidth={2} />} label={t("common.cancel")} tone="secondary" onClick={resetDraft} />
          <ActionButton icon={<Save size={16} strokeWidth={2} />} label={t("followUp.plan")} onClick={planFollowUp} />
        </div>
        <div className="mt-6 grid gap-3">
          <h4 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">{t("followUp.plannedList")}</h4>
          {followUps.length === 0 && (
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">{t("followUp.empty")}</p>
          )}
          {followUps.map((followUp) => (
            <article key={followUp.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 md:grid-cols-5">
                <Field label={t("field.date")} value={formatDate(followUp.date)} />
                <Field label={t("followUp.time")} value={followUp.time} />
                <Field label={t("followUp.appointmentType")} value={followUp.type} />
                <Field label={t("common.status")} value={t("followUp.status.planned")} />
                <Field label={t("appointment.notes")} value={followUp.note || "-"} />
              </div>
            </article>
          ))}
        </div>
      </FicheCard>
      {saved && (
        <div className="fixed bottom-24 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">
          {t("followUp.saved")}
        </div>
      )}
    </>
  );
}

function AddressesSection({ appointment, t }: { appointment: Appointment; t: TranslationFn }) {
  const address = `${appointment.address.line1}, ${appointment.address.postalCode} ${appointment.address.city}`;

  return (
    <div className="grid gap-4">
      <FicheCard icon={<MapPin size={21} strokeWidth={2} />} title={t("fiche.address.official")}>
        <MiniCard title={t("fiche.address.official")} body={address} />
      </FicheCard>
      <div className="grid gap-4 xl:grid-cols-2">
        <FicheCard icon={<MapPin size={21} strokeWidth={2} />} title={t("fiche.address.visit")}>
          <MiniCard title={t("fiche.address.visit")} body={address} />
          <InlineAction label={t("fiche.address.add")} />
        </FicheCard>
        <FicheCard icon={<MapPin size={21} strokeWidth={2} />} title={t("fiche.address.invoice")}>
          <MiniCard title={t("fiche.address.invoice")} body={address} />
          <InlineAction label={t("fiche.address.edit")} />
        </FicheCard>
      </div>
    </div>
  );
}

function FicheCard({ children, icon, title }: { children: ReactNode; icon: ReactNode; title: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-[#003B83]/10 text-[#003B83]">{icon}</span>
        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function TextArea({ label, value }: { label: string; value: string }) {
  return (
    <label className="mt-3 grid gap-2 first:mt-0">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <textarea className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium leading-6 text-slate-700 outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" defaultValue={value} />
    </label>
  );
}

function InputBox({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#003B83] focus:ring-4 focus:ring-blue-100" type={type} />
    </label>
  );
}

function CheckRow({ labels, t }: { labels: string[]; t: TranslationFn }) {
  return (
    <div className="mt-4 grid gap-2">
      {labels.map((label) => (
        <label key={label} className="flex min-h-10 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700">
          <input className="size-4 accent-[#003B83]" type="checkbox" defaultChecked={label.endsWith("q1") || label.endsWith("demoGiven")} />
          {t(label)}
        </label>
      ))}
    </div>
  );
}

function SubtabBar<T extends string>({
  active,
  items,
  t,
  onChange
}: {
  active: T;
  items: Array<{ id: T; key: string }>;
  t: TranslationFn;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      {items.map((item) => (
        <button
          key={item.id}
          className={`min-h-10 rounded-xl px-3 text-sm font-black transition ${
            active === item.id ? "bg-[#003B83] text-white" : "text-slate-600 hover:bg-blue-50 hover:text-[#003B83]"
          }`}
          onClick={() => onChange(item.id)}
        >
          {t(item.key)}
        </button>
      ))}
    </div>
  );
}

function DataTable({ headers, rows, t }: { headers: string[]; rows: string[][]; t: TranslationFn }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                {t(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row) => (
            <tr key={row.join("-")} className="hover:bg-blue-50/40">
              {row.map((cell) => (
                <td key={cell} className="break-words px-3 py-3 font-semibold text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineAction({ label }: { label: string }) {
  return (
    <button className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#002b60]">
      <Plus size={16} strokeWidth={2} />
      {label}
    </button>
  );
}

function HeaderAction({ icon, label, primary, onClick }: { icon: ReactNode; label: string; primary?: boolean; onClick: () => void }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-black transition ${
        primary ? "border-[#003B83] bg-[#003B83] text-white hover:bg-[#002b60]" : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-[#003B83]"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function IconLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="grid min-w-0 grid-cols-[1.25rem_1fr] items-center gap-2">
      <span className="text-[#003B83]">{icon}</span>
      <span className="truncate">{text}</span>
    </span>
  );
}

function MiniCard({ body, title }: { body: string; title: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm font-medium text-slate-600">{body}</p>
    </div>
  );
}

function Timeline({ items, t }: { items: string[]; t?: TranslationFn }) {
  return (
    <ol className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="border-l-2 border-blue-200 pl-3 text-sm font-medium leading-6 text-slate-700">
          {t ? t(item) : item}
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items, t }: { items: string[]; t: TranslationFn }) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
          {t(item)}
        </li>
      ))}
    </ul>
  );
}
