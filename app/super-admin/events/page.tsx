import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import GlobalEventsTable from "./GlobalEventsTable";
import { FolderSearch } from "lucide-react";
import { PaginationControls } from "@/components/ui/PaginationControls";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuperAdminEventsPage(props: Props) {
  const searchParams = await props.searchParams;
  const status =
    typeof searchParams.status === "string" ? searchParams.status : undefined;
  const type =
    typeof searchParams.type === "string" ? searchParams.type : undefined;
  const query =
    typeof searchParams.query === "string" ? searchParams.query : undefined;

  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(
    session?.accessToken as string | undefined,
  );

  const page = searchParams.page
    ? parseInt(searchParams.page as string, 10)
    : 1;
  const limit = 10;

  const queryParams = new URLSearchParams();
  if (type) queryParams.set("type", type);
  if (query) queryParams.set("query", query);
  if (status) queryParams.set("status", status);
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());

  const baseQueryStr = `?${queryParams.toString()}`;

  let events: any[] = [];
  let totalPages = 1;

  try {
    const result = await apiClient.get(`/events${baseQueryStr}`);
    events = result.data || result.events || [];
    totalPages =
      result.pagination?.pages ||
      Math.ceil((result.total || events.length) / limit) ||
      1;
  } catch (err) {
    events = [];
  }

  // Clean up and map the raw MongoDB events to the expected frontend schema
  const mappedEvents = events.map((e: any) => ({
    id: e._id,
    eventCode: e.eventCode || e._id?.substring(0, 8) || "N/A",
    title: e.title || "Untitled Event",
    organizer: {
      name:
        e.organizerId?.businessName ||
        e.organizerId?.fullName ||
        "Unknown Organizer",
      avatar: e.organizerId?.logo || "",
    },
    type: e.type || "UNKNOWN",
    status: e.status || "DRAFT",
    startDate: e.startDate || new Date().toISOString(),
    endDate: e.endDate || new Date().toISOString(),
    stats: {
      votes: e.totalVotes || 0,
      revenue: e.totalRevenue || 0,
    },
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderSearch className="h-7 w-7 text-indigo-600" />
            Global Events
          </h1>
          <p className="text-slate-500">
            Monitor and manage all events across the platform.
          </p>
        </div>
      </div>

      <GlobalEventsTable events={mappedEvents} />

      <div className="mt-4">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          basePath="/super-admin/events"
        />
      </div>
    </div>
  );
}
