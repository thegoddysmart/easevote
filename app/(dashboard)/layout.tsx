"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard";
import { getNavigationForRole } from "@/lib/navigation";
import { OrganizerStatusBanner } from "@/components/organizer/OrganizerStatusBanner";
import { useNotifications } from "@/hooks/useNotifications";

export default function UnifiedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/sign-in");
    },
  });

  const { unreadCount } = useNotifications();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const role = session?.user?.role;

  // Validation: Only staff roles allowed in the dashboard area
  if (role !== "SUPER_ADMIN" && role !== "ADMIN" && role !== "ORGANIZER") {
    redirect("/");
  }

  const navigation = getNavigationForRole(role).map(section => ({
    ...section,
    items: section.items.map(item => {
      if (item.name === "Notifications" || item.href === "/dashboard/notifications") {
        return { ...item, badge: unreadCount > 0 ? unreadCount : undefined };
      }
      return item;
    })
  }));

  const portalName = role === "SUPER_ADMIN" || role === "ADMIN" ? "Admin Portal" : "Organizer Portal";
  const profileUrl = "/dashboard/account";

  return (
    <DashboardLayout
      navigation={navigation}
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        image: session.user.avatar,
      }}
      portalName={portalName}
      profileUrl={profileUrl}
      settingsUrl="/dashboard/settings"
    >
      {role === "ORGANIZER" && <OrganizerStatusBanner />}
      {children}
    </DashboardLayout>
  );
}
