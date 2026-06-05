import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight,
  Zap,
  ShieldCheck,
  CreditCard,
  Ticket,
  Vote
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export const dynamic = "force-dynamic";

export default async function AnalyticsOverviewPage() {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken as string | undefined);
  
  const res = await apiClient.get("/admin/stats/platform").catch(() => null);
  const stats = res?.data;

  if (!stats) {
    return (
        <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
                <Activity size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Analytics Pulse Offline</h2>
            <p className="text-slate-500 max-w-sm">
                The platform heartbeats could not be retrieved. Please check system services.
            </p>
        </div>
    );
  }

  const kpis = [
    {
        title: "Total Organizers",
        value: (stats.overview.registeredOrganizers || 0).toLocaleString(),
        icon: <Users className="h-5 w-5" />,
        link: "/dashboard/analytics/users",
        color: "bg-purple-50 text-purple-600"
    },
    {
        title: "Total Live Events",
        value: (stats.overview.activeEvents || 0).toLocaleString(),
        icon: <Zap className="h-5 w-5" />,
        link: "/dashboard/events",
        color: "bg-amber-50 text-amber-600"
    },
    {
        title: "Total Tickets Sold",
        value: (stats.overview.ticketsSold || 0).toLocaleString(),
        icon: <Ticket className="h-5 w-5" />,
        link: "/dashboard/transactions?type=TICKET",
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "Total Votes Cast",
        value: (stats.overview.totalVotesCast || 0).toLocaleString(),
        icon: <Vote className="h-5 w-5" />,
        link: "/dashboard/transactions?type=VOTE",
        color: "bg-emerald-50 text-emerald-600"
    }
  ];

  const formattedActivities = (stats.recentActivity || []).map((log: any) => ({
    id: log._id,
    title: log.action.replace(/_/g, " "),
    description: `${log.user.fullName} (${log.user.role}) performed ${log.entityType || "system"} activity`,
    time: new Date(log.createdAt).toLocaleString(),
    user: {
        name: log.user.fullName,
        avatar: log.user.avatar
    }
  }));

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-primary-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100">
            <Activity className="h-7 w-7" />
        </div>
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Platform Pulse
            </h1>
            <p className="text-slate-500 font-medium">
                Real-time snapshot of system-wide growth and activity
            </p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
            <Link key={idx} href={kpi.link} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm group">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-50 text-slate-900 rounded-xl transition-colors">
                        {kpi.icon}
                    </div>
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</h3>
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-1">{kpi.title}</p>
                </div>
            </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QUICK STATUS PANEL */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group w-full lg:max-w-md">
                <div className="relative z-10">
                    <ShieldCheck className="h-10 w-10 text-slate-900 mb-6" />
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Security Status</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                        The platform infrastructure is currently operating within normal security parameters. 
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active Protection
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
