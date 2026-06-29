import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";
import { deleteUploadedImage } from "@/lib/upload";

const EDITABLE_FIELDS = [
  "week",
  "month",
  "format",
  "title",
  "pillar",
  "objective",
  "mainIdea",
  "artText",
  "caption",
  "visualSuggestion",
  "clientValidationPoint",
  "cta",
  "hashtags",
  "sortOrder",
  "status",
  "legendDecision",
  "legendRequest",
  "designDecision",
  "designRequest",
  "generalNotes",
] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthorized(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();

  if (body.hashtags && (!Array.isArray(body.hashtags) || body.hashtags.length !== 5)) {
    return NextResponse.json({ error: "São necessárias exatamente 5 hashtags" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) data[field] = body[field];
  }

  const contentItem = await prisma.contentItem.update({ where: { id: params.id }, data });
  return NextResponse.json({ contentItem });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthorized(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const item = await prisma.contentItem.findUnique({ where: { id: params.id } });
  await prisma.contentItem.delete({ where: { id: params.id } });

  if (item) {
    await deleteUploadedImage(item.agencyImageUrl);
    await deleteUploadedImage(item.clientImageUrl);
  }

  return NextResponse.json({ ok: true });
}
