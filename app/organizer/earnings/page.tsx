import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createServerApiClient } from "@/lib/api-client";
import EarningsDashboardClient from "./EarningsDashboardClient";

export default async function EarningsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.organizerId) {
    redirect("/sign-in");
  }

  const apiClient = createServerApiClient(
    session?.accessToken as string | undefined,
  );

  // Fetch financial summary (balance + totalRevenue) via GET /payouts/summary
  const summary = await apiClient.get("/payouts/summary").catch(() => null);

  if (!summary) {
    redirect("/organizer/onboarding");
  }

  // Fetch recent payout/transaction history via GET /payouts/history
  const history = await apiClient.get("/payouts/history").catch(() => []);

  const stats = {
    balance: Number(summary.balance ?? 0),
    totalRevenue: Number(summary.totalRevenue ?? 0),
  };

  const transactionList = Array.isArray(history) ? history : [];

  const formattedTransactions = transactionList.map((tx: any) => ({
    id: tx.id,
    reference: tx.reference,
    type: tx.type,
    amount: Number(tx.amount ?? 0),
    status: tx.status,
    createdAt: tx.createdAt
      ? new Date(tx.createdAt).toISOString()
      : new Date().toISOString(),
    eventName: tx.event?.title || tx.eventName || "",
    customerName:
      tx.customerName ||
      tx.metadata?.voterName ||
      tx.metadata?.holderName ||
      "Guest",
    paymentMethod: tx.paymentMethod,
  }));

  return (
    <EarningsDashboardClient
      stats={stats}
      transactions={formattedTransactions}
    />
  );
}
