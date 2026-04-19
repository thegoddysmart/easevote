"use client";

import { api } from "@/lib/api-client";
import { CheckCircle, XCircle, AlertCircle, PauseCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useModal } from "@/components/providers/ModalProvider";

type Props = {
  eventId: string;
  status: string;
  onStatusChange?: (status: string) => void;
};

export default function AdminEventActions({ eventId, status, onStatusChange }: Props) {
  const router = useRouter();
  const modal = useModal();
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleAction = async (action: string) => {
    const actionLabels: Record<string, { title: string; message: string; variant: "danger" | "warning" | "info" }> = {
      approve: { title: "Approve Event", message: "Are you sure you want to approve this event? It will go live.", variant: "info" },
      suspend: { title: "Suspend Event", message: "Are you sure you want to suspend this event? It will be paused for all users.", variant: "warning" },
      resume: { title: "Resume Event", message: "Are you sure you want to resume this event? It will go live again.", variant: "info" },
    };

    const config = actionLabels[action] || { title: `${action} Event`, message: `Are you sure you want to ${action} this event?`, variant: "warning" as const };
    const confirmed = await modal.confirm({
      title: config.title,
      message: config.message,
      variant: config.variant,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
    });
    if (!confirmed) return;

    setLoadingAction(action);
    startTransition(async () => {
      let newStatus = "";
      switch (action) {
        case "approve":
          newStatus = "APPROVED";
          break;
        case "reject":
          newStatus = "CANCELLED";
          break;
        case "suspend":
          newStatus = "PAUSED";
          break;
        case "resume":
          newStatus = "LIVE";
          break;
      }

      if (newStatus) {
        try {
          if (action === "approve") {
            await api.patch(`/events/${eventId}/approve`, {});
          } else if (action === "suspend") {
            await api.patch(`/events/${eventId}/suspend`, {});
          } else if (action === "resume") {
            const res = await api.patch(`/events/${eventId}/resume`, {});
            newStatus = res.status || newStatus;
          } else {
            await api.put(`/events/${eventId}`, { status: newStatus });
          }
          setCurrentStatus(newStatus);
          onStatusChange?.(newStatus);
          router.refresh();
        } catch (error: any) {
          await modal.alert({
            title: "Action Failed",
            message: error.message || "Failed to update status",
            variant: "danger",
          });
        }
      }
      setLoadingAction(null);
    });
  };

  if (currentStatus === "PENDING_REVIEW") {
    return (
      <div className="flex items-center gap-2">
        <button
          disabled={isPending}
          onClick={() => handleAction("approve")}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium transition-colors"
        >
          {loadingAction === "approve" ? (
            "Processing..."
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Approve
            </>
          )}
        </button>
        {/* Reject endpoint not confirmed in latest API collection - hiding for safety */}
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-400 rounded-lg cursor-not-allowed text-sm font-medium transition-colors"
          title="Rejection endpoint is currently being finalized"
        >
          <XCircle className="w-4 h-4" /> Reject (Planned)
        </button>
      </div>
    );
  }

  if (currentStatus === "LIVE" || currentStatus === "APPROVED") {
    return (
      <button
        disabled={isPending}
        onClick={() => handleAction("suspend")}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 disabled:opacity-50 text-sm font-medium transition-colors"
      >
        {loadingAction === "suspend" ? (
          "Processing..."
        ) : (
          <>
            <PauseCircle className="w-4 h-4" /> Suspend Event
          </>
        )}
      </button>
    );
  }

  if (currentStatus === "PAUSED") {
    return (
      <button
        disabled={isPending}
        onClick={() => handleAction("resume")}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium transition-colors"
      >
        {loadingAction === "resume" ? (
          "Processing..."
        ) : (
          <>
            <CheckCircle className="w-4 h-4" /> Resume Event
          </>
        )}
      </button>
    );
  }

  return null;
}
