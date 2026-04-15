import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import TransactionsTable from "./TransactionsTable";
import { ArrowRightLeft } from "lucide-react";
import { PaginationControls } from "@/components/ui/PaginationControls";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function GlobalTransactionsPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = searchParams.page
    ? parseInt(searchParams.page as string, 10)
    : 1;
  const limit = 20;

  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken);

  let transactions = [];
  let totalPages = 1;

  try {
    const response = await apiClient.get(
      `/super-admin/transactions?page=${page}&limit=${limit}`,
    );
    const rawData = response.data || (Array.isArray(response) ? response : []);
    transactions = Array.isArray(rawData) ? rawData : (rawData.items || []);
    
    totalPages =
      response.pagination?.pages ||
      Math.ceil((response.total || transactions.length) / limit) ||
      1;
  } catch (err) {
    transactions = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Global Transactions
        </h1>
        <p className="text-slate-500">
          A centralized ledger of all payments across all events.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
            Recent Activity (Last 100)
          </h3>
        </div>
        <TransactionsTable transactions={transactions} />
      </div>

      <div className="mt-4">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          basePath="/super-admin/transactions"
        />
      </div>
    </div>
  );
}
