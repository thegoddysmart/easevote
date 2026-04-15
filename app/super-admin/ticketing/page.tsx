import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import GlobalEventsTable from "../events/GlobalEventsTable";
import { Ticket } from "lucide-react";

export default async function TicketingEventsPage({
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
  params.set("type", "TICKETING");

  const { data: events } = await apiClient.get(`/super-admin/events?${params.toString()}`);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
          <Ticket className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Ticketing Events
          </h1>
          <p className="text-slate-500">Manage all ticketing-related events</p>
        </div>
      </div>

      <GlobalEventsTable events={events} />
    </div>
  );
}
