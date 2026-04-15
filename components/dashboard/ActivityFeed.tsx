"use client";

import { clsx } from "clsx";
import { type LucideIcon } from "lucide-react";

type Activity = {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: LucideIcon;
  iconColor?: string;
  user?: {
    name: string;
    avatar?: string;
  };
};

type ActivityFeedProps = {
  title?: string;
  activities: Activity[];
  loading?: boolean;
  maxItems?: number;
};

export function ActivityFeed({
  title = "Recent Activity",
  activities,
  loading = false,
  maxItems = 5,
}: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="h-5 bg-slate-200 rounded w-32 mb-4 animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {displayActivities.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No recent activity
          </p>
        ) : (
          displayActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className={clsx(
                  "flex items-start gap-3 pb-4",
                  index < displayActivities.length - 1 &&
                    "border-b border-slate-100"
                )}
              >
                {Icon ? (
                  <div
                    className={clsx(
                      "p-2 rounded-lg",
                      activity.iconColor || "bg-slate-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                ) : activity.user ? (
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium text-sm">
                    {activity.user.avatar ? (
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      activity.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className="text-sm text-slate-500 truncate">
                      {activity.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      {activities.length > maxItems && (
        <button className="w-full mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium">
          View all activity
        </button>
      )}
    </div>
  );
}
