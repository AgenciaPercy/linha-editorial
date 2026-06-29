import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_FIELDS = [
  "status",
  "legendDecision",
  "legendRequest",
  "designDecision",
  "designRequest",
  "generalNotes",
  "agencyImageUrl",
  "clientImageUrl",
] as const;

const VALID_STATUS = ["pendente", "aprovado", "ajustar", "nao_usar"];
const VALID_DECISION = ["pendente", "manter", "alterar"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token ausente" }, { status: 401 });
  }

  const item = await prisma.contentItem.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Conteúdo não encontrado" }, { status: 404 });
  }

  const project = await prisma.project.findUnique({ where: { id: item.projectId } });
  if (!project || project.token !== token) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await req.json();
  const data: Record<string, string> = {};

  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      data[field] = body[field];
    }
  }

  if (data.status && !VALID_STATUS.includes(data.status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }
  if (data.legendDecision && !VALID_DECISION.includes(data.legendDecision)) {
    return NextResponse.json({ error: "Decisão de legenda inválida" }, { status: 400 });
  }
  if (data.designDecision && !VALID_DECISION.includes(data.designDecision)) {
    return NextResponse.json({ error: "Decisão de design inválida" }, { status: 400 });
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nenhum campo válido enviado" }, { status: 400 });
  }

  const updated = await prisma.contentItem.update({
    where: { id },
    data,
  });

  await prisma.activityLog.create({
    data: {
      projectId: project.id,
      contentItemId: item.id,
      action: `update:${Object.keys(data).join(",")}`,
      oldValue: JSON.stringify(Object.fromEntries(Object.keys(data).map((k) => [k, (item as Record<string, unknown>)[k]]))),
      newValue: JSON.stringify(data),
    },
  });

  return NextResponse.json({ contentItem: updated });
}
