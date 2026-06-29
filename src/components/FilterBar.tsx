import { STATUS_LABELS } from "@/types";
import type { ContentStatus } from "@/types";

export type Filters = {
  search: string;
  week: string;
  format: string;
  status: ContentStatus | "todos";
};

export default function FilterBar({
  filters,
  setFilters,
  weeks,
  formats,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  weeks: string[];
  formats: string[];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder="Buscar por título, ideia ou legenda..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      <select
        value={filters.week}
        onChange={(e) => setFilters({ ...filters, week: e.target.value })}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
      >
        <option value="todas">Todas as semanas</option>
        {weeks.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
      <select
        value={filters.format}
        onChange={(e) => setFilters({ ...filters, format: e.target.value })}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
      >
        <option value="todos">Todos os formatos</option>
        {formats.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value as Filters["status"] })}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
      >
        <option value="todos">Todos os status</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
