"use client";

import { Download, FileSpreadsheet, Users, CreditCard } from "lucide-react";

export default function ReportsPage() {
  const handleExport = (type: string) => {
    alert(`Exporting ${type}... (Feature coming soon)`);
    // In a real app, this would trigger a streaming download or generate a presigned URL
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
          <Download className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Data Export Center
          </h1>
          <p className="text-slate-500">
            Download raw platform data for external reporting
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Reports Cards */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Financial Reports
              </h3>
              <p className="text-xs text-slate-500">Transactions & Payouts</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Full history of all payment transactions, including fees,
            commissions, and organizer payouts.
          </p>
          <button
            onClick={() => handleExport("financials")}
            className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export to CSV
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">User Directory</h3>
              <p className="text-xs text-slate-500">Organizers & Admins</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            List of all registered users with their verification status, contact
            details, and role.
          </p>
          <button
            onClick={() => handleExport("users")}
            className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export to CSV
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Audit Logs</h3>
              <p className="text-xs text-slate-500">System Activity</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Detailed security log of all sensitive actions taken by admins and
            organizers.
          </p>
          <button
            onClick={() => handleExport("audit-logs")}
            className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}

import { Activity } from "lucide-react";
