import {
  Calendar,
  DollarSign,
  Vote,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { KPICard, ChartCard, ActivityFeed } from "@/components/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import Link from "next/link";

// Helper for time aggregation and formatting
const getDayName = (date: Date) => {
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const getTimeAgo = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return date.toLocaleDateString();
};


export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken);

  // Fetch all resources concurrently
  const [eventsRes, usersRes, purchasesRes] = await Promise.all([
    apiClient.get<any>("/events").catch(() => ({ data: [] })),
    apiClient.get<any>("/users").catch(() => ({ data: [] })),
    apiClient.get<any>("/purchases/history").catch(() => ({ data: [] })),
  ]);

  const rawEvents = eventsRes.data || (Array.isArray(eventsRes) ? eventsRes : []);
  const rawUsers = usersRes.data || (Array.isArray(usersRes) ? usersRes : []);
  const rawPurchases = purchasesRes.data || (Array.isArray(purchasesRes) ? purchasesRes : []);

  // Computed Metrics
  const activeEvents = rawEvents.filter((e: any) => e.status === "LIVE").length;

  const rawPendingEvents = rawEvents.filter((e: any) => e.status === "PENDING");
  const pendingApprovalsCount = rawPendingEvents.length;

  const activeOrganizers = rawUsers.filter(
    (u: any) => u.role === "ORGANIZER" && (u.status === "ACTIVE" || u.status === "APPROVED"),
  ).length;

  const today = new Date();
  
  const todayRevenue = rawPurchases.reduce((acc: number, p: any) => {
    const pDate = new Date(p.createdAt);
    const isToday = 
      pDate.getDate() === today.getDate() &&
      pDate.getMonth() === today.getMonth() &&
      pDate.getFullYear() === today.getFullYear();
    
    if (isToday && (p.status === "SUCCESS" || p.status === "COMPLETED")) {
      return acc + (Number(p.amount) || 0);
    }
    return acc;
  }, 0);

  const approvedToday = rawEvents.filter((e: any) => {
    if (e.status !== "LIVE") return false;
    const updatedAt = new Date(e.updatedAt);
    return (
      updatedAt.getDate() === today.getDate() &&
      updatedAt.getMonth() === today.getMonth() &&
      updatedAt.getFullYear() === today.getFullYear()
    );
  }).length;

  // 1. Generate Weekly Events Data
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyEventsData = days.map((day) => {
    const count = rawEvents.filter((e: any) => {
      const eDate = new Date(e.createdAt);
      return getDayName(eDate) === day;
    }).length;
    return { name: day, events: count };
  });

  // 2. Generate Recent Activities (Last 24h)
  const last24h = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  const recentEvents = rawEvents
    .filter((e: any) => new Date(e.createdAt) > last24h || new Date(e.updatedAt) > last24h)
    .map((e: any) => ({
      id: `ev-${e._id || e.id}`,
      title: e.status === "PENDING" ? "New event submitted" : "Event status updated",
      description: `${e.title} is ${e.status.toLowerCase()}`,
      time: getTimeAgo(new Date(e.updatedAt || e.createdAt)),
      user: { name: "System" },
      timestamp: new Date(e.updatedAt || e.createdAt).getTime()
    }));

  const recentUsers = rawUsers
    .filter((u: any) => new Date(u.createdAt) > last24h)
    .map((u: any) => ({
      id: `usr-${u._id || u.id}`,
      title: "New user registered",
      description: `${u.fullName} joined as ${u.role.toLowerCase()}`,
      time: getTimeAgo(new Date(u.createdAt)),
      user: { name: "System" },
      timestamp: new Date(u.createdAt).getTime()
    }));

  const recentActivities = [...recentEvents, ...recentUsers]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  // Format pending approvals for explicitly mapping into UI
  const pendingApprovalsDisplay = rawPendingEvents.slice(0, 5).map((e: any) => ({
    id: e._id || e.id,
    name: e.title || "Untitled Event",
    organizer:
      e.organizerId?.businessName ||
      e.organizerId?.fullName ||
      "Unknown Organizer",
    type: e.type === "VOTING" || e.type === "HYBRID" ? "Voting" : "Ticketing",
    submitted: new Date(e.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">
            Manage events, organizers, and platform operations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Pending Approvals"
          value={pendingApprovalsCount.toString()}
          icon={Clock}
          iconColor="bg-amber-100 text-amber-600"
        />
        <KPICard
          title="Active Events"
          value={activeEvents.toString()}
          icon={Calendar}
          iconColor="bg-blue-100 text-blue-600"
        />
        <KPICard
          title="Today's Transactions"
          value={`GHS ${todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          iconColor="bg-green-100 text-green-600"
        />
        <KPICard
          title="Active Organizers"
          value={activeOrganizers.toString()}
          icon={Building2}
          iconColor="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Events This Week"
            subtitle="Number of events created per day"
            type="bar"
            data={weeklyEventsData}
            dataKey="events"
            xAxisKey="name"
          />
        </div>
        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 h-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Approved Today
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {approvedToday}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Pending Review
                  </span>
                </div>
                <span className="text-lg font-bold text-amber-600">
                  {pendingApprovalsCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    Flagged Issues
                  </span>
                </div>
                <span className="text-lg font-bold text-red-600">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Pending Approvals
              </h3>
              <Link
                href="/admin/events?status=PENDING"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {pendingApprovalsDisplay.length === 0 ? (
                <div className="text-center p-6 text-slate-500 text-sm bg-slate-50 rounded-lg border border-slate-100">
                  No new events pending approval.
                </div>
              ) : (
                pendingApprovalsDisplay.map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        {event.type === "Voting" ? (
                          <Vote className="h-5 w-5 text-amber-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {event.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {event.organizer} • {event.submitted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/admin/events"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                      >
                        Review
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <ActivityFeed activities={recentActivities} title="Recent Actions" />
      </div>
    </div>
  );
}
