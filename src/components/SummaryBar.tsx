import type { ProjectSummary } from "@/types";

export default function SummaryBar({ summary }: { summary: ProjectSummary }) {
  const stats = [
    { label: "Total", value: summary.total, color: "text-slate-700" },
    { label: "Aprovados", value: summary.aprovados, color: "text-green-600" },
    { label: "Ajustar", value: summary.ajustar, color: "text-amber-600" },
    { label: "Não usar", value: summary.naoUsar, color: "text-red-600" },
    { label: "Pendentes", value: summary.pendentes, color: "text-slate-500" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className={`text-lg font-semibold ${s.color}`}>{s.value}</span>
              <span className="text-sm text-slate-500">{s.label}</span>
            </div>
          ))}
        </div>
        <span className="text-sm font-medium text-slate-600">
          {summary.respondidos} de {summary.total} respondidos · {summary.progresso}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${summary.progresso}%` }}
        />
      </div>
    </div>
  );
}
