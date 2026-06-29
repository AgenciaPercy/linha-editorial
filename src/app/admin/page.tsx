"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch, getAdminPassword, setAdminPassword } from "@/lib/adminClient";

type ProjectListItem = {
  id: string;
  name: string;
  slug: string;
  token: string;
  title: string;
  period: string;
  status: string;
  _count: { contentItems: number };
};

export default function AdminPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({ name: "", title: "", period: "" });
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    setPassword(getAdminPassword());
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const json = await adminFetch("/api/admin/projects");
      setProjects(json.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  function savePassword() {
    setAdminPassword(password);
    load();
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await adminFetch("/api/admin/projects", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", title: "", period: "" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar projeto");
    }
  }

  async function duplicateProject(id: string) {
    await adminFetch(`/api/admin/projects/${id}/duplicate`, { method: "POST" });
    load();
  }

  async function deleteProject(id: string) {
    if (!confirm("Excluir este projeto e todos os conteúdos? Esta ação não pode ser desfeita.")) return;
    await adminFetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    load();
  }

  function copyLink(project: ProjectListItem) {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${base}/aprovacao/${project.slug}?token=${project.token}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(project.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-800">Admin · Projetos</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-600">Senha de admin (opcional, ADMIN_PASSWORD)</h2>
        <div className="flex gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Deixe vazio se ADMIN_PASSWORD não estiver configurada"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button onClick={savePassword} className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white">
            Salvar
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-600">Novo projeto</h2>
        <form onSubmit={createProject} className="grid gap-2 sm:grid-cols-3">
          <input
            required
            placeholder="Nome do cliente"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Título da linha editorial"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Período (ex: Julho/2026)"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button type="submit" className="col-span-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white sm:w-fit">
            Criar projeto
          </button>
        </form>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="space-y-2">
        {loading && <p className="text-sm text-slate-400">Carregando...</p>}
        {!loading &&
          projects.map((project) => (
            <div key={project.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div>
                <p className="font-medium text-slate-800">{project.name}</p>
                <p className="text-sm text-slate-500">
                  {project.title} · {project.period} · {project._count.contentItems} conteúdos
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => copyLink(project)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
                  {copiedSlug === project.slug ? "Copiado!" : "Copiar link"}
                </button>
                <Link href={`/admin/${project.id}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
                  Editar
                </Link>
                <button onClick={() => duplicateProject(project.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
                  Duplicar
                </button>
                <button onClick={() => deleteProject(project.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                  Excluir
                </button>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}
