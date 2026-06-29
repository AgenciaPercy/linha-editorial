"use client";

import { useRef, useState } from "react";

export default function ImageUploadField({
  label,
  imageUrl,
  onUpload,
  onRemove,
}: {
  label: string;
  imageUrl: string | null | undefined;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      await onUpload(file);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setBusy(true);
    try {
      await onRemove();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {imageUrl ? (
        <div className="group relative overflow-hidden rounded-lg border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={label} className="h-32 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
              disabled={busy}
            >
              Trocar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              disabled={busy}
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-32 w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-brand-500 hover:text-brand-600 disabled:opacity-50"
        >
          <span className="text-2xl">+</span>
          <span className="text-xs">{busy ? "Enviando..." : "Enviar imagem"}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
