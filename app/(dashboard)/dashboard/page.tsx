import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import { SuperAdminOverview } from "@/components/dashboard/SuperAdminOverview";
import { OrganizerOverview } from "@/components/dashboard/OrganizerOverview";
import { redirect } from "next/navigation";
import { computeEventStats } from "@/lib/event-stats";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }

  const role = session.user?.role;
  const apiClient = createServerApiClient(session?.accessToken as string | undefined);

  // ─── 1. Super Admin / Admin View ───────────────────────────────
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    // Fetch from REAL endpoints only, tolerate partial failures
    const [usersRes, eventsRes, statsRes, pulseRes] = await Promise.allSettled([
      apiClient.get("/users"),
      apiClient.get("/events/admin/all?limit=200"),
      apiClient.get("/admin/stats/revenue"),
      apiClient.get("/admin/stats/platform"),
    ]);

    // ── Pulse Stats (Source of Truth for Totals) ──
    const pulseRaw = pulseRes.status === "fulfilled" ? pulseRes.value : { data: {} };
    const pulse = pulseRaw.data || pulseRaw || {};
    const overview = pulse.overview || {};

    // ── Users ──
    const usersRaw = usersRes.status === "fulfilled" ? usersRes.value : [];
    const users: any[] = Array.isArray(usersRaw) ? usersRaw : usersRaw?.data ?? [];
    const totalUsers = overview.totalUsers || users.length;
    const totalOrganizers = overview.registeredOrganizers || users.filter((u: any) => u.role === "ORGANIZER").length;

    // ── Events ──
    const eventsRaw = eventsRes.status === "fulfilled" ? eventsRes.value : { data: [] };
    const events: any[] = Array.isArray(eventsRaw) ? eventsRaw : eventsRaw?.data ?? [];
    const activeEvents = overview.activeEvents || events.filter((e) => 
      ["LIVE", "Live", "PUBLISHED", "APPROVED", "Upcoming"].includes(e.status)
    ).length;

    // Stats from Ledger
    const totalVotes = overview.totalVotesCast || 0;
    const ticketsSold = overview.ticketsSold || 0;
    const totalRevenue = overview.totalRevenue || 0;
    const platformFee = overview.platformFeeEarned || 0;
    const pendingPayouts = overview.pendingPayouts || 0;
    // ── Event type distribution ──
    const votingCount = events.filter((e) => e.type === "VOTING").length;
    const ticketingCount = events.filter((e) => e.type === "TICKETING").length;
    const otherCount = Math.max(0, events.length - votingCount - ticketingCount);
    const eventTypeData = [
      { name: "Voting Events", value: votingCount },
      { name: "Ticketed Events", value: ticketingCount },
      { name: "Other Events", value: otherCount },
    ].filter((d) => d.value > 0);

    // ── Revenue Trend (from Ledger) ──
    const revenueData = overview.revenueTrend || [];

    // ── Top Events (from Ledger) ──
    const topEvents = overview.topEvents || [];

    // ── Recent events as activity proxy ──
    const recentActivities = pulse.recentActivity || [...events]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((e, i) => ({
        id: e._id || String(i),
        title: e.title || "Event",
        description: `${e.type || "Event"} · ${e.status}`,
        time: e.createdAt
          ? new Date(e.createdAt).toLocaleString("en-GH", { dateStyle: "short", timeStyle: "short" })
          : "Recently",
        user: {
          name:
            typeof e.organizerId === "object"
              ? e.organizerId?.fullName || "Organizer"
              : "Organizer",
        },
      }));

    return (
      <SuperAdminOverview
        data={{
          totalUsers,
          activeEvents,
          totalVotes,
          totalOrganizers,
          ticketsSold,
          totalRevenue,
          platformFee,
          pendingPayouts,
          revenueData,
          eventTypeData,
          topEvents,
          recentActivities,
        }}
      />
    );
  }

  // ─── 2. Organizer View ─────────────────────────────────────────
  if (role === "ORGANIZER") {
    const [eventsRes, statsRes] = await Promise.all([
        apiClient.get("/events/my/events?limit=100").catch(() => ({ data: [] })),
        apiClient.get("/events/my/stats").catch(() => ({ data: {} }))
    ]);

    const rawEvents: any[] = Array.isArray(eventsRes) ? eventsRes : (eventsRes as any)?.data ?? [];
    const statsData = statsRes.data || statsRes || {};

    return (
      <OrganizerOverview
        data={{
          events: rawEvents.slice(0, 5),
          analytics: {
            totalRevenue: statsData.totalRevenue || 0,
            totalVotes: statsData.totalVotes || 0,
            activeEvents: rawEvents.filter((e: any) => e.status === "LIVE" || e.status === "PUBLISHED").length,
          },
        }}
      />
    );
  }

  // Fallback for other roles
  redirect("/");
}
