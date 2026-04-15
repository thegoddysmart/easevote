"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/dashboard";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Vote,
  Ticket,
  Calendar,
  Ban,
  PauseCircle,
  Search,
  Filter,
  X,
  Archive,
  RotateCcw,
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import { api } from "@/lib/api-client";

type GlobalEvent = {
  id: string;
  eventCode: string;
  title: string;
  organizer: {
    name: string;
    avatar: string;
  };
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  stats: {
    votes?: number;
    revenue?: number;
  };
};

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  PENDING_REVIEW: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: AlertCircle,
  },
  APPROVED: {
    label: "Approved",
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: CheckCircle,
  },
  LIVE: {
    label: "Live",
    color: "text-green-700",
    bg: "bg-green-100",
    icon: CheckCircle,
  },
  ENDED: {
    label: "Ended",
    color: "text-slate-600",
    bg: "bg-slate-100",
    icon: CheckCircle,
  },
  ARCHIVED: {
    label: "Archived",
    color: "text-gray-500",
    bg: "bg-gray-100",
    icon: Archive,
  },
  DRAFT: {
    label: "Draft",
    color: "text-slate-500",
    bg: "bg-slate-100",
    icon: MoreHorizontal,
  },
  PAUSED: {
    label: "Paused",
    color: "text-orange-700",
    bg: "bg-orange-100",
    icon: PauseCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-100",
    icon: Ban,
  },
};

const typeConfig: Record<string, { label: string; icon: any; color: string }> =
  {
    VOTING: { label: "Voting", icon: Vote, color: "text-purple-600" },
    TICKETING: { label: "Ticketing", icon: Ticket, color: "text-blue-600" },
    HYBRID: { label: "Hybrid", icon: Calendar, color: "text-orange-600" },
  };

export default function GlobalEventsTable({
  events,
}: {
  events: GlobalEvent[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  // Archival Modal State
  const [archiveModal, setArchiveModal] = useState<{
    isOpen: boolean;
    eventId: string | null;
    eventTitle: string;
  }>({ isOpen: false, eventId: null, eventTitle: "" });
  const [pruneData, setPruneData] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || "",
  );
  const statusFilter = searchParams.get("status") || "all";
  const typeFilter = searchParams.get("type") || "all";
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search update
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams);
    if (query) params.set("query", query);
    else params.delete("query");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleAction = async (action: string, eventId: string) => {
    setActiveMenu(null);
    setPending(true);

    try {
      if (action === "approve") {
        if (!confirm("Approve this event to go live?")) {
          setPending(false);
          return;
        }
        const result = await api.patch(`/admin/events/${eventId}/approve`, {});
        if (!result.success && !result.message)
          alert("Failed to approve event");
        else {
          alert("Event approved!");
          router.refresh();
        }
        setPending(false);
        return;
      }

      if (action === "reject") {
        const reason = prompt("Enter reason for rejection:");
        if (reason === null) {
          setPending(false);
          return;
        }
        const result = await api.patch(`/admin/events/${eventId}/reject`, {
          reason,
        });
        if (!result.success && !result.message) alert("Failed to reject event");
        else {
          alert("Event rejected!");
          router.refresh();
        }
        setPending(false);
        return;
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setPending(false);
    }
  };

  const headers = [
    {
      key: "title",
      header: "Event Info",
      render: (event: GlobalEvent) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            {(() => {
              const Icon = typeConfig[event.type]?.icon || Calendar;
              return <Icon className="h-5 w-5" />;
            })()}
          </div>
          <div>
            <div
              className="font-medium text-slate-900 line-clamp-1"
              title={event.title}
            >
              {event.title}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {event.eventCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "organizer",
      header: "Organizer",
      render: (event: GlobalEvent) => (
        <div className="flex items-center gap-2 max-w-[180px]">
          <div className="h-6 w-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 ring-white shrink-0">
            {(event.organizer.avatar || "").length > 2 ? (
              event.organizer.avatar.startsWith("http") ? (
                <img
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                (event.organizer.name || "O").substring(0, 1)
              )
            ) : (
              (event.organizer.name || "O").substring(0, 1)
            )}
          </div>
          <span
            className="text-sm text-slate-700 truncate"
            title={event.organizer.name}
          >
            {event.organizer.name}
          </span>
        </div>
      ),
    },
    {
      key: "stats",
      header: "Performance",
      render: (event: GlobalEvent) => (
        <div className="text-sm">
          <div className="font-medium text-slate-900">
            {new Intl.NumberFormat("en-GH", {
              style: "currency",
              currency: "GHS",
              minimumFractionDigits: 0,
            }).format(event.stats.revenue || 0)}
          </div>
          <div className="text-xs text-slate-500">
            {(event.stats?.votes || 0).toLocaleString()} votes
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (event: GlobalEvent) => {
        const config = typeConfig[event.type] || {
          label: event.type,
          icon: Calendar,
          color: "text-slate-600",
        };
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-1.5">
            <Icon className={clsx("h-4 w-4", config.color)} />
            <span className="text-sm text-slate-600">{config.label}</span>
          </div>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (event: GlobalEvent) => (
        <div className="flex flex-col text-sm text-slate-600">
          <span>{new Date(event.startDate).toLocaleDateString()}</span>
          <span className="text-xs text-slate-400">
            to {new Date(event.endDate).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (event: GlobalEvent) => {
        const config = statusConfig[event.status] || {
          label: event.status,
          bg: "bg-gray-100",
          color: "text-gray-600",
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
          >
            {config.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search query..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => updateFilters("status", e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="LIVE">Live</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="ENDED">Ended</option>
              <option value="ARCHIVED">Archived</option>
              <option value="CANCELLED">Cancelled/Suspended</option>
            </select>
          </div>
        )}
      </div>

      <DataTable
        data={events}
        columns={headers}
        searchable={false}
        actions={(event) => (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === event.id ? null : event.id);
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-400"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50">
              <Link
                href={`/super-admin/events/${event.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Eye className="h-4 w-4" /> View Details
              </Link>
              {(event.status === "PENDING_REVIEW" ||
                event.status === "DRAFT") && (
                <>
                  <button
                    onClick={() => handleAction("approve", event.id)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 text-left"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve Event
                  </button>
                  <button
                    onClick={() => handleAction("reject", event.id)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                  >
                    <XCircle className="h-4 w-4" /> Reject Event
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      />

      {/* Removed Archive Modal Context */}

      {activeMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}
