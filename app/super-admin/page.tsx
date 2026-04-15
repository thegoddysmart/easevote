import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import {
  Users,
  Calendar,
  DollarSign,
  Vote,
  TrendingUp,
  ArrowUpRight,
  Building2,
  Ticket,
} from "lucide-react";
import { KPICard, ChartCard, ActivityFeed } from "@/components/dashboard";
import Link from "next/link";

export const dynamic = "force-dynamic";

function fmtGHS(amount: number): string {
  if (amount >= 1_000_000) return `GHS ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `GHS ${(amount / 1_000).toFixed(0)}K`;
  return `GHS ${amount.toFixed(0)}`;
}

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default async function SuperAdminDashboard() {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken as string | undefined);

  // Fetch all data sources in parallel, tolerating partial failures
  const [usersRes, eventsRes, txRes, orgRes] = await Promise.allSettled([
    apiClient.get("/users"),
    apiClient.get("/events?limit=100"),
    apiClient.get("/super-admin/transactions?page=1&limit=50"),
    apiClient.get("/organizers"),
  ]);

  // ── Users ────────────────────────────────────────────────────────────────
  const usersData = usersRes.status === "fulfilled" ? usersRes.value : null;
  const users: any[] = Array.isArray(usersData)
    ? usersData
    : usersData?.data ?? [];
  const totalUsers: number = usersData?.total ?? users.length;

  // ── Events ───────────────────────────────────────────────────────────────
  const eventsData = eventsRes.status === "fulfilled" ? eventsRes.value : null;
  const events: any[] = Array.isArray(eventsData)
    ? eventsData
    : eventsData?.data ?? eventsData?.events ?? [];
  const totalEvents: number = eventsData?.total ?? events.length;
  const activeEvents = events.filter(
    (e) => e.status === "LIVE" || e.status === "PUBLISHED" || e.status === "APPROVED",
  ).length;

  // ── Transactions ─────────────────────────────────────────────────────────
  const txData = txRes.status === "fulfilled" ? txRes.value : null;
  const allTx: any[] = Array.isArray(txData)
    ? txData
    : txData?.data ?? txData?.transactions ?? [];
  const successTx = allTx.filter(
    (t) => t.status === "SUCCESS" || t.status === "COMPLETED",
  );
  const totalRevenue = successTx.reduce(
    (sum, t) => sum + (Number(t.amount) || 0), 0,
  );
  const platformFee = totalRevenue * 0.1; // 10% platform fee estimate
  const totalVotes = successTx.reduce(
    (sum, t) => sum + (Number(t.metadata?.quantity) || 0), 0,
  );
  const ticketsSold = successTx.filter((t) => t.metadata?.ticketType).length;
  const pendingPayouts = allTx
    .filter((t) => t.status === "PENDING")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // ── Organizers ───────────────────────────────────────────────────────────
  const orgData = orgRes.status === "fulfilled" ? orgRes.value : null;
  const organizers: any[] = Array.isArray(orgData)
    ? orgData
    : orgData?.data ?? [];
  const totalOrganizers: number = orgData?.total ?? organizers.length;

  // ── Revenue chart: last 6 months ─────────────────────────────────────────
  const now = new Date();
  const revenueByMonth: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    revenueByMonth[MONTH_NAMES[d.getMonth()]] = 0;
  }
  successTx.forEach((t) => {
    if (!t.createdAt) return;
    const key = MONTH_NAMES[new Date(t.createdAt).getMonth()];
    if (key in revenueByMonth) {
      revenueByMonth[key] = (revenueByMonth[key] || 0) + (Number(t.amount) || 0);
    }
  });
  const revenueData = Object.entries(revenueByMonth).map(([name, revenue]) => ({
    name,
    revenue: Math.round(revenue),
  }));

  // ── Event type distribution ───────────────────────────────────────────────
  const votingCount = events.filter(
    (e) => e.type === "VOTING" || e.categories?.length > 0,
  ).length;
  const ticketingCount = events.filter(
    (e) => e.type === "TICKETING" || e.ticketTypes?.length > 0,
  ).length;
  const freeCount = Math.max(0, events.length - votingCount - ticketingCount);
  const eventTypeData = [
    { name: "Voting Events", value: votingCount },
    { name: "Ticketed Events", value: ticketingCount },
    { name: "Free Events", value: freeCount },
  ].filter((d) => d.value > 0);

  // ── Top performing events ────────────────────────────────────────────────
  const topEvents = [...events]
    .sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))
    .slice(0, 4);

  // ── Recent activity from latest transactions ──────────────────────────────
  const recentActivities = successTx.slice(0, 5).map((t, i) => ({
    id: t._id || t.id || String(i),
    title: t.metadata?.eventName || t.eventCode || "Transaction",
    description: `${fmtGHS(Number(t.amount) || 0)} · ${t.customerName || t.customerEmail || "Customer"}`,
    time: t.createdAt
      ? new Date(t.createdAt).toLocaleString("en-GH", {
          dateStyle: "short",
          timeStyle: "short",
        })
      : "Recently",
    user: {
      name:
        t.customerName ||
        t.customerEmail?.split("@")[0] ||
        "Customer",
    },
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
          <p className="text-slate-500">
            Welcome back! Here&apos;s what&apos;s happening on EaseVote today.
          </p>
        </div>
        <Link
          href="/super-admin/analytics"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <TrendingUp className="h-4 w-4" />
          View Reports
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={fmtGHS(totalRevenue)}
          icon={DollarSign}
          iconColor="bg-green-100 text-green-600"
        />
        <KPICard
          title="Active Events"
          value={fmtCount(activeEvents)}
          icon={Calendar}
          iconColor="bg-blue-100 text-blue-600"
        />
        <KPICard
          title="Total Votes Cast"
          value={fmtCount(totalVotes)}
          icon={Vote}
          iconColor="bg-purple-100 text-purple-600"
        />
        <KPICard
          title="Registered Organizers"
          value={fmtCount(totalOrganizers)}
          icon={Building2}
          iconColor="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value={fmtCount(totalUsers)}
          icon={Users}
          iconColor="bg-cyan-100 text-cyan-600"
        />
        <KPICard
          title="Tickets Sold"
          value={fmtCount(ticketsSold)}
          icon={Ticket}
          iconColor="bg-pink-100 text-pink-600"
        />
        <KPICard
          title="Platform Fee Earned"
          value={fmtGHS(platformFee)}
          icon={DollarSign}
          iconColor="bg-emerald-100 text-emerald-600"
        />
        <KPICard
          title="Pending Payouts"
          value={fmtGHS(pendingPayouts)}
          icon={ArrowUpRight}
          iconColor="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Trend"
            subtitle="Monthly revenue over the last 6 months"
            type="line"
            data={revenueData}
            dataKey="revenue"
            xAxisKey="name"
          />
        </div>
        <div>
          <ChartCard
            title="Event Distribution"
            subtitle="By event type"
            type="pie"
            data={eventTypeData.length > 0 ? eventTypeData : [{ name: "No events", value: 1 }]}
            dataKey="value"
            xAxisKey="name"
            height={250}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Top Performing Events
              </h3>
              <Link
                href="/super-admin/events"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {topEvents.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No events found
                </p>
              ) : (
                topEvents.map((event, i) => (
                  <div
                    key={event._id || event.id || i}
                    className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {event.title || event.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {event.organizer?.name ||
                          event.organizerName ||
                          event.organizerId ||
                          "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        {fmtGHS(
                          successTx
                            .filter((t) => t.eventCode === event.eventCode)
                            .reduce((s, t) => s + (Number(t.amount) || 0), 0),
                        )}
                      </p>
                      <p className="text-sm text-slate-500">
                        {event.totalVotes != null
                          ? `${fmtCount(event.totalVotes)} votes`
                          : "Tickets"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <ActivityFeed
          activities={recentActivities}
          title="Recent Transactions"
        />
      </div>
    </div>
  );
}
