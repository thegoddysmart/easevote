"use client";

import { useState } from "react";
import { format } from "date-fns";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";

// Define type based on getGlobalPayouts return
type PayoutRecord = {
  id: string;
  amount: number;
  status: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  organizerName: string;
  organizerEmail: string;
  date: Date;
  reference: string | null;
};

export default function PayoutsTable({ payouts }: { payouts: PayoutRecord[] }) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function handleStatusUpdate(id: string, newStatus: string) {
    if (!confirm(`Are you sure you want to mark this payout as ${newStatus}?`))
      return;
    setProcessingId(id);
    await api.patch(`/super-admin/payouts/${id}/status`, { status: newStatus });
    setProcessingId(null);
    router.refresh(); // Refresh server data
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 font-medium">
          <tr>
            <th className="px-6 py-3">Organizer</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Account Details</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payouts.map((payout) => (
            <tr key={payout.id} className="hover:bg-gray-50">
              <td className="px-6 py-3">
                <div className="font-semibold text-gray-900">
                  {payout.organizerName}
                </div>
                <div className="text-xs text-gray-500">
                  {payout.organizerEmail}
                </div>
              </td>
              <td className="px-6 py-3 font-medium">
                GHS {payout.amount.toFixed(2)}
              </td>
              <td className="px-6 py-3 text-gray-600">
                <div className="text-xs font-medium">{payout.bankName}</div>
                <div className="text-xs">{payout.accountName}</div>
                <div className="text-xs font-mono">{payout.accountNumber}</div>
              </td>
              <td className="px-6 py-3 text-gray-500">
                {format(new Date(payout.date), "MMM d, h:mm a")}
              </td>
              <td className="px-6 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold
                    ${
                      payout.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      payout.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                    ${
                      payout.status === "PROCESSING"
                        ? "bg-blue-100 text-blue-800"
                        : ""
                    }
                    ${
                      payout.status === "FAILED" ||
                      payout.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                  `}
                >
                  {payout.status}
                </span>
              </td>
              <td className="px-6 py-3">
                {payout.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleStatusUpdate(payout.id, "PROCESSING")
                      }
                      disabled={!!processingId}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Process
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(payout.id, "CANCELLED")}
                      disabled={!!processingId}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {payout.status === "PROCESSING" && (
                  <button
                    onClick={() => handleStatusUpdate(payout.id, "COMPLETED")}
                    disabled={!!processingId}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Mark Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {payouts.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No payout requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
