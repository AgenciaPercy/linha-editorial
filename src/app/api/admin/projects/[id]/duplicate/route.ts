import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, generateToken } from "@/lib/token";
import { isAdminAuthorized } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthorized(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const original = await prisma.project.findUnique({
    where: { id: params.id },
    include: { contentItems: true },
  });

  if (!original) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }

  const newProject = await prisma.project.create({
    data: {
      name: `${original.name} (cópia)`,
      title: original.title,
      period: original.period,
      slug: generateSlug(original.name),
      token: generateToken(),
      contentItems: {
        create: original.contentItems.map((item) => ({
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
          hashtags: item.hashtags,
          sortOrder: item.sortOrder,
        })),
      },
    },
  });

  return NextResponse.json({ project: newProject }, { status: 201 });
}
