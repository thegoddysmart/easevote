import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import { Bell, Megaphone, Send, History, Filter } from "lucide-react";
import NotificationForm from "@/app/(dashboard)/dashboard/notifications/NotificationForm";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken as string | undefined);

  const [logs, organizers] = await Promise.all([
    apiClient.get("/admin/notifications/logs").catch(() => []),
    apiClient.get("/users").catch(() => []), // Assuming this returns users with role filter
  ]);

  const activeOrganizers = organizers.filter((u: any) => u.role === "ORGANIZER");

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-primary-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100">
            <Bell className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Broadcast Center
            </h1>
            <p className="text-slate-500 font-medium italic">
              Dispatch system-wide notifications to platform organizers
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COMPRESSION FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-1">
            <div className="bg-slate-50/50 rounded-[1.4rem] p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Send className="h-4 w-4 text-primary-700" />
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">New Broadcast</h2>
                </div>
                <NotificationForm organizers={activeOrganizers} />
            </div>
          </div>
        </div>

        {/* LOGS / HISTORY */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <History className="h-5 w-5 text-slate-400" />
                    <span>Broadcast History</span>
                </div>
           </div>

           <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Sender</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Channels & Recipients</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Snapshot</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No broadcasts recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log: any) => (
                                    <tr key={log._id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900">
                                                {format(new Date(log.createdAt), "MMM d, yyyy")}
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium">
                                                by {log.senderId?.fullName || "System"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 mb-1">
                                                {log.channels.map((chan: string) => (
                                                    <span key={chan} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] font-black text-slate-600">
                                                        {chan}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-xs font-bold text-primary-700">
                                                {log.recipientCount} {log.recipientType === "ALL_ORGANIZERS" ? "Organizers" : "Users"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 line-clamp-2 max-w-xs font-medium">
                                                {log.subject && <span className="font-bold text-slate-900">{log.subject}: </span>}
                                                {log.content}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                log.status === "SENT" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                log.status === "PARTIAL_FAILED" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                "bg-red-50 text-red-600 border border-red-100"
                                            }`}>
                                                {log.status === "SENT" ? "Delivered" : log.status === "PARTIAL_FAILED" ? "Partial" : "Failed"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
