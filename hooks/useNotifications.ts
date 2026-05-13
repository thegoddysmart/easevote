"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";

export interface Notification {
  id: string;
  _id?: string;
  title: string;
  content?: string;
  message?: string;
  time: string;
  createdAt?: string;
  read: boolean;
  type?: "INFO" | "SUCCESS" | "WARNING" | "DANGER" | "PAYOUT" | "EVENT";
}

function showNotificationToast(notification: Notification) {
  const body = [notification.title, notification.message]
    .filter(Boolean)
    .join(" — ");

  if (notification.type === "DANGER") {
    toast.error(body, { duration: 5000 });
  } else {
    toast(body, { icon: "🔔", duration: 5000 });
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Tracks every notification ID we have ever seen so we can diff on each poll
  const knownIdsRef = useRef<Set<string>>(new Set());
  // Distinguishes the first fetch (surface most recent unread) from subsequent polls (surface genuinely new)
  const isInitialFetchRef = useRef(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications");
      const data = Array.isArray(response) ? response : (response.data || []);

      const mapped: Notification[] = data.map((n: any) => ({
        id: n._id || n.id,
        title: n.title || "Notification",
        message: n.message || "",
        time: n.createdAt || new Date().toISOString(),
        read: n.read || false,
        type: n.type || "INFO",
      }));

      setNotifications(mapped);
      setUnreadCount(mapped.filter((n) => !n.read).length);

      if (isInitialFetchRef.current) {
        // Seed the known-IDs set so subsequent polls can diff correctly
        mapped.forEach((n) => knownIdsRef.current.add(n.id));

        // Surface only the single most-recent unread notification on login —
        // showing all of them at once would be noisy
        const mostRecentUnread = mapped.find((n) => !n.read);
        if (mostRecentUnread) {
          showNotificationToast(mostRecentUnread);
        }

        isInitialFetchRef.current = false;
      } else {
        // Find notifications that arrived since the last poll
        const brandNew = mapped.filter((n) => !knownIdsRef.current.has(n.id));
        brandNew.forEach((n) => {
          knownIdsRef.current.add(n.id);
          // Only toast if the backend created it as unread (i.e. it wasn't pre-read by another session)
          if (!n.read) {
            showNotificationToast(n);
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // 30 s gives a responsive feel without hammering the API
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    unreadCount,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
