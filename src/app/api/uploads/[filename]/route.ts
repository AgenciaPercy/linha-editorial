import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads-data";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(_req: NextRequest, { params }: { params: { filename: string } }) {
  const fileName = path.basename(params.filename);
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const mime = MIME_BY_EXT[ext];
  if (!mime) {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
  }

  const dir = path.resolve(process.cwd(), UPLOAD_DIR);
  try {
    const buffer = await readFile(path.join(dir, fileName));
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
  }
}
