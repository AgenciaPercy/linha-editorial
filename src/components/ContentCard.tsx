"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { ContentItem, ContentStatus, DecisionStatus } from "@prisma/client";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import SaveIndicator, { type SaveState } from "./SaveIndicator";
import ImageUploadField from "./ImageUploadField";

type Props = {
  item: ContentItem;
  token: string;
  openByDefault: boolean;
  onChange: (item: ContentItem) => void;
};

async function patchContent(id: string, token: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/content/${id}?token=${encodeURIComponent(token)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao salvar");
  const json = await res.json();
  return json.contentItem as ContentItem;
}

export default function ContentCard({ item, token, openByDefault, onChange }: Props) {
  const [open, setOpen] = useState(openByDefault);
  const [legendRequest, setLegendRequest] = useState(item.legendRequest);
  const [designRequest, setDesignRequest] = useState(item.designRequest);
  const [generalNotes, setGeneralNotes] = useState(item.generalNotes);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    setLegendRequest(item.legendRequest);
    setDesignRequest(item.designRequest);
    setGeneralNotes(item.generalNotes);
  }, [item.id]);

  async function save(data: Record<string, unknown>) {
    setSaveState("saving");
    try {
      const updated = await patchContent(item.id, token, data);
      onChange(updated);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  }

  const debouncedLegendRequest = useDebouncedCallback((value: string) => save({ legendRequest: value }), 800);
  const debouncedDesignRequest = useDebouncedCallback((value: string) => save({ designRequest: value }), 800);
  const debouncedGeneralNotes = useDebouncedCallback((value: string) => save({ generalNotes: value }), 800);

  async function handleUpload(side: "agency" | "client", file: File) {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("contentId", item.id);
    formData.append("side", side);
    formData.append("file", file);
    setSaveState("saving");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Falha no upload");
      const json = await res.json();
      onChange(json.contentItem);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  }

  async function handleRemoveImage(side: "agency" | "client") {
    setSaveState("saving");
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, contentId: item.id, side }),
      });
      if (!res.ok) throw new Error("Falha ao remover");
      const json = await res.json();
      onChange(json.contentItem);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-slate-50"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {item.week}
          </span>
          <span className="truncate font-medium text-slate-800">{item.title}</span>
          <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{item.format}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[item.status]}`}>
            {STATUS_LABELS[item.status]}
          </span>
          <span className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>

      {open && (
        <div className="space-y-5 border-t border-slate-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {item.month} · Pilar: {item.pillar}
            </span>
            <SaveIndicator state={saveState} />
          </div>

          <section className="grid gap-4 sm:grid-cols-2">
            <Field label="Objetivo" value={item.objective} />
            <Field label="CTA" value={item.cta} />
          </section>

          <Field label="Ideia principal" value={item.mainIdea} block />
          <Field label="Texto da arte / páginas do carrossel" value={item.artText} block />
          <Field label="Legenda sugerida" value={item.caption} block />
          <Field label="Visual sugerido" value={item.visualSuggestion} block />
          <Field label="Ponto de validação do cliente" value={item.clientValidationPoint} block highlight />

          <div className="flex flex-wrap gap-2">
            {item.hashtags.map((tag) => (
              <span key={tag} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>

          <section className="grid gap-4 sm:grid-cols-2">
            <ImageUploadField
              label="Imagem/referência da agência"
              imageUrl={item.agencyImageUrl}
              onUpload={(file) => handleUpload("agency", file)}
              onRemove={() => handleRemoveImage("agency")}
            />
            <ImageUploadField
              label="Imagem/referência do cliente"
              imageUrl={item.clientImageUrl}
              onUpload={(file) => handleUpload("client", file)}
              onRemove={() => handleRemoveImage("client")}
            />
          </section>

          <DecisionBlock
            title="Legenda"
            decision={item.legendDecision}
            onDecide={(d) => save({ legendDecision: d })}
            requestValue={legendRequest}
            onRequestChange={(v) => {
              setLegendRequest(v);
              debouncedLegendRequest(v);
            }}
            placeholder="Escreva aqui sua solicitação para a legenda"
          />

          <DecisionBlock
            title="Design"
            decision={item.designDecision}
            onDecide={(d) => save({ designDecision: d })}
            requestValue={designRequest}
            onRequestChange={(v) => {
              setDesignRequest(v);
              debouncedDesignRequest(v);
            }}
            placeholder="Escreva aqui sua solicitação para o design"
          />

          <section className="rounded-lg border border-slate-200 p-3">
            <h4 className="mb-2 text-sm font-semibold text-slate-700">Status final</h4>
            <div className="flex flex-wrap gap-2">
              <StatusButton
                label="Aprovado"
                active={item.status === "aprovado"}
                activeClass="bg-green-600 text-white border-green-600"
                onClick={() => save({ status: "aprovado" as ContentStatus })}
              />
              <StatusButton
                label="Precisa ajustar"
                active={item.status === "ajustar"}
                activeClass="bg-amber-500 text-white border-amber-500"
                onClick={() => save({ status: "ajustar" as ContentStatus })}
              />
              <StatusButton
                label="Não usar agora"
                active={item.status === "nao_usar"}
                activeClass="bg-red-600 text-white border-red-600"
                onClick={() => save({ status: "nao_usar" as ContentStatus })}
              />
            </div>
          </section>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Observações gerais</label>
            <textarea
              value={generalNotes}
              onChange={(e) => {
                setGeneralNotes(e.target.value);
                debouncedGeneralNotes(e.target.value);
              }}
              placeholder="Observações adicionais sobre este conteúdo"
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, block, highlight }: { label: string; value: string; block?: boolean; highlight?: boolean }) {
  return (
    <div className={block ? "" : ""}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <p className={`text-sm text-slate-700 ${highlight ? "rounded-lg bg-amber-50 p-2 text-amber-800" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function StatusButton({
  label,
  active,
  activeClass,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
        active ? activeClass : "border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function DecisionBlock({
  title,
  decision,
  onDecide,
  requestValue,
  onRequestChange,
  placeholder,
}: {
  title: string;
  decision: DecisionStatus;
  onDecide: (d: DecisionStatus) => void;
  requestValue: string;
  onRequestChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 p-3">
      <h4 className="mb-2 text-sm font-semibold text-slate-700">{title}</h4>
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => onDecide("manter")}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
            decision === "manter" ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Manter
        </button>
        <button
          type="button"
          onClick={() => onDecide("alterar")}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
            decision === "alterar" ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Alterar
        </button>
      </div>
      {decision === "alterar" && (
        <textarea
          value={requestValue}
          onChange={(e) => onRequestChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      )}
    </section>
  );
}
