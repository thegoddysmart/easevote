import { notFound } from "next/navigation";
import NominateClient from "./NominateClient";
import { createServerApiClient } from "@/lib/api-client";

export default async function NominatePage({
  params,
}: {
  params: Promise<{ eventCode: string }>;
}) {
  const { eventCode } = await params;

  const apiClient = createServerApiClient();
  let event = null;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(eventCode);

  if (isObjectId) {
    const res = await apiClient.get<any>(`/events/${eventCode}`).catch(() => null);
    event = res?.data || res?.event || res;
  } else {
    // Lookup by short eventCode
    const res = await apiClient.get<any>(`/events?eventCode=${eventCode}`).catch(() => null);
    if (res) {
      const eventsList = res.data || res.events || (Array.isArray(res) ? res : []);
      event = eventsList.find((e: any) => 
        (e.eventCode || "").toUpperCase() === eventCode.toUpperCase()
      );
    }
  }

  if (!event || !event.allowPublicNominations) {
    return notFound();
  }

  const clientEvent = {
    ...event,
    location: event.location || "Accra, Ghana",
  };

  return <NominateClient event={clientEvent as any} />;
}
