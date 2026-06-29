import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const {
    projectId,
    week,
    month,
    format,
    title,
    pillar,
    objective,
    mainIdea,
    artText,
    caption,
    visualSuggestion,
    clientValidationPoint,
    cta,
    hashtags,
    sortOrder,
  } = body;

  if (!projectId || !week || !title) {
    return NextResponse.json({ error: "Campos obrigatórios: projectId, week, title" }, { status: 400 });
  }

  if (hashtags && (!Array.isArray(hashtags) || hashtags.length !== 5)) {
    return NextResponse.json({ error: "São necessárias exatamente 5 hashtags" }, { status: 400 });
  }

  const contentItem = await prisma.contentItem.create({
    data: {
      projectId,
      week,
      month: month || "",
      format: format || "",
      title,
      pillar: pillar || "",
      objective: objective || "",
      mainIdea: mainIdea || "",
      artText: artText || "",
      caption: caption || "",
      visualSuggestion: visualSuggestion || "",
      clientValidationPoint: clientValidationPoint || "",
      cta: cta || "",
      hashtags: hashtags || [],
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json({ contentItem }, { status: 201 });
}
