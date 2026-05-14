"use client";

import toast from "react-hot-toast";
import { X } from "lucide-react";

export function showDismissibleToast(
  message: string,
  options: { icon?: string; duration?: number } = {}
) {
  const { icon, duration = 5000 } = options;

  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 max-w-sm w-full pointer-events-auto transition-all duration-300 ${
          t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        {icon && <span className="text-base shrink-0">{icon}</span>}
        <span className="flex-1 text-sm text-gray-800 leading-snug">{message}</span>
        <button
          type="button"
          onClick={() => toast.dismiss(t.id)}
          className="shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    ),
    { duration }
  );
}

export function showDismissibleErrorToast(message: string, duration = 5000) {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 bg-red-50 border border-red-200 shadow-lg rounded-lg px-4 py-3 max-w-sm w-full pointer-events-auto transition-all duration-300 ${
          t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        <span className="text-base shrink-0">❌</span>
        <span className="flex-1 text-sm text-red-800 leading-snug">{message}</span>
        <button
          type="button"
          onClick={() => toast.dismiss(t.id)}
          className="shrink-0 p-0.5 rounded text-red-400 hover:text-red-700 hover:bg-red-100 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    ),
    { duration }
  );
}
