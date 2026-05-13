"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";

export interface PendingEvent {
  id: string;
  title: string;
  eventCode: string;
  type: string;
  updatedAt: string;
}

export interface PendingOrganizer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export function useAdminAlerts({ enabled = true }: { enabled?: boolean } = {}) {
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [pendingOrgs, setPendingOrgs] = useState<PendingOrganizer[]>([]);

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

      const rawEvents: any[] =
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

      const mappedEvents: PendingEvent[] = rawEvents.map((e: any) => ({
        id: String(e._id || e.id),
        title: e.title || "Untitled Event",
        eventCode: e.eventCode || e._id || e.id,
        type: e.type || "VOTING",
        updatedAt: e.updatedAt || e.createdAt || new Date().toISOString(),
      }));

      const mappedOrgs: PendingOrganizer[] = allUsers
        .filter((u: any) => u.role === "ORGANIZER" && u.status === "PENDING")
        .map((u: any) => ({
          id: String(u._id || u.id),
          name: u.businessName || u.fullName || u.name || "New Organizer",
          email: u.email || "",
          createdAt: u.createdAt || new Date().toISOString(),
        }));

      setPendingEvents(mappedEvents);
      setPendingOrgs(mappedOrgs);

      // Build a unified list for diffing
      type AlertItem = { id: string; kind: "event" | "organizer"; label: string };
      const current: AlertItem[] = [
        ...mappedEvents.map((e) => ({ id: e.id, kind: "event" as const, label: e.title })),
        ...mappedOrgs.map((o) => ({ id: o.id, kind: "organizer" as const, label: o.name })),
      ];

      if (isInitialFetchRef.current) {
        current.forEach((a) => knownIdsRef.current.add(a.id));
        isInitialFetchRef.current = false;
      } else {
        const brandNew = current.filter((a) => !knownIdsRef.current.has(a.id));
        brandNew.forEach((a) => {
          knownIdsRef.current.add(a.id);
          if (a.kind === "event") {
            toast(`New event submitted for review — ${a.label}`, {
              icon: "📋",
              duration: 5000,
            });
          } else {
            toast(`New organizer registration — ${a.label}`, {
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
    pendingEvents,
    pendingOrgs,
    pendingEventsCount: pendingEvents.length,
    pendingOrganizersCount: pendingOrgs.length,
    pendingCount: pendingEvents.length + pendingOrgs.length,
  };
}
