import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads-data";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 8 * 1024 * 1024;

export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Arquivo muito grande (máximo 8MB).");
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const fileName = `${nanoid(16)}.${ext}`;
  const dir = path.resolve(process.cwd(), UPLOAD_DIR);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, fileName), buffer);

  return `/api/uploads/${fileName}`;
}

export async function deleteUploadedImage(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith("/api/uploads/")) return;
  const dir = path.resolve(process.cwd(), UPLOAD_DIR);
  const fileName = path.basename(url);
  try {
    await unlink(path.join(dir, fileName));
  } catch {
    // arquivo já pode não existir, ignora
  }
}
