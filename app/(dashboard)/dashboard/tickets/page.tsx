import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createServerApiClient } from "@/lib/api-client";
import TicketsDashboardClient from "@/app/(dashboard)/dashboard/tickets/TicketsDashboardClient";

// Ticketing Sales Dashboard Server Component

export default async function TicketSalesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.organizerId) {
    redirect("/sign-in");
  }

  const apiClient = createServerApiClient(session?.accessToken as string | undefined);
  const role = session?.user?.role;

  // Determine endpoint based on role
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const endpoint = isAdmin ? "/events/admin/all" : "/events/my/events";

  // Fetch Events
  const eventsResult = await apiClient.get(endpoint).catch(() => []);
  const events = eventsResult.data || eventsResult.events || (Array.isArray(eventsResult) ? eventsResult : []);

  // Filter to only TICKETING and HYBRID events
  const serializedEvents = (Array.isArray(events) ? events : [])
    .filter((event: any) => event.type === "TICKETING" || event.type === "HYBRID")
    .map((event: any) => {
      // Aggregate ticket sales data
      let ticketsSold = 0;
      let totalRevenue = 0;
      
      const ticketTypes = (event.ticketTypes || []).map((tt: any) => {
          const sold = Number(tt.sold ?? tt.soldCount ?? 0);
          const price = Number(tt.price ?? 0);
          ticketsSold += sold;
          totalRevenue += (sold * price);
          return {
              ...tt,
              sold,
              price,
              id: tt._id || tt.id
          };
      });

      return {
        ...event,
        id: event.id || event._id,
        ticketTypes,
        // Ensure summary ALWAYS matches the sum of the tiers for consistency
        totalTicketsSold: ticketsSold,
        totalRevenue: totalRevenue,
      };
    });

  return <TicketsDashboardClient events={serializedEvents} />;
}
