/**
 * Compute event stats from the actual embedded data — no cached fields.
 * Works for both voting and ticketing events.
 */
export function computeEventStats(event: any) {
  // 0. Use Live Ledger Stats if provided by the backend (Source of Truth)
  if (event.ledgerStats) {
    return {
      votes: event.ledgerStats.votes || 0,
      ticketsSold: event.ledgerStats.ticketsSold || 0,
      revenue: event.ledgerStats.revenue || 0
    };
  }

  // 1. Fallback to calculation from embedded counters (Drafts/Local State)
  let totalVotes = 0;
  let ticketsSold = 0;
  let revenue = 0;

  if (event.type === "VOTING") {
    // Sum votes from each candidate across all categories
    for (const cat of event.categories || []) {
      for (const c of cat.candidates || []) {
        totalVotes += Number(c.votes ?? 0);
      }
    }
    revenue = totalVotes * (Number(event.costPerVote ?? event.votePrice ?? 0));
  } else if (event.type === "TICKETING" || event.type === "HYBRID") {
    // Sum sold counts and revenue from ticket types
    for (const tt of event.ticketTypes || []) {
      const sold = Number(tt.sold ?? 0);
      ticketsSold += sold;
      revenue += sold * Number(tt.price ?? 0);
    }
  }

  return { votes: totalVotes, ticketsSold, revenue };
}
