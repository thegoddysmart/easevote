import Hero from "@/components/features/Hero";
import LiveEvents from "@/components/features/LiveEvents";
import LiveTickets from "@/components/features/LiveTickets";
import Partners from "@/components/features/Partners";
import Stats from "@/components/features/Stats";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// Dynamically load components below the fold
const HowItWorks = dynamic(() => import("@/components/features/HowItWorks"));
const Testimonials = dynamic(
  () => import("@/components/features/Testimonials"),
);
const Newsletter = dynamic(() => import("@/components/features/Newsletter"));

export const metadata: Metadata = {
  title: "EaseVote Ghana | Home",
  description:
    "The easiest way to vote for your favorite contestants and buy event tickets in Ghana. Secure, fast, and reliable.",
  alternates: {
    canonical: "https://easevotegh.com",
  },
};

import { createServerApiClient } from "@/lib/api-client";

export default async function Home() {
  const apiClient = createServerApiClient();
  let votingEvents: any[] = [];
  let ticketingEvents: any[] = [];

  try {
    const fetchEvents = async (type: string, status: string) => {
      const res = await apiClient.get<any>(`/events?type=${type}&status=${status}`).catch(() => null);
      if (res) {
        return res.data || res.events || res || [];
      }
      return [];
    };

    const results = await Promise.all([
      fetchEvents("VOTING", "LIVE"),
      fetchEvents("VOTING", "PUBLISHED"),
      fetchEvents("TICKETING", "LIVE"),
      fetchEvents("TICKETING", "PUBLISHED"),
      fetchEvents("HYBRID", "LIVE"),
      fetchEvents("HYBRID", "PUBLISHED"),
    ]);

    // Voting events = VOTING (LIVE/PUBLISHED) + HYBRID (LIVE/PUBLISHED)
    votingEvents = [...results[0], ...results[1], ...results[4], ...results[5]];
    
    // Ticketing events = TICKETING (LIVE/PUBLISHED) + HYBRID (LIVE/PUBLISHED)
    ticketingEvents = [...results[2], ...results[3], ...results[4], ...results[5]];
    
  } catch (err) {
    console.error("Failed to fetch public events frontpage data:", err);
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <LiveEvents events={votingEvents} />
      <LiveTickets events={ticketingEvents} />
      <Partners />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
