export type EventPhase = "UPCOMING" | "NOMINATION" | "VOTING" | "ENDED";

export type EventStatusInfo = {
  label: string;
  phase: EventPhase;
  color: string;
  isActive: boolean;
  isVotingOpen: boolean;
  isNominationOpen: boolean;
};

export function getEventStatus(event: {
  status: string;
  startDate?: string | Date;
  endDate?: string | Date;
}): EventStatusInfo {
  const backendStatus = event.status?.toUpperCase();

  if (backendStatus === "ENDED") {
    return { label: "Ended", phase: "ENDED", color: "bg-gray-600", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }
  if (backendStatus === "CANCELLED") {
    return { label: "Cancelled", phase: "ENDED", color: "bg-red-700", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }
  if (backendStatus === "PAUSED") {
    return { label: "Paused", phase: "VOTING", color: "bg-orange-600", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }
  if (backendStatus === "LIVE") {
    return { label: "Live", phase: "VOTING", color: "bg-red-600", isActive: true, isVotingOpen: true, isNominationOpen: false };
  }

  return { label: "Upcoming", phase: "UPCOMING", color: "bg-gray-400", isActive: false, isVotingOpen: false, isNominationOpen: false };
}
