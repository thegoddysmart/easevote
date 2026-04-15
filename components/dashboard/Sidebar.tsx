"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import type { NavigationSection } from "@/lib/navigation";

type SidebarProps = {
  navigation: NavigationSection[];
  isCollapsed: boolean;
  onToggle: () => void;
  logo?: React.ReactNode;
  portalName: string;
};

export function Sidebar({
  navigation,
  isCollapsed,
  onToggle,
  logo,
  portalName,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-40 h-screen bg-primary-900 text-white transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            {logo || (
              <div className="w-8 h-8 bg-secondary-600 rounded-lg flex items-center justify-center font-bold">
                E
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-sm">EaseVote</span>
              <span className="text-xs text-slate-400">{portalName}</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-secondary-500 rounded-lg flex items-center justify-center font-bold mx-auto">
            E
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-4">
            {section.title && !isCollapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-neutral-300! uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1 px-2">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href + "/"));
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-secondary-700 text-white!"
                          : "text-slate-300! hover:bg-primary-800 hover:text-white"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge !== undefined && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
    </aside>
  );
}
