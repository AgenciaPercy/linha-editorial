import { prisma } from "./prisma";

export async function getProjectByToken(slug: string, token: string | null) {
  if (!token) return null;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project || project.token !== token) return null;
  return project;
}

export function isAdminAuthorized(headerPassword: string | null): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return true; // sem senha configurada = MVP aberto
  return headerPassword === expected;
}
