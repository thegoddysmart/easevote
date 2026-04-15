import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createServerApiClient } from "@/lib/api-client";
import TicketingDashboardClient from "./TicketingDashboardClient";

export default async function OrganizerTicketingPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.organizerId) {
    redirect("/sign-in");
  }

  const apiClient = createServerApiClient(
    session?.accessToken as string | undefined,
  );

  let events: any[] = [];
  try {
    const allEvents = await apiClient.get<any[]>("/organizer/events");
    events = Array.isArray(allEvents) 
      ? allEvents.filter(ev => ev.type === "TICKETING" || ev.type === "HYBRID")
      : [];
  } catch (error) {
    console.error("Error fetching ticketing events:", error);
    events = [];
  }

  const stats = {
    totalRevenue: events.reduce((acc, ev) => acc + (ev.totalRevenue || 0), 0),
    ticketsSold: events.reduce((acc, ev) => acc + (ev.ticketsSold || 0), 0),
    activeEvents: events.filter(ev => ev.status === "LIVE").length,
  };

  const serializedEvents = events.map(ev => ({
    id: ev.id || ev._id,
    eventCode: ev.eventCode,
    title: ev.title,
    type: ev.type,
    status: ev.status,
    startDate: ev.startDate,
    endDate: ev.endDate,
    totalRevenue: ev.totalRevenue || 0,
    ticketsSold: ev.ticketsSold || 0,
    transactionsCount: ev.transactionsCount || 0,
  }));

  return (
    <TicketingDashboardClient 
      initialEvents={serializedEvents}
      stats={stats}
    />
  );
}
