import type { ContentItem, Project } from "@prisma/client";
import { STATUS_LABELS } from "@/types";
import type { ProjectSummary } from "@/types";

export function buildReportHtml(project: Project, items: ContentItem[], summary: ProjectSummary): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.week)}</td>
        <td>${escapeHtml(item.title)}</td>
        <td>${escapeHtml(item.format)}</td>
        <td><span class="status status-${item.status}">${STATUS_LABELS[item.status]}</span></td>
        <td>${escapeHtml(item.legendRequest || "—")}</td>
        <td>${escapeHtml(item.designRequest || "—")}</td>
        <td>${escapeHtml(item.generalNotes || "—")}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Devolutiva - ${escapeHtml(project.title)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; padding: 32px; }
  h1 { margin-bottom: 4px; }
  .meta { color: #64748b; margin-bottom: 24px; }
  .summary { display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
  .summary div { background: #f1f5f9; padding: 12px 16px; border-radius: 8px; }
  .summary strong { display: block; font-size: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; vertical-align: top; }
  th { background: #f8fafc; }
  .status { padding: 2px 8px; border-radius: 999px; font-weight: bold; font-size: 11px; }
  .status-aprovado { background: #dcfce7; color: #166534; }
  .status-ajustar { background: #fef3c7; color: #92400e; }
  .status-nao_usar { background: #fee2e2; color: #991b1b; }
  .status-pendente { background: #f1f5f9; color: #475569; }
</style>
</head>
<body>
  <h1>Devolutiva de Aprovação</h1>
  <p class="meta">${escapeHtml(project.name)} · ${escapeHtml(project.title)} · ${escapeHtml(project.period)} · Gerado em ${new Date().toLocaleString("pt-BR")}</p>
  <div class="summary">
    <div><strong>${summary.total}</strong>Total</div>
    <div><strong>${summary.aprovados}</strong>Aprovados</div>
    <div><strong>${summary.ajustar}</strong>Ajustar</div>
    <div><strong>${summary.naoUsar}</strong>Não usar</div>
    <div><strong>${summary.pendentes}</strong>Pendentes</div>
    <div><strong>${summary.progresso}%</strong>Progresso</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Semana</th><th>Título</th><th>Formato</th><th>Status</th>
        <th>Solicitação legenda</th><th>Solicitação design</th><th>Observações</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
