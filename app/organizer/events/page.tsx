"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Vote,
  Ticket,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  ChevronDown,
  X,
  RefreshCw,
} from "lucide-react";
import { clsx } from "clsx";
import { api } from "@/lib/api-client";
import { PaginationControls } from "@/components/ui/PaginationControls";

type Event = {
  id: string;
  _id?: string;
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

const typeConfig: Record<
  string,
  { label: string; icon: typeof Vote; color: string }
> = {
  VOTING: { label: "Voting", icon: Vote, color: "text-purple-600" },
  TICKETING: { label: "Ticketing", icon: Ticket, color: "text-blue-600" },
  HYBRID: { label: "Hybrid", icon: Calendar, color: "text-amber-600" },
};

export default function OrganizerEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Pagination State
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const data = await api.get(`/events/my/events?${params}`);
      const rawEvents = Array.isArray(data)
        ? data
        : data.events || data.data || [];
      setEvents(rawEvents);
      setTotalPages(
        data.pagination?.pages ||
          Math.ceil((data.total || rawEvents.length) / limit) ||
          1,
      );
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [statusFilter, typeFilter, page]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchEvents();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

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

  const formatCurrency = (amount: number | null | undefined) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const getEventDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (now < start) {
      const days = Math.ceil(
        (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return `Starts in ${days} day${days !== 1 ? "s" : ""}`;
    } else if (now > end) {
      return "Ended";
    } else {
      const days = Math.ceil(
        (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return `${days} day${days !== 1 ? "s" : ""} left`;
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    router.push("/organizer/events"); // Remove query parameters
  };

  const hasActiveFilters =
    statusFilter !== "all" || typeFilter !== "all" || searchQuery;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Events</h1>
          <p className="text-slate-500">
            Manage and monitor all your voting and ticketing events.
          </p>
        </div>
        <button
          onClick={() => router.push("/organizer/events/new")}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search events by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors",
                  showFilters
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50",
                )}
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-primary-500 rounded-full" />
                )}
              </button>
              <button
                onClick={fetchEvents}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw
                  className={clsx("h-4 w-4", loading && "animate-spin")}
                />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="LIVE">Live</option>
                  <option value="PAUSED">Paused</option>
                  <option value="ENDED">Ended</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="VOTING">Voting</option>
                  <option value="TICKETING">Ticketing</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg animate-pulse"
                >
                  <div className="w-16 h-16 bg-slate-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-20" />
                    <div className="h-3 bg-slate-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No events found
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? "No events match your current filters. Try adjusting your search criteria."
                : "You haven't created any events yet. Get started by creating your first event!"}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={() => router.push("/organizer/events/new")}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Your First Event
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((event) => {
              const TypeIcon = typeConfig[event.type]?.icon || Calendar;
              const statusStyles =
                statusConfig[event.status] || statusConfig.DRAFT;

              return (
                <div
                  key={event.id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/organizer/events/${event._id || event.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TypeIcon
                        className={clsx(
                          "h-7 w-7",
                          typeConfig[event.type]?.color,
                        )}
                      />
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
                                statusStyles.color,
                              )}
                            >
                              {statusStyles.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                              {event.eventCode}
                            </span>
                            <span className="flex items-center gap-1">
                              <TypeIcon className="h-3.5 w-3.5" />
                              {typeConfig[event.type]?.label}
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
                                activeMenu === (event._id || event.id) ? null : (event._id || event.id)
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
                                  router.push(`/organizer/events/${event._id || event.id}`)
                                }
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </button>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/organizer/events/${event._id || event.id}/edit`,
                                  )
                                }
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Event
                              </button>
                              <hr className="my-1 border-slate-100" />
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                                Delete Event
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-medium">
                            {formatCurrency(event.totalRevenue)}
                          </span>
                          <span className="text-slate-400">revenue</span>
                        </div>
                        {event.type === "VOTING" && (
                          <>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Vote className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">
                                { (event.totalVotes || 0).toLocaleString()}
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
                          </>
                        )}
                        {event.type === "TICKETING" && (
                          <>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Ticket className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {event.ticketsSold}
                              </span>
                              <span className="text-slate-400">
                                tickets sold
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Calendar className="h-4 w-4 text-amber-500" />
                              <span className="font-medium">
                                {event.ticketTypesCount}
                              </span>
                              <span className="text-slate-400">
                                ticket types
                              </span>
                            </div>
                          </>
                        )}
                        {event.type === "HYBRID" && (
                          <>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Vote className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">
                                { (event.totalVotes || 0).toLocaleString()}
                              </span>
                              <span className="text-slate-400">votes</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Ticket className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {event.ticketsSold}
                              </span>
                              <span className="text-slate-400">tickets</span>
                            </div>
                          </>
                        )}
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500">
                          {getEventDuration(event.startDate, event.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {events.length > 0 && (
          <>
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-600">
                Showing {events.length} event{events.length !== 1 ? "s" : ""} on
                this page
              </p>
            </div>
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              basePath="/organizer/events"
            />
          </>
        )}
      </div>
    </div>
  );
}
