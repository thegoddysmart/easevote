import {
  Calendar,
  DollarSign,
  Vote,
  Users,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Eye,
} from "lucide-react";
import { KPICard, ChartCard, ActivityFeed } from "@/components/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import Link from "next/link";

const votesData = [
  { name: "Week 1", votes: 1200 },
  { name: "Week 2", votes: 2800 },
  { name: "Week 3", votes: 4500 },
  { name: "Week 4", votes: 6200 },
];

const recentActivities = [
  {
    id: "1",
    title: "New votes received",
    description: "150 new votes for Miss Campus 2024",
    time: "15 minutes ago",
    user: { name: "System" },
  },
  {
    id: "2",
    title: "Ticket sold",
    description: "5 VIP tickets for Music Night",
    time: "1 hour ago",
    user: { name: "Customer" },
  },
  {
    id: "3",
    title: "Event approved",
    description: "Your event 'Tech Meetup' is now live",
    time: "3 hours ago",
    user: { name: "Admin" },
  },
  {
    id: "4",
    title: "Payout processed",
    description: "GHS 5,000 transferred to your account",
    time: "1 day ago",
    user: { name: "Finance" },
  },
];

export default async function OrganizerDashboard() {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken);

  // Fetch organizer's events
  const eventsRes = await apiClient
    .get("/events/my/events")
    .catch(() => ({ data: [] }));
  const rawEvents = eventsRes.data || [];

  // Compute metrics
  const activeEventsCount = rawEvents.filter(
    (e: any) => e.status === "LIVE",
  ).length;

  const totalEarnings = rawEvents.reduce(
    (acc: number, e: any) => acc + (Number(e.totalRevenue) || 0),
    0,
  );

  const totalVotes = rawEvents.reduce(
    (acc: number, e: any) => acc + (Number(e.totalVotes) || 0),
    0,
  );

  // Take top 5 recent events
  const recentEvents = rawEvents.slice(0, 5).map((e: any) => ({
    id: e._id || e.id,
    name: e.title || "Untitled Event",
    type: e.type === "VOTING" || e.type === "HYBRID" ? "Voting" : "Ticketing",
    status:
      e.status === "LIVE"
        ? "Active"
        : e.status === "PENDING"
          ? "Pending"
          : "Ended",
    votes:
      e.type === "TICKETING"
        ? "N/A"
        : new Intl.NumberFormat("en-GH").format(Number(e.totalVotes) || 0),
    revenue: new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(Number(e.totalRevenue) || 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
          <p className="text-slate-500">
            Manage your events and track performance.
          </p>
        </div>
        <Link
          href="/organizer/events/new"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Earnings"
          value={new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: "GHS",
          }).format(totalEarnings)}
          icon={DollarSign}
          iconColor="bg-green-100 text-green-600"
        />
        <KPICard
          title="Active Events"
          value={activeEventsCount.toString()}
          icon={Calendar}
          iconColor="bg-blue-100 text-blue-600"
        />
        <KPICard
          title="Total Votes"
          value={new Intl.NumberFormat("en-GH").format(totalVotes)}
          icon={Vote}
          iconColor="bg-purple-100 text-purple-600"
        />
        <KPICard
          title="Total Participants"
          value="0"
          icon={Users}
          iconColor="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Vote Trends"
            subtitle="Weekly votes for active events"
            type="line"
            data={votesData}
            dataKey="votes"
            xAxisKey="name"
          />
        </div>
        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 h-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/organizer/events/new"
                className="w-full flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-left"
              >
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Plus className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Create Event</p>
                  <p className="text-sm text-slate-500">
                    Start a new voting or ticketing event
                  </p>
                </div>
              </Link>
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Add Candidates</p>
                  <p className="text-sm text-slate-500">
                    Add nominees to your voting events
                  </p>
                </div>
              </button>
              <Link
                href="/organizer/payouts"
                className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Request Payout</p>
                  <p className="text-sm text-slate-500">
                    Withdraw your available earnings
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                My Events
              </h3>
              <Link
                href="/organizer/events"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentEvents.length === 0 ? (
                <div className="text-center p-6 text-slate-500 text-sm bg-slate-50 rounded-lg border border-slate-100">
                  You haven't created any events yet.
                </div>
              ) : (
                recentEvents.map((event: any) => (
                  <Link
                    href={`/organizer/events/${event.id}`}
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        {event.type === "Voting" ? (
                          <Vote className="h-5 w-5 text-amber-600" />
                        ) : (
                          <Calendar className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {event.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              event.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : event.status === "Pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {event.status}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        {event.revenue}
                      </p>
                      <p className="text-sm text-slate-500">
                        {event.votes !== "N/A"
                          ? `${event.votes} votes`
                          : "Tickets"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
        <ActivityFeed activities={recentActivities} title="Recent Activity" />
      </div>
    </div>
  );
}
