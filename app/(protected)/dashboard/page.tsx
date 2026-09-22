import Link from "next/link";

import { requireAuth } from "@/features/auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import { getDashboardStats } from "@/features/dashboard/server/dashboard";

export default async function DashboardPage() {
  const session = await requireAuth();

  const installationId = await getUserInstallationId(session.user.id);

  if (!installationId) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your AI-powered GitHub code reviews.
          </p>
        </div>

        <div className="border p-6">
          <h2 className="text-lg font-medium">
            Connect your GitHub account
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Connect GitHub to start automatically reviewing your pull requests.
          </p>

          <Link
            href="/dashboard/github-app"
            className="mt-4 inline-flex border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Connect GitHub
          </Link>
        </div>
      </div>
    );
  }

  const stats = await getDashboardStats(installationId);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your AI-powered GitHub code reviews.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border p-5">
          <p className="text-sm text-muted-foreground">
            Total Pull Requests
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.totalPullRequests}
          </p>
        </div>

        <div className="border p-5">
          <p className="text-sm text-muted-foreground">
            Reviewed
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.reviewedPullRequests}
          </p>
        </div>

        <div className="border p-5">
          <p className="text-sm text-muted-foreground">
            Processing
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.processingPullRequests}
          </p>
        </div>
      </div>

      <div className="border">
        <div className="border-b p-5">
          <h2 className="font-semibold">Recent Pull Requests</h2>
        </div>

        {stats.recentPullRequests.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            No pull requests have been reviewed yet.
          </div>
        ) : (
          <div>
            {stats.recentPullRequests.map((pr) => (
              <div
                key={pr.id}
                className="flex items-center justify-between border-b p-5 last:border-b-0"
              >
                <div>
                  <p className="font-medium">
                    {pr.repoFullName} #{pr.prNumber}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {pr.title}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium capitalize">
                    {pr.status}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {new Date(pr.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
