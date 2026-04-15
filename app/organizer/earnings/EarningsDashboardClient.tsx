"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { clsx } from "clsx";

type Transaction = {
  id: string;
  reference: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  eventName: string;
  customerName: string;
  paymentMethod: string;
};

interface DashboardProps {
  stats: {
    balance: number;
    totalRevenue: number;
  };
  transactions: Transaction[];
}

export default function EarningsDashboardClient({
  stats,
  transactions,
}: DashboardProps) {
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      filter === "ALL" ||
      (filter === "INFLOW" && ["VOTE", "TICKET"].includes(tx.type)) ||
      (filter === "OUTFLOW" && ["PAYOUT", "REFUND"].includes(tx.type));

    const matchesSearch =
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.eventName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleWithdraw = () => {
    alert(
      "Withdrawal feature coming soon! (Integration with Bank/MoMo API needed)"
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      SUCCESS: "bg-green-100 text-green-700 border-green-200",
      COMPLETED: "bg-green-100 text-green-700 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      FAILED: "bg-red-100 text-red-700 border-red-200",
    };
    const style =
      styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";

    return (
      <span
        className={clsx(
          "px-2 py-0.5 rounded text-xs font-bold border capitalize",
          style
        )}
      >
        {status.toLowerCase()}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Earnings & Payouts
          </h1>
          <p className="text-slate-500">
            Track your revenue and financial history.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-gray-50 transition">
            <Download size={16} /> Export Statement
          </button>
        </div>
      </div>

      {/* Wallet & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Wallet Card */}
        <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-magenta-500/20 rounded-full blur-[80px]"></div>
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 font-bold mb-1">
                  Available Balance
                </p>
                <h2 className="text-5xl font-display font-bold">
                  GHS {stats.balance.toFixed(2)}
                </h2>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Wallet size={32} className="text-magenta-400" />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleWithdraw}
                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-magenta-50 transition cursor-pointer"
              >
                Request Payout <ArrowUpRight size={18} />
              </button>
              <button
                disabled
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition cursor-not-allowed opacity-70"
              >
                Manage Accounts <CreditCard size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <span className="text-slate-500 font-bold">Lifetime Revenue</span>
          </div>
          <p className="text-4xl font-display font-bold text-slate-900">
            GHS{" "}
            {stats.totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
            <ArrowUpRight size={14} /> +12% this month
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">
            Recent Transactions
          </h3>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search ref or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {["ALL", "INFLOW", "OUTFLOW"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition",
                    filter === f
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="group hover:bg-gray-50/50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          "p-2 rounded-full",
                          ["VOTE", "TICKET"].includes(tx.type)
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        )}
                      >
                        {["VOTE", "TICKET"].includes(tx.type) ? (
                          <ArrowDownLeft size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {tx.customerName}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {tx.reference} • {tx.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
                    {tx.eventName.length > 20
                      ? tx.eventName.substring(0, 20) + "..."
                      : tx.eventName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString()}{" "}
                    <span className="text-xs">
                      {new Date(tx.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td
                    className={clsx(
                      "px-6 py-4 font-bold font-mono",
                      ["VOTE", "TICKET"].includes(tx.type)
                        ? "text-green-600"
                        : "text-slate-900"
                    )}
                  >
                    {["VOTE", "TICKET"].includes(tx.type) ? "+" : "-"} GHS{" "}
                    {tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No transactions found.
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
