"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { clsx } from "clsx";
import type { NavigationSection } from "@/lib/navigation";

type DashboardLayoutProps = {
  children: React.ReactNode;
  navigation: NavigationSection[];
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  portalName: string;
  profileUrl?: string;
  settingsUrl?: string;
};

export function DashboardLayout({
  children,
  navigation,
  user,
  portalName,
  profileUrl = "#",
  settingsUrl = "#",
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden lg:block">
        <Sidebar
          navigation={navigation}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          portalName={portalName}
        />
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 z-40 lg:hidden">
            <Sidebar
              navigation={navigation}
              isCollapsed={false}
              onToggle={() => setIsMobileMenuOpen(false)}
              portalName={portalName}
            />
          </div>
        </>
      )}

      <div
        className={clsx(
          "transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <Header
          user={user}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          profileUrl={profileUrl}
          settingsUrl={settingsUrl}
        />

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
