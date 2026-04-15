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
  type?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  votingStartsAt?: string | Date;
  votingEndsAt?: string | Date;
  votingStartTime?: string | Date;
  votingEndTime?: string | Date;
  nominationStartsAt?: string | Date;
  nominationEndsAt?: string | Date;
  nominationStartTime?: string | Date;
  nominationEndTime?: string | Date;
  allowPublicNominations?: boolean;
}): EventStatusInfo {
  const now = new Date().getTime();

  // Helper to safely get time
  const getTime = (val: string | Date | undefined | null) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.getTime();
  };

  // Normalise backend date keys
  const start = getTime(event.startDate);
  const end = getTime(event.endDate);
  const voteStart = getTime(event.votingStartsAt || event.votingStartTime);
  const voteEnd = getTime(event.votingEndsAt || event.votingEndTime);
  const nomStart = getTime(event.nominationStartsAt || event.nominationStartTime);
  const nomEnd = getTime(event.nominationEndsAt || event.nominationEndTime);

  const backendStatus = event.status?.toUpperCase();

  // 1. Immediate override by status
  if (backendStatus === "ENDED") {
    return { label: "Concluded", phase: "ENDED", color: "bg-gray-600", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }
  if (backendStatus === "CANCELLED") {
    return { label: "Cancelled", phase: "ENDED", color: "bg-red-700", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }
  if (backendStatus === "PAUSED") {
    return { label: "Paused", phase: "VOTING", color: "bg-orange-600", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }

  // 2. Determine Phase based on dates
  let phase: EventPhase = "UPCOMING";
  let isVotingOpen = false;
  let isNominationOpen = false;

  // Check Voting Phase
  if (voteStart && now >= voteStart) {
    if (!voteEnd || now <= voteEnd) {
      phase = "VOTING";
      isVotingOpen = true;
    } else {
      phase = "ENDED";
    }
  } 
  // Check Nomination Phase (only if voting hasn't started)
  else if (nomStart && now >= nomStart) {
    if (!nomEnd || now <= nomEnd) {
      // Only treat as Nomination Phase if public nominations are enabled
      if (event.allowPublicNominations === true) {
        phase = "NOMINATION";
        isNominationOpen = true;
      } else {
        phase = "UPCOMING";
      }
    } else {
      // Nominations ended but voting hasn't started
      phase = "UPCOMING"; 
    }
  }
  // Check general dates as fallback
  else if (end && now > end) {
    phase = "ENDED";
  }

  // 3. Final Labeling
  if (phase === "ENDED") {
    return { label: "Concluded", phase: "ENDED", color: "bg-gray-600", isActive: false, isVotingOpen: false, isNominationOpen: false };
  }

  if (phase === "VOTING") {
    return { 
      label: "Live Now", 
      phase: "VOTING", 
      color: "bg-red-600", 
      isActive: true, 
      isVotingOpen: true, 
      isNominationOpen: false 
    };
  }

  if (phase === "NOMINATION") {
    return { 
      label: "Nominations Open", 
      phase: "NOMINATION", 
      color: "bg-blue-500", 
      isActive: true, // Show as "Active" for homepage visibility
      isVotingOpen: false, 
      isNominationOpen: true 
    };
  }

  // UPCOMING
  if (backendStatus === "LIVE" || backendStatus === "PUBLISHED" || backendStatus === "APPROVED") {
    return { 
      label: "Starting Soon", 
      phase: "UPCOMING", 
      color: "bg-blue-600", 
      isActive: false, 
      isVotingOpen: false, 
      isNominationOpen: false 
    };
  }

  return { label: "Upcoming", phase: "UPCOMING", color: "bg-gray-400", isActive: false, isVotingOpen: false, isNominationOpen: false };
}
