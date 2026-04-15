import { LucideIcon, TrendingDown, TrendingUp, Minus } from "lucide-react";

type AdminStatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  color?: "blue" | "green" | "purple" | "amber" | "red" | "indigo";
};

const colorMap = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
  red: { bg: "bg-red-100", text: "text-red-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
};

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "neutral",
  color = "blue",
}: AdminStatCardProps) {
  const styles = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${styles.bg} ${styles.text}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-slate-500">{title}</span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trendDirection === "up"
                ? "text-green-700 bg-green-50"
                : trendDirection === "down"
                ? "text-red-700 bg-red-50"
                : "text-slate-600 bg-slate-50"
            }`}
          >
            {trendDirection === "up" && <TrendingUp className="w-3 h-3" />}
            {trendDirection === "down" && <TrendingDown className="w-3 h-3" />}
            {trendDirection === "neutral" && <Minus className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
