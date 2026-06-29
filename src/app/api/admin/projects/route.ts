import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, generateToken } from "@/lib/token";
import { isAdminAuthorized } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { contentItems: true } } },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { name, title, period } = body;

  if (!name || !title || !period) {
    return NextResponse.json({ error: "Campos obrigatórios: name, title, period" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      title,
      period,
      slug: generateSlug(name),
      token: generateToken(),
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
