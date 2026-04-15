"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard";
import { organizerNavigation } from "@/lib/navigation";
import { OrganizerStatusBanner } from "@/components/organizer/OrganizerStatusBanner";

export default function OrganizerLayout({
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (
    session?.user?.role !== "ORGANIZER" &&
    session?.user?.role !== "ADMIN" &&
    session?.user?.role !== "SUPER_ADMIN"
  ) {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout
      navigation={organizerNavigation}
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        image: session.user.avatar,
      }}
      portalName="Organizer Portal"
      profileUrl="/organizer/profile"
      settingsUrl="/organizer/profile"
    >
      <OrganizerStatusBanner />
      {children}
    </DashboardLayout>
  );
}
