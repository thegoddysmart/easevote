"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";

interface AdminAlert {
  id: string;
  title: string;
  kind: "event" | "organizer";
}

export function useAdminAlerts({ enabled = true }: { enabled?: boolean } = {}) {
  const [pendingEventsCount, setPendingEventsCount] = useState(0);
  const [pendingOrganizersCount, setPendingOrganizersCount] = useState(0);

  // Every ID we have ever seen — used to diff and only toast genuinely new arrivals
  const knownIdsRef = useRef<Set<string>>(new Set());
  // Seed on first fetch so we never toast items that were already pending at login
  const isInitialFetchRef = useRef(true);

  const fetchAlerts = useCallback(async () => {
    try {
      const [eventsRes, usersRes] = await Promise.allSettled([
        api.get("/events/admin/all?status=PENDING_REVIEW&limit=100"),
        api.get("/users"),
      ]);

      const events: any[] =
        eventsRes.status === "fulfilled"
          ? Array.isArray(eventsRes.value)
            ? eventsRes.value
            : eventsRes.value?.data ?? []
          : [];

      const allUsers: any[] =
        usersRes.status === "fulfilled"
          ? Array.isArray(usersRes.value)
            ? usersRes.value
            : usersRes.value?.data ?? []
          : [];

      const pendingOrgs = allUsers.filter(
        (u: any) => u.role === "ORGANIZER" && u.status === "PENDING"
      );

      setPendingEventsCount(events.length);
      setPendingOrganizersCount(pendingOrgs.length);

      const currentAlerts: AdminAlert[] = [
        ...events.map((e: any) => ({
          id: String(e._id || e.id),
          title: e.title || "Untitled Event",
          kind: "event" as const,
        })),
        ...pendingOrgs.map((u: any) => ({
          id: String(u._id || u.id),
          title: u.businessName || u.fullName || u.name || "New Organizer",
          kind: "organizer" as const,
        })),
      ];

      if (isInitialFetchRef.current) {
        // Seed all currently-pending items — do NOT toast them on login
        currentAlerts.forEach((a) => knownIdsRef.current.add(a.id));
        isInitialFetchRef.current = false;
      } else {
        // Toast only items that appeared since the last poll
        const brandNew = currentAlerts.filter(
          (a) => !knownIdsRef.current.has(a.id)
        );
        brandNew.forEach((a) => {
          knownIdsRef.current.add(a.id);
          if (a.kind === "event") {
            toast(`New event submitted for review — ${a.title}`, {
              icon: "📋",
              duration: 5000,
            });
          } else {
            toast(`New organizer registration — ${a.title}`, {
              icon: "👤",
              duration: 5000,
            });
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin alerts:", error);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30_000);
    return () => clearInterval(interval);
  }, [enabled, fetchAlerts]);

  return {
    pendingEventsCount,
    pendingOrganizersCount,
    pendingCount: pendingEventsCount + pendingOrganizersCount,
  };
}
