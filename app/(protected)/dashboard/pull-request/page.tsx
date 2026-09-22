import type { Metadata } from "next";
import Link from "next/link";

import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { getUserInstallationId } from "@/features/github/server/installation";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Pull Requests · Dashboard",
};

export default async function PullRequestsPage() {
  const session = await requireAuth();

  const installationId = await getUserInstallationId(session.user.id);

  if (!installationId) {
    return (
      <>
        <DashboardHeader
          title="Pull Requests"
          description="View pull requests processed by the AI code reviewer."
        />

        <div className="p-6">
          <div className="rounded-none border border-border p-6">
            <p className="text-sm text-muted-foreground">
              Connect your GitHub App first to see pull requests.
            </p>

            <Link
              href="/dashboard/github"
              className="mt-4 inline-block text-sm font-medium underline"
            >
              Connect GitHub
            </Link>
          </div>
        </div>
      </>
    );
  }

  const pullRequests = await prisma.pullRequest.findMany({
    where: {
      installationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <DashboardHeader
        title="Pull Requests"
        description="View pull requests processed by the AI code reviewer."
      />

      <div className="flex flex-1 flex-col gap-4 p-6">
        {pullRequests.length === 0 ? (
          <div className="rounded-none border border-border p-6">
            <p className="text-sm text-muted-foreground">
              No pull requests have been reviewed yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-none border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="p-4">Repository</th>
                  <th className="p-4">PR</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Reviewed</th>
                </tr>
              </thead>

              <tbody>
                {pullRequests.map((pullRequest) => {
                  const githubUrl = `https://github.com/${pullRequest.repoFullName}/pull/${pullRequest.prNumber}`;

                  return (
                    <tr
                      key={pullRequest.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="p-4">
                        <Link
                          href={`https://github.com/${pullRequest.repoFullName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline"
                        >
                          {pullRequest.repoFullName}
                        </Link>
                      </td>

                      <td className="p-4">
                        <Link
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline"
                        >
                          #{pullRequest.prNumber}
                        </Link>

                        <div className="mt-1 max-w-md text-xs text-muted-foreground">
                          {pullRequest.title}
                        </div>
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {pullRequest.authorLogin ?? "Unknown"}
                      </td>

                      <td className="p-4">
                        <span className="capitalize">
                          {pullRequest.status}
                        </span>
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {pullRequest.createdAt.toLocaleString()}
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {pullRequest.reviewedAt
                          ? pullRequest.reviewedAt.toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}