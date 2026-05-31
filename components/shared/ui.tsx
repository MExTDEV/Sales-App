import type { AppointmentStatus } from "@/types/sales";
import { appointmentStatusTone, type SharedStatusTone } from "@/domain/shared/statuses";

export type BadgeTone = SharedStatusTone;

export function Badge({ children, tone }: { children: React.ReactNode; tone: BadgeTone }) {
  const tones: Record<BadgeTone, string> = {
    blue: "bg-blue-50 text-[#003B83] ring-blue-200",
    green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    orange: "bg-orange-50 text-orange-800 ring-orange-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    red: "bg-red-50 text-red-800 ring-red-200"
  };

  return <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-[0.68rem] font-black uppercase tracking-wide ring-1 ${tones[tone]}`}>{children}</span>;
}

export function StatusBadge({ label, status }: { label: string; status: AppointmentStatus }) {
  return <Badge tone={appointmentStatusTone[status]}>{label}</Badge>;
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <h3 className="font-bold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-1 text-sm sm:grid-cols-[9rem_1fr]">
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

export function ActionButton({ label, onClick, tone = "default" }: { label: string; onClick: () => void; tone?: "default" | "primary" | "danger" }) {
  const styles = {
    default: "border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md",
    primary: "border-[#003B83] bg-[#003B83] text-white hover:bg-[#002b60] hover:shadow-lg",
    danger: "border-red-200 bg-red-50 text-red-800 hover:bg-red-100 hover:shadow-md"
  };

  return (
    <button
      className={`min-h-12 rounded-lg border px-4 text-left text-sm font-bold shadow-sm transition ${styles[tone]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function SelectField({
  children,
  label,
  onChange,
  value
}: {
  children: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <select
        className="min-h-12 rounded-md border border-slate-300 bg-white px-3"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}
