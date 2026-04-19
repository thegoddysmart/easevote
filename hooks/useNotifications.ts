"use client";

import { useState, useEffect, useCallback } from "react";
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

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await api.get("/notifications");
      // api.get normally returns the data body directly in this project's client
      const data = Array.isArray(response) ? response : (response.data || []);
      
      const mappedNotifications = data.map((n: any) => ({
        id: n._id || n.id,
        title: n.title || "Notification",
        message: n.message || "",
        time: n.createdAt || new Date().toISOString(),
        read: n.read || false,
        type: n.type || "SYSTEM",
      }));

      setNotifications(mappedNotifications);
      setUnreadCount(mappedNotifications.filter((n: any) => !n.read).length);
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
    // Optional: Refresh periodically
    const interval = setInterval(fetchNotifications, 60000); // every minute
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
