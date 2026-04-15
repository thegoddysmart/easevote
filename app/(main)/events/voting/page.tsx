import { createServerApiClient } from "@/lib/api-client";
import EventsBrowseClient from "./EventsBrowseClient";

export const dynamic = "force-dynamic";

export default async function VotingEventsPage() {
  const apiClient = createServerApiClient();
  
  // The API doesn't support comma-separated values, so we fetch separately
  let allEvents: any[] = [];
  
  try {
    const fetchEvents = async (type: string, status: string) => {
      const res = await apiClient.get<any>(`/events?type=${type}&status=${status}`).catch(() => null);
      if (res) {
        const events = res.data || res.events || res;
        if (Array.isArray(events)) allEvents.push(...events);
      }
    };

    // Fetch relevant voting events
    await Promise.all([
      fetchEvents("VOTING", "LIVE"),
      fetchEvents("VOTING", "PUBLISHED"),
      fetchEvents("VOTING", "APPROVED"),
      fetchEvents("HYBRID", "LIVE"),
      fetchEvents("HYBRID", "PUBLISHED"),
      fetchEvents("HYBRID", "APPROVED"),
    ]);
  } catch (error) {
    console.error("Failed to fetch voting events:", error);
  }

  const clientEvents = allEvents.map((event: any) => ({
    id: event._id || event.id,
    title: event.title,
    eventCode: event.eventCode,
    category: event.type || "General",
    image: event.imageUrl || event.coverImage || event.image || "https://images.unsplash.com/photo-1540039155733-d730a53bf30c?q=80&w=2667&auto=format&fit=crop",
    date: event.startDate || event.date,
    status: event.status,
    location: event.location || "Online",
    votePrice: event.costPerVote || event.votePrice || 0,
  }));

  return <EventsBrowseClient initialEvents={clientEvents} />;
}
