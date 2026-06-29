import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedImage, deleteUploadedImage } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get("token") as string | null;
  const contentId = formData.get("contentId") as string | null;
  const side = formData.get("side") as string | null; // "agency" | "client"
  const file = formData.get("file") as File | null;

  if (!token || !contentId || !side || !file) {
    return NextResponse.json({ error: "Parâmetros incompletos" }, { status: 400 });
  }
  if (side !== "agency" && side !== "client") {
    return NextResponse.json({ error: "Lado inválido" }, { status: 400 });
  }

  const item = await prisma.contentItem.findUnique({ where: { id: contentId } });
  if (!item) {
    return NextResponse.json({ error: "Conteúdo não encontrado" }, { status: 404 });
  }

  const project = await prisma.project.findUnique({ where: { id: item.projectId } });
  if (!project || project.token !== token) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const url = await saveUploadedImage(file);
    const field = side === "agency" ? "agencyImageUrl" : "clientImageUrl";
    const previousUrl = side === "agency" ? item.agencyImageUrl : item.clientImageUrl;

    const updated = await prisma.contentItem.update({
      where: { id: contentId },
      data: { [field]: url },
    });

    await deleteUploadedImage(previousUrl);

    return NextResponse.json({ url, contentItem: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao salvar imagem";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { token, contentId, side } = await req.json();

  if (!token || !contentId || !side) {
    return NextResponse.json({ error: "Parâmetros incompletos" }, { status: 400 });
  }

  const item = await prisma.contentItem.findUnique({ where: { id: contentId } });
  if (!item) {
    return NextResponse.json({ error: "Conteúdo não encontrado" }, { status: 404 });
  }

  const project = await prisma.project.findUnique({ where: { id: item.projectId } });
  if (!project || project.token !== token) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const field = side === "agency" ? "agencyImageUrl" : "clientImageUrl";
  const previousUrl = side === "agency" ? item.agencyImageUrl : item.clientImageUrl;

  const updated = await prisma.contentItem.update({
    where: { id: contentId },
    data: { [field]: null },
  });

  await deleteUploadedImage(previousUrl);

  return NextResponse.json({ contentItem: updated });
}
