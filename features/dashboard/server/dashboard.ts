import { prisma } from "@/lib/db";

export async function getDashboardStats(installationId: number) {
  const [totalPullRequests, reviewedPullRequests, processingPullRequests] =
    await Promise.all([
      prisma.pullRequest.count({
        where: { installationId },
      }),

      prisma.pullRequest.count({
        where: {
          installationId,
          status: "reviewed",
        },
      }),

      prisma.pullRequest.count({
        where: {
          installationId,
          status: "processing",
        },
      }),
    ]);

  const recentPullRequests = await prisma.pullRequest.findMany({
    where: { installationId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      repoFullName: true,
      prNumber: true,
      title: true,
      status: true,
      createdAt: true,
      reviewedAt: true,
    },
  });

  return {
    totalPullRequests,
    reviewedPullRequests,
    processingPullRequests,
    recentPullRequests,
  };
}
