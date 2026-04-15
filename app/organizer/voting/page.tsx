import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createServerApiClient } from "@/lib/api-client";
import VotingDashboardClient from "./VotingDashboardClient";

export default async function OrganizerVotingPage() {
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
      ? allEvents.filter(ev => ev.type === "VOTING" || ev.type === "HYBRID")
      : [];
  } catch (error) {
    console.error("Error fetching voting events:", error);
    events = [];
  }

  const stats = {
    totalVotes: events.reduce((acc, ev) => acc + (ev.totalVotes || 0), 0),
    totalRevenue: events.reduce((acc, ev) => acc + (ev.totalRevenue || 0), 0),
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
    totalVotes: ev.totalVotes || 0,
    totalRevenue: ev.totalRevenue || 0,
    candidatesCount: ev.candidatesCount || ev.categories?.reduce((acc: number, cat: any) => acc + (cat.candidates?.length || 0), 0) || 0,
  }));

  return (
    <VotingDashboardClient 
      initialEvents={serializedEvents}
      stats={stats}
    />
  );
}
