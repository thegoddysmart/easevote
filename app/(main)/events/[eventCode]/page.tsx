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
    const organizerId = session.user?.organizerId;
    const eventOrganizerId = typeof event.organizerId === 'object' ? event.organizerId?._id : event.organizerId;
    const isOwner = organizerId === eventOrganizerId;
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
  const rawNomStart = event.nominationStartTime || event.nominationStartsAt;
  const rawNomEnd = event.nominationEndTime || event.nominationEndsAt;
  const rawVoteStart = event.votingStartTime || event.votingStartsAt;
  const rawVoteEnd = event.votingEndTime || event.votingEndsAt;

  const nomStart = rawNomStart ? new Date(rawNomStart).getTime() : null;
  const nomEnd = rawNomEnd ? new Date(rawNomEnd).getTime() : null;
  const voteStart = rawVoteStart ? new Date(rawVoteStart).getTime() : null;
  const voteEnd = rawVoteEnd ? new Date(rawVoteEnd).getTime() : null;

  // Timeline Display Logic
  let timelineLabel = statusInfo.label;
  let timelineEnd: Date | null = null;

  if (phase === "NOMINATION") {
    if (nomEnd) {
      const gmtDate = new Date(nomEnd);
      timelineLabel = `Nominations close ${gmtDate.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`;
      timelineEnd = gmtDate;
    } else {
      timelineLabel = "Nominations Open";
    }
  } else if (phase === "VOTING") {
    if (voteEnd) {
      const gmtDate = new Date(voteEnd);
      timelineLabel = `Voting ends ${gmtDate.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`;
      timelineEnd = gmtDate;
    } else {
      timelineLabel = "Voting Live";
    }
  } else if (phase === "UPCOMING") {
    if (nomStart && now < nomStart) {
      const gmtDate = new Date(nomStart);
      timelineLabel = `Nominations start ${gmtDate.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`;
      timelineEnd = gmtDate;
    } else if (voteStart && now < voteStart) {
      const gmtDate = new Date(voteStart);
      timelineLabel = `Voting starts ${gmtDate.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`;
      timelineEnd = gmtDate;
    } else {
      timelineLabel = "Starting Soon";
    }
  } else if (phase === "ENDED") {
    timelineLabel = "Event Ended";
  }

  let visibleCategories = event.categories;
  if (!isAuthorized && !isVotingOpen && !event.showLiveResults) {
    visibleCategories = event.categories.map((cat: any) => ({ ...cat, candidates: [] }));
  }

  const clientEvent: any = {
    ...event,
    isVotingOpen,
    isNominationOpen,
    phase,
    date: timelineLabel,
    timelineEnd: timelineEnd?.toISOString() || null,
    categories: visibleCategories,
  };

  return (
    <>
      <EventStatusNotification event={clientEvent} />
      {showPreviewBanner && <PreviewBanner status={event.status} />}
      <EventDetailClient event={clientEvent} />
    </>
  );
}
