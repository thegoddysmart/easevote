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
          "flex items-center justify-between w-full md:w-[280px] px-4 py-2.5 border rounded-xl text-sm transition-all",
          "bg-white border-slate-200 text-slate-700 hover:border-primary-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10",
          isOpen && "border-primary-700 ring-4 ring-primary-900/5 font-bold"
        )}
      >
        <span className="truncate mr-2">
          {selectedEvent ? selectedEvent.title : placeholder}
        </span>
        <ChevronDown
          className={clsx(
            "h-4 w-4 text-slate-400 transition-transform duration-300",
            isOpen && "rotate-180 text-primary-700"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full md:w-[320px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-left">
          {/* Search Header */}
          <div className="p-3 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Find an event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 text-slate-700 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
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
                "flex items-center justify-between w-full px-4 py-3 text-sm text-left transition-colors",
                (value === "ALL" || !value)
                  ? "bg-primary-900 text-white font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <span>{placeholder}</span>
              {(value === "ALL" || !value) && <Check className="h-4 w-4" />}
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
                    "flex items-center justify-between w-full px-4 py-3 text-sm text-left transition-colors border-t border-slate-50",
                    value === event.id
                      ? "bg-primary-50 text-primary-900 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span className="truncate">{event.title}</span>
                  {value === event.id && <Check className="h-4 w-4 text-primary-700" />}
                </button>
              ))
            ) : (
              <div className="px-4 py-12 text-center">
                <Search className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-medium">No events match "{searchTerm}"</p>
              </div>
            )}
          </div>
          
          {/* Footer Info */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
               {filteredEvents.length} Events Found
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d9b3d8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c080bf;
        }
      `}</style>
    </div>
  );
}
