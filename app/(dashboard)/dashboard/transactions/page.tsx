import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Activity,
  AlertOctagon,
} from "lucide-react";
import TransactionsTable from "./TransactionsTable";
import AdminStatCard from "@/components/admin/AdminStatCard";

export default async function AdminTransactionsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isOrganizer = role === "ORGANIZER";
  const apiClient = createServerApiClient(session?.accessToken);

  let stats, transactions;

  if (isOrganizer) {
    // Organizer-specific data
    const [balanceRes, purchasesRes] = await Promise.all([
      apiClient.get("/payouts/balance").catch(() => null),
      apiClient.get("/purchases/organizer").catch(() => ({ data: [] })),
    ]);

    const balanceData = balanceRes?.data || {};
    stats = {
      totalVolume: balanceData.grossRevenue || 0,
      netRevenue: balanceData.netRevenue || 0, // This is organizer's share after commission
      successRate: 100, // We don't have this for organizer yet, default to 100%
      pendingCount: balanceData.totalWithdrawn ? 1 : 0, // Placeholder
    };

    const rawTransactions = purchasesRes.data || purchasesRes.purchases || [];
    transactions = rawTransactions.map((tx: any) => ({
      id: tx._id,
      reference: tx.paymentReference,
      type: tx.type,
      amount: tx.amount,
      status: tx.status === "PAID" ? "SUCCESS" : tx.status,
      payer: tx.customerName || tx.customerEmail || "Anonymous",
      event: tx.eventId?.title || "Unknown Event",
      date: tx.paidAt || tx.createdAt,
    }));
  } else {
    // Admin-specific data
    const [statsRes, transactionsRes] = await Promise.all([
      apiClient.get("/admin/stats/revenue").catch(() => ({
        data: {
          totalVolume: 0,
          netRevenue: 0,
          successRate: 0,
          pendingCount: 0,
        },
      })),
      apiClient.get("/admin/transactions").catch(() => ({ data: [] })),
    ]);

    const rawStats = statsRes.data || statsRes || {};
    stats = {
      totalVolume: rawStats.totalVolume || rawStats.totalRevenue || 0,
      netRevenue: rawStats.netRevenue || rawStats.netCommission || 0,
      successRate: rawStats.successRate || 0,
      pendingCount: rawStats.pendingCount || 0,
    };

    const rawTransactions = transactionsRes.data || transactionsRes.purchases || (Array.isArray(transactionsRes) ? transactionsRes : []);
    transactions = rawTransactions.map((tx: any) => ({
      id: tx._id,
      reference: tx.paymentReference,
      type: tx.type,
      amount: tx.amount,
      status: tx.status === "PAID" ? "SUCCESS" : tx.status,
      payer: tx.customerName || tx.customerEmail || "Anonymous",
      event: tx.eventId?.title || "Unknown Event",
      date: tx.paidAt || tx.createdAt,
    }));
  }

  return (
    <div className="space-y-8 p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">
          {isOrganizer ? "My Event Transactions" : "Transactions"}
        </h1>
        <p className="text-slate-500 mt-2">
          {isOrganizer 
            ? "Monitor all financial activities and payment statuses for your events."
            : "Monitor all platform-wide financial activities, revenue, and payment statuses."}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title={isOrganizer ? "Gross Revenue" : "Total Volume"}
          value={new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: "GHS",
          }).format(stats.totalVolume)}
          icon={Activity}
          trend={isOrganizer ? "Total collected" : "Gross processed"}
          trendDirection="neutral"
        />
        <AdminStatCard
          title={isOrganizer ? "Net Earnings" : "Net Revenue"}
          value={new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: "GHS",
          }).format(stats.netRevenue)}
          icon={DollarSign}
          trend={isOrganizer ? "After commission" : "Fees & Commissions"}
          trendDirection="up"
        />
        {!isOrganizer && (
          <AdminStatCard
            title="Success Rate"
            value={`${stats.successRate.toFixed(1)}%`}
            icon={TrendingUp}
            trend="Completion Rate"
            trendDirection={stats.successRate > 90 ? "up" : "down"}
          />
        )}
        {!isOrganizer && (
          <AdminStatCard
            title="Pending Actions"
            value={stats.pendingCount}
            icon={AlertOctagon}
            trend="Needs Attention"
            trendDirection="neutral"
            color="amber"
          />
        )}
      </div>

      {/* Transactions Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {isOrganizer ? "Recent Sales" : "Recent Transactions"}
          </h2>
        </div>
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}
