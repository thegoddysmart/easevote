"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard";
import { superAdminNavigation } from "@/lib/navigation";

export default function SuperAdminLayout({
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

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout
      navigation={superAdminNavigation}
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        image: session.user.avatar,
      }}
      portalName="Super Admin"
      profileUrl="/super-admin/account"
      settingsUrl="/super-admin/account?tab=security"
    >
      {children}
    </DashboardLayout>
  );
}
