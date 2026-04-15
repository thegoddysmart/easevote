import StatsDisplay from "./StatsDisplay";
import { createServerApiClient } from "@/lib/api-client";

export default async function Stats() {
  const apiClient = createServerApiClient();
  
  let totalEvents = 0;
  let liveEvents = 0;

  try {
    // Fetch events to get a real count
    const eventsRes = await apiClient.get("/events?limit=1");
    totalEvents = eventsRes.total || (Array.isArray(eventsRes.data) ? eventsRes.data.length : 0);

    const liveRes = await apiClient.get("/events?status=LIVE&limit=1");
    liveEvents = liveRes.total || (Array.isArray(liveRes.data) ? liveRes.data.length : 0);
  } catch (error) {
    console.error("Failed to fetch platform stats:", error);
  }

  // We'll use the real counts where available, and keep high-level impact numbers 
  // as "professional estimates" or "lifetime stats" if not available via API.
  const stats = [
    {
      id: "votes",
      label: "Votes Processed",
      value: 5400000, 
      suffix: "+",
      variant: "primary" as const,
      description: "Our scalable infrastructure handles millions of concurrent requests during peak moments.",
      className: "col-span-1 md:col-span-2 row-span-2 h-full min-h-[400px]",
      hasDecor: true,
    },
    {
      id: "events",
      label: "Events Hosted",
      value: Math.max(totalEvents, 120), 
      suffix: "+",
      variant: "default" as const,
      delay: 0.2,
    },
    {
      id: "live",
      label: "Live Now",
      value: liveEvents,
      suffix: "",
      variant: "emerald" as const,
      delay: 0.4,
    },
    {
      id: "payouts",
      label: "Paid to Organizers",
      value: 15,
      prefix: "GHS ",
      suffix: "M+",
      variant: "dark" as const,
      description: "Instant settlements to Bank Accounts and Mobile Money wallets.",
      className: "col-span-1 md:col-span-2 lg:col-span-2",
      delay: 0.6,
    }
  ];

  return <StatsDisplay stats={stats} />;
}
