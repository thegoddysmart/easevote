"use client";

import { useState } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  AlertCircle,
  Search,
} from "lucide-react";
import { clsx } from "clsx";

type Payout = {
  id: string;
  amount: number;
  currency: string;
  status: string; // PENDING, PROCESSING, COMPLETED, FAILED
  provider: string; // MTN, VODAFONE, BANK
  accountNumber: string;
  accountName: string;
  reference: string;
  createdAt: string;
  processedAt: string | null;
};

interface DashboardProps {
  stats: {
    totalWithdrawn: number;
    pendingAmount: number;
    pendingCount: number;
  };
  payouts: Payout[];
}

export default function PayoutHistoryClient({
  stats,
  payouts,
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayouts = payouts.filter(
    (p) =>
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.accountNumber.includes(searchQuery)
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      COMPLETED: "bg-green-100 text-green-700 border-green-200",
      PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      FAILED: "bg-red-100 text-red-700 border-red-200",
    };
    const icons = {
      COMPLETED: CheckCircle,
      PROCESSING: Clock,
      PENDING: Clock,
      FAILED: XCircle,
    };

    const style =
      styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
    const Icon = icons[status as keyof typeof icons] || AlertCircle;

    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
          style
        )}
      >
        <Icon size={12} />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payout History</h1>
          <p className="text-slate-500">
            View your withdrawal records and status.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Placeholder export */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-gray-50 transition">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle size={20} />
              </div>
              <span className="text-sm font-bold text-slate-500">
                Total Withdrawn
              </span>
            </div>
            <p className="text-3xl font-display font-bold text-slate-900">
              GHS{" "}
              {stats.totalWithdrawn.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                <Clock size={20} />
              </div>
              <span className="text-sm font-bold text-slate-500">
                Pending Requests
              </span>
            </div>
            <p className="text-3xl font-display font-bold text-slate-900">
              {stats.pendingCount}{" "}
              <span className="text-sm font-normal text-slate-400">
                ({stats.pendingAmount.toFixed(2)} GHS)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-center">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Need Help?</p>
            <p className="text-xs text-slate-400">
              Contact support for payment issues.
            </p>
            <button className="mt-3 text-sm font-bold text-primary-600 hover:underline">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Withdrawal Log</h3>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Requested On</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayouts.map((p) => (
                <tr key={p.id} className="group hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">
                    {p.reference}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm">
                      {p.provider}
                    </div>
                    <div className="text-xs text-slate-500">
                      {p.accountNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    GHS {p.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}

              {filteredPayouts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No payout history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
