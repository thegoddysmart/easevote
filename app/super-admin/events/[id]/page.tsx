import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import { notFound } from "next/navigation";
import { AdminEventManager } from "@/app/components/events/AdminEventManager";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SuperAdminEventDetailsPage(props: Props) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(
    session?.accessToken as string | undefined,
  );
  const rawEvent = await apiClient
    .get(`/events/${params.id}`)
    .catch(() => null);

  if (!rawEvent) {
    notFound();
  }

  const eventData = rawEvent.data || rawEvent.event || rawEvent;

  // Map _id to id if necessary
  if (eventData && !eventData.id && eventData._id) {
    eventData.id = eventData._id;
  }

  // Provide robust fallbacks in case the backend payload misses some nested objects
  const event = {
    ...eventData,
    organizer: eventData.organizer ||
      eventData.organizerId || {
        name: "Unknown Organizer",
        email: "",
        phone: "",
      },
    stats: eventData.stats || {
      revenue: 0,
      votes: 0,
      ticketsSold: 0,
      candidatesCount: 0,
      ticketTypesCount: 0,
    },
    ticketTypes: eventData.ticketTypes || [],
    categories: eventData.categories || [],
  };

  return (
    <AdminEventManager
      event={event as any}
      role="SUPER_ADMIN"
      backUrl="/super-admin/events"
    />
  );
}
