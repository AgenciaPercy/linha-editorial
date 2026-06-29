import type { ContentItem, Project, ContentStatus, DecisionStatus } from "@prisma/client";

export type { ContentItem, Project, ContentStatus, DecisionStatus };

export const STATUS_LABELS: Record<ContentStatus, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  ajustar: "Precisa ajustar",
  nao_usar: "Não usar agora",
};

export const STATUS_COLORS: Record<ContentStatus, string> = {
  pendente: "bg-slate-100 text-slate-700 border-slate-300",
  aprovado: "bg-green-100 text-green-700 border-green-300",
  ajustar: "bg-amber-100 text-amber-700 border-amber-300",
  nao_usar: "bg-red-100 text-red-700 border-red-300",
};

export const DECISION_LABELS: Record<DecisionStatus, string> = {
  pendente: "Pendente",
  manter: "Manter",
  alterar: "Alterar",
};

export type ContentItemUpdateInput = Partial<
  Pick<
    ContentItem,
    | "status"
    | "legendDecision"
    | "legendRequest"
    | "designDecision"
    | "designRequest"
    | "generalNotes"
    | "agencyImageUrl"
    | "clientImageUrl"
  >
>;

export type ProjectSummary = {
  total: number;
  respondidos: number;
  aprovados: number;
  ajustar: number;
  naoUsar: number;
  pendentes: number;
  progresso: number;
};

export function computeSummary(items: ContentItem[]): ProjectSummary {
  const total = items.length;
  const aprovados = items.filter((i) => i.status === "aprovado").length;
  const ajustar = items.filter((i) => i.status === "ajustar").length;
  const naoUsar = items.filter((i) => i.status === "nao_usar").length;
  const pendentes = items.filter((i) => i.status === "pendente").length;
  const respondidos = aprovados + ajustar + naoUsar;
  const progresso = total === 0 ? 0 : Math.round((respondidos / total) * 100);
  return { total, respondidos, aprovados, ajustar, naoUsar, pendentes, progresso };
}
