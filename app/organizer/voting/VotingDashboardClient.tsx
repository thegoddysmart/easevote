"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Vote,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Edit,
  TrendingUp,
  Globe,
  Users,
} from "lucide-react";
import { clsx } from "clsx";

type Event = {
  id: string;
  eventCode: string;
  title: string;
  type: "VOTING" | "TICKETING" | "HYBRID";
  status: string;
  startDate: string;
  endDate: string;
  totalVotes: number;
  totalRevenue: number;
  candidatesCount: number;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: "Draft", color: "text-slate-600", bg: "bg-slate-100" },
  PENDING_REVIEW: { label: "Pending Review", color: "text-yellow-700", bg: "bg-yellow-100" },
  APPROVED: { label: "Approved", color: "text-blue-700", bg: "bg-blue-100" },
  LIVE: { label: "Live", color: "text-green-700", bg: "bg-green-100" },
  PAUSED: { label: "Paused", color: "text-orange-700", bg: "bg-orange-100" },
  ENDED: { label: "Ended", color: "text-slate-600", bg: "bg-slate-200" },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100" },
};

export default function VotingDashboardClient({ 
  initialEvents,
  stats 
}: { 
  initialEvents: Event[],
  stats: { totalVotes: number, totalRevenue: number, activeEvents: number }
}) {
  const router = useRouter();
  const [events] = useState<Event[]>(initialEvents);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Voting Events</h1>
          <p className="text-slate-500">Manage your elections, polls, and voting competitions.</p>
        </div>
        <button
          onClick={() => router.push("/organizer/events/new")}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Election
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Vote className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Votes</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.totalVotes.toLocaleString()}</h3>
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
              <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Globe className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Elections</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.activeEvents}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Elections & Polls</h2>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Vote className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No voting events found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't created any elections or polls yet.</p>
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
              const statusStyles = statusConfig[event.status] || statusConfig.DRAFT;

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
                            <h3 className="font-semibold text-slate-900 truncate">{event.title}</h3>
                            <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", statusStyles.bg, statusStyles.color)}>
                              {statusStyles.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{event.eventCode}</span>
                            <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                          </div>
                        </div>

                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveMenu(activeMenu === event.id ? null : event.id)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                          </button>
                          {activeMenu === event.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                              <button onClick={() => router.push(`/organizer/events/${event.id}`)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                <Eye className="h-4 w-4" /> View Details
                              </button>
                              <button onClick={() => router.push(`/organizer/events/${event.id}/edit`)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                <Edit className="h-4 w-4" /> Edit Event
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Vote className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">{event.totalVotes.toLocaleString()}</span>
                          <span className="text-slate-400">votes</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{event.candidatesCount}</span>
                          <span className="text-slate-400">candidates</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{formatCurrency(event.totalRevenue)}</span>
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
