"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function EventError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[EventPage]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="p-5 bg-red-50 rounded-full">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <div className="space-y-3 max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">
          Couldn&apos;t load this event
        </h1>
        <p className="text-slate-500">
          {error.message ||
            "Something went wrong while loading the event. Please try again or browse other events."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/events"
          className="px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full font-semibold transition-colors"
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
}
