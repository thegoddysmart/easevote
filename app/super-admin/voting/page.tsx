import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import GlobalEventsTable from "../events/GlobalEventsTable";
import { Vote } from "lucide-react";

export default async function VotingEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken);

  const resolvedParams = await searchParams;
  const query =
    typeof resolvedParams.query === "string" ? resolvedParams.query : undefined;
  const status =
    typeof resolvedParams.status === "string"
      ? resolvedParams.status
      : undefined;

  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (status) params.set("status", status);
  params.set("type", "VOTING");

  const { data: events } = await apiClient.get(`/super-admin/events?${params.toString()}`);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
          <Vote className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Voting Events</h1>
          <p className="text-slate-500">Manage all voting-related events</p>
        </div>
      </div>

      <GlobalEventsTable events={events} />
    </div>
  );
}
