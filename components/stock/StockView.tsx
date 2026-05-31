"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  Boxes,
  CalendarDays,
  CircleAlert,
  Package,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  X
} from "lucide-react";
import { Badge } from "@/components/shared/ui";
import type { MockUser, TranslationFn } from "@/types/sales";

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

type StockItem = {
  id: string;
  itemNo: string;
  description: string;
  category: string;
  quantity: number;
  minimumQuantity: number;
  lastChanged: string;
  lastSale: string;
  lastSync: string;
};

type TransferStatus = "requested" | "approved" | "rejected" | "executed";

type TransferRequest = {
  id: string;
  date: string;
  itemNo: string;
  description: string;
  quantity: number;
  reason: string;
  desiredDate: string;
  status: TransferStatus;
};

const stockItems: StockItem[] = [
  { id: "stk-1", itemNo: "EHBO-10", description: "EHBO koffer horeca", category: "EHBO", quantity: 3, minimumQuantity: 2, lastChanged: "2026-05-29 15:20", lastSale: "2026-05-20", lastSync: "2026-05-30 07:26" },
  { id: "stk-2", itemNo: "REFILL-01", description: "Refill set verbandmateriaal", category: "EHBO", quantity: 12, minimumQuantity: 5, lastChanged: "2026-05-28 09:10", lastSale: "2026-05-24", lastSync: "2026-05-30 07:26" },
  { id: "stk-3", itemNo: "AED-BATT", description: "AED batterij pack", category: "AED", quantity: 0, minimumQuantity: 2, lastChanged: "2026-05-27 13:45", lastSale: "2026-05-21", lastSync: "2026-05-30 07:26" },
  { id: "stk-4", itemNo: "FIRE-2KG", description: "Brandblusser 2 kg schuim", category: "Brandbestrijding", quantity: 1, minimumQuantity: 3, lastChanged: "2026-05-26 16:05", lastSale: "2026-05-18", lastSync: "2026-05-30 07:26" },
  { id: "stk-5", itemNo: "SAFETY-SIGN", description: "Veiligheidspictogram nooduitgang", category: "Signalisatie", quantity: 20, minimumQuantity: 8, lastChanged: "2026-05-25 11:12", lastSale: "2026-05-22", lastSync: "2026-05-30 07:26" },
  { id: "stk-6", itemNo: "AED-PAD", description: "AED elektroden volwassenen", category: "AED", quantity: 2, minimumQuantity: 4, lastChanged: "2026-05-24 10:55", lastSale: "2026-05-19", lastSync: "2026-05-30 07:26" }
];

export function StockView({ lastSync, t, user }: { lastSync: string; t: TranslationFn; user: MockUser }) {
  const [articleSearch, setArticleSearch] = useState("");
  const [descriptionSearch, setDescriptionSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailItem, setDetailItem] = useState<StockItem | undefined>();
  const [transferItem, setTransferItem] = useState<StockItem | undefined>();
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([
    {
      id: "TRF-0001",
      date: "2026-05-29",
      itemNo: "AED-PAD",
      description: "AED elektroden volwassenen",
      quantity: 2,
      reason: "Minimumvoorraad bereikt",
      desiredDate: "2026-06-03",
      status: "requested"
    }
  ]);
  const [successOpen, setSuccessOpen] = useState(false);
  const categories = Array.from(new Set(stockItems.map((item) => item.category)));
  const filteredItems = useMemo(
    () =>
      stockItems.filter((item) => {
        const status = stockStatus(item);
        return (
          item.itemNo.toLowerCase().includes(articleSearch.toLowerCase()) &&
          item.description.toLowerCase().includes(descriptionSearch.toLowerCase()) &&
          (categoryFilter === "all" || item.category === categoryFilter) &&
          (statusFilter === "all" || status === statusFilter)
        );
      }),
    [articleSearch, categoryFilter, descriptionSearch, statusFilter]
  );
  const lowStockCount = stockItems.filter((item) => stockStatus(item) !== "in_stock").length;

  function saveTransferRequest(request: TransferRequest) {
    setTransferRequests((current) => [request, ...current]);
    setTransferItem(undefined);
    setSuccessOpen(true);
    window.setTimeout(() => setSuccessOpen(false), 2600);
  }

  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(0,59,131,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#003B83] via-[#0054b8] to-sky-300" />
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#003B83]">{t("stock.title")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{t("nav.inventory")}</h2>
            <p className="mt-2 text-sm font-bold text-slate-500">{user.name} - {user.establishmentNumber}</p>
          </div>
          <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#003B83]">
            <Boxes aria-hidden="true" size={24} strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StockMetric label={t("stock.location")} value={user.establishmentNumber} />
        <StockMetric label={t("sync.lastSync")} value={lastSync} />
        <StockMetric label={t("stock.totalItems")} value={String(stockItems.length)} />
        <StockMetric label={t("stock.lowStockCount")} value={String(lowStockCount)} warning={lowStockCount > 0} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#003B83]/10 text-[#003B83]">
            <SlidersHorizontal aria-hidden="true" size={20} strokeWidth={2} />
          </span>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">{t("stock.filters")}</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FilterInput icon={<Search size={16} strokeWidth={2} />} label={t("stock.searchArticleNo")} value={articleSearch} onChange={setArticleSearch} />
          <FilterInput icon={<Search size={16} strokeWidth={2} />} label={t("stock.searchDescription")} value={descriptionSearch} onChange={setDescriptionSearch} />
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{t("stock.category")}</span>
            <select className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83]" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">{t("common.all")}</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{t("common.status")}</span>
            <select className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83]" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">{t("common.all")}</option>
              <option value="in_stock">{t("stock.status.in_stock")}</option>
              <option value="low_stock">{t("stock.status.low_stock")}</option>
              <option value="out_of_stock">{t("stock.status.out_of_stock")}</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-600">{t("stock.tableTitle")}</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["stock.articleNo", "stock.description", "stock.category", "stock.quantity", "stock.minimumQuantity", "common.status", "fiche.table.actions"].map((header) => (
                  <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40">
                  <td className="break-words px-3 py-3 font-black text-slate-950">{item.itemNo}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.description}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.category}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.quantity}</td>
                  <td className="break-words px-3 py-3 font-semibold text-slate-700">{item.minimumQuantity}</td>
                  <td className="break-words px-3 py-3"><StockStatusBadge status={stockStatus(item)} t={t} /></td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <TableButton label={t("stock.openDetail")} onClick={() => setDetailItem(item)} />
                      <TableButton icon={<ArrowRightLeft size={14} strokeWidth={2} />} label={t("stock.transfer.request")} onClick={() => setTransferItem(item)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <TransferRequestsTable requests={transferRequests} t={t} />

      {detailItem && <StockDetailModal item={detailItem} onClose={() => setDetailItem(undefined)} t={t} />}
      {transferItem && (
        <TransferRequestModal
          item={transferItem}
          nextId={`TRF-${String(transferRequests.length + 1).padStart(4, "0")}`}
          onCancel={() => setTransferItem(undefined)}
          onSave={saveTransferRequest}
          t={t}
        />
      )}
      {successOpen && (
        <div className="fixed bottom-24 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg">
          {t("stock.transfer.saved")}
        </div>
      )}
    </section>
  );
}

function StockMetric({ label, value, warning }: { label: string; value: string; warning?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/60 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-black tracking-tight ${warning ? "text-amber-700" : "text-slate-950"}`}>{value}</p>
    </div>
  );
}

function FilterInput({ icon, label, onChange, value }: { icon: React.ReactNode; label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <span className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[#003B83]">
        {icon}
        <input className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-950 outline-none" value={value} onChange={(event) => onChange(event.target.value)} />
      </span>
    </label>
  );
}

function StockStatusBadge({ status, t }: { status: StockStatus; t: TranslationFn }) {
  const tone = status === "in_stock" ? "green" : status === "low_stock" ? "amber" : "red";
  const Icon = status === "in_stock" ? Package : status === "low_stock" ? TriangleAlert : CircleAlert;
  return (
    <Badge tone={tone}>
      <span className="inline-flex items-center gap-1.5">
        <Icon aria-hidden="true" size={13} strokeWidth={2} />
        {t(`stock.status.${status}`)}
      </span>
    </Badge>
  );
}

function TableButton({ icon, label, onClick }: { icon?: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-blue-50 hover:text-[#003B83]" onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function StockDetailModal({ item, onClose, t }: { item: StockItem; onClose: () => void; t: TranslationFn }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-black text-slate-950">{item.description}</h3>
          <button className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" onClick={onClose}>
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <DetailField label={t("stock.articleNo")} value={item.itemNo} />
          <DetailField label={t("stock.description")} value={item.description} />
          <DetailField label={t("stock.category")} value={item.category} />
          <DetailField label={t("stock.quantity")} value={String(item.quantity)} />
          <DetailField label={t("stock.minimumQuantity")} value={String(item.minimumQuantity)} />
          <DetailField label={t("stock.lastChanged")} value={item.lastChanged} />
          <DetailField label={t("stock.lastSale")} value={item.lastSale} />
          <DetailField label={t("sync.lastSync")} value={item.lastSync} />
        </div>
      </section>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function TransferRequestModal({
  item,
  nextId,
  onCancel,
  onSave,
  t
}: {
  item: StockItem;
  nextId: string;
  onCancel: () => void;
  onSave: (request: TransferRequest) => void;
  t: TranslationFn;
}) {
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [desiredDate, setDesiredDate] = useState(currentDateValue());

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-slate-950">{t("stock.transfer.request")}</h3>
        <div className="mt-5 grid gap-3">
          <DetailField label={t("stock.article")} value={`${item.itemNo} - ${item.description}`} />
          <DetailField label={t("stock.currentStock")} value={String(item.quantity)} />
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{t("stock.requestedQuantity")}</span>
            <input className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83]" min="1" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{t("stock.reason")}</span>
            <textarea className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#003B83]" value={reason} onChange={(event) => setReason(event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">{t("stock.desiredDate")}</span>
            <input className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-[#003B83]" type="date" value={desiredDate} onChange={(event) => setDesiredDate(event.target.value)} />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50" onClick={onCancel}>{t("common.cancel")}</button>
          <button
            className="min-h-11 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white hover:bg-[#002b60]"
            onClick={() =>
              onSave({
                id: nextId,
                date: currentDateValue(),
                itemNo: item.itemNo,
                description: item.description,
                quantity: Number(quantity) || 1,
                reason,
                desiredDate,
                status: "requested"
              })
            }
          >
            {t("stock.transfer.register")}
          </button>
        </div>
      </section>
    </div>
  );
}

function TransferRequestsTable({ requests, t }: { requests: TransferRequest[]; t: TranslationFn }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-600">{t("stock.transfer.mine")}</h3>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["field.date", "stock.article", "stock.requestedQuantity", "common.status", "stock.reason"].map((header) => (
                <th key={header} className="break-words px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{t(header)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="break-words px-3 py-3 font-semibold text-slate-700">{request.date}</td>
                <td className="break-words px-3 py-3 font-black text-slate-950">{request.itemNo}</td>
                <td className="break-words px-3 py-3 font-semibold text-slate-700">{request.quantity}</td>
                <td className="break-words px-3 py-3"><Badge tone={transferTone(request.status)}>{t(`stock.transfer.status.${request.status}`)}</Badge></td>
                <td className="break-words px-3 py-3 font-semibold text-slate-700">{request.reason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function stockStatus(item: StockItem): StockStatus {
  if (item.quantity <= 0) return "out_of_stock";
  if (item.quantity <= item.minimumQuantity) return "low_stock";
  return "in_stock";
}

function transferTone(status: TransferStatus) {
  if (status === "approved" || status === "executed") return "green";
  if (status === "rejected") return "red";
  return "blue";
}

function currentDateValue() {
  return new Date().toLocaleDateString("en-CA");
}
