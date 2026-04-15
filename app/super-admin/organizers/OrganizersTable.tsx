"use client";

import { DataTable } from "@/components/dashboard";
import { CheckCircle, Clock, XCircle, Search } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Organizer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  verificationStatus: string;
  userStatus: string;
  eventsCount: number;
  totalRevenue: number;
  balance: number;
  joinedAt: Date;
};

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  VERIFIED: {
    label: "Verified",
    color: "text-green-700",
    bg: "bg-green-100",
    icon: CheckCircle,
  },
  PENDING: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: Clock,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-100",
    icon: XCircle,
  },
};

export default function OrganizersTable({
  organizers,
}: {
  organizers: Organizer[];
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrganizers = organizers.filter((org) => {
    const query = searchQuery.toLowerCase();
    return (
      org.name.toLowerCase().includes(query) ||
      org.email.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      key: "name",
      header: "Organizer",
      render: (org: Organizer) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-sm font-bold overflow-hidden">
            {org.avatar?.startsWith("http") ? (
              <img
                src={org.avatar}
                alt={org.name}
                className="h-full w-full object-cover"
              />
            ) : (
              (org.name || "??").substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <Link
              href={`/super-admin/organizers/${org.id}`}
              className="font-medium text-slate-900 hover:text-indigo-600 hover:underline"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {org.name}
            </Link>
            <div className="text-xs text-slate-500">{org.email}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "verificationStatus",
      header: "Verification",
      render: (org: Organizer) => {
        const config = statusConfig[org.verificationStatus] || {
          label: org.verificationStatus || "Unknown",
          color: "text-slate-600",
          bg: "bg-slate-100",
          icon: Clock,
        };
        const Icon = config.icon;
        return (
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              config.bg,
              config.color
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: "totalRevenue",
      header: "Revenue",
      render: (org: Organizer) => (
        <span className="font-medium text-slate-900">
          {new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: "GHS",
          }).format(org.totalRevenue)}
        </span>
      ),
      sortable: true,
    },
    {
      key: "eventsCount",
      header: "Events",
      render: (org: Organizer) => (
        <div className="text-sm font-medium text-slate-900">
          {org.eventsCount}
        </div>
      ),
      sortable: true,
    },
    {
      key: "userStatus",
      header: "Account",
      render: (org: Organizer) => (
        <span
          className={clsx(
            "text-xs font-medium px-2 py-0.5 rounded",
            org.userStatus === "ACTIVE"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          )}
        >
          {org.userStatus}
        </span>
      ),
    },
    {
      key: "joinedAt",
      header: "Joined",
      render: (org: Organizer) => (
        <span className="text-sm text-slate-500">
          {new Date(org.joinedAt).toLocaleDateString()}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <DataTable
        data={filteredOrganizers}
        columns={columns}
        searchable={false}
        actions={(org) => (
          <Link
            href={`/super-admin/organizers/${org.id}`}
            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Search className="w-4 h-4" />
          </Link>
        )}
      />
    </div>
  );
}
