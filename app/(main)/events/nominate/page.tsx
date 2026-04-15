import { notFound, redirect } from "next/navigation";
import { createServerApiClient } from "@/lib/api-client";
import NominationWrapper from "./NominationWrapper";

interface PageProps {
  searchParams: Promise<{
    eventCode?: string;
  }>;
}

export default async function NominationPage({ searchParams }: PageProps) {
  const { eventCode } = await searchParams;

  if (!eventCode) {
    redirect("/events");
  }

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

  if (!event) {
    return notFound();
  }

  // Fetch the nomination form configuration
  let formConfig = await apiClient.get(`/nominations/form/${event.id}`).catch(() => null);

  // Serialize event for client
  const clientEvent: any = {
    ...event,
    votePrice: event.votePrice ? Number(event.votePrice) : 0,
    totalRevenue: Number(event.totalRevenue),
  };

  return <NominationWrapper event={clientEvent} formConfig={formConfig} />;
}
