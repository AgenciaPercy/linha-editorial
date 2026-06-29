"use client";

import { useMemo, useState } from "react";
import type { ContentItem, Project } from "@prisma/client";
import { computeSummary } from "@/types";
import SummaryBar from "./SummaryBar";
import FilterBar, { type Filters } from "./FilterBar";
import ContentCard from "./ContentCard";
import { buildReportHtml } from "@/lib/exportReport";

export default function ApprovalApp({
  project,
  initialItems,
  token,
}: {
  project: Project;
  initialItems: ContentItem[];
  token: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [filters, setFilters] = useState<Filters>({ search: "", week: "todas", format: "todos", status: "todos" });
  const [finalizing, setFinalizing] = useState(false);
  const [finalized, setFinalized] = useState(false);

  const summary = useMemo(() => computeSummary(items), [items]);

  const weeks = useMemo(() => Array.from(new Set(items.map((i) => i.week))), [items]);
  const formats = useMemo(() => Array.from(new Set(items.map((i) => i.format))), [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.week !== "todas" && item.week !== filters.week) return false;
      if (filters.format !== "todos" && item.format !== filters.format) return false;
      if (filters.status !== "todos" && item.status !== filters.status) return false;
      if (filters.search) {
        const haystack = `${item.title} ${item.mainIdea} ${item.caption}`.toLowerCase();
        if (!haystack.includes(filters.search.toLowerCase())) return false;
      }
      return true;
    });
  }, [items, filters]);

  const groupedByWeek = useMemo(() => {
    const groups = new Map<string, ContentItem[]>();
    for (const item of filteredItems) {
      const list = groups.get(item.week) || [];
      list.push(item);
      groups.set(item.week, list);
    }
    return Array.from(groups.entries());
  }, [filteredItems]);

  function handleItemChange(updated: ContentItem) {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  async function handleFinalize() {
    setFinalizing(true);
    try {
      const res = await fetch(`/api/projects/${project.slug}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error("Falha ao finalizar");
      const json = await res.json();
      setItems(json.contentItems);
      setFinalized(true);

      const html = buildReportHtml(json.project, json.contentItems, json.summary);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `devolutiva-${project.slug}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setFinalizing(false);
    }
  }

  return (
    <main className="min-h-screen pb-16">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{project.name}</p>
            <h1 className="text-lg font-semibold text-slate-800">{project.title}</h1>
            <p className="text-xs text-slate-400">{project.period}</p>
          </div>
          <button
            type="button"
            onClick={handleFinalize}
            disabled={finalizing}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
          >
            {finalizing ? "Finalizando..." : "Finalizar aprovação"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        {finalized && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Aprovação finalizada e salva. O resumo foi baixado como arquivo HTML.
          </div>
        )}

        <SummaryBar summary={summary} />
        <FilterBar filters={filters} setFilters={setFilters} weeks={weeks} formats={formats} />

        {groupedByWeek.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">Nenhum conteúdo encontrado com os filtros atuais.</p>
        )}

        {groupedByWeek.map(([week, weekItems]) => (
          <section key={week} className="space-y-2">
            <h2 className="px-1 text-sm font-semibold text-slate-500">{week}</h2>
            <div className="space-y-2">
              {weekItems.map((item) => (
                <ContentCard key={item.id} item={item} token={token} openByDefault={false} onChange={handleItemChange} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
