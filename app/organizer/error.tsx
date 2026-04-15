"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function OrganizerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Organizer]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="p-4 bg-red-50 rounded-full">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">
          Something went wrong
        </h2>
        <p className="text-slate-500 max-w-md">
          {error.message || "An unexpected error occurred. Your events and data are safe."}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/organizer"
          className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
