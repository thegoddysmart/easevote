import { createServerApiClient } from "@/lib/api-client";
import { notFound } from "next/navigation";
import { TicketSelectionClient } from "./TicketSelectionClient";

export default async function TicketSelectionPage({
  params,
}: {
  params: Promise<{ eventCode: string }>;
}) {
  const { eventCode } = await params;

  const apiClient = createServerApiClient();
  let event = null;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(eventCode);

  if (isObjectId) {
    event = await apiClient.get<any>(`/events/${eventCode}`).catch(() => null);
  } else {
    // Lookup by short eventCode
    // The backend sometimes returns all events for this query, so we must manually filter
    const res = await apiClient.get<any>(`/events?eventCode=${eventCode}`).catch(() => null);
    const eventsList = res?.data || res?.events || (Array.isArray(res) ? res : []);
    
    if (Array.isArray(eventsList)) {
      event = eventsList.find((e: any) => 
        e.eventCode?.toUpperCase() === eventCode.toUpperCase()
      );
    }
  }

  if (!event) return notFound();

  const pageEvent = {
    id: event.id,
    title: event.title,
    eventCode: event.eventCode,
    image: event.coverImage || "/placeholder-event.jpg",
    category: event.type as any,
    date: new Date(event.startDate).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: new Date(event.startDate).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    venue: event.venue || event.location || "TBA",
    organizer: event.organizer?.businessName || event.organizer?.user?.name || "Organizer",
    description: event.description || "",
    ticketTypes: (event.ticketTypes || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      price: Number(t.price),
      available: t.available ?? (t.quantity - t.soldCount),
      description: t.description || "",
    })),
  };

  return <TicketSelectionClient event={pageEvent as any} />;
}
