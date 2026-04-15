import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import PayoutsTable from "./PayoutsTable";
import { Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperAdminPayoutsPage() {
  const session = await getServerSession(authOptions);
  const { data: payouts } = { data: [] }; // Mocking empty array for now as backend lacks payout APIs

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
          <Wallet className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payout Requests</h1>
          <p className="text-slate-500">
            Review and process organizer withdrawal requests
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <PayoutsTable payouts={payouts} />
      </div>
    </div>
  );
}
