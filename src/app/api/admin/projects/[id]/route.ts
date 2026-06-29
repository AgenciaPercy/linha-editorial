import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthorized(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { contentItems: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
  });

  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthorized(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { name, title, period, status } = body;
  const data: Record<string, string> = {};
  if (name) data.name = name;
  if (title) data.title = title;
  if (period) data.period = period;
  if (status) data.status = status;

  const project = await prisma.project.update({ where: { id: params.id }, data });
  return NextResponse.json({ project });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthorized(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
