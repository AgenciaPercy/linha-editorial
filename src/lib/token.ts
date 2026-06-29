import { nanoid } from "nanoid";

export function generateToken(): string {
  return nanoid(24);
}

const COMBINING_MARKS = /[̀-ͯ]/g;

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${nanoid(5).toLowerCase()}`;
}
