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
  votingStartTime?: string | Date;
  votingEndTime?: string | Date;
  nominationStartTime?: string | Date;
  nominationEndTime?: string | Date;
  nominationStartDate?: string | Date;
  nominationEndDate?: string | Date;
  nominationDeadline?: string | Date;
  allowPublicNominations?: boolean;
}): EventStatusInfo {
  const now = new Date();
  const backendStatus = event.status?.toUpperCase();

  // Helper to parse dates safely
  const parseDate = (d?: string | Date) => {
    if (!d) return null;
    const date = new Date(d);
    return isNaN(date.getTime()) ? null : date;
  };
  
  const vStart = parseDate(event.votingStartTime);
  const vEnd = parseDate(event.votingEndTime);
  const eStart = parseDate(event.startDate);
  const eEnd = parseDate(event.endDate);
  
  // Try multiple possible field names for nomination dates
  const nStart = parseDate(event.nominationStartTime || event.nominationStartDate);
  const nEnd = parseDate(event.nominationEndTime || event.nominationEndDate || event.nominationDeadline);

  // 1. Terminal / Forced Statuses
  if (backendStatus === "ENDED") {
    return { label: "Ended", phase: "ENDED", color: "bg-slate-600", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }
  if (backendStatus === "CANCELLED") {
    return { label: "Cancelled", phase: "ENDED", color: "bg-red-700", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }
  if (backendStatus === "PAUSED") {
    return { label: "Paused", phase: "VOTING", color: "bg-orange-600", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }

  // 2. Window Calculations
  const effectiveVStart = vStart || eStart;
  const effectiveVEnd = vEnd || eEnd;
  
  const isVotingOpen = ["LIVE", "PUBLISHED"].includes(backendStatus) && 
                      (effectiveVStart ? now >= effectiveVStart : true) && 
                      (effectiveVEnd ? now <= effectiveVEnd : true);

  // Nomination is open if:
  // - allowPublicNominations is true AND
  // - status is LIVE/NOMINATING/PUBLISHED AND
  // - either dates are met OR (no dates set and status is NOMINATING)
  const isNominationOpen = !!event.allowPublicNominations && 
                          ["LIVE", "NOMINATING", "PUBLISHED"].includes(backendStatus) && 
                          (nStart ? now >= nStart : (backendStatus === "NOMINATING" || backendStatus === "LIVE")) && 
                          (nEnd ? now <= nEnd : true);

  // 3. Phase Determination
  let phase: EventPhase = "UPCOMING";
  let label = "Upcoming";
  let color = "bg-slate-400";

  if (effectiveVEnd && now > effectiveVEnd) {
    phase = "ENDED";
    label = "Ended";
    color = "bg-slate-600";
  } else if (isVotingOpen) {
    phase = "VOTING";
    label = "Live";
    color = "bg-green-600";
  } else if (isNominationOpen) {
    phase = "NOMINATION";
    label = "Nomination";
    color = "bg-blue-600";
  } else if (effectiveVStart && now < effectiveVStart) {
    phase = "UPCOMING";
    label = "Coming Soon";
    color = "bg-amber-500";
  }

  // Final check for allowPublicNominations override
  // If allowPublicNominations is true but dates aren't strictly met, 
  // we still might want isNominationOpen to be true if we want the tab to show up.
  // Actually, let's keep isNominationOpen strict but add a check in EventDetailClient for showing the tab.

  return {
    label,
    phase,
    color,
    isActive: isVotingOpen || isNominationOpen,
    isVotingOpen,
    isNominationOpen
  };
}
