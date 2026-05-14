import { notFound } from "next/navigation";
import EventDetailClient from "./EventDetailClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import EventStatusNotification from "./EventStatusNotification";
import { createServerApiClient } from "@/lib/api-client";
import { getEventStatus } from "@/lib/utils/event-status";

interface PageProps {
  params: Promise<{ eventCode: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventCode } = await params;
  const session = await getServerSession(authOptions);

  const apiClient = createServerApiClient(session?.accessToken as string);
  let event = null;

  // Check if eventCode is a MongoDB ObjectId (24 hex characters)
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(eventCode);

  if (isObjectId) {
    const res = await apiClient.get<any>(`/events/${eventCode}`).catch((err) => {
      console.error(`[EventPage] Error fetching ID ${eventCode}:`, err.message);
      return null;
    });
    event = res?.data || res?.event || res;
  } else {
    // Lookup by short eventCode
    // The backend now handles natural filtering, so we just pass the code.
    const res = await apiClient.get<any>(`/events?eventCode=${eventCode}`).catch((err) => {
      console.error(`[EventPage] Error fetching code ${eventCode}:`, err.message);
      return null;
    });

    if (res) {
      const eventsList = res.data || res.events || (Array.isArray(res) ? res : []);
      console.log(`[EventPage] Lookup for ${eventCode} returned ${eventsList.length} items`);
      
      event = eventsList.find((e: any) => 
        (e.eventCode || "").toUpperCase() === eventCode.toUpperCase()
      );

      if (event) {
        console.log(`[EventPage] Matched event: ${event.title} (${event.eventCode})`);
      }
    }
  }

  if (!event) {
    console.log(`[EventPage] Final result: Not Found for ${eventCode}`);
    return notFound();
  }

  // Permissions Check for Visibility
  let isAuthorized = false;
  if (session) {
    const userRole = session.user?.role;
    const userId = session.user?.id;
    const eventOrganizerId = typeof event.organizerId === 'object' ? event.organizerId?._id : event.organizerId;
    const isOwner = !!userId && userId === eventOrganizerId;
    const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
    isAuthorized = isOwner || isAdmin;
  }

  // Preview Mode Logic
  let showPreviewBanner = false;
  const isPublished = event.status === "PUBLISHED" || event.status === "LIVE" || event.status === "APPROVED" || event.status === "ENDED";
  if (!isPublished) {
    if (!isAuthorized) return notFound();
    showPreviewBanner = true;
  }

  // --- Unified Status & Phase Evaluation ---
  const statusInfo = getEventStatus(event);
  const { phase, isVotingOpen, isNominationOpen } = statusInfo;
  
  const now = new Date().getTime();
  const endDate = new Date(event.endDate).getTime();

  // Timeline Display Logic
  let timelineLabel = statusInfo.label;
  let timelineEnd: Date | null = null;

  if (phase === "VOTING") {
    const gmtDate = new Date(event.endDate);
    timelineLabel = `Voting ends ${gmtDate.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true })}`;
    timelineEnd = gmtDate;
  } else if (phase === "ENDED") {
    timelineLabel = "Event Ended";
  } else {
    const gmtDate = new Date(event.startDate);
    timelineLabel = `Starts ${gmtDate.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true })}`;
    timelineEnd = gmtDate;
  }

  let visibleCategories = event.categories;
  if (!isAuthorized && !isVotingOpen && !event.showLiveResults) {
    visibleCategories = event.categories.map((cat: any) => ({ ...cat, candidates: [] }));
  }

  const eventId = event._id || event.id;
  const isEventIdValid = /^[0-9a-fA-F]{24}$/.test(eventId);
  
  let hasNominationForm = false;
  if (isEventIdValid) {
    try {
      const formRes = await apiClient.get<any>(`/nominations/events/${eventId}/form`);
      const form = formRes?.data || formRes;
      hasNominationForm = !!form;
    } catch (err) {
      // It's okay if the form doesn't exist or returns 404/400
      console.log(`[EventPage] Nomination form not found or inaccessible for ${eventId}`);
    }
  }

  const clientEvent: any = {
    ...event,
    isVotingOpen,
    isNominationOpen,
    phase,
    date: timelineLabel,
    timelineEnd: timelineEnd?.toISOString() || null,
    categories: visibleCategories,
    hasNominationForm,
  };

  return (
    <>
      <EventStatusNotification event={clientEvent} />
      {showPreviewBanner && <PreviewBanner status={event.status} />}
      <EventDetailClient event={clientEvent} />
    </>
  );
}
