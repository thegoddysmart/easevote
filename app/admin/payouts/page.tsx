import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import PayoutRequestForm from "@/components/payouts/PayoutRequestForm";
import PayoutHistoryTable from "@/components/payouts/PayoutHistoryTable";
import { redirect } from "next/navigation";

export default async function PayoutsPage() {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken);

  const [summaryRes, historyRes] = await Promise.all([
    apiClient.get("/payouts/summary").catch(() => ({
      data: {
        grossSale: 0,
        totalCommission: 0,
        totalPayouts: 0,
        availableBalance: 0,
      },
    })),
    apiClient.get("/payouts/history").catch(() => ({ data: [] })),
  ]);
  const summary = summaryRes.data;
  const history = historyRes.data;

  if (!summary) {
    // Should handle error or redirect if not organizer
    return <div className="p-10">Access Denied or Profile Not Found</div>;
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
        <p className="text-gray-500 mt-2">
          Manage your earnings and request payouts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Gross Sales</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            GHS {summary.grossSale.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Commission</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            GHS {summary.totalCommission.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Payouts</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            GHS {summary.totalPayouts.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100 ring-1 ring-green-100">
          <p className="text-sm font-medium text-green-700">
            Available Balance
          </p>
          <p className="text-3xl font-bold text-green-700 mt-2">
            GHS {summary.availableBalance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <PayoutRequestForm availableBalance={summary.availableBalance} />
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Payout History
          </h2>
          <PayoutHistoryTable payouts={history} />
        </div>
      </div>
    </div>
  );
}
