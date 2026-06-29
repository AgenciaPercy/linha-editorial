import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token ausente" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project || project.token !== token) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const contentItems = await prisma.contentItem.findMany({
    where: { projectId: project.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ project, contentItems });
}
