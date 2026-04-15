
import { createServerApiClient } from "../lib/api-client";

async function debug() {
  const apiClient = createServerApiClient();
  console.log("Checking backend for event codes...");

  const fetchEvents = async (type: string, status: string) => {
    try {
      const res = await apiClient.get<any>(`/events?type=${type}&status=${status}&limit=100`);
      const events = res.data || res.events || (Array.isArray(res) ? res : []);
      return events;
    } catch (err: any) {
      console.error(`Error fetching ${type}/${status}:`, err.message);
      return [];
    }
  };

  const statuses = ["LIVE", "PUBLISHED", "APPROVED", "ENDED"];
  const types = ["VOTING", "TICKETING", "HYBRID"];

  let allFoundCodes: string[] = [];

  for (const t of types) {
    for (const s of statuses) {
      const events = await fetchEvents(t, s);
      const codes = events.map((e: any) => e.eventCode).filter(Boolean);
      allFoundCodes.push(...codes);
      if (codes.length > 0) {
        console.log(`[${t} - ${s}] Found:`, codes.join(", "));
      }
    }
  }

  const target = "B11F99";
  if (allFoundCodes.includes(target)) {
    console.log(`\nSUCCESS: Found ${target} in the backend list!`);
  } else {
    console.log(`\nFAILURE: ${target} NOT found in the backend list for any public status.`);
    
    // Try one absolute direct lookup if possible
    console.log(`Trying direct lookup: /events?eventCode=${target}`);
    try {
        const res = await apiClient.get<any>(`/events?eventCode=${target}`);
        console.log("Direct lookup result:", JSON.stringify(res, null, 2));
    } catch (e: any) {
        console.log("Direct lookup failed:", e.message);
    }
  }
}

debug();
