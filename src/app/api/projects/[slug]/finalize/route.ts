import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeSummary } from "@/types";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { token } = await req.json();

  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project || project.token !== token) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const contentItems = await prisma.contentItem.findMany({
    where: { projectId: project.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const summary = computeSummary(contentItems);

  await prisma.activityLog.create({
    data: {
      projectId: project.id,
      action: "finalize",
      newValue: JSON.stringify(summary),
    },
  });

  return NextResponse.json({ project, contentItems, summary });
}
