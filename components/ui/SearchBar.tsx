"use client";

import { Search } from "lucide-react";
import { SearchBarProps } from "../../types";

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-auto">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search events..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-secondary-700 bg-white 
                   shadow-sm transition-all text-sm text-slate-800 placeholder-slate-400"
      />
    </div>
  );
}
