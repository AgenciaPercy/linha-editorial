"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { adminFetch } from "@/lib/adminClient";
import type { ContentItem, Project } from "@prisma/client";

type ContentForm = {
  week: string;
  month: string;
  format: string;
  title: string;
  pillar: string;
  objective: string;
  mainIdea: string;
  artText: string;
  caption: string;
  visualSuggestion: string;
  clientValidationPoint: string;
  cta: string;
  hashtags: string;
};

const EMPTY_FORM: ContentForm = {
  week: "",
  month: "",
  format: "",
  title: "",
  pillar: "",
  objective: "",
  mainIdea: "",
  artText: "",
  caption: "",
  visualSuggestion: "",
  clientValidationPoint: "",
  cta: "",
  hashtags: "",
};

export default function AdminProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContentForm>(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setError("");
    try {
      const json = await adminFetch(`/api/admin/projects/${id}`);
      setProject(json.project);
      setItems(json.project.contentItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    }
  }

  function startCreate() {
    setEditingId("new");
    setForm(EMPTY_FORM);
  }

  function startEdit(item: ContentItem) {
    setEditingId(item.id);
    setForm({
      week: item.week,
      month: item.month,
      format: item.format,
      title: item.title,
      pillar: item.pillar,
      objective: item.objective,
      mainIdea: item.mainIdea,
      artText: item.artText,
      caption: item.caption,
      visualSuggestion: item.visualSuggestion,
      clientValidationPoint: item.clientValidationPoint,
      cta: item.cta,
      hashtags: item.hashtags.join(", "),
    });
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const hashtags = form.hashtags
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    if (hashtags.length !== 5) {
      setError("São necessárias exatamente 5 hashtags (separadas por vírgula)");
      return;
    }

    try {
      if (editingId === "new") {
        await adminFetch("/api/admin/content", {
          method: "POST",
          body: JSON.stringify({ ...form, hashtags, projectId: id }),
        });
      } else if (editingId) {
        await adminFetch(`/api/admin/content/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify({ ...form, hashtags }),
        });
      }
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar conteúdo");
    }
  }

  async function deleteItem(itemId: string) {
    if (!confirm("Excluir este conteúdo?")) return;
    await adminFetch(`/api/admin/content/${itemId}`, { method: "DELETE" });
    load();
  }

  if (!project) {
    return <main className="mx-auto max-w-4xl px-4 py-8 text-sm text-slate-400">{error || "Carregando..."}</main>;
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Link href="/admin" className="text-sm text-brand-600">
        ← Voltar
      </Link>
      <h1 className="text-xl font-semibold text-slate-800">{project.name}</h1>
      <p className="text-sm text-slate-500">
        {project.title} · {project.period} · slug: <code>{project.slug}</code>
      </p>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-600">Conteúdos ({items.length})</h2>
        <button onClick={startCreate} className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white">
          + Novo conteúdo
        </button>
      </div>

      {editingId && (
        <form onSubmit={submitForm} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">
            {editingId === "new" ? "Novo conteúdo" : "Editar conteúdo"}
          </h3>
          <div className="grid gap-2 sm:grid-cols-3">
            <LabeledInput label="Semana" value={form.week} onChange={(v) => setForm({ ...form, week: v })} required />
            <LabeledInput label="Mês/período" value={form.month} onChange={(v) => setForm({ ...form, month: v })} />
            <LabeledInput label="Formato" value={form.format} onChange={(v) => setForm({ ...form, format: v })} />
          </div>
          <LabeledInput label="Título/headline" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
          <div className="grid gap-2 sm:grid-cols-2">
            <LabeledInput label="Pilar" value={form.pillar} onChange={(v) => setForm({ ...form, pillar: v })} />
            <LabeledInput label="Objetivo" value={form.objective} onChange={(v) => setForm({ ...form, objective: v })} />
          </div>
          <LabeledTextarea label="Ideia principal" value={form.mainIdea} onChange={(v) => setForm({ ...form, mainIdea: v })} />
          <LabeledTextarea label="Texto da arte / páginas do carrossel" value={form.artText} onChange={(v) => setForm({ ...form, artText: v })} />
          <LabeledTextarea label="Legenda" value={form.caption} onChange={(v) => setForm({ ...form, caption: v })} />
          <LabeledTextarea label="Visual sugerido" value={form.visualSuggestion} onChange={(v) => setForm({ ...form, visualSuggestion: v })} />
          <LabeledTextarea
            label="Ponto de validação do cliente"
            value={form.clientValidationPoint}
            onChange={(v) => setForm({ ...form, clientValidationPoint: v })}
          />
          <LabeledInput label="CTA" value={form.cta} onChange={(v) => setForm({ ...form, cta: v })} />
          <LabeledInput
            label="Hashtags (exatamente 5, separadas por vírgula)"
            value={form.hashtags}
            onChange={(v) => setForm({ ...form, hashtags: v })}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
              Salvar
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">
                {item.week} · {item.title}
              </p>
              <p className="text-xs text-slate-500">{item.format} · status: {item.status}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
                Editar
              </button>
              <button onClick={() => deleteItem(item.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />
    </label>
  );
}

function LabeledTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />
    </label>
  );
}
