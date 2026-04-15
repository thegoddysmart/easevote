"use client";

import React, { useState, useEffect } from "react";
// We'll define a local interface or import one if available, but to be safe/self-contained for now matching the passed data
// import { Event } from "@/types";
import {
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface ClientEvent {
  id: string;
  title: string;
  eventCode: string;
  category: string;
  image: string;
  date: string;
  status: string;
  location: string;
  votePrice?: number;
}

interface EventsBrowseClientProps {
  initialEvents: ClientEvent[];
}

export default function EventsBrowseClient({
  initialEvents,
}: EventsBrowseClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * ---------------------------------------------------------------------
   * FILTER LOGIC
   * ---------------------------------------------------------------------
   */
  const filteredEvents = initialEvents.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.eventCode?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || e.status === statusFilter;

    // Use metadata category or type? The mapped data should handle this.
    // Assuming 'category' field is populated with "Awards", "School" etc.
    const matchesCategory =
      categoryFilter === "All" || e.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-gray-100 pb-8 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
            Explore Events
          </h1>
          <p className="text-slate-500">
            Discover and vote for your favorite nominees in Ghana&#39;s top
            events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= FILTER BAR ================= */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or event code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            <select
              aria-label="Event status"
              title="Event status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-magenta-500 cursor-pointer hover:bg-gray-50"
            >
              <option value="All">All Status</option>
              <option value="LIVE">Live Now</option>
              <option value="UPCOMING">Upcoming</option>
              {/* Database uses LIVE, PENDING_REVIEW (upcoming?), ENDED */}
              <option value="ENDED">Ended</option>
            </select>

            <select
              aria-label="Event category"
              title="Event category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-magenta-500 cursor-pointer hover:bg-gray-50"
            >
              <option value="All">All Categories</option>
              {/* We might want to make these dynamic from DB later, but hardcoded for now matches current UI */}
              <option value="Awards">Awards</option>
              <option value="Pageantry">Pageantry</option>
              <option value="School">School Elections</option>
              <option value="Sports">Sports</option>
              <option value="Tech">Tech</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 border-l border-gray-100 pl-4">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              title="Grid view"
              className={`p-3 rounded-xl transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-50 text-primary-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              title="List view"
              className={`p-3 rounded-xl transition-colors ${
                viewMode === "list"
                  ? "bg-primary-50 text-primary-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* ================= RESULTS ================= */}
        {filteredEvents.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "flex flex-col gap-4"
            }
          >
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.eventCode}`}
                className={`group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  viewMode === "list"
                    ? "flex flex-row min-h-[14rem] items-stretch"
                    : "flex flex-col"
                }`}
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden bg-gray-100 ${
                    viewMode === "list"
                      ? "w-48 sm:w-64 relative shrink-0"
                      : "h-56"
                  }`}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${
                        event.status === "LIVE"
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-slate-800 text-white"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`p-6 flex flex-col ${
                    viewMode === "list" ? "flex-1 justify-center" : ""
                  }`}
                >
                  <div className="mb-2 flex justify-between items-start">
                    <span className="text-xs font-bold text-magenta-600 uppercase tracking-wide">
                      {event.category}
                    </span>

                    {event.votePrice !== undefined && (
                      <span className="text-xs font-bold text-slate-400">
                        GHS {event.votePrice.toFixed(2)}/vote
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-magenta-700 transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={16} className="text-slate-300" />
                      {event.date}
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={16} className="text-slate-300" />
                        {event.location}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="mt-auto">
                    <div
                      className={`py-3 rounded-xl border-2 border-slate-100 text-slate-700 font-bold group-hover:bg-secondary-700 group-hover:border-secondary-700 group-hover:text-white! transition-all flex items-center justify-center gap-2 ${
                        viewMode === "list"
                          ? "w-auto px-8 mt-2 text-slate-700"
                          : "w-full"
                      }`}
                    >
                      View Details <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="text-gray-300" size={32} />
            </div>
            <p className="text-slate-500 text-xl font-medium mb-2">
              No events found
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setCategoryFilter("All");
              }}
              className="text-primary-600 font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
