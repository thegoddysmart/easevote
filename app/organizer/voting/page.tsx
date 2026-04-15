"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Vote,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Calendar,
  RefreshCw,
  Trophy,
  Globe,
} from "lucide-react";
import { clsx } from "clsx";

type Event = {
  id: string;
  eventCode: string;
  title: string;
  type: "VOTING" | "TICKETING" | "HYBRID";
  status:
    | "DRAFT"
    | "PENDING_REVIEW"
    | "APPROVED"
    | "LIVE"
    | "PAUSED"
    | "ENDED"
    | "CANCELLED";
  coverImage: string | null;
  startDate: string;
  endDate: string;
  votePrice: number | null;
  totalVotes: number;
  totalRevenue: number;
  categoriesCount: number;
  candidatesCount: number;
  ticketTypesCount: number;
  ticketsSold: number;
  transactionsCount: number;
  createdAt: string;
  publishedAt: string | null;
};

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  DRAFT: { label: "Draft", color: "text-slate-600", bg: "bg-slate-100" },
  PENDING_REVIEW: {
    label: "Pending Review",
    color: "text-yellow-700",
    bg: "bg-yellow-100",
  },
  APPROVED: { label: "Approved", color: "text-blue-700", bg: "bg-blue-100" },
  LIVE: { label: "Live", color: "text-green-700", bg: "bg-green-100" },
  PAUSED: { label: "Paused", color: "text-orange-700", bg: "bg-orange-100" },
  ENDED: { label: "Ended", color: "text-slate-600", bg: "bg-slate-200" },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100" },
};

export default function OrganizerVotingPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // States for stats
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalRevenue: 0,
    activeEvents: 0,
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch all events then filter client-side for flexibility
      // Or if API supported filtering by multiple types, we'd use that.
      // Current API supports single type. So we fetch all and filter.
      // Wait, if I fetch type=VOTING, I miss HYBRID.
      // So I will fetch ALL and filter since the list is likely small for MVP.
      const response = await fetch("/api/organizer/events");
      if (response.ok) {
        const allData: Event[] = await response.json();

        // Filter for Voting/Hybrid
        const votingEvents = allData.filter(
          (ev) => ev.type === "VOTING" || ev.type === "HYBRID"
        );

        setEvents(votingEvents);

        // Calculate stats
        const votes = votingEvents.reduce((acc, ev) => acc + ev.totalVotes, 0);
        // Revenue for voting events might include ticket sales if Hybrid.
        // Ideally we'd separate them, but `totalRevenue` is per event.
        const revenue = votingEvents.reduce(
          (acc, ev) => acc + ev.totalRevenue,
          0
        );
        const active = votingEvents.filter((ev) => ev.status === "LIVE").length;

        setStats({
          totalVotes: votes,
          totalRevenue: revenue,
          activeEvents: active,
        });
      }
    } catch (error) {
      console.error("Error fetching voting events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getOrdinalNum = (n: number) => {
    return (
      n +
      (n > 0
        ? ["th", "st", "nd", "rd"][
            (n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10
          ]
        : "")
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = getOrdinalNum(date.getDate());
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Voting Events</h1>
          <p className="text-slate-500">
            Manage your elections, polls, and voting competitions.
          </p>
        </div>
        <button
          onClick={() => router.push("/organizer/events/new")}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Election
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Vote className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Votes</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {stats.totalVotes.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {formatCurrency(stats.totalRevenue)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Globe className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Channel Split</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">WEB: 65%</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">USSD: 35%</span>
              </div>
            </div>
          </div>
          {/* Subtle progress bar for channel split */}
          <div className="absolute bottom-0 left-0 right-0 h-1 flex">
             <div className="bg-blue-500 h-full" style={{ width: '65%' }}></div>
             <div className="bg-purple-500 h-full" style={{ width: '35%' }}></div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Elections & Polls</h2>
          <button
            onClick={fetchEvents}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg animate-pulse"
              >
                <div className="w-16 h-16 bg-slate-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Vote className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No voting events found
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              You haven't created any elections or polls yet.
            </p>
            <button
              onClick={() => router.push("/organizer/events/new")}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Election
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((event) => {
              const statusStyles =
                statusConfig[event.status] || statusConfig.DRAFT;

              return (
                <div
                  key={event.id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/organizer/events/${event.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-600">
                      <Vote className="h-7 w-7" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {event.title}
                            </h3>
                            <span
                              className={clsx(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                statusStyles.bg,
                                statusStyles.color
                              )}
                            >
                              {statusStyles.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                              {event.eventCode}
                            </span>
                            <span>
                              {formatDate(event.startDate)} -{" "}
                              {formatDate(event.endDate)}
                            </span>
                          </div>
                        </div>

                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === event.id ? null : event.id
                              )
                            }
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                          </button>
                          {activeMenu === event.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                              <button
                                onClick={() =>
                                  router.push(`/organizer/events/${event.id}`)
                                }
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </button>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/organizer/events/${event.id}/edit`
                                  )
                                }
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Event
                              </button>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/organizer/events/${event.id}/categories`
                                  )
                                }
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Users className="h-4 w-4" />
                                Manage Candidates
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Vote className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">
                            {event.totalVotes.toLocaleString()}
                          </span>
                          <span className="text-slate-400">votes</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {event.candidatesCount}
                          </span>
                          <span className="text-slate-400">candidates</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-medium">
                            {formatCurrency(event.totalRevenue)}
                          </span>
                          <span className="text-slate-400">revenue</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
