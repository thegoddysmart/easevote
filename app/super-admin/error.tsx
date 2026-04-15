"use client";

import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";

export default function SuperAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SuperAdmin]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="p-4 bg-red-50 rounded-full">
        <ShieldAlert className="w-10 h-10 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">
          Something went wrong
        </h2>
        <p className="text-slate-500 max-w-md">
          {error.message || "An unexpected error occurred in the super-admin panel."}
        </p>
      </div>
      <button
        onClick={reset}
        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
