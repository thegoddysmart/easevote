"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, Clock } from "lucide-react";
import { api } from "@/lib/api-client";

export function OrganizerStatusBanner() {
  const { data: session, update } = useSession();
  const [liveApproved, setLiveApproved] = useState(false);

  const sessionIsPending =
    session?.user?.role === "ORGANIZER" && session?.user?.status === "PENDING";

  useEffect(() => {
    if (!sessionIsPending || !session?.user?.id) return;

    const checkApprovalStatus = async () => {
      try {
        const res = await api.get(`/users/${session.user.id}`);
        const userData = res?.data || res;
        if (userData?.status && userData.status !== "PENDING") {
          setLiveApproved(true);
          // Persist the new status into the JWT so all subsequent reads are correct
          await update({ status: userData.status });
        }
      } catch {
        // Silent failure — banner stays visible until the next poll
      }
    };

    checkApprovalStatus();
    const interval = setInterval(checkApprovalStatus, 30_000);
    return () => clearInterval(interval);
  }, [sessionIsPending, session?.user?.id, update]);

  if (liveApproved || !sessionIsPending) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between flex-wrap gap-2 max-w-7xl mx-auto">
        <div className="flex-1 flex items-center">
          <span className="flex p-2 rounded-lg bg-amber-100">
            <Clock className="h-6 w-6 text-amber-600" aria-hidden="true" />
          </span>
          <div className="ml-3 font-medium text-amber-700">
            <span className="md:hidden text-sm">
              Your account is pending approval.
            </span>
            <span className="hidden md:inline">
              Your organizer account is currently{" "}
              <strong>pending admin approval</strong>. You can create event
              drafts, but you won't be able to submit or publish them until
              approved.
            </span>
          </div>
        </div>
        <div className="order-3 shrink-0 w-full sm:order-2 sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/50 px-2 py-1 rounded">
            <AlertCircle size={14} />
            Pending Review
          </div>
        </div>
      </div>
    </div>
  );
}
