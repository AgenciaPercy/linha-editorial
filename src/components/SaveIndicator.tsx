export type SaveState = "idle" | "saving" | "saved" | "error";

export default function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "idle") return null;

  const config = {
    saving: { text: "Salvando...", className: "text-slate-400" },
    saved: { text: "Salvo", className: "text-green-600" },
    error: { text: "Erro ao salvar", className: "text-red-600" },
  }[state];

  return <span className={`text-xs font-medium ${config.className}`}>{config.text}</span>;
}
