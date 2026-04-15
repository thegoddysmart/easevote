import React from "react";
import { clsx } from "clsx";

export type UssdStatus =
  | "session_active"
  | "payment_pending"
  | "payment_confirmed"
  | "payment_failed"
  | "session_timeout"
  | "session_cancelled"
  | "sms_sent"
  | "sms_failed";

const statusConfig: Record<
  UssdStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  session_active: {
    label: "Session Active",
    color: "text-blue-700",
    bg: "bg-blue-100",
    dot: "bg-blue-500",
  },
  payment_pending: {
    label: "Payment Pending",
    color: "text-amber-700",
    bg: "bg-amber-100",
    dot: "bg-amber-500",
  },
  payment_confirmed: {
    label: "Payment Confirmed",
    color: "text-green-700",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  payment_failed: {
    label: "Payment Failed",
    color: "text-red-700",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  session_timeout: {
    label: "Session Timeout",
    color: "text-slate-600",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  },
  session_cancelled: {
    label: "Session Cancelled",
    color: "text-slate-600",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  },
  sms_sent: {
    label: "SMS Sent",
    color: "text-green-700",
    bg: "bg-green-500/10",
    dot: "bg-green-600",
  },
  sms_failed: {
    label: "SMS Failed",
    color: "text-red-700",
    bg: "bg-red-500/10",
    dot: "bg-red-600",
  },
};

interface UssdStatusBadgeProps {
  status: UssdStatus | string;
  showDot?: boolean;
}

export function UssdStatusBadge({
  status,
  showDot = true,
}: UssdStatusBadgeProps) {
  // Normalize lowercase status from backend
  const normalizedStatus = (status || "").toLowerCase() as UssdStatus;
  const config = statusConfig[normalizedStatus] || {
    label: status,
    color: "text-slate-600",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
        config.bg,
        config.color
      )}
    >
      {showDot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full shrink-0",
            config.dot,
            normalizedStatus === "session_active" && "animate-pulse"
          )}
        />
      )}
      {config.label}
    </span>
  );
}
