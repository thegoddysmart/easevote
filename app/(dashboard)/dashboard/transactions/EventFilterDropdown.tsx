"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";
import { clsx } from "clsx";

interface EventItem {
  id: string;
  title: string;
}

interface EventFilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  eventsList: EventItem[];
  placeholder?: string;
}

export default function EventFilterDropdown({
  value,
  onChange,
  eventsList,
  placeholder = "All Events",
}: EventFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedEvent = eventsList.find((e) => e.id === value);

  // Filter events based on search term
  const filteredEvents = eventsList.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    // Using click instead of mousedown to avoid race condition with item selection
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center justify-between w-full md:w-[280px] px-4 py-2 border rounded-lg text-sm transition-all",
          "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
          isOpen && "border-indigo-500 ring-2 ring-indigo-500/20"
        )}
      >
        <span className="truncate mr-2 font-medium">
          {selectedEvent ? selectedEvent.title : placeholder}
        </span>
        <ChevronDown
          className={clsx(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full md:w-[320px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-100 origin-top-left">
          {/* Search Header */}
          <div className="p-2 border-bottom border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Find an event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded-full"
                >
                  <X className="h-3 w-3 text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* List Area */}
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar border-t border-slate-100">
            {/* Clear/All Option */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onChange("ALL");
                setIsOpen(false);
                setSearchTerm("");
              }}
              className={clsx(
                "flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors",
                value === "ALL" || !value
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <span>{placeholder}</span>
              {(value === "ALL" || !value) && <Check className="h-3.5 w-3.5" />}
            </button>

            {/* Event Items */}
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <button
                  type="button"
                  key={event.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(event.id);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={clsx(
                    "flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition-colors border-t border-slate-50",
                    value === event.id
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span className="truncate">{event.title}</span>
                  {value === event.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-slate-400 text-sm italic">
                No events found matching "{searchTerm}"
              </div>
            )}
          </div>
          
          {/* Footer Info */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
            Showing {filteredEvents.length} of {eventsList.length} events
          </div>
        </div>
      )}

      {/* Internal CSS for nice scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
