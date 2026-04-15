import { clsx } from "clsx";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

type KPICardProps = {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
};

export function KPICard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon: Icon,
  iconColor = "bg-amber-100 text-amber-600",
  trend,
  loading = false,
}: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === "up" || (change !== undefined && change > 0)) {
      return <TrendingUp className="h-3 w-3" />;
    }
    if (trend === "down" || (change !== undefined && change < 0)) {
      return <TrendingDown className="h-3 w-3" />;
    }
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (trend === "up" || (change !== undefined && change > 0)) {
      return "text-green-600 bg-green-50";
    }
    if (trend === "down" || (change !== undefined && change < 0)) {
      return "text-red-600 bg-red-50";
    }
    return "text-slate-600 bg-slate-50";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-8 bg-slate-200 rounded w-32" />
            <div className="h-3 bg-slate-200 rounded w-20" />
          </div>
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <span
                className={clsx(
                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                  getTrendColor(),
                )}
              >
                {getTrendIcon()}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-slate-500">{changeLabel}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx("p-3 rounded-xl", iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
