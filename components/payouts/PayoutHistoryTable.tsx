"use client";

import { format } from "date-fns";

type PayoutRecord = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  reference: string;
  createdAt: string;
  processedAt: string | null;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function PayoutHistoryTable({
  payouts,
}: {
  payouts: PayoutRecord[];
}) {
  if (!payouts || payouts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
        No payout requests found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Bank / Account</th>
            <th className="px-6 py-3">Reference</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payouts.map((payout) => (
            <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-500">
                {format(new Date(payout.createdAt), "MMM d, yyyy")}
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900">
                {payout.currency} {payout.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-gray-600">
                <div className="font-medium text-xs">{payout.provider}</div>
                <div className="text-xs">{payout.accountName}</div>
                <div className="text-xs font-mono">{payout.accountNumber}</div>
              </td>
              <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                {payout.reference}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    statusStyles[payout.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {payout.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
