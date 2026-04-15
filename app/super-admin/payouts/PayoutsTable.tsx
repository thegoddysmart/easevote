"use client";

import { useState, useTransition } from "react";
import { DataTable } from "@/components/dashboard";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Building2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";

// Reuse the PayoutStatus type if available, or define here
type PayoutStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

type Payout = {
  id: string;
  amount: number;
  status: string;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  organizerName: string;
  organizerEmail: string;
  date: Date;
  reference: string | null;
};

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: Clock,
  },
  PROCESSING: {
    label: "Processing",
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: Clock,
  },
  COMPLETED: {
    label: "Paid",
    color: "text-green-700",
    bg: "bg-green-100",
    icon: CheckCircle,
  },
  FAILED: {
    label: "Failed",
    color: "text-red-700",
    bg: "bg-red-100",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-slate-600",
    bg: "bg-slate-100",
    icon: XCircle,
  },
};

export default function PayoutsTable({ payouts }: { payouts: Payout[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleStatusUpdate = (payoutId: string, newStatus: string) => {
    if (confirm(`Are you sure you want to mark this payout as ${newStatus}?`)) {
      startTransition(async () => {
        await api.patch(`/super-admin/payouts/${payoutId}/status`, { status: newStatus });
        setActiveMenu(null);
      });
    }
  };

  const headers = [
    {
      key: "amount",
      header: "Amount",
      render: (payout: Payout) => (
        <div className="font-medium text-slate-900">
          {new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: "GHS",
          }).format(payout.amount)}
        </div>
      ),
    },
    {
      key: "organizer",
      header: "Organizer",
      render: (payout: Payout) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">
            {payout.organizerName}
          </span>
          <span className="text-xs text-slate-500">
            {payout.organizerEmail}
          </span>
        </div>
      ),
    },
    {
      key: "account",
      header: "Account Details",
      render: (payout: Payout) => (
        <div className="text-sm">
          <div className="font-medium text-slate-900">
            {payout.bankName || "N/A"}
          </div>
          <div className="text-slate-500">
            {payout.accountNumber} • {payout.accountName}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (payout: Payout) => {
        const config = statusConfig[payout.status] || {
          label: payout.status,
          bg: "bg-slate-100",
          color: "text-slate-600",
          icon: AlertCircle,
        };
        const Icon = config.icon;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </span>
        );
      },
    },
    {
      key: "date",
      header: "Requested On",
      render: (payout: Payout) => (
        <span className="text-sm text-slate-500">
          {new Date(payout.date).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={payouts}
        columns={headers}
        searchable={true}
        searchKey="organizerName"
        actions={(payout) => (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === payout.id ? null : payout.id);
              }}
              disabled={isPending}
              className="p-1 hover:bg-slate-100 rounded text-slate-400"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {activeMenu === payout.id && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50">
                {payout.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(payout.id, "COMPLETED")}
                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" /> Mark as Paid
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(payout.id, "CANCELLED")}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" /> Reject Request
                    </button>
                  </>
                )}
                {payout.status === "COMPLETED" && (
                  <div className="px-4 py-2 text-xs text-slate-400 italic text-center">
                    This payout is completed
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      />
      {activeMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </>
  );
}
