"use client";

import { PackageCheck, ReceiptText, Save, Search, ShoppingCart, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { SalesRevenueUpdate, TranslationFn } from "@/types/sales";

type ResultType = "invoice" | "order" | "delivered_order";

type Article = {
  id: string;
  number: string;
  description: string;
  price: number;
  stock: number;
  resource?: boolean;
};

type SalesLine = {
  id: string;
  article: Article;
  quantity: number;
  price: number;
  discount: number;
  resultType: ResultType;
};

const articles: Article[] = [
  { id: "a-1", number: "EHBO-10", description: "EHBO koffer horeca", price: 160, stock: 3 },
  { id: "a-2", number: "REFILL-01", description: "Refill set verbandmateriaal", price: 42.5, stock: 12 },
  { id: "a-3", number: "AED-BATT", description: "AED batterij pack", price: 189, stock: 0 },
  { id: "a-4", number: "FIRE-2KG", description: "Brandblusser 2 kg schuim", price: 74.95, stock: 4 },
  { id: "a-5", number: "TRAIN-BHV", description: "Opleiding basis hulpverlening", price: 325, stock: 0, resource: true },
  { id: "a-6", number: "SAFETY-SIGN", description: "Veiligheidspictogram nooduitgang", price: 12.5, stock: 20 }
];

export function SalesWizard({
  t,
  onCancel,
  onSave
}: {
  t: TranslationFn;
  onCancel: () => void;
  onSave: (revenue: SalesRevenueUpdate) => void;
}) {
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState<SalesLine[]>([]);
  const [resourceNoticeOpen, setResourceNoticeOpen] = useState(false);
  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return articles;
    }

    return articles.filter((article) =>
      `${article.number} ${article.description}`.toLowerCase().includes(normalized)
    );
  }, [query]);
  const totals = calculateTotals(lines);

  function addArticle(article: Article) {
    if (article.resource) {
      setResourceNoticeOpen(true);
    }

    setLines((current) => [
      ...current,
      {
        id: `line-${Date.now()}-${article.id}`,
        article,
        quantity: 1,
        price: article.price,
        discount: 0,
        resultType: article.stock > 0 ? "invoice" : "order"
      }
    ]);
  }

  function updateLine(id: string, patch: Partial<Omit<SalesLine, "id" | "article">>) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  function removeLine(id: string) {
    setLines((current) => current.filter((line) => line.id !== id));
  }

  function handleSave() {
    onSave({
      invoiceRevenue: totals.invoice + totals.deliveredOrder,
      orderRevenue: totals.order
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
      <section className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#003B83]">{t("salesWizard.title")}</p>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{t("salesWizard.articleSales")}</h3>
          </div>
          <button className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50" onClick={onCancel}>
            <X aria-hidden="true" size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[20rem_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700">{t("salesWizard.search")}</span>
              <span className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
                <Search aria-hidden="true" className="text-[#003B83]" size={18} strokeWidth={2} />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                  placeholder={t("salesWizard.searchPlaceholder")}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </span>
            </label>
            <div className="mt-4 grid gap-2">
              {filteredArticles.map((article) => (
                <button
                  key={article.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  onClick={() => addArticle(article)}
                >
                  <p className="text-sm font-black text-slate-950">{article.number}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-600">{article.description}</p>
                  <p className="mt-1 text-xs font-bold text-[#003B83]">{formatEuro(article.price)} | {t("salesWizard.stock")}: {article.stock}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-4">
            <SalesLinesTable lines={lines} t={t} onRemove={removeLine} onUpdate={updateLine} />
            <TotalsBlock totals={totals} t={t} />
          </section>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50" onClick={onCancel}>
            <X aria-hidden="true" size={16} strokeWidth={2} />
            {t("common.cancel")}
          </button>
          <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003B83] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#002b60]" onClick={handleSave}>
            <Save aria-hidden="true" size={16} strokeWidth={2} />
            {t("salesWizard.save")}
          </button>
        </div>

        {resourceNoticeOpen && (
          <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/40 p-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-2xl">
              <h4 className="text-lg font-black text-slate-950">{t("salesWizard.resource.title")}</h4>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{t("salesWizard.resource.body")}</p>
              <button className="mt-5 min-h-11 rounded-xl bg-[#003B83] px-5 text-sm font-black text-white" onClick={() => setResourceNoticeOpen(false)}>
                {t("common.ok")}
              </button>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}

function SalesLinesTable({
  lines,
  t,
  onRemove,
  onUpdate
}: {
  lines: SalesLine[];
  t: TranslationFn;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<SalesLine, "id" | "article">>) => void;
}) {
  if (lines.length === 0) {
    return (
      <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
        <p className="text-sm font-bold text-slate-500">{t("salesWizard.empty")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {["salesWizard.articleNo", "salesWizard.description", "salesWizard.quantity", "salesWizard.unitPrice", "salesWizard.discount", "salesWizard.total", "salesWizard.result", "fiche.table.actions"].map((key) => (
              <th key={key} className="break-words px-2 py-3 text-[0.65rem] font-black uppercase tracking-wide text-slate-500">
                {t(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {lines.map((line) => (
            <tr key={line.id}>
              <td className="break-words px-2 py-3 font-black text-slate-950">{line.article.number}</td>
              <td className="break-words px-2 py-3 font-semibold text-slate-700">{line.article.description}</td>
              <td className="px-2 py-3">
                <NumberInput value={line.quantity} onChange={(quantity) => onUpdate(line.id, { quantity })} />
              </td>
              <td className="px-2 py-3">
                <NumberInput value={line.price} onChange={(price) => onUpdate(line.id, { price })} />
              </td>
              <td className="px-2 py-3">
                <NumberInput value={line.discount} onChange={(discount) => onUpdate(line.id, { discount })} />
              </td>
              <td className="break-words px-2 py-3 font-black text-slate-950">{formatEuro(lineTotal(line))}</td>
              <td className="px-2 py-3">
                <select
                  className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold outline-none focus:border-[#003B83]"
                  value={line.resultType}
                  onChange={(event) => onUpdate(line.id, { resultType: event.target.value as ResultType })}
                >
                  <option value="invoice">{t("salesWizard.result.invoice")}</option>
                  <option value="order">{t("salesWizard.result.order")}</option>
                  <option value="delivered_order">{t("salesWizard.result.deliveredOrder")}</option>
                </select>
              </td>
              <td className="px-2 py-3">
                <button className="grid size-10 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100" onClick={() => onRemove(line.id)}>
                  <Trash2 aria-hidden="true" size={16} strokeWidth={2} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TotalsBlock({ totals, t }: { totals: ReturnType<typeof calculateTotals>; t: TranslationFn }) {
  const items = [
    { icon: ReceiptText, label: t("salesWizard.totalInvoice"), value: totals.invoice },
    { icon: ShoppingCart, label: t("salesWizard.totalOrder"), value: totals.order },
    { icon: PackageCheck, label: t("salesWizard.totalDeliveredOrder"), value: totals.deliveredOrder },
    { icon: Save, label: t("salesWizard.grandTotal"), value: totals.grandTotal }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/60 p-4">
            <div className="flex items-center gap-2 text-[#003B83]">
              <Icon aria-hidden="true" size={18} strokeWidth={2} />
              <p className="text-[0.68rem] font-black uppercase tracking-wide text-slate-500">{item.label}</p>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-950">{formatEuro(item.value)}</p>
          </div>
        );
      })}
    </div>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <input
      className="min-h-10 w-full rounded-lg border border-slate-200 px-2 text-sm font-bold outline-none focus:border-[#003B83]"
      min={0}
      step="0.01"
      type="number"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

function lineTotal(line: SalesLine) {
  const subtotal = line.quantity * line.price;
  return Math.max(0, subtotal - subtotal * (line.discount / 100));
}

function calculateTotals(lines: SalesLine[]) {
  return lines.reduce(
    (totals, line) => {
      const total = lineTotal(line);
      if (line.resultType === "invoice") {
        totals.invoice += total;
      } else if (line.resultType === "order") {
        totals.order += total;
      } else {
        totals.deliveredOrder += total;
      }
      totals.grandTotal += total;
      return totals;
    },
    { invoice: 0, order: 0, deliveredOrder: 0, grandTotal: 0 }
  );
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}
