import { prisma } from "@/lib/prisma";
import ApprovalApp from "@/components/ApprovalApp";
import AccessDenied from "@/components/AccessDenied";

export const dynamic = "force-dynamic";

export default async function AprovacaoPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { token?: string };
}) {
  const token = searchParams.token || null;
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });

  if (!project || !token || project.token !== token) {
    return <AccessDenied />;
  }

  const contentItems = await prisma.contentItem.findMany({
    where: { projectId: project.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return <ApprovalApp project={project} initialItems={contentItems} token={token} />;
}
